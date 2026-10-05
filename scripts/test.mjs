import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { createRequire } from 'node:module'
import ts from 'typescript'

const dir = mkdtempSync(join(tmpdir(), 'typeflow-tests-'))
const require = createRequire(import.meta.url)
try {
  for (const file of ['data/poems.ts', 'data/lessons.ts', 'engine/generate.ts', 'lib/poemRotation.ts', 'lib/storage.ts', 'lib/coaching.ts', 'lib/practice.ts', 'lib/result.ts', 'engine/engine.ts', 'engine/keys.ts', 'engine/stats.ts']) {
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
  // Return to writable storage for the engine and backup tests.
  storage.clear()
  globalThis.localStorage = { getItem: (key) => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) }
  const { createEngine } = require(join(dir, 'engine/engine.js'))
  const config = (words, extra = {}) => ({ mode: { kind: 'custom', words }, wordBank: [], ...extra })
  let engine = createEngine(config(['cat']))
  engine.handleKey('x',0); engine.handleKey('Backspace',100)
  for (const [i,key] of [...'cat'].entries()) engine.handleKey(key,200+i*100)
  let snapshot = engine.getSnapshot()
  assert.equal(snapshot.status,'finished', 'final character completes without trailing Space')
  assert.equal(snapshot.stats.accuracy,100)
  assert.ok(Math.abs(snapshot.stats.firstAccuracy - 200/3) < 0.01, 'corrected errors remain in first-attempt accuracy')
  assert.equal(snapshot.errorMap.c,1)
  assert.equal(snapshot.keyStats.c.attempts,2)
  assert.equal(snapshot.keyStats.c.errors,1)
  const savedSnapshot = snapshot
  engine = createEngine(config(['cat'], { guided:true }))
  engine.handleKey('x',0); engine.handleKey('a',100); engine.handleKey(' ',200)
  assert.equal(engine.getSnapshot().caret.charIndex,1, 'guided mode blocks continuation until correction')
  engine.handleKey('Backspace',300)
  for (const [i,key] of [...'cat'].entries()) engine.handleKey(key,400+i*100)
  assert.equal(engine.getSnapshot().status,'finished')
  assert.ok(engine.getSnapshot().stats.firstAccuracy < 95)
  engine = createEngine({ mode:{kind:'custom',words:['one','two'],seconds:1}, wordBank:[] })
  engine.handleKey('o',0); engine.handleKey('n',1000)
  assert.equal(engine.getSnapshot().stats.correct,1,'keystrokes at the deadline are rejected')
  assert.equal(engine.getSnapshot().stats.elapsedMs,1000)
  engine = createEngine({ mode:{kind:'custom',words:['a'],seconds:1}, wordBank:[] })
  engine.handleKey('a',0); engine.handleKey(' ',100)
  assert.equal(engine.getSnapshot().expectedKey,'a','timed poetry tops up instead of getting stuck')
  engine = createEngine(config(['cat','dog']))
  for (const [i,key] of [...'cat '].entries()) engine.handleKey(key,i*100)
  engine.handleKey('Backspace',400)
  assert.equal(engine.getSnapshot().caret.wordIndex,0,'Backspace can correct the previous word')
  engine = createEngine(config(['abcdef']))
  engine.handleKey('a',0); engine.handleKey('b',2000)
  assert.deepEqual(engine.getSnapshot().wpmSeries,[12,6],'late characters do not rewrite earlier speed samples')
  engine.restart()
  assert.equal(engine.getSnapshot().stats.attempts,0,'repeat clears first-attempt counters')
  const { buildPoetry, buildLesson } = require(join(dir,'lib/practice.js'))
  const benchmarkA = buildPoetry(1,{seconds:60,benchmark:true}), benchmarkB = buildPoetry(2,{seconds:60,benchmark:true})
  assert.deepEqual(benchmarkA.mode,benchmarkB.mode,'benchmark content is stable across seeds')
  for (const length of ['short','medium','long']) {
    const lesson = buildLesson(1,'whole-poem',length)
    assert.ok(lesson.lineBreaks.length > 0)
    assert.ok(lesson.passages.every((p) => p.poem.full),'whole-poem lesson retains complete poems')
  }
  storage.set('typeflow:poem-rotation:v1','[]')
  const synthetic = [{...POEMS[0],id:'without-e',lines:['zzz']},{...POEMS[1],id:'with-e',lines:['eeeeeeeeeeee']}]
  assert.equal(createPoemRotation(['e']).pick(() => 0.1,synthetic).id,'with-e','adaptive selection chooses a fresh passage containing a target key')
  const { weakestKeys, resultGroup } = require(join(dir,'lib/coaching.js'))
  assert.equal(weakestKeys([{keyStats:{a:{attempts:10,errors:1,totalMs:1000,intervals:10},b:{attempts:10,errors:4,totalMs:1000,intervals:10}}}])[0],'b')
  assert.notEqual(resultGroup({mode:{kind:'timed',seconds:60},practiceStyle:'guided'}),resultGroup({mode:{kind:'timed',seconds:60},practiceStyle:'flow'}),'records separate practice styles')
  const prepared = buildPoetry(3,{seconds:60})
  prepared.remember([prepared.passages[0].poem.id])
  assert.equal(JSON.parse(storage.get('typeflow:poem-rotation:v1')).length,1,'unread timed buffer poems are not marked seen')
  const { snapshotToResult } = require(join(dir,'lib/result.js'))
  const { pushResult,exportBackup,importBackup,loadResults,loadSettings,saveSettings,loadProgress } = require(join(dir,'lib/storage.js'))
  const result = snapshotToResult(savedSnapshot,'test',{kind:'words',count:10})
  pushResult(result)
  const backup = exportBackup()
  importBackup(backup); importBackup(backup)
  assert.equal(loadResults().length,1,'backup import merges without duplicate results')
  assert.equal(loadResults()[0].errorMap.c,1,'error history survives a backup round trip')
  assert.throws(() => importBackup('{"version":1,"results":[{}]}'),'malformed backups must be rejected')
  const bad = JSON.parse(backup); bad.results[0].wpm='fast'
  assert.throws(() => importBackup(JSON.stringify(bad)))
  globalThis.localStorage = { getItem() { throw Error('blocked') }, setItem() { throw Error('blocked') } }
  saveSettings({...loadSettings(),fontSize:30})
  assert.equal(loadSettings().fontSize,30,'comfort settings work with blocked storage')
  assert.ok(Array.isArray(loadProgress().completed))
  console.log('All tests passed: rotation, guided/flow accuracy, timer boundaries, final-character completion, refill, corrections, speed samples, benchmarks, verse lines, and backup validation.')
} finally {
  rmSync(dir, { recursive: true, force: true })
}
