// drawer/GenericDrawerContent.tsx
export default function GenericDrawerContent({ data }: { data: any }) {
  return (
    <div style={{ padding: 16 }}>
      <strong>Contenido restaurado:</strong>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
