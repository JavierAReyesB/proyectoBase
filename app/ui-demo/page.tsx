/* app/ui-demo/page.tsx
   ===============================================================
   DEMO de la biblioteca de componentes UI – pantalla completa
   =============================================================== */
'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RcTooltip,
  CartesianGrid
} from 'recharts'

/* ──────────────── Wrappers / utilidades globales ─────────────── */
import { PageWrapper } from '@/app/(client)/layout/PageWrapper'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

/* ──────────────── Componentes UI (orden alfabético) ──────────── */
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from '@/components/ui/accordion'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from '@/components/ui/alert-dialog'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbLink
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from '@/components/ui/carousel'
import {
  ChartContainer,
  ChartTooltip,
  ChartLegend
} from '@/components/ui/chart'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent
} from '@/components/ui/collapsible'
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem
} from '@/components/ui/command'
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem
} from '@/components/ui/context-menu'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle
} from '@/components/ui/drawer'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form'
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent
} from '@/components/ui/hover-card'
import { Input } from '@/components/ui/input'
import { InputOTP } from '@/components/ui/input-otp'
import { Label } from '@/components/ui/label'
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem
} from '@/components/ui/menubar'
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink
} from '@/components/ui/navigation-menu'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink
} from '@/components/ui/pagination'
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from '@/components/ui/popover'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ResizablePanelGroup, ResizablePanel } from '@/components/ui/resizable'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { Slider } from '@/components/ui/slider'
import { Spin } from '@/components/ui/spin'
import { FilterSwitch } from '@/components/ui/switch'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Toaster } from '@/components/ui/toaster'
import { Toggle } from '@/components/ui/toggle'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent
} from '@/components/ui/tooltip'

/* ══════════════════════════════════════════════════════════════ */

