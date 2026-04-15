'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { portfolioCategories, portfolioData } from '@/data'

export default function PortfolioGrid() {
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = activeCategory === 'All'
    ? portfolioData
    : portfolioData.filter(p => p.category === activeCategory)

  return (
    <div>
      {/* Category Filter */}
      <div className="flex flex-wrap gap-3 mb-10">
        {portfolioCategories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeCategory === cat
                ? 'bg-gradient-to-r from-gold-600 to-gold-400 text-navy-900 shadow-lg shadow-gold-500/20'
                : 'bg-navy-800 border border-white/10 text-slate-300 hover:text-white hover:border-gold-500/30'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((project) => (
          <Link
            key={project.id}
            href={`/portfolio/${project.slug}`}
            className="group relative rounded-2xl overflow-hidden bg-navy-900 aspect-[4/3] block w-full"
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/20 to-transparent" />

            {/* Before/After badge */}
            {project.beforeImage && (
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-gold-500/90 text-navy-900 text-[10px] font-bold">
                Before/After
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 p-5">
              <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase bg-gold-500/20 text-gold-400 border border-gold-500/30 mb-2">
                {project.category}
              </span>
              <h3 className="text-white font-bold text-base font-serif leading-snug">{project.title}</h3>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-slate-400 text-xs">{project.location}</p>
                <span className="text-slate-600">·</span>
                <p className="text-gold-400 text-xs font-medium">{project.budget}</p>
              </div>
            </div>

            {/* View overlay */}
            <div className="absolute inset-0 bg-navy-950/0 group-hover:bg-navy-950/20 transition-colors duration-300 flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4 py-2 rounded-full bg-gold-500 text-navy-900 text-xs font-bold">
                View Project
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
