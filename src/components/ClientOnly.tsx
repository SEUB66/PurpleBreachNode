import { useEffect, useState, type ReactNode } from 'react'

/** Render children only after hydration — React Flow measures the DOM. */
export function ClientOnly({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return <>{mounted ? children : fallback}</>
}
