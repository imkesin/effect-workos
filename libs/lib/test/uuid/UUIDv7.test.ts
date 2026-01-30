import { describe, it } from "@effect/vitest"
import * as S from "effect/Schema"
import { expect } from "vitest"
import { ShortenedUUIDv7, UUIDv7, UUIDv7FromShortened } from "../../src/uuid/UUIDv7.ts"

const FULL = "019c1144-15bd-7eff-a88d-37439858704e"
const FULL_UPPER = FULL.toUpperCase()

const SHORTENED = "06E12H0NQNZFZA4D6X1SGP3G9R"
const SHORTENED_LOWER = SHORTENED.toLowerCase()

describe("UUIDv7", () => {
  const decode = S.decodeUnknownSync(UUIDv7)

  it("decodes valid lowercase UUID", async () => {
    const result = decode(FULL)
    expect(result).toBe(FULL)
  })

  it("normalizes uppercase UUID to lowercase", async () => {
    const result = decode(FULL_UPPER)
    expect(result).toBe(FULL)
  })

  it("rejects invalid UUID", () => {
    expect(() => decode("not-a-uuid")).toThrow()
  })
})

describe("ShortenedUUIDv7", () => {
  const decode = S.decodeUnknownSync(ShortenedUUIDv7)

  it("decodes valid uppercase shortened UUID", () => {
    const result = decode(SHORTENED)
    expect(result).toBe(SHORTENED)
  })

  it("normalizes lowercase to uppercase", () => {
    const result = decode(SHORTENED_LOWER)
    expect(result).toBe(SHORTENED)
  })

  it("rejects invalid shortened UUID", () => {
    expect(() => decode("invalid")).toThrow()
  })
})

describe("UUIDv7FromShortened", () => {
  it("decodes uppercase shortened to full UUID", () => {
    const result = S.decodeUnknownSync(UUIDv7FromShortened)(SHORTENED)
    expect(result).toBe(FULL)
  })

  it("decodes lowercase shortened to full UUID", () => {
    const result = S.decodeUnknownSync(UUIDv7FromShortened)(SHORTENED_LOWER)
    expect(result).toBe(FULL)
  })

  it("encodes full UUID to shortened", () => {
    const result = S.encodeUnknownSync(UUIDv7FromShortened)(FULL)
    expect(result).toBe(SHORTENED)
  })

  it("roundtrip: decode then encode", () => {
    const decoded = S.decodeUnknownSync(UUIDv7FromShortened)(SHORTENED)
    const encoded = S.encodeUnknownSync(UUIDv7FromShortened)(decoded)
    expect(encoded).toBe(SHORTENED)
  })

  it("roundtrip: encode then decode", () => {
    const encoded = S.encodeUnknownSync(UUIDv7FromShortened)(FULL)
    const decoded = S.decodeUnknownSync(UUIDv7FromShortened)(encoded)
    expect(decoded).toBe(FULL)
  })
})

