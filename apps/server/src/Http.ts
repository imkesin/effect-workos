import { HttpApiBuilder, type HttpApp, HttpMiddleware, HttpServer } from "@effect/platform"
import { NodeHttpServer } from "@effect/platform-node"
import { ServerApi } from "@one-kilo/server-api/ServerApi"
import * as Config from "effect/Config"
import { pipe } from "effect/Function"
import * as Layer from "effect/Layer"
import { createServer } from "node:http"
import { HealthHttp } from "./modules/health/HealthHttp.ts"
import { SessionsHttp } from "./modules/sessions/SessionsHttp.ts"

const ServerApiLive = pipe(
  HttpApiBuilder.api(ServerApi),
  Layer.provide([HealthHttp, SessionsHttp])
)

const middleware = (httpApp: HttpApp.Default) =>
  pipe(
    httpApp,
    HttpMiddleware.logger,
    HttpMiddleware.xForwardedHeaders
  )

export const HttpTest = HttpApiBuilder
  .serve(middleware)
  .pipe(
    Layer.provide(ServerApiLive),
    Layer.provideMerge(NodeHttpServer.layerTest)
  )

export const HttpLive = HttpApiBuilder
  .serve(middleware)
  .pipe(
    HttpServer.withLogAddress,
    Layer.provide(ServerApiLive),
    Layer.provide(
      NodeHttpServer.layerConfig(
        createServer,
        {
          port: pipe(
            Config.number("PORT"),
            Config.withDefault(10_000)
          )
        }
      )
    )
  )
