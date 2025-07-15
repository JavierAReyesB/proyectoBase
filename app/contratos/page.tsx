'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { PageWrapper } from '@/app/layout/PageWrapper'
import { Search } from 'lucide-react'

export default function ContratosPage() {
  const [open, setOpen] = useState(false)
  const [tipoContrato, setTipoContrato] = useState("")
  const [nombreContrato, setNombreContrato] = useState("")

  /* Acción de búsqueda */
  const handleSearch = () => {
    // Aquí pon tu lógica real (API, filtro, etc.).
    console.log('Buscando contrato:', nombreContrato)
  }

  return (
    <PageWrapper
      title='Contratos'
      description='Gestión de contratos registrados en el sistema.'
    >
      <div className='flex justify-end mb-4'>
        <Button variant='default' onClick={() => setOpen(true)}>
          + Nuevo contrato
        </Button>
      </div>

      <div className='rounded-md border border-muted p-4 mb-6'>
        <p className='text-sm text-muted-foreground'>
          No hay contratos registrados todavía.
        </p>
      </div>

      {/* Demo de botones */}
      <div className='space-x-2'>
        {['xs', 'sm', 'default', 'lg', 'xl'].map((sz) => (
          <Button key={sz} size={sz as any}>
            {sz.toUpperCase()}
          </Button>
        ))}
        <Button size='icon' aria-label='icono'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-4 w-4'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 4v16m8-8H4'
            />
          </svg>
        </Button>
      </div>

      {/* Modal */}
      <Modal
        title='Crear contrato'
        description='Ingresa los datos requeridos.'
        size='full'
        open={open}
        onOpenChange={setOpen}
      >
        <div className='space-y-6'>
          {/* Input + botón de búsqueda */}
          <div className="relative w-full max-w-full">
            {/* input con padding-right extra para que no tape el botón */}
            <Input
              className="pr-24"                    /* deja espacio para el botón */
              placeholder="Ej. Contrato de prestación de servicios"
              value={nombreContrato}
              onChange={(e) => setNombreContrato(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
            />

            {/* botón flotante */}
            <Button
              type="button"
              size="xs"
              onClick={handleSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              Buscar
            </Button>
          </div>



          {/* Select */}
          <div className='space-y-2'>
            <label className='block text-sm font-medium text-foreground'>
              Tipo de contrato
            </label>
            <Select value={tipoContrato} onValueChange={setTipoContrato}>
              <SelectTrigger>
                <SelectValue placeholder='Selecciona tipo de contrato' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='fijo'>Contrato fijo</SelectItem>
                <SelectItem value='indefinido'>Contrato indefinido</SelectItem>
                <SelectItem value='temporal'>Contrato temporal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='flex justify-end gap-2 pt-2'>
            <Button variant='ghost' onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setOpen(false)}>Guardar</Button>
          </div>
        </div>
      </Modal>
    </PageWrapper>
  )
}
