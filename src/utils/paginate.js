// src/utils/paginate.js
// Opening body paragraphs are split across pages (max 3 per page).
// Timeline entries auto-paginate by character count.
// Memory cards: 1 per page, paired naturally as spreads by StPageFlip.

import { memories } from '../data/memories'
import { timeline } from '../data/timeline'

// No auto-chunking. You control pages with ---PAGEBREAK--- in timeline.js.
// Every ---PAGEBREAK--- = a new page. What's between markers stays together.
function chunkBody(body) {
  return body
    .split(/^[\t ]*---PAGEBREAK---[\t ]*$/m)
    .map(s => s.trim())
    .filter(Boolean)
}

// Split body paragraphs array into groups of max N paragraphs per page
function chunkParagraphs(paragraphs, perPage = 3) {
  const groups = []
  for (let i = 0; i < paragraphs.length; i += perPage) {
    groups.push(paragraphs.slice(i, i + perPage))
  }
  return groups
}

export function buildPageList() {
  const pages = []

  // ── Blank endpaper (this becomes the cover via BookJournal's isCover logic)
  pages.push({ type: 'blank' })

  // ── Title page
  pages.push({ type: 'title' })

  // ── Opening two lines — always one page
  pages.push({ type: 'opening' })

  // ── Opening body paragraphs — split across pages, max 3 per page
  const BODY_PARAGRAPHS = [
    "Maybe you're reading this on the same day I shared it with you. Or maybe years have already passed, I'm not alive, and the world looks completely different now. Either way, I hope you still have that smile. The one that somehow made everything feel a little lighter just by existing.",
    "By the way... Happy Birthday, Ma'am.",
    "I know you don't want to see me or talk to me. This isn't meant to change anything. I know that. I just realized somewhere along the way that some things deserve to be said, even when the right moment has already passed. And somehow, saying them out loud isn't something I can do anymore.",
    "I never needed anything from you. I never really did. I just always wanted to see you happy. I still do. That part never changed, no matter how much everything else did.",
    "I always wished you could truly see how much you meant to me. Because even in what I thought could've been my last moment, during that accident... you were there too.",
    "Maybe that says more than I ever could.",
    "I hope you'll have a great time here.",
  ]

  const bodyGroups = chunkParagraphs(BODY_PARAGRAPHS, 3)
  bodyGroups.forEach((group, i) => {
    pages.push({
      type: 'opening-body',
      paragraphs: group,
      isFirst: i === 0,
      isLast: i === bodyGroups.length - 1,
    })
  })

  // ── Timeline header
  pages.push({ type: 'timeline-header' })

  // ── Timeline entries — auto-paginated by character count
  for (const entry of timeline) {
    const chunks = chunkBody(entry.body)
    chunks.forEach((chunk, idx) => {
      pages.push({
        type: 'timeline-year',
        year: entry.year,
        chapter: entry.chapter,
        title: entry.title,
        bodyChunk: chunk,
        chunkIndex: idx,
        totalChunks: chunks.length,
        isFirst: idx === 0,
        isLast: idx === chunks.length - 1,
      })
    })
  }

  // ── Memories header
  pages.push({ type: 'memories-header' })

  // ── Memory cards — 2 per page, paired side by side ────────────────────────
  const tabColors = ['#D4956A', '#C4837A', '#8B6D4A', '#B8860B', '#C4681A']
  for (let i = 0; i < memories.length; i += 2) {
    const cardA = memories[i]
    const cardB = memories[i + 1] || null  // may be null if odd number
    pages.push({
      type: 'memory-pair',
      cardA,
      cardB,
      rotationA: [-2.8, 1.5, -1.8][i % 3],
      rotationB: [2.2, -1.2, 2.8][(i + 1) % 3],
      tabColorA: tabColors[i % tabColors.length],
      tabColorB: tabColors[(i + 1) % tabColors.length],
    })
  }

  // ── Pad so back cover lands on a right-hand page
  if (pages.length % 2 === 0) {
    pages.push({ type: 'blank-end' })
  }

  // ── Back cover
  pages.push({ type: 'back-cover' })

  return pages
}
