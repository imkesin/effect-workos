import * as SqlClient from "@effect/sql/SqlClient"
import * as SqlSchema from "@effect/sql/SqlSchema"
import { UserId, UserIdGenerator } from "@one-kilo/domain/ids/UserId"
import { orDieWithUnexpectedError } from "@one-kilo/lib/errors/UnexpectedError"
import * as Effect from "effect/Effect"
import * as Option from "effect/Option"
import * as S from "effect/Schema"
import { UsersModel } from "./UsersModel.ts"

type InsertUserParameters = {
  performedByUserId: Option.Option<UserId>
}

export class UsersRepository extends Effect.Service<UsersRepository>()(
  "@one-kilo/sql/UsersRepository",
  {
    dependencies: [UserIdGenerator.Default],
    effect: Effect.gen(function*() {
      const sql = yield* SqlClient.SqlClient
      const userIdGenerator = yield* UserIdGenerator

      const insertSchema = SqlSchema.single({
        Request: S.Struct({
          createdByUserId: S.OptionFromSelf(UserId)
        }),
        Result: UsersModel.select,
        execute: (request) =>
          Effect.flatMap(
            userIdGenerator.generate,
            (generatedId) =>
              sql`
                INSERT INTO users (
                  id,
                  created_by_user_id,
                  updated_by_user_id
                )
                VALUES (
                  ${generatedId},
                  COALESCE(${Option.getOrNull(request.createdByUserId)}, ${generatedId}),
                  COALESCE(${Option.getOrNull(request.createdByUserId)}, ${generatedId})
                )
                RETURNING *
              `
          )
      })
      const insert = Effect.fn("UsersRepository.insert")(
        function*({ performedByUserId }: InsertUserParameters) {
          return yield* insertSchema({ createdByUserId: performedByUserId })
        },
        orDieWithUnexpectedError("Failed to insert user")
      )

      return { insert }
    })
  }
) {}
