import * as ApiClient from "@effect-workos/workos/ApiClient"
import * as ApiGateway from "@effect-workos/workos/ApiGateway"
import { NodeHttpClient } from "@effect/platform-node"
import { Config, Layer, pipe } from "effect"

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
