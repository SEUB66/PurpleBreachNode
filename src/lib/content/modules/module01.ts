import { bi } from '~/lib/i18n'
import type { ModuleDoc } from '~/lib/content/types'

/**
 * Module 01 — Linux survival (FOUNDATIONS).
 * Source: Manuel-Kali-SEUB-FRCA.pdf · Partie II · Module 01.
 * Native tooling/command names stay verbatim in both locales.
 */
export const module01: ModuleDoc = {
  meta: {
    id: '01',
    slug: 'linux-survival',
    order: 1,
    part: bi('Partie II · Modules 01–03', 'Part II · Modules 01–03'),
    title: bi('Survie sous Linux', 'Linux survival'),
    level: 'novice',
    objective: bi(
      'Naviguer dans le système de fichiers, lire et écrire des fichiers, gérer les permissions — sans rien casser.',
      'Move around the filesystem, read and write files, handle permissions — without breaking anything.',
    ),
  },
  topology: [
    { op: 'addNode', node: { id: 'kali', label: 'YOU · Kali', kind: 'attacker' } },
  ],
  blocks: [
    {
      type: 'callout',
      variant: 'why',
      body: bi(
        "Si tu hésites dans le shell, chaque phase suivante fait mal. Le terminal doit devenir un réflexe, pas une épreuve. 80 % des blocages du débutant ne sont pas de la sécurité : c'est Linux et le réseau. On règle ça d'abord.",
        'If you hesitate in the shell, every later phase hurts. The terminal has to become a reflex, not a trial. 80% of a beginner’s roadblocks aren’t security — they’re Linux and networking. We fix that first.',
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
        'pwd affiche le dossier courant. ls -la liste tout, fichiers cachés compris, avec permissions, propriétaire et taille. Premier caractère : d = dossier, - = fichier, l = lien symbolique. Les 9 caractères suivants sont les rwx pour propriétaire / groupe / autres. Puis propriétaire, groupe, taille, date, nom.',
        'pwd prints the current directory. ls -la lists everything, hidden files included, with permissions, owner and size. First character: d = directory, - = file, l = symlink. The next 9 characters are the rwx bits for owner / group / others. Then owner, group, size, date, name.',
      ),
    },
    { type: 'heading', text: bi('Créer, chercher, lire', 'Create, search, read') },
    {
      type: 'terminal',
      host: 'kali@lab : ~',
      lines: [
        { kind: 'in', text: 'cd ~/lab && mkdir -p targets loot notes', comment: 'rien = succès / no output = success' },
        { kind: 'in', text: 'grep -rin "password" .' },
        { kind: 'out', text: './notes.txt:3:password: hunter2' },
      ],
    },
    {
      type: 'read',
      body: bi(
        'mkdir -p crée des dossiers imbriqués sans échouer s’ils existent déjà. Sous Linux, pas de sortie = succès : confirme avec ls. grep -rin cherche dans le contenu des fichiers, récursivement (r), sans tenir compte de la casse (i), avec numéros de ligne (n). Le format fichier:ligne:contenu — avec ses deux-points — tu le retrouveras partout dans les sorties d’outils.',
        'mkdir -p creates nested directories without failing if they already exist. On Linux, no output = success: confirm with ls. grep -rin searches file contents recursively (r), case-insensitively (i), with line numbers (n). The file:line:content format — colons and all — shows up everywhere in tool output.',
      ),
    },
    {
      type: 'callout',
      variant: 'why',
      heading: bi('grep est une arme', 'grep is a weapon'),
      body: bi(
        'Chercher le mot « password » dans des fichiers de config, c’est la méthode numéro un pour trouver des identifiants oubliés en clair — sur ta propre machine comme sur une cible compromise. Simple, et redoutablement efficace.',
        'Grepping for "password" across config files is the number-one way to find forgotten cleartext credentials — on your own box and on a compromised target alike. Simple, and brutally effective.',
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
        'Les permissions se lisent en base 8 : chaque chiffre = r=4, w=2, x=1 additionnés. 755 = propriétaire rwx (7), groupe et autres r-x (5). 600 = seul le propriétaire lit/écrit (utile pour une clé privée). Vérifie toujours avec ls -l : si tu ne vois pas le x, le fichier n’est pas exécutable.',
        'Permissions read in base 8: each digit = r=4, w=2, x=1 summed. 755 = owner rwx (7), group and others r-x (5). 600 = owner-only read/write (handy for a private key). Always confirm with ls -l: if you don’t see the x, the file isn’t executable.',
      ),
    },
    { type: 'heading', text: bi('Ce que je peux faire en root', 'What I can do as root') },
    {
      type: 'terminal',
      host: 'kali@lab : ~',
      lines: [
        { kind: 'in', text: 'sudo -l' },
        { kind: 'out', text: 'User kali may run the following commands:' },
        { kind: 'out', text: '    (ALL : ALL) ALL' },
      ],
    },
    {
      type: 'read',
      body: bi(
        'sudo -l liste ce que tu as le droit d’exécuter en tant que root. Note-le. Sur une cible, c’est la première chose à vérifier pour l’élévation de privilèges (module 09) : une règle sudo mal fichue est le chemin le plus rapide vers root.',
        'sudo -l lists what you’re allowed to run as root. Write it down. On a target it’s the first thing to check for privilege escalation (module 09): a sloppy sudo rule is the fastest path to root.',
      ),
    },
    {
      type: 'callout',
      variant: 'trap',
      body: bi(
        'rm -rf depuis le mauvais dossier efface tout, sans corbeille (vérifie pwd d’abord). > écrase, >> ajoute. Les noms avec espaces se mettent entre guillemets. Ctrl+C interrompt une commande qui tourne.',
        'rm -rf from the wrong directory wipes everything, no recycle bin (check pwd first). > overwrites, >> appends. Quote names with spaces. Ctrl+C interrupts a running command.',
      ),
    },
    {
      type: 'callout',
      variant: 'remediation',
      heading: bi('côté défenseur', 'defender side'),
      body: bi(
        'Ce que tu apprends ici éclaire le durcissement : un sudo -l qui répond (ALL) ALL est un drapeau rouge. Principe du moindre privilège : chaque compte n’a que les droits strictement nécessaires. Les clés privées en 600, jamais en 644. Les fichiers de config contenant des secrets ne sont pas lisibles par « autres ».',
        'What you learn here drives hardening: a sudo -l that answers (ALL) ALL is a red flag. Least privilege: every account gets only the rights it strictly needs. Private keys at 600, never 644. Config files holding secrets aren’t readable by "others".',
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
