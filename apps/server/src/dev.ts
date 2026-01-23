import { DevTools } from "@effect/experimental"
import { NodeRuntime, NodeSocket } from "@effect/platform-node"
import { pipe } from "effect/Function"
import * as Layer from "effect/Layer"

const DevToolsLive = Layer.provide(
  DevTools.layerWebSocket(),
  NodeSocket.layerWebSocketConstructor
)

pipe(
  Layer.empty,
  Layer.provide(DevToolsLive),
  Layer.launch,
  NodeRuntime.runMain
)
