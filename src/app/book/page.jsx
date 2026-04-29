import Container from '@/shared/components/ui/Container'
import PageHero from '@/shared/components/layout/PageHero'
import BookingClient from '@/features/booking/components/BookingClient'
import { getManagedPageContent } from '@/lib/db/siteSettings'

export const metadata = {
  title: 'Book a Consultation',
  description: 'Book a free 30-minute consultation with Signature Works. Choose a date and time that works for you.',
}

export const dynamic = 'force-dynamic'

export default async function BookPage() {
  const pageContent = await getManagedPageContent('book')

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
        <div className="max-w-2xl mx-auto">
          <BookingClient />
        </div>
      </Container>
    </main>
  )
}
