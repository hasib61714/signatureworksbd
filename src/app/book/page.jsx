import Container from '@/shared/components/ui/Container'
import PageHero from '@/shared/components/layout/PageHero'
import BookingClient from '@/features/booking/components/BookingClient'

export const metadata = {
  title: 'Book a Consultation',
  description: 'Book a free 30-minute consultation with Signature Works BD. Choose a date and time that works for you.',
}

export default function BookPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-navy-950 pt-24 pb-20">
      <Container className="max-w-4xl">
        <div className="mb-12">
          <PageHero
            label="Free Consultation"
            title="Book"
            accent="Consultation"
            description="Talk with our team about design direction, budgeting, renovation, or construction planning in a focused 30-minute session."
            cards={[
              { title: 'No pressure', text: 'A clear discussion before you commit.' },
              { title: 'Project focus', text: 'Advice based on your real needs and site.' },
              { title: 'Next steps', text: 'Get a clearer direction for moving ahead.' },
            ]}
          />
        </div>
        <div className="max-w-2xl mx-auto">
          <BookingClient />
        </div>
      </Container>
    </main>
  )
}
