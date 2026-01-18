import * as KeyValueStore from "@effect/platform/KeyValueStore"
import * as DateTime from "effect/DateTime"
import * as Duration from "effect/Duration"
import * as Effect from "effect/Effect"
import { pipe } from "effect/Function"
import * as Option from "effect/Option"
import * as Redacted from "effect/Redacted"
import * as S from "effect/Schema"
import { Organization, User } from "../domain/DomainEntities.ts"
import { ResourceNotFoundError, UnauthorizedError } from "../domain/DomainErrors.ts"
import { ClientId, generateOrganizationId, generateUserId, OrganizationId, UserId } from "../domain/DomainIds.ts"
import { EmailAddress } from "../domain/DomainValues.ts"
import * as TokenGenerator from "../TokenGenerator.ts"
import {
  type CreateOrganizationParameters,
  DeleteOrganizationResponse
} from "./Api/OrganizationsApiClientDefinitionSchemas.ts"
import { type CreateUserParameters, DeleteUserResponse } from "./Api/UserManagementApiClientDefinitionSchemas.ts"
import {
  type RetrieveTokenByClientCredentialsParameters_Redacted,
  RetrieveTokenByClientCredentialsResponse
} from "./OAuth2/OAuth2ClientDefinitionSchemas.js"

class UsersModel extends S.Class<UsersModel>("UserModel")({
  ...User.fields,

  password: pipe(
    S.NonEmptyTrimmedString,
    S.NullOr
  )
}) {
  asEntity() {
    return User.make(this)
  }
}

class OrganizationsModel extends S.Class<OrganizationsModel>("OrganizationModel")({
  ...Organization.fields
}) {
  asEntity() {
    return Organization.make(this)
  }
}

class ClientsModel extends S.Class<ClientsModel>("ClientModel")({
  id: ClientId,
  orgId: OrganizationId,
  secret: S.NonEmptyTrimmedString
}) {}

interface UserManagement {
  readonly createUser: (parameters: typeof CreateUserParameters.Type) => Effect.Effect<User>
  readonly deleteUser: (userId: UserId) => Effect.Effect<DeleteUserResponse>
  readonly retrieveUser: (userId: UserId) => Effect.Effect<User, ResourceNotFoundError>
}

interface Organizations {
  readonly createOrganization: (parameters: typeof CreateOrganizationParameters.Type) => Effect.Effect<Organization>
  readonly deleteOrganization: (organizationId: OrganizationId) => Effect.Effect<DeleteOrganizationResponse>
  readonly retrieveOrganization: (organizationId: OrganizationId) => Effect.Effect<Organization, ResourceNotFoundError>
}

export interface ApiClient {
  readonly userManagement: UserManagement
  readonly organizations: Organizations
}

export interface OAuth2Client {
  readonly retrieveTokenByClientCredentials: (
    parameters: RetrieveTokenByClientCredentialsParameters_Redacted
  ) => Effect.Effect<typeof RetrieveTokenByClientCredentialsResponse.Type, UnauthorizedError>
}

export type MakeOptions = {
  initialMachineClients?: ReadonlyArray<{
    clientId: ClientId
    orgId: OrganizationId
    secret: Redacted.Redacted<string>
  }>
}

export const make = (options?: MakeOptions): Effect.Effect<
  {
    readonly apiClient: ApiClient
    readonly oauth2Client: OAuth2Client
  },
  never,
  KeyValueStore.KeyValueStore | TokenGenerator.TokenGenerator
