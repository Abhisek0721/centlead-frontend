'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const COUNT = 4800
const POINTER_RADIUS = 140
const POINTER_STRENGTH = 2.2

// ── Shape 1: People Group ─────────────────────────────────────────────────────
// Cluster of human figures — the leads/contacts you're targeting
function drawPeopleGroup(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const cx = w / 2, cy = h * 0.48
  const s = Math.min(w, h) / 480

  function drawPerson(px: number, py: number, scale: number) {
    const r = 22 * s * scale
    // head
    ctx.beginPath(); ctx.arc(px, py - r * 1.55, r * 0.72, 0, Math.PI * 2); ctx.fill()
    // body: rounded trapezoid using arc
    const bw = r * 1.5, bh = r * 1.9, by = py - r * 0.55
    ctx.beginPath()
    ctx.moveTo(px - bw * 0.5, by + bh)
    ctx.quadraticCurveTo(px - bw * 0.72, by, px - bw * 0.1, by)
    ctx.lineTo(px + bw * 0.1, by)
    ctx.quadraticCurveTo(px + bw * 0.72, by, px + bw * 0.5, by + bh)
    ctx.closePath(); ctx.fill()
  }

  ctx.fillStyle = '#fff'

  // back row — 2 figures, slightly higher & smaller
  drawPerson(cx - 88 * s, cy - 18 * s, 0.82)
  drawPerson(cx + 88 * s, cy - 18 * s, 0.82)

  // middle row — 2 figures
  drawPerson(cx - 46 * s, cy + 4 * s, 0.92)
  drawPerson(cx + 46 * s, cy + 4 * s, 0.92)

  // center front — largest figure
  drawPerson(cx, cy + 14 * s, 1.0)
}

