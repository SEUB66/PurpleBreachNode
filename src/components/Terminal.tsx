import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'
import type { TerminalBlock } from '~/content/module'

/**
 * Animated terminal: types user input character-by-character, then reveals
 * machine output. Runs once when scrolled into view. Input = magenta,
 * output = neutral grey, prompt = cyan, blinking cursor.
 */
export function Terminal({ block }: { block: TerminalBlock }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const [step, setStep] = useState(0) // how many lines are fully shown
  const [typed, setTyped] = useState('') // partial text for the current typing line
  const host = block.host ?? 'kali@lab : ~'

  useEffect(() => {
    if (!inView) return
    let cancelled = false
    let timers: ReturnType<typeof setTimeout>[] = []

    const runLine = (i: number) => {
      if (cancelled || i >= block.lines.length) return
      const line = block.lines[i]
      if (!line) return
      if (line.kind === 'out') {
        setStep(i + 1)
        timers.push(setTimeout(() => runLine(i + 1), 260))
        return
      }
      // type the input char by char
      let c = 0
      const tick = () => {
        if (cancelled) return
        c++
        setTyped(line.text.slice(0, c))
        if (c < line.text.length) {
          timers.push(setTimeout(tick, 26 + Math.random() * 34))
        } else {
          setStep(i + 1)
          setTyped('')
          timers.push(setTimeout(() => runLine(i + 1), 360))
        }
      }
      timers.push(setTimeout(tick, 220))
    }

    timers.push(setTimeout(() => runLine(0), 300))
    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [inView, block.lines])

  const currentIsTyping =
    step < block.lines.length && block.lines[step]?.kind === 'in'

  return (
    <motion.div
      ref={ref}
      className="term my-6"
      initial={{ opacity: 0, y: 22, scale: 0.98 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
        <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
        <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
        <span className="ml-2 font-mono text-xs text-ink-faint">{host}</span>
      </div>
      <pre className="m-0 overflow-x-auto px-4 py-3.5 text-[0.86rem] leading-relaxed">
        <code>
          {block.lines.map((line, i) => {
            if (i > step) return null
            const isCurrent = i === step // the one being typed (input only)
            if (line.kind === 'in') {
              const shown = isCurrent ? typed : line.text
              return (
                <div key={i}>
                  <span className="glow-cyan">{line.prompt ?? '$'} </span>
                  <span className="font-bold text-magenta">{shown}</span>
                  {isCurrent && currentIsTyping && <span className="term-cursor" />}
                  {!isCurrent && line.comment && (
                    <span className="text-ink-faint italic">  # {line.comment}</span>
                  )}
                </div>
              )
            }
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-ink-faint"
              >
                {line.text}
              </motion.div>
            )
          })}
          {step >= block.lines.length && <span className="term-cursor" />}
        </code>
      </pre>
    </motion.div>
  )
}
