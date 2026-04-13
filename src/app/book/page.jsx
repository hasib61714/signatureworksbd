import Container from '@/shared/components/ui/Container'
import SectionLabel from '@/shared/components/ui/SectionLabel'
import BookingClient from '@/features/booking/components/BookingClient'

export const metadata = {
  title: 'Book a Consultation',
  description: 'Book a free 30-minute consultation with Signature Works BD. Choose a date and time that works for you.',
}

export default function BookPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-navy-950 pt-24 pb-20">
      <Container className="max-w-2xl">
        <div className="text-center mb-12">
          <SectionLabel>Free Consultation</SectionLabel>
          <h1 className="text-4xl sm:text-5xl font-bold text-navy-900 dark:text-white font-serif mt-4">
            Book a <span className="text-light-gradient">Consultation</span>
          </h1>
          <p className="mt-4 text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            30 minutes with our team — no obligation, no sales pitch. Just an honest conversation about your project.
          </p>
        </div>
        <BookingClient />
      </Container>
    </main>
  )
}
