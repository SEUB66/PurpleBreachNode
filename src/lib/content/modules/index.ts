import type { ModuleDoc, ModuleMeta } from '~/lib/content/types'
import { bi } from '~/lib/i18n'
import { module01 } from './module01'

/**
 * Module registry. Authored modules carry full ModuleDoc content; the rest are
 * declared as "planned" meta so navigation, the roadmap and the map scaffolding
 * exist from day one. Translate module-by-module into `modules` as we go.
 */

export const modules: ModuleDoc[] = [module01]

/** Full 27-module roadmap from the source manual (meta only until authored). */
export const roadmap: ModuleMeta[] = [
  module01.meta,
  meta('02', 'network-essentials', 2, 'II · 01–03', 'Les essentiels du réseau', 'Network essentials', 'novice'),
  meta('03', 'build-your-lab', 3, 'II · 01–03', 'Monter son labo', 'Build your lab', 'novice'),
  meta('04', 'passive-recon', 4, 'III · 04–07', 'Reconnaissance passive', 'Passive reconnaissance', 'intermediate'),
  meta('05', 'active-scanning', 5, 'III · 04–07', 'Scan actif', 'Active scanning', 'intermediate'),
  meta('06', 'enumeration', 6, 'III · 04–07', 'Énumération', 'Enumeration', 'intermediate'),
  meta('07', 'vuln-analysis', 7, 'III · 04–07', 'Analyse de vulnérabilités', 'Vulnerability analysis', 'intermediate'),
  meta('08', 'exploitation', 8, 'IV · 08–10', 'Exploitation', 'Exploitation', 'expert'),
  meta('09', 'post-exploitation', 9, 'IV · 08–10', 'Post-exploitation', 'Post-exploitation', 'expert'),
  meta('10', 'password-attacks', 10, 'IV · 08–10', 'Attaques de mots de passe', 'Password attacks', 'expert'),
  meta('11', 'web-exploitation', 11, 'V · 11', 'Exploitation web', 'Web exploitation', 'expert'),
  meta('12', 'reporting', 12, 'VI · 12', 'Rapport & livraison', 'Reporting & delivery', 'intermediate'),
  meta('13', 'ad-foundations', 13, 'VII · 13–16', 'Active Directory — fondations', 'Active Directory — foundations', 'expert'),
  meta('14', 'ad-enumeration', 14, 'VII · 13–16', 'AD — énumération', 'AD — enumeration', 'expert'),
  meta('15', 'ad-lateral', 15, 'VII · 13–16', 'AD — mouvement latéral', 'AD — lateral movement', 'veteran'),
  meta('16', 'ad-domain-dominance', 16, 'VII · 13–16', 'AD — domination du domaine', 'AD — domain dominance', 'veteran'),
  meta('17', 'cloud', 17, 'VIII · 17–20', 'Cloud', 'Cloud', 'expert'),
  meta('18', 'wireless', 18, 'VIII · 17–20', 'Sans-fil', 'Wireless', 'expert'),
  meta('19', 'evasion', 19, 'VIII · 17–20', 'Furtivité & évasion', 'Stealth & evasion', 'veteran'),
  meta('20', 'mobile', 20, 'VIII · 17–20', 'Mobile', 'Mobile', 'expert'),
  meta('21', 'social-engineering', 21, 'IX · 21–24', 'Ingénierie sociale', 'Social engineering', 'expert'),
  meta('22', 'physical', 22, 'IX · 21–24', 'Intrusion physique', 'Physical intrusion', 'veteran'),
  meta('23', 'c2', 23, 'IX · 21–24', 'Command & Control', 'Command & Control', 'veteran'),
  meta('24', 'purple-team', 24, 'IX · 21–24', 'Purple Team', 'Purple Team', 'veteran'),
  meta('25', 'tradecraft', 25, 'X · 25–27', 'Tradecraft & OPSEC', 'Tradecraft & OPSEC', 'veteran'),
  meta('26', 'automation', 26, 'X · 25–27', 'Automatisation', 'Automation', 'expert'),
  meta('27', 'the-veteran-reflex', 27, 'X · 25–27', 'Le réflexe du vétéran', 'The veteran reflex', 'veteran'),
]

export function getModule(slugOrId: string): ModuleDoc | undefined {
  return modules.find((m) => m.meta.slug === slugOrId || m.meta.id === slugOrId)
}

export function isAuthored(id: string): boolean {
  return modules.some((m) => m.meta.id === id)
}

function meta(
  id: string,
  slug: string,
  order: number,
  part: string,
  frTitle: string,
  enTitle: string,
  level: ModuleMeta['level'],
): ModuleMeta {
  return {
    id,
    slug,
    order,
    part: bi(`Partie ${part}`, `Part ${part}`),
    title: bi(frTitle, enTitle),
    level,
    objective: bi('', ''),
  }
}
