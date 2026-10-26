export type Locale = 'fr' | 'en'
export type Bi = Record<Locale, string>
export const bi = (fr: string, en: string): Bi => ({ fr, en })
export type Level = 'novice' | 'intermediate' | 'expert' | 'veteran'

export type TermLine =
  | { kind: 'in'; prompt?: string; text: string; comment?: string }
  | { kind: 'out'; text: string }

export interface TerminalBlock {
  type: 'terminal'
  host?: string
  lines: TermLine[]
}
export interface CalloutBlock {
  type: 'callout'
  variant: 'why' | 'trap' | 'remediation' | 'exercise'
  heading?: Bi
  body: Bi
}
export interface ReadBlock { type: 'read'; body: Bi }
export interface ProseBlock { type: 'prose'; body: Bi }
export interface HeadingBlock { type: 'heading'; text: Bi }

export type Block = ProseBlock | HeadingBlock | TerminalBlock | CalloutBlock | ReadBlock

export interface ModuleDoc {
  id: string
  part: Bi
  title: Bi
  level: Level
  objective: Bi
  blocks: Block[]
}

export const BOX = {
  why: bi('POURQUOI', 'WHY'),
  trap: bi('PIÈGE', 'TRAP'),
  remediation: bi('REMÉDIATION', 'REMEDIATION'),
  read: bi('LIRE', 'READ'),
  exercise: bi('EXERCICE', 'EXERCISE'),
  objective: bi('OBJECTIF', 'OBJECTIVE'),
} as const

export const module01: ModuleDoc = {
  id: '01',
  part: bi('Partie II · Modules 01–03', 'Part II · Modules 01–03'),
  title: bi('Survie sous Linux', 'Linux survival'),
  level: 'novice',
  objective: bi(
    'Naviguer dans le système de fichiers, lire et écrire des fichiers, gérer les permissions — sans rien casser.',
    'Move around the filesystem, read and write files, handle permissions — without breaking anything.',
  ),
  blocks: [
    {
      type: 'callout',
      variant: 'why',
      body: bi(
        "Si tu hésites dans le shell, chaque phase suivante fait mal. Le terminal doit devenir un réflexe, pas une épreuve. 80 % des blocages du débutant ne sont pas de la sécurité : c'est Linux et le réseau.",
        'If you hesitate in the shell, every later phase hurts. The terminal has to become a reflex, not a trial. 80% of a beginner’s roadblocks aren’t security — they’re Linux and networking.',
      ),
    },
    { type: 'heading', text: bi('Savoir où l’on est', 'Know where you are') },
    {
      type: 'terminal',
      host: 'kali@lab : ~/lab',
      lines: [
        { kind: 'in', text: 'pwd' },
        { kind: 'out', text: '/home/kali/lab' },
        { kind: 'in', text: 'ls -la' },
        { kind: 'out', text: 'drwxr-xr-x  2 kali kali 4096 Oct 19 10:02 targets' },
        { kind: 'out', text: '-rw-r--r--  1 kali kali  220 Oct 19 10:01 notes.txt' },
      ],
    },
    {
      type: 'read',
      body: bi(
        'pwd affiche le dossier courant. ls -la liste tout, fichiers cachés compris. Premier caractère : d = dossier, - = fichier, l = lien symbolique. Les 9 suivants sont les rwx pour propriétaire / groupe / autres.',
        'pwd prints the current directory. ls -la lists everything, hidden files included. First character: d = directory, - = file, l = symlink. The next 9 are the rwx bits for owner / group / others.',
      ),
    },
    { type: 'heading', text: bi('Créer, chercher, lire', 'Create, search, read') },
    {
      type: 'terminal',
      host: 'kali@lab : ~',
      lines: [
        { kind: 'in', text: 'cd ~/lab && mkdir -p targets loot notes', comment: 'no output = success' },
        { kind: 'in', text: 'grep -rin "password" .' },
        { kind: 'out', text: './notes.txt:3:password: hunter2' },
      ],
    },
    {
      type: 'callout',
      variant: 'why',
      heading: bi('grep est une arme', 'grep is a weapon'),
      body: bi(
        'Chercher « password » dans des fichiers de config, c’est la méthode numéro un pour trouver des identifiants en clair — sur ta machine comme sur une cible compromise.',
        'Grepping for "password" across config files is the number-one way to find cleartext credentials — on your box and on a compromised target alike.',
      ),
    },
    { type: 'heading', text: bi('Les permissions, vraiment comprises', 'Permissions, actually understood') },
    {
      type: 'terminal',
      host: 'kali@lab : ~/lab',
      lines: [
        { kind: 'in', text: 'chmod 755 script.sh', comment: 'rwx r-x r-x' },
        { kind: 'in', text: 'ls -l script.sh' },
        { kind: 'out', text: '-rwxr-xr-x 1 kali kali 42 Oct 19 10:10 script.sh' },
      ],
    },
    {
      type: 'read',
      body: bi(
        'Base 8 : chaque chiffre = r=4, w=2, x=1 additionnés. 755 = propriétaire rwx (7), groupe/autres r-x (5). 600 = seul le propriétaire lit/écrit (clé privée).',
        'Base 8: each digit = r=4, w=2, x=1 summed. 755 = owner rwx (7), group/others r-x (5). 600 = owner-only read/write (private key).',
      ),
    },
    {
      type: 'callout',
      variant: 'trap',
      body: bi(
        'rm -rf depuis le mauvais dossier efface tout, sans corbeille (vérifie pwd d’abord). > écrase, >> ajoute. Ctrl+C interrompt une commande qui tourne.',
        'rm -rf from the wrong directory wipes everything, no recycle bin (check pwd first). > overwrites, >> appends. Ctrl+C interrupts a running command.',
      ),
    },
    {
      type: 'callout',
      variant: 'remediation',
      heading: bi('côté défenseur', 'defender side'),
      body: bi(
        'Un sudo -l qui répond (ALL) ALL est un drapeau rouge. Moindre privilège : chaque compte n’a que les droits nécessaires. Clés privées en 600, jamais 644.',
        'A sudo -l that answers (ALL) ALL is a red flag. Least privilege: every account gets only the rights it needs. Private keys at 600, never 644.',
      ),
    },
    {
      type: 'callout',
      variant: 'exercise',
      body: bi(
        'Crée ~/lab, ajoute un fichier, passe-le en 600, vérifie avec ls -l, puis repasse-le en 644. Tu dois pouvoir expliquer chaque chiffre à voix haute.',
        'Create ~/lab, add a file, chmod it 600, confirm with ls -l, then set it back to 644. You should be able to explain every digit out loud.',
      ),
    },
  ],
}
