const fs = require('node:fs'), path = require('node:path'), ts = require('typescript'), assert = require('node:assert/strict');
const project = path.join(__dirname,'..');
const out = fs.mkdtempSync(path.join(project,'.typeflow-dom-'));
fs.writeFileSync(path.join(out,'package.json'),'{"type":"commonjs"}');
function compile(dir) {
  for (const e of fs.readdirSync(path.join(project,'src',dir),{withFileTypes:true})) {
    const f = path.join(dir,e.name);
    if (e.isDirectory()) compile(f);
    else {
      const target = path.join(out,f.replace(/\.tsx?$/,'.js'));
      fs.mkdirSync(path.dirname(target),{recursive:true});
      if (/\.tsx?$/.test(f)) fs.writeFileSync(target,ts.transpileModule(fs.readFileSync(path.join(project,'src',f),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText);
      else fs.copyFileSync(path.join(project,'src',f),target);
    }
  }
}
compile('');
const { JSDOM } = require('jsdom');
const dom = new JSDOM('<div id="root"></div>',{url:'http://localhost/'});
for (const key of ['window','document','localStorage','HTMLElement','KeyboardEvent','Event']) global[key] = dom.window[key];
global.IS_REACT_ACT_ENVIRONMENT = true;
let clock = 1000, tick = null;
Object.defineProperty(performance,'now',{value:()=>clock,configurable:true});
global.requestAnimationFrame = (callback) => { tick = callback; return 1 };
global.cancelAnimationFrame = () => { tick = null };
window.matchMedia = () => ({matches:false,addEventListener(){},removeEventListener(){}});
const React = require('react'), {act} = React, {createRoot} = require('react-dom/client');
const {MemoryRouter,Routes,Route} = require('react-router-dom');
const {SettingsProvider} = require(path.join(out,'hooks/useTheme.js'));
const {TestPage} = require(path.join(out,'pages/TestPage.js'));
const {LessonPlayerPage} = require(path.join(out,'pages/LessonPlayerPage.js'));
const {DailyPage} = require(path.join(out,'pages/DailyPage.js'));
const {HistoryPage} = require(path.join(out,'pages/HistoryPage.js'));
const store = require(path.join(out,'lib/storage.js'));
const root = createRoot(document.getElementById('root'));
const button = (label) => [...document.querySelectorAll('button')].find((b)=>b.textContent === label);
const words = () => [...document.querySelectorAll('.stage span.relative.whitespace-nowrap')].map((e)=>e.textContent);
const key = (value) => { clock += 100; document.querySelector('input[aria-label="Type here"]').dispatchEvent(new KeyboardEvent('keydown',{key:value,bubbles:true,cancelable:true})) };
async function click(label) { assert.ok(button(label),`missing button: ${label}`); await act(async()=>button(label).click()) }
async function mount(url,Page,route) {
  await act(async()=>root.render(React.createElement(React.StrictMode,null,React.createElement(SettingsProvider,null,React.createElement(MemoryRouter,{initialEntries:[url],key:url+Math.random()},React.createElement(Routes,null,React.createElement(Route,{path:route,element:React.createElement(Page)})))))));
}
async function finishWords() { const text=words().join(' '); await act(async()=>{ for (const ch of text) key(ch) }) }
(async()=>{
  await mount('/test?words=10',TestPage,'/test'); await click('Begin practice');
  const original = words(); assert.equal(original.length,10);
  await act(async()=>{ key(original[0][0] === 'x' ? 'z' : 'x'); key('Backspace') });
  await finishWords();
  assert.ok(document.body.textContent.includes('First-attempt accuracy remembers errors'));
  let saved = store.loadResults()[0]; assert.ok(saved.firstAccuracy < 100); assert.equal(saved.accuracy,100); assert.ok(Object.keys(saved.keyStats).length);
  assert.equal(store.loadPoemHistory().length,1,'only viewed poems enter rotation');
  await click('Repeat this poem'); assert.deepEqual(words(),original);
  await act(async()=>key(original[0][0]));
  await act(async()=>window.dispatchEvent(new KeyboardEvent('keydown',{key:'r',altKey:true,bubbles:true,cancelable:true})));
  assert.deepEqual(words(),original); assert.equal(document.activeElement.getAttribute('aria-label'),'Type here');
  const tab = new KeyboardEvent('keydown',{key:'Tab',bubbles:true,cancelable:true});
  await act(async()=>document.activeElement.dispatchEvent(tab)); assert.equal(tab.defaultPrevented,false,'Tab must not be trapped');
  await finishWords(); await click('New poem'); assert.notDeepEqual(words(),original);
  await mount('/lessons/world',LessonPlayerPage,'/lessons/:id');
  await click('Begin lesson'); await finishWords();
  assert.ok(store.loadProgress().completed.includes('world'),'lesson passes using first-attempt accuracy');
  await mount('/daily',DailyPage,'/daily');
  await click('Start daily practice');
  for (let stage=0; stage<3; stage++) {
    await click('Begin practice');
    const first=words()[0][0]; await act(async()=>key(first));
    const endTick=tick; assert.ok(endTick,'timer must be scheduled');
    clock += 600000;
    await act(async()=>endTick(clock));
    await click(stage===0 ? 'Continue to Focused practice' : stage===1 ? 'Continue to Poetry flow' : 'Finish daily practice');
  }
  assert.ok(document.body.textContent.includes('Daily practice · complete'));
  assert.equal(store.loadResults().filter((r)=>r.daily).length,3);
  assert.deepEqual(store.loadResults().filter((r)=>r.daily).map((r)=>r.practiceStyle),['flow','guided','flow']);
  await mount('/test?benchmark=1',TestPage,'/test'); await click('Begin practice');
  await act(async()=>key(words()[0][0])); const benchmarkTick=tick; clock+=60000; await act(async()=>benchmarkTick(clock));
  assert.equal(store.loadResults()[0].benchmark,true);
  assert.equal(store.loadResults()[0].durationMs,60000);
  await mount('/history',HistoryPage,'/history');
  assert.ok(button('Export backup')); assert.ok(button('Import backup'));
  const backup=JSON.parse(store.exportBackup()); backup.settings.highContrast=true; backup.settings.fontSize=30;
  await act(async()=>store.importBackup(JSON.stringify(backup)));
  assert.ok(document.documentElement.classList.contains('high-contrast'));
  assert.equal(store.loadSettings().fontSize,30);
  await act(async()=>root.unmount());
  console.log('DOM integration passed in StrictMode: corrected scoring, repeat/new poems, normal Tab, Alt+R, automatic lesson completion, saved progress, all daily stages, benchmark timing, coaching, and backup restoration.');
})().catch((error)=>{console.error(error);process.exitCode=1}).finally(()=>fs.rmSync(out,{recursive:true,force:true}));
