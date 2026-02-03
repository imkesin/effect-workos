import * as S from "effect/Schema"

export class InvalidUrlError extends S.TaggedError<InvalidUrlError>("@effect/auth-workos/InvalidUrlError")(
  "InvalidUrlError",
  {
    cause: S.Defect
  }
) {}