export default function UiDemoPage() {
  /* estado demo */
  const [switchOn, setSwitchOn] = useState(true)
  const { toast } = useToast()

  /* react-hook-form demo */
  const form = useForm<{ nombre: string }>({
    defaultValues: { nombre: '' }
  })

  /* datos mini-gráfico */
  const chartData = [
    { name: 'Ene', visitas: 120 },
    { name: 'Feb', visitas: 190 },
    { name: 'Mar', visitas: 150 }
  ]

  return (
    <PageWrapper
      title='UI Demo'
      description='Galería de todos los componentes disponibles.'
      className='space-y-12'
    >
      {/* 00 Navegación */}
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href='/'>Volver al inicio</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* 01 Accordion */}
      <Accordion type='single' collapsible className='w-full'>
        <AccordionItem value='item-1'>
          <AccordionTrigger>Accordion</AccordionTrigger>
          <AccordionContent className='text-sm'>
            Contenido desplegable de ejemplo.
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* 02 Alert + AlertDialog */}
      <div className='space-y-4'>
        <Alert>
          <AlertTitle>Alerta simple</AlertTitle>
          <AlertDescription>Mensaje informativo.</AlertDescription>
        </Alert>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant='outline'>Abrir AlertDialog</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
              <AlertDescription>
                Esta acción no se puede deshacer.
              </AlertDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction>Aceptar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* 03 Avatar + Badge */}
      <div className='flex items-center gap-4'>
        <Avatar>
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <Badge variant='secondary'>Nuevo</Badge>
      </div>

      {/* 04 Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href='/'>Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink>Demo</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* 05 Buttons con Tooltip */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button>Botón con tooltip</Button>
        </TooltipTrigger>
        <TooltipContent>Hola 👋</TooltipContent>
      </Tooltip>

      {/* 06 Calendar */}
      <Calendar mode='single' />

      {/* 07 Cards */}
      <Card className='w-56'>
        <CardHeader>
          <CardTitle>Card</CardTitle>
        </CardHeader>
        <CardContent className='text-sm'>Cuerpo de la tarjeta</CardContent>
      </Card>

      {/* 08 Carousel */}
      <Carousel className='max-w-xs'>
        <CarouselContent>
          {[1, 2, 3].map((n) => (
            <CarouselItem key={n}>
              <AspectRatio ratio={4 / 3} className='bg-muted rounded-md'>
                <div className='flex h-full items-center justify-center text-lg'>
                  Slide {n}
                </div>
              </AspectRatio>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      {/* 09 Mini Chart */}
      <ChartContainer
        config={{
          visitas: { label: 'Visitas', color: '#4f46e5' }
        }}
        className='h-48 max-w-md'
      >
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='name' />
          <YAxis />
          <RcTooltip />
          <Bar dataKey='visitas' fill='var(--color-visitas)' />
        </BarChart>
        <ChartLegend verticalAlign='top' />
        <ChartTooltip />
      </ChartContainer>

      {/* 10 Checkbox & Switch */}
      <div className='flex items-center gap-6'>
        <Checkbox defaultChecked /> Checkbox
        <FilterSwitch
          checked={switchOn}
          onCheckedChange={setSwitchOn}
          labelOn='ON'
          labelOff='OFF'
        />
      </div>

      {/* 11 Collapsible */}
      <Collapsible>
        <CollapsibleTrigger className='underline text-sm'>
          Ver más
        </CollapsibleTrigger>
        <CollapsibleContent className='mt-2 text-sm'>
          Texto oculto que se muestra al desplegar.
        </CollapsibleContent>
      </Collapsible>

      {/* 12 Command */}
      <Command className='border rounded-md w-64'>
        <CommandInput placeholder='Buscar...' />
        <CommandList>
          <CommandItem>Opción A</CommandItem>
          <CommandItem>Opción B</CommandItem>
        </CommandList>
      </Command>

      {/* 13 Context menu */}
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <Button variant='outline'>Clic derecho aquí</Button>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Acción 1</ContextMenuItem>
          <ContextMenuItem>Acción 2</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {/* 14 Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant='outline'>Abrir dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Título</DialogTitle>
          </DialogHeader>
          Contenido del dialog.
        </DialogContent>
      </Dialog>

      {/* 15 Drawer */}
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant='outline'>Abrir drawer</Button>
        </DrawerTrigger>
        <DrawerContent className='p-6'>
          <DrawerHeader>
            <DrawerTitle>Menú rápido</DrawerTitle>
          </DrawerHeader>
          <div>Contenido del drawer</div>
        </DrawerContent>
      </Drawer>

      {/* 16 Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline'>Dropdown</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Uno</DropdownMenuItem>
          <DropdownMenuItem>Dos</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 17 Formulario (react-hook-form) */}
      <Form form={form}>
        <FormField
          control={form.control}
          name='nombre'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder='Escribe tu nombre' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>

      {/* 18 Hover-card */}
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant='link'>Hover card</Button>
        </HoverCardTrigger>
        <HoverCardContent>Contenido al pasar el cursor.</HoverCardContent>
      </HoverCard>

      {/* 19 Input OTP */}
      {/* <InputOTP maxLength={4} containerClassName='gap-1' /> */}

      {/* 20 Menubar */}
      <Menubar className='w-max'>
        <MenubarMenu>
          <MenubarTrigger>Archivo</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Nuevo</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>

      {/* 21 Pagination */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink isActive>Página 1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink>Página 2</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* 22 Popover */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant='outline'>Popover</Button>
        </PopoverTrigger>
        <PopoverContent>Texto del popover</PopoverContent>
      </Popover>

      {/* 23 Progress */}
      <Progress value={60} className='w-64' />

      {/* 24 RadioGroup */}
      <RadioGroup defaultValue='a' className='flex gap-4'>
        <div className='flex items-center gap-2'>
          <RadioGroupItem value='a' /> A
        </div>
        <div className='flex items-center gap-2'>
          <RadioGroupItem value='b' /> B
        </div>
      </RadioGroup>

      {/* 25 Resizable */}
      <ResizablePanelGroup direction='horizontal' className='h-32 border'>
        <ResizablePanel
          defaultSize={50}
          className='flex items-center justify-center'
        >
          Panel 1
        </ResizablePanel>
        <ResizablePanel
          defaultSize={50}
          className='flex items-center justify-center'
        >
          Panel 2
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* 26 ScrollArea */}
      <ScrollArea className='h-24 w-64 rounded border'>
        <p className='p-4 text-sm'>
          Contenido muy largo… Contenido muy largo… Contenido muy largo…
        </p>
      </ScrollArea>

      {/* 27 Select */}
      <Select>
        <SelectTrigger className='w-40'>
          <SelectValue placeholder='Selecciona…' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='1'>Uno</SelectItem>
          <SelectItem value='2'>Dos</SelectItem>
        </SelectContent>
      </Select>

      {/* 28 Separator */}
      <Separator />

      {/* 29 Sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant='outline'>Abrir sheet</Button>
        </SheetTrigger>
        <SheetContent className='p-6'>Cuerpo del sheet.</SheetContent>
      </Sheet>

      {/* 30 Skeleton */}
      <Skeleton className='h-6 w-48' />

      {/* 31 Slider */}
      <Slider defaultValue={[40]} max={100} className='w-48' />

      {/* 32 Spin */}
      <Spin />

      {/* 33 Table */}
      <Table className='w-64'>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Ana</TableCell>
            <TableCell>ana@mail.com</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {/* 34 Tabs */}
      <Tabs defaultValue='t1' className='w-64'>
        <TabsList>
          <TabsTrigger value='t1'>Tab 1</TabsTrigger>
          <TabsTrigger value='t2'>Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value='t1'>Contenido 1</TabsContent>
        <TabsContent value='t2'>Contenido 2</TabsContent>
      </Tabs>

      {/* 35 Textarea */}
      <Textarea placeholder='Escribe algo…' className='w-64' />

      {/* 36 Toast */}
      <Button
        variant='outline'
        onClick={() =>
          toast({
            title: 'Notificación',
            description: 'Ejemplo de toast.'
          })
        }
      >
        Lanzar toast
      </Button>
      <Toaster />

      {/* 37 Toggle + ToggleGroup */}
      <div className='flex items-center gap-4'>
        <Toggle aria-label='Toggle'>Toggle simple</Toggle>
        <ToggleGroup type='single' defaultValue='b'>
          <ToggleGroupItem value='a'>A</ToggleGroupItem>
          <ToggleGroupItem value='b'>B</ToggleGroupItem>
          <ToggleGroupItem value='c'>C</ToggleGroupItem>
        </ToggleGroup>
      </div>
    </PageWrapper>
  )
}
