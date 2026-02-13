import * as HttpApiEndpoint from "@effect/platform/HttpApiEndpoint"
import * as HttpApiGroup from "@effect/platform/HttpApiGroup"
import { ExchangeCode_InvalidCode_ApiError } from "./internal/SessionsApiErrors.ts"
import { Sessions_ExchangeCode_ApiSchemas } from "./SessionsApiSchemas.ts"

export class SessionsApi extends HttpApiGroup.make("sessions")
  .add(
    HttpApiEndpoint.post("exchangeCode", "/exchange-code")
      .setPayload(Sessions_ExchangeCode_ApiSchemas.Payload)
      .addSuccess(Sessions_ExchangeCode_ApiSchemas.Success)
      .addError(ExchangeCode_InvalidCode_ApiError)
  )
{}
