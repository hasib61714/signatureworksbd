import Container from '@/shared/components/ui/Container'
import SectionLabel from '@/shared/components/ui/SectionLabel'
import PortfolioGrid from '@/features/portfolio/components/PortfolioGrid'

export const metadata = {
  title: 'Portfolio',
  description: 'Explore 150+ architectural design, construction, and interior projects by Signature Works BD across Dhaka.',
}

export default function PortfolioPage() {
  return (
    <main className="pt-32 pb-24 bg-navy-950 min-h-screen">
      <Container>
        <div className="text-center mb-14">
          <SectionLabel>Our Portfolio</SectionLabel>
          <h1 className="text-4xl sm:text-6xl font-bold text-white font-serif leading-tight">
            Projects That <span className="text-gold-gradient">Define Us</span>
          </h1>
          <p className="mt-4 text-slate-400 max-w-xl mx-auto text-lg">
            150+ completed projects across Dhaka — each one a signature of our craft.
          </p>
        </div>

        <PortfolioGrid />
      </Container>
    </main>
  )
}
