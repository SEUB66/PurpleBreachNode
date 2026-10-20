import type { TerminalBlock } from '~/lib/content/types'

/**
 * Fake terminal window. User-typed input renders magenta-bold, machine output
 * neutral grey, prompts cyan, trailing comments dimmed italic.
 */
export function Terminal({ block }: { block: TerminalBlock }) {
  const host = block.host ?? 'kali@lab : ~'
  return (
    <div className="pbn-terminal my-5" role="group" aria-label={`terminal ${host}`}>
      <div className="pbn-terminal__bar">
        <span className="pbn-terminal__dot" style={{ background: '#ff5f56' }} />
        <span className="pbn-terminal__dot" style={{ background: '#ffbd2e' }} />
        <span className="pbn-terminal__dot" style={{ background: '#27c93f' }} />
        <span className="ml-2">{host}</span>
      </div>
      <pre className="pbn-terminal__body m-0">
        <code>
          {block.lines.map((line, i) => {
            if (line.kind === 'in') {
              return (
                <div key={i}>
                  <span className="pbn-prompt">{line.prompt ?? '$'} </span>
                  <span className="pbn-in">{line.text}</span>
                  {line.comment && <span className="pbn-comment">  # {line.comment}</span>}
                </div>
              )
            }
            if (line.kind === 'comment') {
              return (
                <div key={i} className="pbn-comment">
                  # {line.text}
                </div>
              )
            }
            return (
              <div key={i} className="pbn-out">
                {line.text}
              </div>
            )
          })}
          <span className="pbn-cursor" aria-hidden />
        </code>
      </pre>
    </div>
  )
}
