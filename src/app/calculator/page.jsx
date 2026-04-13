import { Suspense } from 'react'
import Container from '@/shared/components/ui/Container'
import SectionLabel from '@/shared/components/ui/SectionLabel'
import CostCalculatorClient from '@/features/calculator/components/CostCalculatorClient'

export const metadata = {
  title: 'Construction Cost Calculator',
  description: 'Estimate your construction or interior design project cost in Bangladesh. Get an instant ballpark figure based on project type, area, and quality grade.',
}

export default function CalculatorPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-navy-950 pt-24 pb-20">
      <Container className="max-w-3xl">
        <div className="text-center mb-12">
          <SectionLabel>Free Tool</SectionLabel>
          <h1 className="text-4xl sm:text-5xl font-bold text-navy-900 dark:text-white font-serif mt-4">
            Construction <span className="text-light-gradient">Cost Calculator</span>
          </h1>
          <p className="mt-4 text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            Get an instant ballpark estimate for your project. Based on current Dhaka market rates as of 2024.
          </p>
        </div>
        <Suspense>
          <CostCalculatorClient />
        </Suspense>
      </Container>
    </main>
  )
}
