import * as S from "effect/Schema"

export class ResourceNotFoundError
  extends S.TaggedError<ResourceNotFoundError>("@effect/auth-workos/ResourceNotFoundError")(
    "ResourceNotFoundError",
    {}
  )
{}

export class UnauthorizedError extends S.TaggedError<UnauthorizedError>("@effect/auth-workos/UnauthorizedError")(
  "UnauthorizedError",
  {}
) {}