// ── Shape 2: Business Deal Handshake ─────────────────────────────────────────
// Business woman (left, long hair) shaking hands with a suited professional
function drawBusinessDeal(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const cx = w / 2, cy = h * 0.50
  const s  = Math.min(w, h) / 480

  ctx.fillStyle   = '#fff'
  ctx.strokeStyle = '#fff'
  ctx.lineCap     = 'round'
  ctx.lineJoin    = 'round'

  // Shared vertical layout
  const headR   = 26 * s
  const headY   = cy - 108 * s
  const neckBot = headY + headR * 0.85 + 13 * s
  const sTop    = neckBot
  const sBot    = cy + 36 * s
  const armY    = sTop + 20 * s
  const legBot  = cy + 110 * s

  // ── Left: Business Woman ────────────────────────────────────────────────────
  const lx  = cx - 88 * s
  const lSW = 54 * s, lWW = 44 * s

  // Long flowing hair (drawn before head so head overlaps)
  ctx.lineWidth = 20 * s
  ctx.beginPath()
  ctx.moveTo(lx - headR * 0.62, headY - headR * 0.3)
  ctx.quadraticCurveTo(lx - headR * 1.55, headY + headR * 2.0, lx - headR * 0.95, sTop + 22 * s)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(lx + headR * 0.62, headY - headR * 0.3)
  ctx.quadraticCurveTo(lx + headR * 1.15, headY + headR * 2.0, lx + headR * 0.55, sTop + 22 * s)
  ctx.stroke()
  ctx.lineWidth = 24 * s
  ctx.beginPath()
  ctx.arc(lx, headY - headR * 0.12, headR * 1.08, -Math.PI * 0.87, -Math.PI * 0.13, false)
  ctx.stroke()

  // Head
  ctx.beginPath(); ctx.arc(lx, headY, headR, 0, Math.PI * 2); ctx.fill()

  // Neck
  ctx.fillRect(lx - 8 * s, headY + headR * 0.72, 16 * s, 15 * s)

  // Suit jacket body
  ctx.beginPath()
  ctx.moveTo(lx - lSW / 2, sTop); ctx.lineTo(lx + lSW / 2, sTop)
  ctx.lineTo(lx + lWW / 2, sBot); ctx.lineTo(lx - lWW / 2, sBot)
  ctx.closePath(); ctx.fill()

  // Lapels
  ctx.lineWidth = 3.2 * s
  ctx.beginPath()
  ctx.moveTo(lx - 5 * s, sTop + 5 * s)
  ctx.lineTo(lx - lSW * 0.42, sTop + 2 * s)
  ctx.lineTo(lx - lSW * 0.33, sTop + 28 * s)
  ctx.lineTo(lx - 5 * s, sTop + 18 * s)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(lx + 5 * s, sTop + 5 * s)
  ctx.lineTo(lx + lSW * 0.42, sTop + 2 * s)
  ctx.lineTo(lx + lSW * 0.33, sTop + 28 * s)
  ctx.lineTo(lx + 5 * s, sTop + 18 * s)
  ctx.stroke()

  // Collar V
  ctx.lineWidth = 2 * s
  ctx.beginPath(); ctx.moveTo(lx - 9 * s, neckBot); ctx.lineTo(lx, sTop + 7 * s); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(lx + 9 * s, neckBot); ctx.lineTo(lx, sTop + 7 * s); ctx.stroke()

  // Left arm — down at side
  ctx.lineWidth = 15 * s
  ctx.beginPath()
  ctx.moveTo(lx - lSW / 2, armY)
  ctx.lineTo(lx - lSW / 2 - 5 * s, armY + 52 * s)
  ctx.stroke()

  // Right arm — extended to center for handshake
  ctx.lineWidth = 15 * s
  ctx.beginPath()
  ctx.moveTo(lx + lSW / 2, armY)
  ctx.quadraticCurveTo(lx + lSW / 2 + 32 * s, armY + 6 * s, cx - 18 * s, armY + 14 * s)
  ctx.stroke()

  // Skirt — slightly flared below torso
  ctx.lineWidth = 24 * s
  ctx.beginPath(); ctx.moveTo(lx - lWW / 2 + 4 * s, sBot); ctx.lineTo(lx - 22 * s, sBot + 42 * s); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(lx + lWW / 2 - 4 * s, sBot); ctx.lineTo(lx + 22 * s, sBot + 42 * s); ctx.stroke()
  ctx.lineWidth = 14 * s
  ctx.beginPath(); ctx.moveTo(lx - 22 * s, sBot + 42 * s); ctx.lineTo(lx - 16 * s, legBot); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(lx + 22 * s, sBot + 42 * s); ctx.lineTo(lx + 16 * s, legBot); ctx.stroke()

  // ── Right: Suited Professional ──────────────────────────────────────────────
  const rx  = cx + 88 * s
  const rSW = 54 * s, rWW = 44 * s

  // Head
  ctx.beginPath(); ctx.arc(rx, headY, headR, 0, Math.PI * 2); ctx.fill()

  // Short hair stub
  ctx.lineWidth = 11 * s
  ctx.beginPath()
  ctx.arc(rx, headY - headR * 0.18, headR * 1.0, -Math.PI * 0.88, -Math.PI * 0.12, false)
  ctx.stroke()

  // Neck
  ctx.fillRect(rx - 8 * s, headY + headR * 0.72, 16 * s, 15 * s)

  // Suit jacket body
  ctx.beginPath()
  ctx.moveTo(rx - rSW / 2, sTop); ctx.lineTo(rx + rSW / 2, sTop)
  ctx.lineTo(rx + rWW / 2, sBot); ctx.lineTo(rx - rWW / 2, sBot)
  ctx.closePath(); ctx.fill()

  // Lapels
  ctx.lineWidth = 3.2 * s
  ctx.beginPath()
  ctx.moveTo(rx - 5 * s, sTop + 5 * s)
  ctx.lineTo(rx - rSW * 0.42, sTop + 2 * s)
  ctx.lineTo(rx - rSW * 0.33, sTop + 28 * s)
  ctx.lineTo(rx - 5 * s, sTop + 18 * s)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(rx + 5 * s, sTop + 5 * s)
  ctx.lineTo(rx + rSW * 0.42, sTop + 2 * s)
  ctx.lineTo(rx + rSW * 0.33, sTop + 28 * s)
  ctx.lineTo(rx + 5 * s, sTop + 18 * s)
  ctx.stroke()

  // Collar V
  ctx.lineWidth = 2 * s
  ctx.beginPath(); ctx.moveTo(rx - 9 * s, neckBot); ctx.lineTo(rx, sTop + 7 * s); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(rx + 9 * s, neckBot); ctx.lineTo(rx, sTop + 7 * s); ctx.stroke()

  // Tie
  const tW = 11 * s, tTop = sTop + 6 * s, tBot = sBot - 6 * s
  ctx.beginPath()
  ctx.moveTo(rx - tW * 0.42, tTop);          ctx.lineTo(rx + tW * 0.42, tTop)
  ctx.lineTo(rx + tW * 0.50, tTop + tW * 0.8)
  ctx.lineTo(rx + tW * 0.44, tBot - 12 * s); ctx.lineTo(rx, tBot)
  ctx.lineTo(rx - tW * 0.44, tBot - 12 * s)
  ctx.lineTo(rx - tW * 0.50, tTop + tW * 0.8)
  ctx.closePath(); ctx.fill()

  // Right arm — down at side
  ctx.lineWidth = 15 * s
  ctx.beginPath()
  ctx.moveTo(rx + rSW / 2, armY)
  ctx.lineTo(rx + rSW / 2 + 5 * s, armY + 52 * s)
  ctx.stroke()

  // Left arm — extended to center for handshake
  ctx.lineWidth = 15 * s
  ctx.beginPath()
  ctx.moveTo(rx - rSW / 2, armY)
  ctx.quadraticCurveTo(rx - rSW / 2 - 32 * s, armY + 6 * s, cx + 18 * s, armY + 14 * s)
  ctx.stroke()

  // Legs — straight trousers
  ctx.lineWidth = 20 * s
  ctx.beginPath(); ctx.moveTo(rx - rWW / 2 + 6 * s, sBot); ctx.lineTo(rx - 14 * s, legBot); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(rx + rWW / 2 - 6 * s, sBot); ctx.lineTo(rx + 14 * s, legBot); ctx.stroke()

  // ── Handshake ───────────────────────────────────────────────────────────────
  // Main palm/clasp mass
  ctx.beginPath()
  ctx.ellipse(cx, armY + 14 * s, 22 * s, 13 * s, -0.18, 0, Math.PI * 2)
  ctx.fill()
  // Top fingers (woman's hand gripping)
  for (let i = 0; i < 4; i++) {
    ctx.beginPath()
    ctx.arc(cx - 16 * s + i * 11 * s, armY + 3 * s, 5.5 * s, 0, Math.PI * 2)
    ctx.fill()
  }
  // Bottom fingers (man's hand gripping)
  for (let i = 0; i < 4; i++) {
    ctx.beginPath()
    ctx.arc(cx - 14 * s + i * 11 * s, armY + 24 * s, 5.5 * s, 0, Math.PI * 2)
    ctx.fill()
  }
  // Thumb arcs
  ctx.beginPath(); ctx.arc(cx - 22 * s, armY + 12 * s, 5 * s, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.arc(cx + 22 * s, armY + 16 * s, 5 * s, 0, Math.PI * 2); ctx.fill()
}

// ── Shape 3: Lead Magnet ──────────────────────────────────────────────────────
// Horseshoe magnet attracting leads — the core product metaphor
function drawMagnet(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const cx = w / 2, cy = h * 0.50
  const s = Math.min(w, h) / 480

  ctx.strokeStyle = '#fff'
  ctx.fillStyle = '#fff'

  const R = 90 * s      // outer radius of horseshoe arc
  const thick = 28 * s  // tube thickness
  const armLen = 100 * s

  // Horseshoe arc (U shape opening downward, so arms point down)
  // Draw as two concentric arcs from 0 to π (opening faces down)
  ctx.lineWidth = thick
  ctx.lineCap = 'butt'
  ctx.beginPath()
  ctx.arc(cx, cy - armLen * 0.5, R, Math.PI, 0, false)
  ctx.stroke()

  // Left arm (going down from left end of arc)
  const lx = cx - R, armTop = cy - armLen * 0.5
  ctx.lineWidth = thick
  ctx.beginPath(); ctx.moveTo(lx, armTop); ctx.lineTo(lx, armTop + armLen); ctx.stroke()

  // Right arm
  const rx = cx + R
  ctx.beginPath(); ctx.moveTo(rx, armTop); ctx.lineTo(rx, armTop + armLen); ctx.stroke()

  // Pole caps (bright end tips — north poles)
  ctx.lineWidth = 0
  const capH = 18 * s
  // left cap
  ctx.fillRect(lx - thick / 2, armTop + armLen - capH, thick, capH)
  // right cap
  ctx.fillRect(rx - thick / 2, armTop + armLen - capH, thick, capH)

  // Attraction lines — dashed lines from poles toward floating person silhouettes
  ctx.lineWidth = 2 * s
  ctx.setLineDash([6 * s, 5 * s])

  const poleY = armTop + armLen
  const targets2 = [
    { px: lx - 70 * s, py: poleY + 50 * s },
    { px: lx - 110 * s, py: poleY - 20 * s },
    { px: rx + 70 * s, py: poleY + 50 * s },
    { px: rx + 110 * s, py: poleY - 20 * s },
    { px: cx, py: poleY + 100 * s },
  ]

  for (const t of targets2) {
    const nearX = t.px < cx ? lx : rx
    ctx.beginPath(); ctx.moveTo(nearX, poleY); ctx.lineTo(t.px, t.py); ctx.stroke()
  }
  ctx.setLineDash([])

  // Small person silhouettes at ends of lines
  const pr = 11 * s
  for (const t of targets2) {
    ctx.beginPath(); ctx.arc(t.px, t.py - pr * 1.5, pr * 0.68, 0, Math.PI * 2); ctx.fill()
    const bw = pr * 1.3, bh = pr * 1.7, by = t.py - pr * 0.6
    ctx.beginPath()
    ctx.moveTo(t.px - bw * 0.5, by + bh)
    ctx.quadraticCurveTo(t.px - bw * 0.7, by, t.px, by)
    ctx.quadraticCurveTo(t.px + bw * 0.7, by, t.px + bw * 0.5, by + bh)
    ctx.closePath(); ctx.fill()
  }
}

// ── Shape 4: AI Hexagon Network ───────────────────────────────────────────────
// Central AI brain surrounded by orbiting capability hexagons — the platform
function drawAIHexagon(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const cx = w / 2, cy = h * 0.48
  const s = Math.min(w, h) / 480

  function hexPath(hx: number, hy: number, r: number) {
    ctx.beginPath()
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i - Math.PI / 6
      const px = hx + r * Math.cos(a)
      const py = hy + r * Math.sin(a)
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
    }
    ctx.closePath()
  }

  ctx.strokeStyle = '#fff'
  ctx.fillStyle = '#fff'

  // Central hexagon — thick outline + inner ring
  const CR = 72 * s
  ctx.lineWidth = 5 * s
  hexPath(cx, cy, CR); ctx.stroke()

  // Inner double ring
  ctx.lineWidth = 2 * s
  hexPath(cx, cy, CR * 0.72); ctx.stroke()

  // "AI" text as two thick bars rendered as rectangles (readable by particles)
  const tw = 18 * s, th = 36 * s, tgap = 10 * s, ts = 8 * s
  // "A" — two diagonal bars + crossbar
  const ax = cx - tgap / 2 - tw
  ctx.fillRect(ax - tw * 0.5, cy - th * 0.5, ts, th)       // left stroke of A
  ctx.fillRect(ax + tw * 0.5 - ts, cy - th * 0.5, ts, th)  // right stroke of A
  ctx.fillRect(ax - tw * 0.5, cy - ts * 0.5, tw, ts)        // crossbar
  ctx.fillRect(ax - tw * 0.5, cy - th * 0.5, tw, ts)        // top cap
  // "I" — single vertical bar
  const ix = cx + tgap / 2 + tw * 0.5
  ctx.fillRect(ix - ts * 0.5, cy - th * 0.5, ts, th)

  // Orbit: 6 smaller hexagons around the center
  const orbit = 160 * s
  const smallR = 36 * s
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i
    const hx = cx + orbit * Math.cos(a)
    const hy = cy + orbit * Math.sin(a)

    // Connector line from center hex edge to small hex
    ctx.lineWidth = 2 * s
    const edgeX = cx + CR * Math.cos(a), edgeY = cy + CR * Math.sin(a)
    const nearX = hx - smallR * Math.cos(a), nearY = hy - smallR * Math.sin(a)
    ctx.beginPath(); ctx.moveTo(edgeX, edgeY); ctx.lineTo(nearX, nearY); ctx.stroke()

    // Small hex
    ctx.lineWidth = 3 * s
    hexPath(hx, hy, smallR); ctx.stroke()

    // Dot at connector midpoint (circuit node)
    const mpx = (edgeX + nearX) / 2, mpy = (edgeY + nearY) / 2
    ctx.beginPath(); ctx.arc(mpx, mpy, 4 * s, 0, Math.PI * 2); ctx.fill()
  }

  // Corner dots on center hex vertices
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i - Math.PI / 6
    ctx.beginPath(); ctx.arc(cx + CR * Math.cos(a), cy + CR * Math.sin(a), 5 * s, 0, Math.PI * 2); ctx.fill()
  }
}

