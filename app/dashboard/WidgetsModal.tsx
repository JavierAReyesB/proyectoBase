'use client'
import { Modal } from '@/components/ui/modal'
import { AVAILABLE_WIDGETS } from '@/app/dashboard/availableWidgets'
import { Button } from '@/components/ui/button'

export function WidgetsModal({ open, onOpenChange, onAdd }: {
  open: boolean
  onOpenChange: (o: boolean) => void
  onAdd: (type: string) => void
}) {
  return (
    <Modal
      title="Widgets disponibles"
      description="Añade o quita widgets a tu dashboard"
      open={open}
      onOpenChange={onOpenChange}
      size="full"
    >
      <div className="mx-auto max-w-5xl grid gap-4 p-4
                      sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {AVAILABLE_WIDGETS.map(({ type, icon: Icon, title, description }) => (
          <Button key={type} variant="outline"
            className="w-full h-auto justify-start p-4"
            onClick={() => { onAdd(type); onOpenChange(false) }}>
            <Icon className="mr-3 h-5 w-5" />
            <div className="text-left">
              <div className="font-medium">{title}</div>
              <div className="text-xs text-muted-foreground">{description}</div>
            </div>
          </Button>
        ))}
      </div>
    </Modal>
  )
}
