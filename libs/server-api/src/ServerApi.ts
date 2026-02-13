import * as HttpApi from "@effect/platform/HttpApi"
import * as HttpApiError from "@effect/platform/HttpApiError"
import { Authentication } from "./infra/Authentication.ts"
import { HealthApi } from "./modules/health/HealthApi.ts"
import { SessionsApi } from "./modules/sessions/SessionsApi.ts"

const ApplicationApi = HttpApi.make("@one-kilo/ApplicationApi")
  .middleware(Authentication)

const AuthenticationApi = HttpApi.make("@one-kilo/AuthenticationApi")
  .add(SessionsApi)
  .prefix("/authentication")

const PublicApi = HttpApi.make("@one-kilo/PublicApi")
  .add(HealthApi)

export const ServerApi = HttpApi.make("@one-kilo/ServerApi")
  .addHttpApi(ApplicationApi)
  .addHttpApi(AuthenticationApi)
  .addHttpApi(PublicApi)
  .addError(HttpApiError.InternalServerError)
