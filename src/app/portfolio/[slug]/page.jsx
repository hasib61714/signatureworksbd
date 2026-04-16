import { notFound } from 'next/navigation'
import PortfolioDetailClient from '@/features/portfolio/components/PortfolioDetailClient'
import { getPortfolioBySlug, getPortfolioProjects } from '@/lib/db/portfolio'

export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  const projects = await getPortfolioProjects()
  return projects.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({ params }) {
  const project = await getPortfolioBySlug(params.slug)
  if (!project) return {}

  return {
    title: project.title,
    description: project.description,
    openGraph: { images: [project.image] },
  }
}

export default async function PortfolioDetailPage({ params }) {
  const [project, projects] = await Promise.all([
    getPortfolioBySlug(params.slug),
    getPortfolioProjects(),
  ])

  if (!project) notFound()

  const currentIdx = projects.findIndex((item) => item.slug === params.slug)
  const prevProject = projects[currentIdx - 1] || null
  const nextProject = projects[currentIdx + 1] || null

  return <PortfolioDetailClient project={project} prevProject={prevProject} nextProject={nextProject} />
}
