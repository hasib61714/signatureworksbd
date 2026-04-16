import Container from '@/shared/components/ui/Container'
import PageHero from '@/shared/components/layout/PageHero'
import PortfolioGrid from '@/features/portfolio/components/PortfolioGrid'
import { getPortfolioProjects } from '@/lib/db/portfolio'
import { getManagedPageContent } from '@/lib/db/siteSettings'

export const metadata = {
  title: 'Portfolio',
  description: 'Explore 150+ architectural design, construction, and interior projects by Signature Works BD across Dhaka.',
}

export const dynamic = 'force-dynamic'

export default async function PortfolioPage() {
  const [pageContent, projects] = await Promise.all([
    getManagedPageContent('portfolio'),
    getPortfolioProjects(),
  ])

  return (
    <main className="pt-32 pb-24 bg-navy-950 min-h-screen">
      <Container>
        <div className="mb-14">
          <PageHero
            dark
            label={pageContent.label}
            title={pageContent.title}
            accent={pageContent.accent}
            description={pageContent.description}
            cards={pageContent.cards}
          />
        </div>

        <PortfolioGrid projects={projects} />
      </Container>
    </main>
  )
}
