import { pipe } from "effect/Function"
import * as S from "effect/Schema"
import * as UUIDv7 from "@effect-workos/lib/uuid/UUIDv7"
import * as ParseResult from "effect/ParseResult"

export const WorkspaceId = pipe(
  UUIDv7.UUIDv7,
  S.brand("@effect-workos/domain/WorkspaceId"),
  S.annotations({
    description: "The unique identifier for a workspace.",
    identifier: "WorkspaceId",
    title: "Workspace ID",
  })
)
export type WorkspaceId = typeof WorkspaceId.Type

export const PrefixedWorkspaceId = pipe(
  S.NonEmptyTrimmedString,
  S.startsWith("w_"),
  S.brand("@effect-workos/domain/PrefixedWorkspaceId"),
  S.annotations({
    description: "The unique identifier for a workspace.",
    identifier: "PrefixedWorkspaceId",
    title: "Workspace ID (Prefixed)",
  })
)
export type PrefixedWorkspaceId = typeof PrefixedWorkspaceId.Type

export const WorkspaceIdFromPrefixed = S.transformOrFail(
  PrefixedWorkspaceId,
  S.typeSchema(WorkspaceId),
  {
    decode: (fromA, _, ast) => pipe(
      fromA.split("_")[1],
      S.decodeUnknown(UUIDv7.UUIDv7FromShortened),
      ParseResult.mapBoth({
        onFailure: (error) => new ParseResult.Type(ast, fromA, error.message),
        onSuccess: (decoded) => WorkspaceId.make(decoded)
      })
    ),
    encode: (toI, _, ast) => pipe(
      S.encode(UUIDv7.UUIDv7FromShortened)(toI),
      ParseResult.mapBoth({
        onFailure: (error) => new ParseResult.Type(ast, toI, error.message),
        onSuccess: (encoded) => PrefixedWorkspaceId.make(`w_${encoded}`)
      })
    ),
  },
)