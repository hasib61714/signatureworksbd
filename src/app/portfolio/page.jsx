import Container from '@/shared/components/ui/Container'
import PageHero from '@/shared/components/layout/PageHero'
import PortfolioGrid from '@/features/portfolio/components/PortfolioGrid'

export const metadata = {
  title: 'Portfolio',
  description: 'Explore 150+ architectural design, construction, and interior projects by Signature Works BD across Dhaka.',
}

export default function PortfolioPage() {
  return (
    <main className="pt-32 pb-24 bg-navy-950 min-h-screen">
      <Container>
        <div className="mb-14">
          <PageHero
            dark
            label="Built Work"
            title="Project"
            accent="Portfolio"
            description="A curated look at residential, commercial, and interior work shaped by planning, detailing, and disciplined execution."
            cards={[
              { title: 'Residential', text: 'Comfort-driven homes with stronger layout logic.' },
              { title: 'Commercial', text: 'Branded spaces that feel practical and polished.' },
              { title: 'Renovation', text: 'Meaningful transformation without a generic feel.' },
            ]}
          />
        </div>

        <PortfolioGrid />
      </Container>
    </main>
  )
}
