const SHIFTED: Record<string, string> = {
  '~': '`',
  '!': '1',
  '@': '2',
  '#': '3',
  '$': '4',
  '%': '5',
  '^': '6',
  '&': '7',
  '*': '8',
  '(': '9',
  ')': '0',
  _: '-',
  '+': '=',
  '{': '[',
  '}': ']',
  '|': '\\',
  ':': ';',
  '"': "'",
  '<': ',',
  '>': '.',
  '?': '/',
}

export function isPrintableKey(key: string): boolean {
  return key.length === 1 && key !== '\n' && key !== '\r' && key !== '\t'
}

export function needsShift(char: string): boolean {
  if (!char) return false
  if (char.length !== 1) return false
  if (char >= 'A' && char <= 'Z') return true
  return char in SHIFTED
}

export function physicalKey(char: string): string {
  if (char === ' ') return ' '
  if (char >= 'A' && char <= 'Z') return char.toLowerCase()
  return SHIFTED[char] ?? char
}
