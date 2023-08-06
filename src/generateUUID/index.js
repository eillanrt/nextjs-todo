import crypto from 'crypto'

export function generateUUID() {
  const uuidBytes = crypto.randomBytes(16)
  uuidBytes[6] = (uuidBytes[6] & 0x0f) | 0x40 // Version 4 (random)
  uuidBytes[8] = (uuidBytes[8] & 0x3f) | 0x80 // Variant (RFC4122)

  const hexDigits = '0123456789abcdef'
  let uuid = ''
  for (let i = 0; i < 16; i++) {
    uuid += hexDigits[uuidBytes[i] >> 4] + hexDigits[uuidBytes[i] & 0x0f]
    if ([3, 5, 7, 9].includes(i)) uuid += '-'
  }

  return uuid
}
