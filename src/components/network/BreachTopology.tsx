import { useCallback, useMemo, useState } from 'react'
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  MarkerType,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type NodeMouseHandler,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { nodeTypes, NODE_COLOR, type BreachNodeData, type NodeKind } from './nodes'

/* ---- Realistic starting lab topology ---------------------------------- */

type ND = { id: string; kind: NodeKind; host: string; ip: string; x: number; y: number; owned?: boolean }

const TOPO: ND[] = [
  { id: 'kali', kind: 'attacker', host: 'kali', ip: '10.10.14.7', x: 0, y: 170, owned: true },
  { id: 'fw', kind: 'firewall', host: 'pfSense', ip: '10.10.10.1', x: 255, y: 170 },
  { id: 'gw', kind: 'router', host: 'core-sw', ip: '10.10.10.254', x: 510, y: 170 },
  { id: 'web', kind: 'webserver', host: 'WEB01', ip: '10.10.10.20', x: 810, y: 20 },
  { id: 'ws', kind: 'workstation', host: 'WS01', ip: '10.10.10.25', x: 810, y: 185 },
  { id: 'dc', kind: 'dc', host: 'DC01', ip: '10.10.10.10', x: 810, y: 350 },
  { id: 'db', kind: 'db', host: 'SQL01', ip: '10.10.10.30', x: 1095, y: 185 },
]

type EdgeDef = {
  id: string
  source: string
  target: string
  sh: string
  th: string
  label: string
}

const LINKS: EdgeDef[] = [
  { id: 'e-kali-fw', source: 'kali', target: 'fw', sh: 'sr', th: 'tl', label: 'tun0 · VPN' },
  { id: 'e-fw-gw', source: 'fw', target: 'gw', sh: 'sr', th: 'tl', label: 'filter' },
  { id: 'e-gw-web', source: 'gw', target: 'web', sh: 'sr', th: 'tl', label: '443/tcp' },
  { id: 'e-gw-ws', source: 'gw', target: 'ws', sh: 'sr', th: 'tl', label: '445 SMB' },
  { id: 'e-gw-dc', source: 'gw', target: 'dc', sh: 'sr', th: 'tl', label: '389 LDAP' },
  { id: 'e-ws-dc', source: 'ws', target: 'dc', sh: 'sb', th: 'tt', label: 'GPO · trust' },
  { id: 'e-web-db', source: 'web', target: 'db', sh: 'sb', th: 'tt', label: '1433' },
  { id: 'e-dc-db', source: 'dc', target: 'db', sh: 'sr', th: 'tl', label: 'Kerberos' },
]

function makeNodes(owned: Set<string>): Node[] {
  return TOPO.map((n) => ({
    id: n.id,
    type: 'breach',
    position: { x: n.x, y: n.y },
    data: { kind: n.kind, host: n.host, ip: n.ip, owned: owned.has(n.id) } satisfies BreachNodeData,
  }))
}

function makeEdges(owned: Set<string>): Edge[] {
  return LINKS.map((l) => {
    // An edge is a live attack path once its source is compromised.
    const hot = owned.has(l.source)
    const color = hot ? '#ff2d95' : 'rgba(123,196,255,0.55)'
    return {
      id: l.id,
      source: l.source,
      target: l.target,
      sourceHandle: l.sh,
      targetHandle: l.th,
      label: l.label,
      animated: hot,
      style: {
        stroke: color,
        strokeWidth: hot ? 2.4 : 1.4,
        filter: hot ? 'drop-shadow(0 0 6px rgba(255,45,149,0.8))' : 'none',
      },
      labelStyle: { fill: hot ? '#ff8ac4' : '#8a81ab', fontFamily: 'JetBrains Mono, monospace', fontSize: 10 },
      labelBgStyle: { fill: '#0c0518', fillOpacity: 0.75 },
      labelBgPadding: [5, 3] as [number, number],
      labelBgBorderRadius: 4,
      markerEnd: { type: MarkerType.ArrowClosed, color, width: 16, height: 16 },
    }
  })
}

function Graph() {
  const [owned, setOwned] = useState<Set<string>>(() => new Set(['kali']))
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(makeNodes(owned))
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(makeEdges(owned))

  const recolor = useCallback(
    (nextOwned: Set<string>) => {
      setNodes((ns) =>
        ns.map((n) => ({ ...n, data: { ...(n.data as BreachNodeData), owned: nextOwned.has(n.id) } })),
      )
      setEdges(makeEdges(nextOwned))
    },
    [setNodes, setEdges],
  )

  const onNodeClick: NodeMouseHandler = useCallback(
    (_e, node) => {
      if (node.id === 'kali') return // the attacker is always you
      setOwned((prev) => {
        const next = new Set(prev)
        next.has(node.id) ? next.delete(node.id) : next.add(node.id)
        recolor(next)
        return next
      })
    },
    [recolor],
  )

  const minimapColor = useCallback((n: Node) => {
    const d = n.data as BreachNodeData
    return d.owned ? '#ff2d95' : NODE_COLOR[d.kind]
  }, [])

  const compromised = useMemo(() => [...owned].filter((id) => id !== 'kali').length, [owned])

  return (
    <div className="relative h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.22 }}
        minZoom={0.35}
        maxZoom={2.2}
        proOptions={{ hideAttribution: true }}
        colorMode="dark"
        panOnScroll
        selectionOnDrag
      >
        <Background variant={BackgroundVariant.Dots} gap={26} size={1.1} color="rgba(139,63,181,0.4)" />
        <Controls className="pbn-rf-controls" showInteractive={false} />
        <MiniMap
          pannable
          zoomable
          nodeColor={minimapColor}
          nodeStrokeWidth={2}
          maskColor="rgba(12,5,24,0.72)"
          style={{ background: 'rgba(12,5,24,0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10 }}
        />
      </ReactFlow>

      {/* HUD */}
      <div className="pointer-events-none absolute left-3 top-3 z-10 flex items-center gap-2 font-mono text-[0.68rem]">
        <span className="rounded-md border border-white/10 bg-black/40 px-2 py-1 text-cyan backdrop-blur">
          {compromised} / {TOPO.length - 1} compromised
        </span>
        <span className="rounded-md border border-white/10 bg-black/40 px-2 py-1 text-ink-faint backdrop-blur">
          click a node to toggle breach
        </span>
      </div>
    </div>
  )
}

export function BreachTopology() {
  return (
    <ReactFlowProvider>
      <Graph />
    </ReactFlowProvider>
  )
}
