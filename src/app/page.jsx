import HeroSection from '@/features/home/components/HeroSection'
import StatsSection from '@/features/home/components/StatsSection'
import ServicesSection from '@/features/home/components/ServicesSection'
import PortfolioPreview from '@/features/home/components/PortfolioPreview'
import ProcessSection from '@/features/home/components/ProcessSection'
import AboutSection from '@/features/home/components/AboutSection'
import WhyUsSection from '@/features/home/components/WhyUsSection'
import TestimonialsSection from '@/features/home/components/TestimonialsSection'
import PricingSection from '@/features/home/components/PricingSection'
import BlogSection from '@/features/home/components/BlogSection'
import ContactSection from '@/features/home/components/ContactSection'

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <PortfolioPreview />
      <ProcessSection />
      <AboutSection />
      <WhyUsSection />
      <TestimonialsSection />
      <PricingSection />
      <BlogSection />
      <ContactSection />
    </main>
  )
}
