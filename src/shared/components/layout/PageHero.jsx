import ExpandableText from '@/shared/components/ui/ExpandableText'

export default function PageHero({ label, title, accent, description, cards = [], dark = false }) {
  return (
    <section
      className={`relative overflow-hidden rounded-[28px] border p-6 sm:p-8 lg:p-10 ${
        dark
          ? 'border-white/10 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 text-white'
          : 'border-navy-100 bg-gradient-to-br from-white via-navy-50 to-gold-50 text-navy-950 shadow-xl shadow-navy-900/5'
      }`}
    >
      <div className="absolute inset-0 opacity-40 pointer-events-none bg-grid" />
      <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gold-400/20 blur-3xl" />
      <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-navy-500/20 blur-3xl" />

      <div className="relative">
        <span
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${
            dark
              ? 'border-gold-400/30 bg-gold-400/10 text-gold-300'
              : 'border-gold-300/60 bg-gold-100 text-navy-900'
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
          {label}
        </span>

        <div className="mt-5 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <h1
              className={`line-clamp-2 max-w-3xl text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.02] ${dark ? 'text-white' : 'text-navy-950'}`}
              style={{ textWrap: 'balance' }}
            >
              <span className="block">{title}</span>
              {accent && <span className="mt-1 block bg-gradient-to-r from-gold-500 via-amber-300 to-navy-500 bg-clip-text text-transparent">{accent}</span>}
            </h1>
            <ExpandableText
              text={description}
              className={`mt-4 max-w-2xl text-base leading-7 ${dark ? 'text-slate-300' : 'text-slate-600'}`}
            />
          </div>

          {cards.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {cards.map((card) => (
                <div
                  key={card.title}
                  className={`rounded-2xl border p-4 ${
                    dark
                      ? 'border-white/10 bg-white/5'
                      : 'border-navy-100 bg-white/80 backdrop-blur-sm'
                  }`}
                >
                  <p className={`text-sm font-bold ${dark ? 'text-white' : 'text-navy-900'}`}>{card.title}</p>
                  <p className={`mt-1 text-sm leading-6 ${dark ? 'text-slate-300' : 'text-slate-600'}`}>{card.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