// ── Canvas sampling ───────────────────────────────────────────────────────────

function sampleFromCanvas(
  w: number, h: number, count: number,
  drawFn: (ctx: CanvasRenderingContext2D, w: number, h: number) => void,
): Float32Array {
  const canvas = document.createElement('canvas')
  canvas.width = w; canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) return new Float32Array(count * 2)
  drawFn(ctx, w, h)
  const img = ctx.getImageData(0, 0, w, h)
  const filled: number[] = []
  for (let y = 0; y < h; y += 2) {
    for (let x = 0; x < w; x += 2) {
      if (img.data[(y * w + x) * 4 + 3] > 80) filled.push(x, y)
    }
  }
  const out = new Float32Array(count * 2)
  const total = filled.length / 2
  if (total === 0) {
    for (let i = 0; i < count; i++) { out[i * 2] = Math.random() * w; out[i * 2 + 1] = Math.random() * h }
    return out
  }
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(Math.random() * total)
    out[i * 2]     = filled[idx * 2]     + (Math.random() - 0.5) * 1.8
    out[i * 2 + 1] = filled[idx * 2 + 1] + (Math.random() - 0.5) * 1.8
  }
  return out
}

function toScene(sampled: Float32Array, w: number, h: number): Float32Array {
  const out = new Float32Array(sampled.length)
  for (let i = 0; i < sampled.length / 2; i++) {
    out[i * 2]     = sampled[i * 2]     - w / 2
    out[i * 2 + 1] = h / 2 - sampled[i * 2 + 1]
  }
  return out
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function LoginInteractiveParticles() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = containerRef.current!
    if (!host) return

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.domElement.style.display = 'block'
    host.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
    camera.position.z = 2

    const positions    = new Float32Array(COUNT * 3)
    const colors       = new Float32Array(COUNT * 3)
    const velocities   = new Float32Array(COUNT * 2)
    const noiseSeeds   = new Float32Array(COUNT)
    const ambientSeeds = new Float32Array(COUNT)
    const ambientAmps  = new Float32Array(COUNT)
    const cloudTargets = new Float32Array(COUNT * 2)

    const rect0  = host.getBoundingClientRect()
    const cloudR = rect0.width > 0 ? Math.max(80, Math.min(rect0.width, rect0.height) * 0.28) : 150

    for (let i = 0; i < COUNT; i++) {
      const i2 = i * 2, i3 = i * 3
      const angle = Math.random() * Math.PI * 2
      const r     = Math.sqrt(Math.random()) * cloudR
      cloudTargets[i2]     = Math.cos(angle) * r
      cloudTargets[i2 + 1] = Math.sin(angle) * r
      positions[i3]     = cloudTargets[i2]
      positions[i3 + 1] = cloudTargets[i2 + 1]
      positions[i3 + 2] = (Math.random() - 0.5) * 10

      // Indigo → violet → bright white-blue
      const t = Math.random()
      if (t < 0.07) {
        colors[i3] = 0.86; colors[i3 + 1] = 0.84; colors[i3 + 2] = 1.0
      } else {
        colors[i3]     = 0.30 + t * 0.22
        colors[i3 + 1] = 0.27 + t * 0.09
        colors[i3 + 2] = 0.88 + t * 0.12
      }

      noiseSeeds[i]   = Math.random() * Math.PI * 2
      ambientSeeds[i] = Math.random() * Math.PI * 2
      ambientAmps[i]  = 0.7 + Math.random() * 1.8
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color',    new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: 1.9, sizeAttenuation: false,
      transparent: true, opacity: 0.88,
      vertexColors: true,
      blending: THREE.AdditiveBlending, depthWrite: false,
    })

    scene.add(new THREE.Points(geometry, material))

    let width = 1, height = 1
    let rafId = 0, disposed = false
    let phaseElapsed = 0, lastTime = performance.now()
    const shapes = [drawPeopleGroup, drawBusinessDeal, drawMagnet, drawAIHexagon]
    let targets: Float32Array[] = []
    let cur = 0, nxt = 1, holding = true
    const HOLD = 3.8, TRANS = 2.4
    const pointer = { x: 9999, y: 9999, active: false }

    function buildTargets(w: number, h: number) {
      targets = shapes.map(fn => toScene(sampleFromCanvas(w, h, COUNT, fn), w, h))
      cur = 0; nxt = 1; holding = true; phaseElapsed = 0
    }

    function resize() {
      const r = host.getBoundingClientRect()
      width  = Math.max(1, Math.floor(r.width))
      height = Math.max(1, Math.floor(r.height))
      renderer.setSize(width, height, true)
      camera.left = -width / 2;  camera.right = width / 2
      camera.top  =  height / 2; camera.bottom = -height / 2
      camera.updateProjectionMatrix()
      buildTargets(width, height)
    }

    function onMove(e: PointerEvent) {
      const r = host.getBoundingClientRect()
      pointer.x = e.clientX - r.left - width / 2
      pointer.y = -(e.clientY - r.top  - height / 2)
      pointer.active = true
    }

    function animate(now: number) {
      if (disposed) return
      const dt = Math.min((now - lastTime) / 1000, 0.033)
      lastTime = now
      phaseElapsed += dt

      const dur = holding ? HOLD : TRANS
      if (phaseElapsed >= dur) {
        if (targets.length > 0) {
          if (holding) { holding = false; nxt = (cur + 1) % targets.length }
          else         { cur = nxt; nxt = (cur + 1) % targets.length; holding = true }
        }
        phaseElapsed = 0
      }

      const src   = targets.length > 0 ? targets[cur]  : cloudTargets
      const dst   = targets.length > 0 ? (targets[nxt] ?? src) : cloudTargets
      const morph = holding ? 0 : Math.min(1, phaseElapsed / TRANS)

      for (let i = 0; i < COUNT; i++) {
        const i2 = i * 2, i3 = i * 3
        const bx = src[i2]     * (1 - morph) + dst[i2]     * morph
        const by = src[i2 + 1] * (1 - morph) + dst[i2 + 1] * morph

        const ap = now * 0.00042 + ambientSeeds[i]
        const tx = bx + Math.sin(ap) * ambientAmps[i]
        const ty = by + Math.cos(ap * 0.91 + ambientSeeds[i] * 0.4) * ambientAmps[i] * 0.75

        const x = positions[i3], y = positions[i3 + 1]
        let px = 0, py = 0

        if (pointer.active) {
          const dx = x - pointer.x, dy = y - pointer.y
          const d2 = dx * dx + dy * dy
          if (d2 < POINTER_RADIUS * POINTER_RADIUS) {
            const d = Math.sqrt(d2) + 1e-4
            const f = (1 - d / POINTER_RADIUS) ** 2 * POINTER_STRENGTH
            px = (dx / d) * f; py = (dy / d) * f
          }
        }

        velocities[i2]     = velocities[i2]     * 0.87 + (tx - x) * 0.046 + px + Math.sin(now * 0.0007  + noiseSeeds[i]) * 0.025
        velocities[i2 + 1] = velocities[i2 + 1] * 0.87 + (ty - y) * 0.046 + py + Math.cos(now * 0.00065 + noiseSeeds[i] * 1.1) * 0.025
        positions[i3]     += velocities[i2]
        positions[i3 + 1] += velocities[i2 + 1]
      }

      ;(geometry.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true
      renderer.render(scene, camera)
      rafId = requestAnimationFrame(animate)
    }

    resize()
    window.addEventListener('resize', resize)
    host.addEventListener('pointermove', onMove)
    host.addEventListener('pointerleave', () => { pointer.active = false })
    rafId = requestAnimationFrame(animate)

    return () => {
      disposed = true
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      geometry.dispose(); material.dispose(); renderer.dispose()
      if (renderer.domElement.parentElement === host) host.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div ref={containerRef} className="absolute inset-0">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_46%,rgba(79,70,229,0.16)_0%,transparent_62%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#07060f]/55" />
    </div>
  )
}
