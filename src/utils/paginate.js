// src/utils/paginate.js
// Builds the ordered array of page objects for the book.
// Timeline comes before memories (makes more narrative sense).
// Memory cards are displayed 2 per spread, with rotation/sticky styling.

import { memories } from '../data/memories'
import { timeline } from '../data/timeline'

const MAX_CHARS_PER_PAGE = 800

// Split a long body string into page-sized chunks
function chunkBody(body, maxChars = MAX_CHARS_PER_PAGE) {
  const sentences = body
    .split(/(?<=[.!?…])\s+/)
    .filter(s => s.trim().length > 0)

  const chunks = []
  let current = ''

  for (const sentence of sentences) {
    if ((current + ' ' + sentence).trim().length > maxChars && current.length > 0) {
      chunks.push(current.trim())
      current = sentence
    } else {
      current = current ? current + ' ' + sentence : sentence
    }
  }
  if (current.trim()) chunks.push(current.trim())

  return chunks.length > 0 ? chunks : [body.trim()]
}

export function buildPageList() {
  const pages = []

  // ── Blank endpaper ─────────────────────────────────────────────────────────
  pages.push({ type: 'blank' })

  // ── Title page ─────────────────────────────────────────────────────────────
  pages.push({ type: 'title' })

  // ── Opening text ───────────────────────────────────────────────────────────
  pages.push({ type: 'opening' })
  pages.push({ type: 'opening-body' })

  // ── Timeline header + entries ──────────────────────────────────────────────
  // Header gets its own page (left side of a spread)
  pages.push({ type: 'timeline-header' })

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
        hasImage: !!entry.image,
        image: entry.image || null,
      })
    })
  }

  // ── Memories header ────────────────────────────────────────────────────────
  pages.push({ type: 'memories-header' })

  // ── Memory cards: 2 per page (left card + right card) ─────────────────────
  // Each "page" in the book shows one card (left or right position)
  // StPageFlip pairs them automatically as spreads
  for (let i = 0; i < memories.length; i++) {
    pages.push({
      type: 'memory',
      card: memories[i],
      cardIndex: i,
      // Rotation: alternates sign, varies by card index for natural scatter
      rotation: ((i % 3 === 0) ? -2.5 : (i % 3 === 1) ? 1.8 : -1.2) + (i % 2 === 0 ? 0.5 : -0.5),
      // Sticky tab color from a warm palette
      tabColor: ['#D4956A', '#C4837A', '#8B6D4A', '#B8860B', '#C4681A'][i % 5],
    })
  }

  // ── Blank before back cover (keeps back cover on a right page) ─────────────
  if (pages.length % 2 === 0) {
    pages.push({ type: 'blank-end' })
  }

  // ── Back cover ─────────────────────────────────────────────────────────────
  pages.push({ type: 'back-cover' })

  return pages
}
