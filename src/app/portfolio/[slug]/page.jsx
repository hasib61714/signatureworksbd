import { notFound } from 'next/navigation'
import { portfolioData } from '@/data'
import PortfolioDetailClient from '@/features/portfolio/components/PortfolioDetailClient'

export async function generateStaticParams() {
  return portfolioData.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }) {
  const project = portfolioData.find(p => p.slug === params.slug)
  if (!project) return {}
  return {
    title: project.title,
    description: project.description,
    openGraph: { images: [project.image] },
  }
}

export default function PortfolioDetailPage({ params }) {
  const project = portfolioData.find(p => p.slug === params.slug)
  if (!project) notFound()

  const currentIdx = portfolioData.findIndex(p => p.slug === params.slug)
  const prevProject = portfolioData[currentIdx - 1] || null
  const nextProject = portfolioData[currentIdx + 1] || null

  return <PortfolioDetailClient project={project} prevProject={prevProject} nextProject={nextProject} />
}
