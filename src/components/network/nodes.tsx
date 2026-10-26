import { Handle, Position, type NodeProps } from '@xyflow/react'
import { motion } from 'motion/react'

export type NodeKind = 'attacker' | 'firewall' | 'router' | 'webserver' | 'workstation' | 'dc' | 'db'

export interface BreachNodeData {
  kind: NodeKind
  host: string
  ip: string
  owned?: boolean
  [key: string]: unknown
}

const COLOR: Record<NodeKind, string> = {
  attacker: '#2dd4ff',
  firewall: '#ffca3a',
  router: '#b794f6',
  webserver: '#49c7ff',
  workstation: '#8b9bff',
  dc: '#ff7a3c',
  db: '#35e0a1',
}

const KIND_LABEL: Record<NodeKind, string> = {
  attacker: 'ATTACKER',
  firewall: 'FIREWALL',
  router: 'GATEWAY',
  webserver: 'WEB · DMZ',
  workstation: 'WORKSTATION',
  dc: 'DOMAIN CTRL',
  db: 'SQL',
}

function Icon({ kind, color }: { kind: NodeKind; color: string }) {
  const common = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  switch (kind) {
    case 'attacker':
      return (<svg {...common}><polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" /></svg>)
    case 'firewall':
      return (<svg {...common}><path d="M12 2l8 4v5c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V6z" /></svg>)
    case 'router':
      return (<svg {...common}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></svg>)
    case 'webserver':
      return (<svg {...common}><rect x="3" y="4" width="18" height="7" rx="1.5" /><rect x="3" y="13" width="18" height="7" rx="1.5" /><line x1="7" y1="7.5" x2="7" y2="7.5" /><line x1="7" y1="16.5" x2="7" y2="16.5" /></svg>)
    case 'workstation':
      return (<svg {...common}><rect x="3" y="4" width="18" height="12" rx="1.5" /><line x1="8" y1="20" x2="16" y2="20" /><line x1="12" y1="16" x2="12" y2="20" /></svg>)
    case 'dc':
      return (<svg {...common}><path d="M4 21V9l8-5 8 5v12" /><path d="M9 21v-6h6v6" /><line x1="2" y1="21" x2="22" y2="21" /></svg>)
    case 'db':
      return (<svg {...common}><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5" /><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" /></svg>)
  }
}

const handleStyle = {
  width: 7,
  height: 7,
  background: 'rgba(255,255,255,0.5)',
  border: 'none',
}

export function BreachNode({ data, selected }: NodeProps) {
  const d = data as BreachNodeData
  const base = COLOR[d.kind]
  const color = d.owned ? '#ff2d95' : base

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      style={{
        minWidth: 168,
        borderRadius: 14,
        padding: '10px 13px',
        background: d.owned
          ? 'linear-gradient(135deg, rgba(255,45,149,0.16), rgba(255,255,255,0.02))'
          : 'linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.015))',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        border: `1px solid ${color}`,
        boxShadow: selected
          ? `0 0 0 2px ${color}, 0 0 26px -2px ${color}`
          : d.owned
            ? `0 0 22px -4px ${color}, inset 0 1px 0 rgba(255,255,255,0.08)`
            : `0 10px 30px -14px rgba(0,0,0,0.7), 0 0 16px -8px ${color}, inset 0 1px 0 rgba(255,255,255,0.08)`,
        color: '#f5f1ff',
        fontFamily: "'Space Grotesk', sans-serif",
        cursor: 'pointer',
        transition: 'box-shadow .3s ease, border-color .3s ease',
      }}
    >
      {/* handles — 4 sides */}
      <Handle id="tl" type="target" position={Position.Left} style={handleStyle} />
      <Handle id="sr" type="source" position={Position.Right} style={handleStyle} />
      <Handle id="tt" type="target" position={Position.Top} style={handleStyle} />
      <Handle id="sb" type="source" position={Position.Bottom} style={handleStyle} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <Icon kind={d.kind} color={color} />
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, letterSpacing: '0.12em', color }}>
          {KIND_LABEL[d.kind]}
        </span>
        <span
          style={{
            marginLeft: 'auto',
            width: 7,
            height: 7,
            borderRadius: 999,
            background: color,
            boxShadow: `0 0 8px ${color}`,
          }}
        />
      </div>
      <div style={{ marginTop: 5, fontSize: 13, fontWeight: 600, lineHeight: 1.1 }}>{d.host}</div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#8a81ab', marginTop: 1 }}>
        {d.ip}
      </div>
      {d.owned && (
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: '#ff2d95', marginTop: 4, letterSpacing: '0.1em' }}>
          ● COMPROMISED
        </div>
      )}
    </motion.div>
  )
}

export const nodeTypes = { breach: BreachNode }
export { COLOR as NODE_COLOR }
