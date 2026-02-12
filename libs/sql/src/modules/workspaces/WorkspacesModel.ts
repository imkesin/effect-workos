import * as WorkOSIds from "@effect/auth-workos/domain/Ids"
import { Model } from "@effect/sql"
import { WorkspaceId } from "@one-kilo/domain/ids/WorkspaceId"
import { Schema } from "effect"
import { ModelAuditFields } from "../../utils/ModelFields.ts"

export class WorkspacesModel extends Model.Class<WorkspacesModel>("@one-kilo/sql/WorkspacesModel")({
  id: Model.GeneratedByApp(WorkspaceId),

  name: Schema.NonEmptyTrimmedString,
  workosOrganizationId: WorkOSIds.OrganizationId,

  ...ModelAuditFields
}) {}
