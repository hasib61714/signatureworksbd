import { Suspense } from 'react'
import Container from '@/shared/components/ui/Container'
import PageHero from '@/shared/components/layout/PageHero'
import CostCalculatorClient from '@/features/calculator/components/CostCalculatorClient'

export const metadata = {
  title: 'Construction Cost Calculator',
  description: 'Estimate your construction or interior design project cost in Bangladesh. Get an instant ballpark figure based on project type, area, and quality grade.',
}

export default function CalculatorPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-navy-950 pt-24 pb-20">
      <Container className="max-w-4xl">
        <div className="mb-12">
          <PageHero
            label="Planning Tool"
            title="Cost"
            accent="Calculator"
            description="Get a quick budget range for construction, renovation, or interior work before moving into detailed planning."
            cards={[
              { title: 'Quick estimate', text: 'Get a fast early-stage budget range.' },
              { title: 'Dhaka context', text: 'Built around practical local assumptions.' },
              { title: 'Better planning', text: 'Start decisions with more clarity.' },
            ]}
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