> =>
  Effect.gen(function*() {
    const { generator } = yield* TokenGenerator.TokenGenerator

    const usersStore = yield* Effect.map(
      KeyValueStore.KeyValueStore,
      (store) => store.forSchema(S.ReadonlyMap({ key: UserId, value: UsersModel }))
    )
    const findUsers = pipe(
      usersStore.get("users"),
      Effect.map(Option.getOrElse<ReadonlyMap<UserId, UsersModel>>(() => new Map())),
      Effect.orDie
    )
    const findUserById = (userId: UserId) =>
      pipe(
        findUsers,
        Effect.map((users) =>
          pipe(
            users.get(userId),
            Option.fromNullable
          )
        ),
        Effect.filterOrFail(
          Option.isSome,
          () => new ResourceNotFoundError()
        ),
        Effect.map(({ value }) => value)
      )
    const setUsers = (users: ReadonlyMap<UserId, UsersModel>) =>
      pipe(
        usersStore.set("users", users),
        Effect.orDie
      )
    const insertUser = (user: UsersModel) =>
      pipe(
        findUsers,
        Effect.flatMap((existingUsers) => setUsers(new Map(existingUsers).set(user.id, user))),
        Effect.orDie
      )
    const deleteUser = (userId: UserId) =>
      pipe(
        findUsers,
        Effect.flatMap((existingUsers) => {
          const users = new Map(existingUsers)
          const userExisted = users.delete(userId)

          return pipe(
            setUsers(users),
            Effect.map(() => ({ userExisted }))
          )
        }),
        Effect.orDie
      )

    const clientsStore = yield* Effect.map(
      KeyValueStore.KeyValueStore,
      (store) => store.forSchema(S.ReadonlyMap({ key: ClientId, value: ClientsModel }))
    )
    const setClients = (clients: ReadonlyMap<ClientId, ClientsModel>) =>
      pipe(
        clientsStore.set("clients", clients),
        Effect.orDie
      )
    const findClients = pipe(
      clientsStore.get("clients"),
      Effect.map(Option.getOrElse<ReadonlyMap<ClientId, ClientsModel>>(() => new Map())),
      Effect.orDie
    )
    const findClientById = (clientId: ClientId) =>
      pipe(
        findClients,
        Effect.map((clients) =>
          pipe(
            clients.get(clientId),
            Option.fromNullable
          )
        ),
        Effect.filterOrFail(
          Option.isSome,
          /**
           * The absence of a client ID is a special case
           */
          () => new UnauthorizedError()
        ),
        Effect.map(({ value }) => value)
      )

    const organizationsStore = yield* Effect.map(
      KeyValueStore.KeyValueStore,
      (store) => store.forSchema(S.ReadonlyMap({ key: OrganizationId, value: OrganizationsModel }))
    )
    const findOrganizations = pipe(
      organizationsStore.get("organizations"),
      Effect.map(Option.getOrElse<ReadonlyMap<OrganizationId, OrganizationsModel>>(() => new Map())),
      Effect.orDie
    )
    const findOrganizationById = (organizationId: OrganizationId) =>
      pipe(
        findOrganizations,
        Effect.map((organizations) =>
          pipe(
            organizations.get(organizationId),
            Option.fromNullable
          )
        ),
        Effect.filterOrFail(
          Option.isSome,
          () => new ResourceNotFoundError()
        ),
        Effect.map(({ value }) => value)
      )
    const setOrganizations = (organizations: ReadonlyMap<OrganizationId, OrganizationsModel>) =>
      pipe(
        organizationsStore.set("organizations", organizations),
        Effect.orDie
      )
    const insertOrganization = (organization: OrganizationsModel) =>
      pipe(
        findOrganizations,
        Effect.flatMap((existingOrganizations) =>
          setOrganizations(new Map(existingOrganizations).set(organization.id, organization))
        ),
        Effect.orDie
      )
    const deleteOrganization = (organizationId: OrganizationId) =>
      pipe(
        findOrganizations,
        Effect.flatMap((existingOrganizations) => {
          const organizations = new Map(existingOrganizations)
          const organizationExisted = organizations.delete(organizationId)

          return pipe(
            setOrganizations(organizations),
            Effect.map(() => ({ organizationExisted }))
          )
        }),
        Effect.orDie
      )

    if (options?.initialMachineClients) {
      yield* setClients(
        new Map(
          options.initialMachineClients.map((client) => [
            client.clientId,
            ClientsModel.make({
              id: client.clientId,
              orgId: client.orgId,
              secret: Redacted.value(client.secret)
            })
          ])
        )
      )
    }

    return {
      apiClient: {
        userManagement: {
          createUser: Effect.fn(function*(parameters: typeof CreateUserParameters.Type) {
            const now = yield* DateTime.nowAsDate

            const user = UsersModel.make({
              id: generateUserId(),
              email: EmailAddress.make(parameters.email),
              emailVerified: false,
              password: parameters.password ?? null,
              firstName: parameters.firstName ?? null,
              lastName: parameters.lastName ?? null,
              externalId: parameters.externalId ?? null,
              profilePictureUrl: null,
              lastSignInAt: null,
              locale: null,
              metadata: parameters.metadata ?? {},
              createdAt: now,
              updatedAt: now
            })

            yield* insertUser(user)

            return user.asEntity()
          }),
          deleteUser: (userId: UserId) =>
            pipe(
              deleteUser(userId),
              Effect.map(({ userExisted }) => (
                userExisted
                  ? DeleteUserResponse.Success()
                  : DeleteUserResponse.NotFound()
              ))
            ),
          retrieveUser: (userId: UserId) =>
            pipe(
              findUserById(userId),
              Effect.map((user) => user.asEntity())
            )
        },
        organizations: {
          createOrganization: Effect.fn(function*(parameters: typeof CreateOrganizationParameters.Type) {
            const now = yield* DateTime.nowAsDate

            const organization = OrganizationsModel.make({
              id: generateOrganizationId(),
              name: parameters.name,
              domains: [],
              stripeCustomerId: null,
              externalId: parameters.externalId ?? null,
              metadata: parameters.metadata ?? {},
              createdAt: now,
              updatedAt: now
            })

            yield* insertOrganization(organization)

            return organization.asEntity()
          }),
          deleteOrganization: (organizationId: OrganizationId) =>
            pipe(
              deleteOrganization(organizationId),
              Effect.map(({ organizationExisted }) => (
                organizationExisted
                  ? DeleteOrganizationResponse.Success()
                  : DeleteOrganizationResponse.NotFound()
              ))
            ),
          retrieveOrganization: (organizationId: OrganizationId) =>
            pipe(
              findOrganizationById(organizationId),
              Effect.map((organization) => organization.asEntity())
            )
        }
      },
      oauth2Client: {
        retrieveTokenByClientCredentials: Effect.fn(function*(parameters) {
          const client = yield* findClientById(parameters.clientId)

          if (client.secret !== Redacted.value(parameters.clientSecret)) {
            return yield* Effect.fail(new UnauthorizedError())
          }

          const accessToken = yield* pipe(
            generator.generateMachineAccessToken({
              clientId: parameters.clientId,
              orgId: client.orgId
            }),
            Effect.orDie
          )

          return RetrieveTokenByClientCredentialsResponse.make({
            accessToken,
            expiresIn: Duration.hours(1),
            tokenType: "bearer"
          })
        })
      }
    }
  })
