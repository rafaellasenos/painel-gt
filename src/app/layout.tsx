import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GT - Expx',
  description: 'Preencha o formulário para entrar na reunião',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
