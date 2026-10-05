import { useRef, useState } from 'react'
import { exportBackup, importBackup } from '../lib/storage'
export function BackupControls() {
  const fileRef = useRef<HTMLInputElement>(null)
  const [message,setMessage] = useState('')
  function download() {
    const url = URL.createObjectURL(new Blob([exportBackup()], { type:'application/json' }))
    const a = document.createElement('a'); a.href=url; a.download=`typeflow-backup-${new Date().toISOString().slice(0,10)}.json`; a.click()
    window.setTimeout(() => URL.revokeObjectURL(url),1000)
    setMessage('Backup downloaded. Keep it somewhere you can find it.')
  }
  return <section className="coaching-card mt-10" aria-label="Backup your progress"><p className="kicker">Your progress, in your hands</p><p className="mt-3 text-sm text-muted">Back up your last 50 results, passed lessons, comfort settings, and poem rotation. Import merges results and passed lessons; it restores the backup’s settings and rotation.</p>
    <div className="mt-5 flex flex-wrap gap-3"><button type="button" className="btn" onClick={download}>Export backup</button><button type="button" className="btn" onClick={() => fileRef.current?.click()}>Import backup</button></div>
    <input ref={fileRef} className="sr-only" aria-label="Typeflow backup file" tabIndex={-1} type="file" accept="application/json,.json" onChange={async (e) => { const file = e.target.files?.[0]; if (!file) return; try { if (file.size > 5_000_000) throw new Error('Choose a backup smaller than 5 MB.'); const count = importBackup(await file.text()); setMessage(`Imported ${count} results. Your progress is ready.`) } catch (error) { setMessage(error instanceof SyntaxError ? 'That file is not valid JSON. Choose a Typeflow backup.' : error instanceof Error ? error.message : 'Could not import this backup.') } e.target.value='' }} />
    {message ? <p className="mt-4 text-sm" role="status">{message}</p> : null}
  </section>
}
