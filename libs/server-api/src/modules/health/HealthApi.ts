import * as HttpApiEndpoint from "@effect/platform/HttpApiEndpoint"
import * as HttpApiError from "@effect/platform/HttpApiError"
import * as HttpApiGroup from "@effect/platform/HttpApiGroup"
import { Health_RetrieveLiveness_ApiSchemas } from "./HealthApiSchemas.ts"

export class HealthApi extends HttpApiGroup.make("health")
  .add(
    HttpApiEndpoint.get("retrieveLiveness", "/livez")
      .addSuccess(Health_RetrieveLiveness_ApiSchemas.Success)
      .addError(HttpApiError.ServiceUnavailable)
  )
{}
