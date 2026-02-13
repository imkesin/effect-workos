import * as HttpApiBuilder from "@effect/platform/HttpApiBuilder"
import { Sessions_ExchangeCode_ApiSchemas } from "@one-kilo/server-api/modules/sessions/SessionsApiSchemas"
import { ServerApi } from "@one-kilo/server-api/ServerApi"
import * as Effect from "effect/Effect"

export const SessionsHttp = HttpApiBuilder.group(
  ServerApi,
  "sessions",
  (handlers) =>
    handlers.handle(
      "exchangeCode",
      () => Effect.fail(Sessions_ExchangeCode_ApiSchemas.InvalidCodeError.make())
    )
)
