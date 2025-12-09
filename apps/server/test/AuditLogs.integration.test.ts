import { describe, expect, layer } from "@effect/vitest"
import { Effect, pipe } from "effect"
import { WorkOSClient } from "../src/WorkOSClient.ts"

const integrationTestLayer = WorkOSClient.Default

describe("Audit Logs - Integration", () => {
  layer(integrationTestLayer)((it) => {
    it.effect("can send an audit log", () =>
      Effect.gen(function*() {
        const { use } = yield* WorkOSClient

        const result = yield* pipe(
          use((client) =>
            client.auditLogs.createEvent(
              "org_id",
              {
                version: 1,
                action: "test_action",
                actor: {
                  id: "user_01H9JHJHJHJHJHJHJHJHJHJH",
                  type: "user"
                },
                targets: [
                  {
                    id: "user_01H9JHJHJHJHJHJHJHJHJHJH",
                    type: "user"
                  }
                ],
                occurredAt: new Date(),
                context: {
                  location: "test_location"
                }
              }
            )
          ),
          Effect.flip
        )

        expect(result).toBeUndefined()
      }))
  })
})
