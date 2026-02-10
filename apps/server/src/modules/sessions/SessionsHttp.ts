import { HttpApiBuilder } from "@effect/platform"
import { ServerApi } from "@one-kilo/server-api/ServerApi"

export const SessionsHttp = HttpApiBuilder.group(ServerApi, "sessions", (handlers) => handlers)
