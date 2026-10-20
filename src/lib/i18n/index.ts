/**
 * Bilingual core — Canadian French (fr-CA) + English (en).
 *
 * Lexicon rule (strict): native offensive-security terms stay in English in
 * BOTH locales — handshake, pass-the-hash, phishing, payload, reverse shell,
 * hash, scan, exploit, etc. We translate prose and the box labels only.
 */

export const LOCALES = ['fr', 'en'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'fr'

export function isLocale(value: string | undefined): value is Locale {
  return value === 'fr' || value === 'en'
}

export function otherLocale(l: Locale): Locale {
  return l === 'fr' ? 'en' : 'fr'
}

/** A string available in both locales. */
export type Bi = Record<Locale, string>
export const bi = (fr: string, en: string): Bi => ({ fr, en })

/** Pick the right side of a Bi value. */
export function t(value: Bi, locale: Locale): string {
  return value[locale]
}

/** Canonical box labels — kept in English per the field-manual spec. */
export const BOX_LABELS = {
  why: bi('POURQUOI', 'WHY'),
  trap: bi('PIÈGE', 'TRAP'),
  remediation: bi('REMÉDIATION', 'REMEDIATION'),
  read: bi('LIRE', 'READ'),
  exercise: bi('EXERCICE', 'EXERCISE'),
  objective: bi('OBJECTIF', 'OBJECTIVE'),
} as const

/** UI chrome strings (not manual content). */
export const UI = {
  tagline: bi(
    'Le manuel de terrain de la sécurité offensive.',
    'The offensive-security field manual.',
  ),
  subtitle: bi(
    'Comprendre, tester et défendre les systèmes avec Kali Linux.',
    'Understand, test and defend systems with Kali Linux.',
  ),
  readFirst: bi('À lire avant tout le reste', 'Read this before anything else'),
  startPath: bi('Commencer le parcours', 'Start the path'),
  modules: bi('Modules', 'Modules'),
  lexicon: bi('Lexique', 'Lexicon'),
  cheatsheet: bi('Fiche de commandes', 'Command cheat sheet'),
  openMap: bi('Ouvrir la Network Map', 'Open the Network Map'),
  popOutMap: bi('Détacher sur 2ᵉ écran', 'Pop out to 2nd screen'),
  mapHint: bi(
    'Carte réseau vivante — se met à jour au fil des modules.',
    'Live network map — updates as you move through the modules.',
  ),
  prev: bi('Précédent', 'Previous'),
  next: bi('Suivant', 'Next'),
  langName: bi('Français (CA)', 'English'),
  switchTo: bi('EN', 'FR'),
  legalTitle: bi('La règle d’or, sans exception', 'The golden rule, no exception'),
  author: bi('Sébastien Germain — SEUB', 'Sébastien Germain — SEUB'),
  authorRole: bi(
    'Architecte logiciel & systèmes · Rive-Sud de Montréal',
    'Software & systems architect · South Shore of Montréal',
  ),
  level: {
    novice: bi('NOVICE', 'NOVICE'),
    intermediate: bi('INTERMÉDIAIRE', 'INTERMEDIATE'),
    expert: bi('EXPERT', 'EXPERT'),
    veteran: bi('VÉTÉRAN', 'VETERAN'),
  },
} as const
