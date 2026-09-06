export function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function pickWords(bank: string[], count: number, rng: () => number): string[] {
  const source = bank.length > 0 ? bank : ['the']
  const out: string[] = []
  let last = ''
  let guard = 0
  while (out.length < count && guard < count * 20) {
    guard += 1
    const word = source[Math.floor(rng() * source.length)] ?? source[0]
    if (word === last && source.length > 1) continue
    out.push(word)
    last = word
  }
  return out
}

export function generateFromCharset(
  chars: string,
  count: number,
  rng: () => number,
  minLen = 4,
  maxLen = 5,
): string[] {
  const alphabet = chars.replace(/\s/g, '')
  if (!alphabet) return pickWords(['a'], count, rng)
  const out: string[] = []
  for (let i = 0; i < count; i += 1) {
    const len = minLen + Math.floor(rng() * (maxLen - minLen + 1))
    let word = ''
    for (let j = 0; j < len; j += 1) {
      word += alphabet[Math.floor(rng() * alphabet.length)]
    }
    out.push(word)
  }
  return out
}

export function wordsUsingCharset(bank: string[], charset: string): string[] {
  const allowed = new Set(charset.replace(/\s/g, '').split(''))
  return bank.filter((word) => [...word].every((ch) => allowed.has(ch.toLowerCase())))
}

export function tokenize(text: string): string[] {
  return text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0)
}
