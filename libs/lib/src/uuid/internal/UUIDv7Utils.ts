import { UUIDv7 } from "../UUIDv7.ts"

const CROCKFORD_BASE_32_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"
const HEX_ALPHABET = "0123456789abcdef"

/**
 * Decodes a 26-char Crockford Base32 string into 16 bytes.
 * Base32 uses 5 bits/char; 26 chars = 130 bits (128 UUID bits + 2 padding).
 */
export function decodeCrockfordBase32(str: string): Uint8Array {
  const bytes = new Uint8Array(16)
  let bitBuffer = 0
  let bitsInBuffer = 0
  let byteIndex = 0

  for (let i = 0; i < str.length; i++) {
    const char = str[i] ?? "0"
    const value = CROCKFORD_BASE_32_ALPHABET.indexOf(char)

    bitBuffer = (bitBuffer << 5) | value
    bitsInBuffer += 5

    if (bitsInBuffer >= 8) {
      bitsInBuffer -= 8
      bytes[byteIndex++] = (bitBuffer >> bitsInBuffer) & 0xff
    }
  }

  return bytes
}

/**
 * Encodes 16 bytes into a 26-char Crockford Base32 string.
 */
export function encodeCrockfordBase32(bytes: Uint8Array): string {
  let output = ""
  let bitBuffer = 0
  let bitsInBuffer = 0

  for (let i = 0; i < bytes.length; i++) {
    const byte = bytes[i] ?? 0

    bitBuffer = (bitBuffer << 8) | byte
    bitsInBuffer += 8

    while (bitsInBuffer >= 5) {
      bitsInBuffer -= 5
      const index = (bitBuffer >> bitsInBuffer) & 0x1f
      output += CROCKFORD_BASE_32_ALPHABET.charAt(index)
    }
  }

  // Pad remaining bits (128 % 5 = 3) to form final 5-bit group
  if (bitsInBuffer > 0) {
    const index = (bitBuffer << (5 - bitsInBuffer)) & 0x1f
    output += CROCKFORD_BASE_32_ALPHABET.charAt(index)
  }

  return output
}

export function formatBytesAsUUIDv7(bytes: Uint8Array) {
  let output = "";

  for (let i = 0; i < bytes.length; i++) {
    const byte = bytes[i] ?? 0

    output += HEX_ALPHABET.charAt(byte >>> 4);
    output += HEX_ALPHABET.charAt(byte & 0xf);

    if (i === 3 || i === 5 || i === 7 || i === 9) {
      output += "-";
    }
  }

  return UUIDv7.make(output);
}
export function formatHexStringAsUUIDv7(hex: string) {
  let output = "";

  for (let i = 0; i < hex.length; i++) {
    const char = hex[i]
    output += char ?? "0"

    if (i === 7 || i === 11 || i === 15 || i === 19) {
      output += "-"
    }
  }

  return UUIDv7.make(output);
}
