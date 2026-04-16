import { Suspense } from 'react'
import Container from '@/shared/components/ui/Container'
import PageHero from '@/shared/components/layout/PageHero'
import CostCalculatorClient from '@/features/calculator/components/CostCalculatorClient'
import { getManagedPageContent } from '@/lib/db/siteSettings'

export const metadata = {
  title: 'Construction Cost Calculator',
  description: 'Estimate your construction or interior design project cost in Bangladesh. Get an instant ballpark figure based on project type, area, and quality grade.',
}

export const dynamic = 'force-dynamic'

export default async function CalculatorPage() {
  const pageContent = await getManagedPageContent('calculator')

  return (
    <main className="min-h-screen bg-white dark:bg-navy-950 pt-24 pb-20">
      <Container className="max-w-4xl">
        <div className="mb-12">
          <PageHero
            label={pageContent.label}
            title={pageContent.title}
            accent={pageContent.accent}
            description={pageContent.description}
            cards={pageContent.cards}
          />
        </div>
        <div className="max-w-3xl mx-auto">
          <Suspense>
            <CostCalculatorClient />
          </Suspense>
        </div>
      </Container>
    </main>
  )
}
