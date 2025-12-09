import { WorkOS } from "@workos-inc/node"
import { Effect, pipe, Redacted, Schema } from "effect"
import { Config } from "effect"

class WorkOSError extends Schema.TaggedError<WorkOSError>("@effect-workos/workos/WorkOSError")(
  "WorkOSError",
  {
    cause: Schema.Unknown
  }
) {}

export class WorkOSClient extends Effect.Service<WorkOSClient>()(
  "WorkOSClient",
  {
    effect: Effect.gen(function*() {
      const config = yield* pipe(
        Config.all({
          clientId: Config.string("CLIENT_ID"),
          apiKey: pipe(
            Config.string("API_KEY"),
            (_) => Config.redacted(_)
          )
        }),
        Config.nested("WORKOS")
      )

      const client = new WorkOS(
        Redacted.value(config.apiKey),
        {
          clientId: config.clientId
        }
      )

      const use = <A>(f: (client: WorkOS) => Promise<A>): Effect.Effect<A, WorkOSError> =>
        Effect.tryPromise({
          try: () => f(client),
          catch: (cause) => new WorkOSError({ cause })
        })

      return { use } as const
    })
  }
) {}
