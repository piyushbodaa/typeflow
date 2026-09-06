export function RibbonMark({ className = '' }: { className?: string }) {
  return (
    <figure className={`ribbon-mark ${className}`.trim()}>
      <img
        src="/ribbon.jpg"
        alt="A dual-color typewriter carbon ribbon cassette"
        width={352}
        height={243}
      />
    </figure>
  )
}
