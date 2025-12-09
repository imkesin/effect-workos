import { NodeRuntime } from "@effect/platform-node"
import { Layer } from "effect"
import { pipe } from "effect/Function"

pipe(
  Layer.empty,
  Layer.launch,
  NodeRuntime.runMain
)
