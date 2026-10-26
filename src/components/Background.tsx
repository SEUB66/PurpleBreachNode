import { motion } from 'motion/react'

/** Fixed, layered, living background: gradient field, pixel-sun halo,
 *  perspective grid floor, drifting glow blobs, fine grain. */
export function Background() {
  return (
    <>
      <div className="bg-field" />
      <div className="bg-sun" />
      <div className="bg-grid" />
      <div className="bg-grain" />

      {/* drifting glow blobs */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed -z-[2] h-[36vmin] w-[36vmin] rounded-full"
        style={{
          left: '6vw',
          top: '42vh',
          background: 'radial-gradient(circle, rgba(45,212,255,0.22), transparent 70%)',
          filter: 'blur(30px)',
        }}
        animate={{ y: [0, -28, 0], x: [0, 14, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed -z-[2] h-[30vmin] w-[30vmin] rounded-full"
        style={{
          right: '10vw',
          top: '55vh',
          background: 'radial-gradient(circle, rgba(255,45,149,0.2), transparent 70%)',
          filter: 'blur(32px)',
        }}
        animate={{ y: [0, 24, 0], x: [0, -18, 0] }}
        transition={{ duration: 19, repeat: Infinity, ease: 'easeInOut' }}
      />
    </>
  )
}
