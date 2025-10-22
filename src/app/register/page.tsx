'use client'

import { RegisterForm } from '@/components/registerForm'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default function RegisterPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-center   text-4xl font-bold text-green-600 mb-1 tracking-tight" >Criar Conta</CardTitle>
          <CardDescription className="text-center">
            Preencha os dados abaixo para criar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm/>
        </CardContent>
      </Card>
    </div>
  )
}