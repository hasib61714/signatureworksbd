import Container from '@/shared/components/ui/Container'
import Reveal from '@/shared/components/ui/Reveal'
import { statsData } from '@/data'

export default function StatsSection({ stats = statsData }) {
  const safeStats = Array.isArray(stats) && stats.length > 0 ? stats : statsData
  return (
    <section className="relative bg-white dark:bg-slate-950">
      {/* Top/bottom accent lines */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />

      <Container className="py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {safeStats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 80}>
              <div className="group text-center">
                <p className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-navy-900 via-gold-500 to-amber-300 bg-clip-text text-transparent leading-none mb-2">
                  {stat.value}
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                  {stat.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
