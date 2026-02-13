import * as WorkOSIds from "@effect/auth-workos/domain/Ids"
import * as Model from "@effect/sql/Model"
import { WorkspaceId } from "@one-kilo/domain/ids/WorkspaceId"
import * as S from "effect/Schema"
import { ModelAuditFields } from "../../utils/ModelFields.ts"

export class WorkspacesModel extends Model.Class<WorkspacesModel>("@one-kilo/sql/WorkspacesModel")({
  id: Model.GeneratedByApp(WorkspaceId),

  name: S.NonEmptyTrimmedString,
  workosOrganizationId: WorkOSIds.OrganizationId,

  ...ModelAuditFields
}) {}
