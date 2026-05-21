import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Painel - GT Expx',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
