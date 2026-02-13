import * as HttpApiMiddleware from "@effect/platform/HttpApiMiddleware"
import * as HttpApiSchema from "@effect/platform/HttpApiSchema"
import * as HttpApiSecurity from "@effect/platform/HttpApiSecurity"
import { Actor } from "@one-kilo/domain/tags/Actor"
import * as S from "effect/Schema"

export class UnauthorizedApiError extends S.TaggedError<UnauthorizedApiError>()(
  "UnauthorizedApiError",
  {},
  HttpApiSchema.annotations({
    description: "Authentication is required and has failed or has not been provided",
    status: 401
  })
) {}

export class Authentication extends HttpApiMiddleware.Tag<Authentication>()(
  "Authentication",
  {
    failure: UnauthorizedApiError,
    provides: Actor,
    security: {
      jwt: HttpApiSecurity.bearer
    }
  }
) {}
