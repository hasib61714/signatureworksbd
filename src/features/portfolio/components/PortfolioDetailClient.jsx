'use client'
import Image from 'next/image'
import { useState } from 'react'
import Link from 'next/link'
import Container from '@/shared/components/ui/Container'
import BeforeAfterSlider from './BeforeAfterSlider'

function GalleryLightbox({ images, initialIndex, onClose }) {
  const [current, setCurrent] = useState(initialIndex)

  const prev = () => setCurrent(i => (i - 1 + images.length) % images.length)
  const next = () => setCurrent(i => (i + 1) % images.length)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95" onClick={onClose}>
      <div className="relative w-full max-w-5xl px-4" onClick={e => e.stopPropagation()}>
        <div className="relative h-[80vh] w-full">
          <Image
            src={images[current]}
            alt={`Gallery image ${current + 1}`}
            fill
            sizes="100vw"
            className="rounded-xl object-contain"
          />
        </div>
        <div className="absolute inset-y-0 left-4 flex items-center">
          <button onClick={prev} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors backdrop-blur-sm">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
        </div>
        <div className="absolute inset-y-0 right-4 flex items-center">
          <button onClick={next} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors backdrop-blur-sm">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
        <button onClick={onClose} className="absolute top-0 right-4 -translate-y-12 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <p className="text-center text-slate-400 text-sm mt-4">{current + 1} / {images.length}</p>
      </div>
    </div>
  )
}

function getEmbedUrl(url) {
  if (!url) return ''
  if (url.includes('youtube.com/watch?v=')) {
    return `https://www.youtube.com/embed/${url.split('v=')[1].split('&')[0]}`
  }
  if (url.includes('youtu.be/')) {
    return `https://www.youtube.com/embed/${url.split('youtu.be/')[1].split('?')[0]}`
  }
  return url
}

