import { NodeRuntime } from "@effect/platform-node"
import { Layer } from "effect"
import { pipe } from "effect/Function"
import { HttpLive } from "./Http.ts"

pipe(
  HttpLive,
  Layer.launch,
  NodeRuntime.runMain
)
