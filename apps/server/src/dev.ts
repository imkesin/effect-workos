import { DevTools } from "@effect/experimental"
import { NodeRuntime, NodeSocket } from "@effect/platform-node"
import { pipe } from "effect/Function"
import * as Layer from "effect/Layer"
import { HttpLive } from "./Http.ts"

const DevToolsLive = Layer.provide(
  DevTools.layerWebSocket(),
  NodeSocket.layerWebSocketConstructor
)

pipe(
  HttpLive,
  Layer.provide(DevToolsLive),
  Layer.launch,
  NodeRuntime.runMain
)