export default function PortfolioDetailClient({ project, prevProject, nextProject }) {
  const [lightbox, setLightbox] = useState(null)
  const gallery = Array.isArray(project.gallery) && project.gallery.length ? project.gallery : [project.image].filter(Boolean)
  const highlights = Array.isArray(project.highlights) ? project.highlights : []
  const team = Array.isArray(project.team)
    ? project.team
    : typeof project.team === 'string'
      ? project.team.split(',').map((item) => item.trim()).filter(Boolean)
      : []
  const beforeImage = project.beforeImage || project.before_image
  const afterImage = project.afterImage || project.after_image
  const videoUrl = project.videoUrl || project.video_url
  const fullDescription = project.fullDescription || project.full_description || project.description || ''
  const paragraphs = fullDescription.split('\n\n').filter(Boolean)

  return (
    <main className="min-h-screen bg-navy-950 pt-24 pb-20">
      <div className="relative h-[50vh] sm:h-[60vh] overflow-hidden">
        <Image
          src={gallery[0] || project.image}
          alt={project.title}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-navy-950/20" />
        <div className="absolute bottom-0 left-0 right-0">
          <Container className="pb-10">
            <Link href="/portfolio" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-4 transition-colors group">
              <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              All Projects
            </Link>
            <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase bg-gold-500/20 text-gold-400 border border-gold-500/30 mb-3">
              {project.category}
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold text-white font-serif">{project.title}</h1>
            <p className="text-slate-400 mt-2">{project.location} · {project.year}</p>
          </Container>
        </div>
      </div>

      <Container className="mt-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Description */}
            <div>
              <h2 className="text-white text-xl font-bold font-serif mb-4">Project Overview</h2>
              <div className="space-y-4">
                {paragraphs.map((para, i) => (
                  <p key={i} className="text-slate-300 leading-relaxed">{para}</p>
                ))}
              </div>
            </div>

            {/* Highlights */}
            <div>
              <h2 className="text-white text-xl font-bold font-serif mb-4">Key Highlights</h2>
              <ul className="grid sm:grid-cols-2 gap-3">
                {highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-gold-500/20 border border-gold-500/40 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-2.5 h-2.5 text-gold-400" fill="currentColor" viewBox="0 0 8 8">
                        <path d="M6.41 1L7.5 2.09l-4.5 4.5L.5 4.09 1.59 3l1.41 1.41z" />
                      </svg>
                    </span>
                    <span className="text-slate-300 text-sm">{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Before / After */}
            {beforeImage && afterImage && (
              <div>
                <h2 className="text-white text-xl font-bold font-serif mb-4">Before & After</h2>
                <BeforeAfterSlider beforeImage={beforeImage} afterImage={afterImage} />
              </div>
            )}

            {videoUrl && (
              <div>
                <h2 className="text-white text-xl font-bold font-serif mb-4">Project Video</h2>
                <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-950 aspect-video">
                  <iframe
                    src={getEmbedUrl(videoUrl)}
                    title={`${project.title} video`}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {gallery.length > 1 && (
              <div>
                <h2 className="text-white text-xl font-bold font-serif mb-4">Gallery</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {gallery.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setLightbox(i)}
                      className="group relative aspect-[4/3] rounded-xl overflow-hidden"
                    >
                      <Image src={img} alt={`${project.title} ${i + 1}`} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-navy-950/0 group-hover:bg-navy-950/30 transition-colors duration-300 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project details card */}
            <div className="bg-navy-900 border border-white/[0.08] rounded-2xl p-6 space-y-5">
              <h3 className="text-white font-bold font-serif">Project Details</h3>
              {[
                { label: 'Client', value: project.client },
                { label: 'Location', value: project.location },
                { label: 'Budget', value: project.budget },
                { label: 'Area', value: project.area },
                { label: 'Duration', value: project.duration },
                { label: 'Year', value: project.year },
              ].map(item => (
                <div key={item.label} className="flex justify-between items-start">
                  <span className="text-slate-500 text-xs font-semibold tracking-wider uppercase">{item.label}</span>
                  <span className="text-white text-sm font-medium text-right ml-4">{item.value}</span>
                </div>
              ))}
            </div>

            {team.length > 0 && (
              <div className="bg-navy-900 border border-white/[0.08] rounded-2xl p-6">
                <h3 className="text-white font-bold font-serif mb-4">Our Team</h3>
                <ul className="space-y-2">
                  {team.map((member, i) => (
                    <li key={i} className="flex items-center gap-2 text-slate-300 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-400 shrink-0" />
                      {member}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTA */}
            <div className="bg-gradient-to-br from-gold-600/20 to-gold-400/5 border border-gold-500/20 rounded-2xl p-6 text-center">
              <h3 className="text-white font-bold font-serif mb-2">Like what you see?</h3>
              <p className="text-slate-400 text-sm mb-4">Let&apos;s discuss your project. Free consultation.</p>
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl bg-gradient-to-r from-gold-600 to-gold-400 text-navy-900 font-semibold text-sm hover:shadow-lg hover:shadow-gold-500/20 transition-all duration-300 active:scale-95"
              >
                Start a Project
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Prev / Next navigation */}
        {(prevProject || nextProject) && (
          <div className="mt-16 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row gap-4 justify-between">
            {prevProject ? (
              <Link href={`/portfolio/${prevProject.slug}`} className="group flex items-center gap-4 flex-1 bg-navy-900 border border-white/[0.08] rounded-2xl p-5 hover:border-gold-500/30 transition-colors">
                <svg className="w-5 h-5 text-slate-400 group-hover:-translate-x-1 transition-transform shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                <div className="min-w-0">
                  <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Previous Project</p>
                  <p className="text-white text-sm font-semibold font-serif truncate">{prevProject.title}</p>
                </div>
              </Link>
            ) : <div className="flex-1" />}
            {nextProject ? (
              <Link href={`/portfolio/${nextProject.slug}`} className="group flex items-center gap-4 flex-1 bg-navy-900 border border-white/[0.08] rounded-2xl p-5 hover:border-gold-500/30 transition-colors text-right justify-end">
                <div className="min-w-0">
                  <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Next Project</p>
                  <p className="text-white text-sm font-semibold font-serif truncate">{nextProject.title}</p>
                </div>
                <svg className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            ) : <div className="flex-1" />}
          </div>
        )}
      </Container>

      {/* Lightbox */}
      {lightbox !== null && (
        <GalleryLightbox images={gallery} initialIndex={lightbox} onClose={() => setLightbox(null)} />
      )}
    </main>
  )
}
