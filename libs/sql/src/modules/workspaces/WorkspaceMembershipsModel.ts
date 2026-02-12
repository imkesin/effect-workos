import { Model } from "@effect/sql"
import { UserId } from "@one-kilo/domain/ids/UserId"
import { WorkspaceId } from "@one-kilo/domain/ids/WorkspaceId"
import { ModelAuditFields } from "../../utils/ModelFields.ts"

export class WorkspaceMembershipsModel extends Model.Class<WorkspaceMembershipsModel>("WorkspaceMembershipsModel")({
  userId: UserId,
  workspaceId: WorkspaceId,

  ...ModelAuditFields
}) {}
