import { createFileRoute, redirect } from '@tanstack/react-router'
import { DEFAULT_LOCALE } from '~/lib/i18n'

// Root "/" sends to the default locale (fr-CA primary).
export const Route = createFileRoute('/')({
  beforeLoad: () => {
    throw redirect({ to: '/$lang', params: { lang: DEFAULT_LOCALE } })
  },
})
