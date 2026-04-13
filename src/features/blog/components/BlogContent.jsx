// Lightweight markdown renderer — supports ##, **bold**, tables, lists, paragraphs
// No external dependency needed for our controlled content.

function parseLine(line) {
  // Bold: **text**
  return line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
}

function parseContent(content) {
  const lines = content.split('\n')
  const elements = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Empty line
    if (line.trim() === '') {
      i++
      continue
    }

    // H2
    if (line.startsWith('## ')) {
      elements.push({ type: 'h2', content: line.slice(3) })
      i++
      continue
    }

    // Table
    if (line.startsWith('|')) {
      const tableLines = []
      while (i < lines.length && lines[i].startsWith('|')) {
        tableLines.push(lines[i])
        i++
      }
      elements.push({ type: 'table', lines: tableLines })
      continue
    }

    // Unordered list
    if (line.startsWith('- ')) {
      const items = []
      while (i < lines.length && lines[i].startsWith('- ')) {
        items.push(lines[i].slice(2))
        i++
      }
      elements.push({ type: 'ul', items })
      continue
    }

    // Paragraph
    const paraLines = []
    while (i < lines.length && lines[i].trim() !== '' && !lines[i].startsWith('## ') && !lines[i].startsWith('- ') && !lines[i].startsWith('|')) {
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
