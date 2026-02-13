import * as HttpApiSchema from "@effect/platform/HttpApiSchema"
import * as S from "effect/Schema"

const Health_RetrieveLiveness_ApiSuccess = S.Struct({}).annotations(HttpApiSchema.annotations({ status: 200 }))

export const Health_RetrieveLiveness_ApiSchemas = { Success: Health_RetrieveLiveness_ApiSuccess } as const
