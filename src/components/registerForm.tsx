'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// Componente apresentacional apenas front-end.
// Aceita um prop opcional `onSubmit` para que o pai decida o que fazer com os dados.
export function RegisterForm({
  onSubmit,
}: {
  onSubmit?: (data: { name: string; email: string; password: string }) => Promise<void> | void
}) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const data = {
      name: String(formData.get('name') ?? ''),
      email: String(formData.get('email') ?? ''),
      password: String(formData.get('password') ?? ''),
    }

    try {
      if (onSubmit) {
        await onSubmit(data)
      } else {
        // Comportamento padrão para desenvolvimento: apenas logar os dados
        // Você pode remover ou alterar isso conforme precisar
        // eslint-disable-next-line no-console
        console.log('RegisterForm submit:', data)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input id="name" name="name" placeholder="Digite seu nome" required disabled={isLoading} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="Digite seu email" required disabled={isLoading} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input id="password" name="password" type="password" placeholder="Digite sua senha" required disabled={isLoading} />
      </div>

      <Button className="w-full" type="submit" disabled={isLoading}>
        {isLoading ? 'Validando...' : 'Criar conta'}
      </Button>
    </form>
  )
}