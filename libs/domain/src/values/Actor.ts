import * as S from "effect/Schema"
import { UserId } from "../ids/UserId.ts"
import { WorkspaceId } from "../ids/WorkspaceId.ts"

export class Actor extends S.TaggedClass<Actor>("@one-kilo/domain/Actor")(
  "Actor",
  {
    userId: UserId,
    workspaceId: WorkspaceId
  },
  {
    identifier: "Actor",
    title: "Actor",
    description: "The subject of an authorization check"
  }
) {}
