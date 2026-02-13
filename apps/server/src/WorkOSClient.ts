import * as ApiClient from "@effect/auth-workos/ApiClient"
import * as ApiGateway from "@effect/auth-workos/ApiGateway"
import { NodeHttpClient } from "@effect/platform-node"
import * as Config from "effect/Config"
import { pipe } from "effect/Function"
import * as Layer from "effect/Layer"

const apiClientLayer = ApiClient.layerConfig({
  apiKey: pipe(
    Config.string("WORKOS_API_KEY"),
    (_) => Config.redacted(_)
  )
})

export const WorkOSClientLive = pipe(
  ApiGateway.layer(),
  Layer.provide(apiClientLayer),
  Layer.provide(NodeHttpClient.layer)
)

export { ApiGateway as WorkOSClient }
