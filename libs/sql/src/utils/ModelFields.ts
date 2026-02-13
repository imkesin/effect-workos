import * as Model from "@effect/sql/Model"
import { UserId } from "@one-kilo/domain/ids/UserId"
import * as ModelExtensions from "./ModelExtensions.ts"

export const ModelAuditFields = {
  createdAt: Model.DateTimeInsert,
  createdByUserId: Model.GeneratedByApp(UserId),

  updatedAt: Model.DateTimeUpdate,
  updatedByUserId: Model.GeneratedByApp(UserId),

  archivedAt: ModelExtensions.DateTimeArchived
} as const
