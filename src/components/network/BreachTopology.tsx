import { useMemo } from 'react'
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  type Edge,
  type Node,
  MarkerType,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useBreachStore } from '~/lib/store/breachStore'
import type { NodeKind, TopoEdge, TopoNode } from '~/lib/content/types'

/**
 * <BreachTopology/> — the LiveNetworkMap render surface.
 *
 * Pure projection of the Zustand breach store. Nodes are laid out by kind in
 * deterministic lanes so the graph grows coherently as modules are revealed.
 * Styling is neon-on-charcoal; compromised nodes glow magenta, the AD
 * shortest-path edges glow red.
 */

const LANE_X: Record<NodeKind, number> = {
  attacker: 0,
  host: 320,
  service: 560,
  webapp: 560,
  domain: 860,
  dc: 1120,
  user: 1120,
}

const KIND_COLOR: Record<NodeKind, string> = {
  attacker: '#00ffff',
  host: '#b794f6',
  service: '#7cc7ff',
  webapp: '#ffd700',
  domain: '#b794f6',
  dc: '#ff8a00',
  user: '#a99fc9',
}

function layout(nodes: TopoNode[]): Node[] {
  const laneCount: Partial<Record<NodeKind, number>> = {}
  return nodes.map((n) => {
    const idx = (laneCount[n.kind] = (laneCount[n.kind] ?? 0) + 1) - 1
    const color = n.owned ? '#ff007f' : KIND_COLOR[n.kind]
    return {
      id: n.id,
      position: { x: LANE_X[n.kind], y: idx * 110 + (n.kind === 'attacker' ? 220 : 40) },
      data: { label: n.label },
      draggable: true,
      style: {
        background: n.owned ? 'rgba(255,0,127,0.12)' : 'rgba(26,5,58,0.9)',
        color,
        border: `1px solid ${color}`,
        borderRadius: 8,
        padding: '8px 12px',
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: 12,
        boxShadow: n.owned
          ? '0 0 16px -2px rgba(255,0,127,0.6)'
          : `0 0 10px -4px ${color}`,
        minWidth: 120,
        textAlign: 'center' as const,
      },
    }
  })
}

const EDGE_COLOR: Record<NonNullable<TopoEdge['variant']>, string> = {
  recon: '#00ffff',
  shell: '#5efcff',
  adpath: '#ff3b5c',
  trust: '#b794f6',
}

function toEdges(edges: TopoEdge[], highlighted: string[]): Edge[] {
  return edges.map((e) => {
    const base = EDGE_COLOR[e.variant ?? 'recon']
    const hot = e.variant === 'adpath' || highlighted.includes(e.id)
    const color = hot ? '#ff3b5c' : base
    return {
      id: e.id,
      source: e.source,
      target: e.target,
      label: e.label,
      animated: e.variant === 'shell' || hot,
      labelStyle: { fill: color, fontFamily: "'Share Tech Mono', monospace", fontSize: 10 },
      labelBgStyle: { fill: '#0d0418' },
      style: { stroke: color, strokeWidth: hot ? 2.2 : 1.4 },
      markerEnd: { type: MarkerType.ArrowClosed, color },
    }
  })
}

export function BreachTopology({ className }: { className?: string }) {
  const nodes = useBreachStore((s) => s.nodes)
  const edges = useBreachStore((s) => s.edges)
  const highlighted = useBreachStore((s) => s.highlighted)

  const rfNodes = useMemo(() => layout(Object.values(nodes)), [nodes])
  const rfEdges = useMemo(() => toEdges(Object.values(edges), highlighted), [edges, highlighted])

  const empty = rfNodes.length === 0

  return (
    <div className={className} style={{ position: 'relative', height: '100%', width: '100%' }}>
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        proOptions={{ hideAttribution: true }}
        minZoom={0.3}
        maxZoom={1.75}
        colorMode="dark"
      >
        <Background variant={BackgroundVariant.Dots} gap={28} size={1} color="#2e1657" />
        <Controls showInteractive={false} />
      </ReactFlow>
      {empty && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            pointerEvents: 'none',
            color: '#6f6690',
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 13,
            textAlign: 'center',
            padding: 24,
          }}
        >
          <p>
            <span style={{ color: '#00ffff' }}>[ cold ]</span>
            <br />
            Open a module to light up the map.
          </p>
        </div>
      )}
    </div>
  )
}
