import { useEffect, useRef } from 'react'

const BOID_COUNT = 80
const NEIGHBOR_RADIUS = 60
const SEPARATION_RADIUS = 22
const MAX_SPEED = 2.2
const MAX_FORCE = 0.05

class Boid {
  constructor(width, height) {
    this.x = Math.random() * width
    this.y = Math.random() * height
    const angle = Math.random() * Math.PI * 2
    this.vx = Math.cos(angle) * MAX_SPEED
    this.vy = Math.sin(angle) * MAX_SPEED
  }

  update(boids, width, height) {
    let sepX = 0, sepY = 0
    let aliX = 0, aliY = 0
    let cohX = 0, cohY = 0
    let count = 0

    for (const other of boids) {
      if (other === this) continue
      const dx = this.x - other.x
      const dy = this.y - other.y
      const dist = Math.hypot(dx, dy)
      if (dist > 0 && dist < NEIGHBOR_RADIUS) {
        if (dist < SEPARATION_RADIUS) {
          sepX += dx / dist
          sepY += dy / dist
        }
        aliX += other.vx
        aliY += other.vy
        cohX += other.x
        cohY += other.y
        count++
      }
    }

    if (count > 0) {
      aliX /= count
      aliY /= count
      cohX = cohX / count - this.x
      cohY = cohY / count - this.y

      this.vx += sepX * MAX_FORCE * 1.5 + aliX * MAX_FORCE * 0.05 + cohX * MAX_FORCE * 0.01
      this.vy += sepY * MAX_FORCE * 1.5 + aliY * MAX_FORCE * 0.05 + cohY * MAX_FORCE * 0.01
    }

    const speed = Math.hypot(this.vx, this.vy)
    if (speed > MAX_SPEED) {
      this.vx = (this.vx / speed) * MAX_SPEED
      this.vy = (this.vy / speed) * MAX_SPEED
    }

    this.x += this.vx
    this.y += this.vy

    if (this.x < -10) this.x = width + 10
    if (this.x > width + 10) this.x = -10
    if (this.y < -10) this.y = height + 10
    if (this.y > height + 10) this.y = -10
  }
}

export default function Flock() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let width, height, boids, frameId

    function resize() {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    boids = Array.from({ length: BOID_COUNT }, () => new Boid(width, height))

    function draw() {
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = 'rgba(150, 170, 200, 0.6)'
      for (const boid of boids) {
        boid.update(boids, width, height)
        const angle = Math.atan2(boid.vy, boid.vx)
        ctx.save()
        ctx.translate(boid.x, boid.y)
        ctx.rotate(angle)
        ctx.beginPath()
        ctx.moveTo(5, 0)
        ctx.lineTo(-4, 3)
        ctx.lineTo(-4, -3)
        ctx.closePath()
        ctx.fill()
        ctx.restore()
      }
      frameId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="flock-background" />
}
