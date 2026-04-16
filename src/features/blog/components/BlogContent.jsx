// Lightweight markdown renderer — supports ##, **bold**, tables, lists, images, and video embeds.

function parseLine(line) {
  return line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
}

function getEmbedUrl(url) {
  if (!url) return ''
  if (url.includes('youtube.com/watch?v=')) {
    return `https://www.youtube.com/embed/${url.split('v=')[1].split('&')[0]}`
  }
  if (url.includes('youtu.be/')) {
    return `https://www.youtube.com/embed/${url.split('youtu.be/')[1].split('?')[0]}`
  }
  return url
}

function parseContent(content) {
  const lines = content.split('\n')
  const elements = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    if (trimmed === '') {
      i++
      continue
    }

    if (trimmed.startsWith('## ')) {
      elements.push({ type: 'h2', content: trimmed.slice(3) })
      i++
      continue
    }

    const imageMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/)
    if (imageMatch) {
      elements.push({ type: 'image', alt: imageMatch[1] || 'Article image', src: imageMatch[2] })
      i++
      continue
    }

    const videoMatch = trimmed.match(/^\[video:(.*?)\]$/i) || trimmed.match(/^video:\s*(https?:\/\/\S+)/i)
    if (videoMatch) {
      elements.push({ type: 'video', src: videoMatch[1].trim() })
      i++
      continue
    }

    if (trimmed.startsWith('|')) {
      const tableLines = []
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i])
        i++
      }
      elements.push({ type: 'table', lines: tableLines })
      continue
    }

    if (trimmed.startsWith('- ')) {
      const items = []
      while (i < lines.length && lines[i].trim().startsWith('- ')) {
        items.push(lines[i].trim().slice(2))
        i++
      }
      elements.push({ type: 'ul', items })
      continue
    }

    const paraLines = []
    while (i < lines.length) {
      const current = lines[i].trim()
      const isSpecial = current === '' || current.startsWith('## ') || current.startsWith('- ') || current.startsWith('|') || current.match(/^!\[(.*?)\]\((.*?)\)$/) || current.match(/^\[video:(.*?)\]$/i) || current.match(/^video:\s*(https?:\/\/\S+)/i)
      if (isSpecial) break
      paraLines.push(lines[i])
      i++
    }

    if (paraLines.length > 0) {
      elements.push({ type: 'p', content: paraLines.join(' ') })
    }
  }

  return elements
}

function TableEl({ lines }) {
  const rows = lines.filter(l => !l.match(/^\|[-| ]+\|$/))
  const headers = rows[0].split('|').filter(c => c.trim() !== '')
  const body = rows.slice(1)

  return (
    <div className="overflow-x-auto my-6 rounded-xl border border-slate-200 dark:border-white/[0.08]">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 dark:bg-navy-800">
            {headers.map((h, i) => (
              <th key={i} className="px-4 py-3 text-left text-slate-600 dark:text-slate-300 font-semibold text-xs uppercase tracking-wide">
                {h.trim()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, ri) => {
            const cells = row.split('|').filter(c => c.trim() !== '')
            return (
              <tr key={ri} className="border-t border-slate-100 dark:border-white/[0.05]">
                {cells.map((cell, ci) => (
                  <td key={ci} className="px-4 py-3 text-slate-700 dark:text-slate-300">{cell.trim()}</td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default function BlogContent({ content }) {
  const elements = parseContent(content)

  return (
    <article className="prose-custom">
      {elements.map((el, i) => {
        if (el.type === 'h2') {
          return (
            <h2 key={i} className="text-2xl font-bold font-serif text-navy-900 dark:text-white mt-10 mb-4">
              {el.content}
            </h2>
          )
        }
        if (el.type === 'ul') {
          return (
            <ul key={i} className="my-5 space-y-2.5">
              {el.items.map((item, j) => (
                <li key={j} className="flex items-start gap-3 text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                  <span className="w-5 h-5 rounded-full bg-gold-500/20 border border-gold-500/40 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                  </span>
                  <span dangerouslySetInnerHTML={{ __html: parseLine(item) }} />
                </li>
              ))}
            </ul>
          )
        }
        if (el.type === 'table') {
          return <TableEl key={i} lines={el.lines} />
        }
        if (el.type === 'image') {
          return (
            <figure key={i} className="my-8 overflow-hidden rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-slate-900/40">
              <img src={el.src} alt={el.alt} className="w-full object-cover" />
              <figcaption className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">{el.alt}</figcaption>
            </figure>
          )
        }
        if (el.type === 'video') {
          return (
            <div key={i} className="my-8 overflow-hidden rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-slate-950 aspect-video">
              <iframe
                src={getEmbedUrl(el.src)}
                title="Embedded video"
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )
        }
        if (el.type === 'p') {
          return (
            <p
              key={i}
              className="text-slate-600 dark:text-slate-300 text-base leading-relaxed my-5"
              dangerouslySetInnerHTML={{ __html: parseLine(el.content) }}
            />
          )
        }
        return null
      })}
    </article>
  )
}
