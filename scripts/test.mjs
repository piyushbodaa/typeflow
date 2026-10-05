import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { createRequire } from 'node:module'
import ts from 'typescript'

const dir = mkdtempSync(join(tmpdir(), 'typeflow-tests-'))
const require = createRequire(import.meta.url)
try {
  for (const file of ['data/poems.ts', 'data/lessons.ts', 'engine/generate.ts', 'lib/poemRotation.ts']) {
    const target = join(dir, file.replace('.ts', '.js'))
    mkdirSync(dirname(target), { recursive: true })
    writeFileSync(target, ts.transpileModule(readFileSync(`src/${file}`, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText)
  }
  writeFileSync(join(dir, 'data/words.json'), readFileSync('src/data/words.json'))
  const storage = new Map()
  globalThis.localStorage = { getItem: (key) => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) }
  const { POEMS, poemStream } = require(join(dir, 'data/poems.js'))
  const { LESSONS } = require(join(dir, 'data/lessons.js'))
  const { createPoemRotation } = require(join(dir, 'lib/poemRotation.js'))
  const rng = () => 0
  const first = createPoemRotation()
  const firstPoem = first.pick(rng)
  assert.equal(storage.size, 0, 'preview selection must not write during render')
  first.remember()
  first.remember() // React StrictMode effect replay must be idempotent.
  const seen = [firstPoem.id]
  for (let i = 1; i < POEMS.length; i++) {
    const rotation = createPoemRotation()
    const poem = rotation.pick(rng)
    assert.ok(!seen.includes(poem.id), 'fresh visits must exhaust unseen poems first')
    seen.push(poem.id)
    rotation.remember()
  }
  assert.equal(createPoemRotation().pick(rng).id, firstPoem.id, 'exhausted pools return their least recent poem')
  for (const lesson of LESSONS.filter((lesson) => ['shift', 'punct', 'world', 'english', 'whole-poem'].includes(lesson.id))) {
    storage.clear()
    const rotation = createPoemRotation()
    const run = lesson.build(rng, rotation.pick)
    rotation.remember()
    const next = createPoemRotation()
    assert.notEqual(lesson.build(rng, next.pick).poem.id, run.poem.id, `${lesson.id} must rotate`)
  }
  storage.clear()
  const rotation = createPoemRotation()
  const selected = []
  const tokens = poemStream(rng, 400, POEMS, (random, pool) => {
    const poem = rotation.pick(random, pool)
    selected.push(poem.id)
    return poem
  })
  assert.ok(tokens.length >= 400)
  assert.equal(new Set(selected).size, selected.length, 'timed runs must not repeat poems before exhaustion')
  storage.set('typeflow:poem-rotation:v1', '{broken')
  assert.ok(createPoemRotation().pick(rng))
  globalThis.localStorage = { getItem() { throw Error('blocked') }, setItem() { throw Error('blocked') } }
  const blocked = createPoemRotation()
  const poem = blocked.pick(rng)
  blocked.remember()
  assert.notEqual(createPoemRotation().pick(rng).id, poem.id, 'memory fallback must rotate when storage is blocked')
  console.log('Poem rotation tests passed: persistence, exhaustion, lesson pools, timed streams, corrupt/blocked storage.')
} finally {
  rmSync(dir, { recursive: true, force: true })
}
