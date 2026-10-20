import type { Bi } from '~/lib/i18n'

/** Difficulty badges from the original manual. */
export type Level = 'novice' | 'intermediate' | 'expert' | 'veteran'

/** A single line inside a terminal block. */
export type TermLine =
  | { kind: 'in'; prompt?: string; text: string; comment?: string } // user types (magenta)
  | { kind: 'out'; text: string } // machine output (grey)
  | { kind: 'comment'; text: string }

export interface TerminalBlock {
  type: 'terminal'
  host?: string // e.g. "kali@lab : ~/recon"
  lines: TermLine[]
}

export interface CalloutBlock {
  type: 'callout'
  variant: 'why' | 'trap' | 'remediation' | 'exercise'
  heading?: Bi // optional extra heading after the label
  body: Bi
}

/** The "READ / LIRE" box that interprets machine output. */
export interface ReadBlock {
  type: 'read'
  body: Bi
}

export interface ProseBlock {
  type: 'prose'
  body: Bi
}

export interface HeadingBlock {
  type: 'heading'
  text: Bi
}

export type Block =
  | ProseBlock
  | HeadingBlock
  | TerminalBlock
  | CalloutBlock
  | ReadBlock

/* ----------------------------------------------------------------------
   Live Network Map — topology mutations each module applies to the graph.
   The map is a function of "modules seen so far", replayed deterministically.
   ---------------------------------------------------------------------- */

export type NodeKind =
  | 'attacker' // you / Kali
  | 'host'
  | 'service'
  | 'webapp'
  | 'dc' // domain controller
  | 'user'
  | 'domain'

export interface TopoNode {
  id: string
  label: string
  kind: NodeKind
  /** false = discovered, true = compromised (turns magenta). */
  owned?: boolean
}

export interface TopoEdge {
  id: string
  source: string
  target: string
  label?: string
  /** 'recon' cyan, 'shell' bright cyan, 'adpath' red, 'trust' lavender. */
  variant?: 'recon' | 'shell' | 'adpath' | 'trust'
}

export type TopoMutation =
  | { op: 'addNode'; node: TopoNode }
  | { op: 'addEdge'; edge: TopoEdge }
  | { op: 'compromise'; nodeId: string }
  | { op: 'highlightPath'; edgeIds: string[] }

export interface ModuleMeta {
  id: string // "01"
  slug: string // "fondations-terminal"
  order: number
  part: Bi // "Partie II · Modules 01–03"
  title: Bi
  level: Level
  objective: Bi
}

export interface ModuleDoc {
  meta: ModuleMeta
  blocks: Block[]
  /** Applied to the topology when this module is opened. */
  topology?: TopoMutation[]
}
