import { Schema } from "effect"
import { DynamicServerError as NextDynamicServerError } from "next/dist/client/components/hooks-server-context"
import { RedirectError as NextRedirectError } from "next/dist/client/components/redirect-error"

export class DynamicServerError extends Schema.TaggedError<DynamicServerError>()(
  "DynamicServerError",
  {
    _nextCause: Schema.instanceOf(NextDynamicServerError)
  },
  {
    description: "An error was thrown to indicate that a page should be re-rendered dynamically"
  }
) {
  static fromNextDynamicServerError(error: NextDynamicServerError) {
    return DynamicServerError.make({ _nextCause: error })
  }
}
export const isDynamicServerError = Schema.is(DynamicServerError)

export class RedirectError extends Schema.TaggedError<RedirectError>()(
  "RedirectError",
  {
    _nextCause: Schema.Defect
  },
  {
    description: "An error was thrown to indicate that this request should be redirected"
  }
) {
  static fromNextRedirectError(error: NextRedirectError) {
    return RedirectError.make({ _nextCause: error })
  }
}
export const isRedirectError = Schema.is(RedirectError)
