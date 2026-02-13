import * as HttpApiBuilder from "@effect/platform/HttpApiBuilder"
import { Health_RetrieveLiveness_ApiSchemas } from "@one-kilo/server-api/modules/Health/HealthApiSchemas"
import { ServerApi } from "@one-kilo/server-api/ServerApi"
import * as Effect from "effect/Effect"

export const HealthHttp = HttpApiBuilder.group(
  ServerApi,
  "health",
  (handlers) =>
    handlers.handle(
      "retrieveLiveness",
      () => Effect.succeed(Health_RetrieveLiveness_ApiSchemas.Success.make())
    )
)
