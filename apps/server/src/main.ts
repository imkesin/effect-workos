import { NodeRuntime } from "@effect/platform-node"
import { pipe } from "effect/Function"
import * as Layer from "effect/Layer"
import { HttpLive } from "./Http.ts"

pipe(
  HttpLive,
  Layer.launch,
  NodeRuntime.runMain
)
