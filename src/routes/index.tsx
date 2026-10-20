import { createFileRoute } from '@tanstack/react-router'
import { ModuleView } from '~/components/ModuleView'
import { module01 } from '~/content/module'

export const Route = createFileRoute('/')({
  component: () => <ModuleView doc={module01} />,
})
