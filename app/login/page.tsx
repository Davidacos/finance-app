"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LogIn, Mail, Lock, ArrowRight, Wallet, CheckCircle2, ShieldCheck, Zap } from "lucide-react"

/**
 * Redesigned Professional Login Page
 * Featuring an immersive split-screen layout for desktop and premium dark aesthetics.
 */
export default function LoginPage() {
  const { login, isLoading } = useAuth()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(formData.email, formData.password)
    } catch (error) {
      // Error handled by hook toast
    }
  }

  return (
    <div className="min-h-screen flex bg-background selection:bg-indigo-500/30">
      {/* --- Left Side: Branding & Visuals (Desktop Only) --- */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden bg-slate-950 border-r border-border/50">
        {/* Abstract Background Design */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-500 shadow-xl shadow-indigo-500/20">
            <Wallet className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="text-2xl font-black text-white tracking-tighter">FinanceApp</span>
            <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest leading-none">Pro Edition</p>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-lg">
          <h1 className="text-5xl font-black text-white tracking-tight leading-[1.1] mb-6">
            Toma el control de tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-sky-400">futuro financiero</span> hoy mismo.
          </h1>
          <p className="text-xl text-slate-400 font-medium leading-relaxed mb-10">
            Gestiona tus gastos, analiza tus ingresos y alcanza tus metas con la plataforma más avanzada y elegante.
          </p>

          <div className="space-y-5">
            {[
              { icon: CheckCircle2, text: "Análisis inteligente de gastos e ingresos" },
              { icon: ShieldCheck, text: "Seguridad bancaria avanzada y privacidad" },
              { icon: Zap, text: "Sincronización en tiempo real con la nube" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 group-hover:border-indigo-500/40 transition-colors">
                  <item.icon className="h-5 w-5 text-indigo-400" />
                </div>
                <span className="text-slate-300 font-semibold tracking-wide">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10">
          <p className="text-slate-500 font-medium text-sm">
            © 2026 FinanceApp Inc. Todos los derechos reservados.
          </p>
        </div>
      </div>

      {/* --- Right Side: Login Form --- */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden">
        {/* Mobile Background Elements */}
        <div className="lg:hidden absolute inset-0 z-0">
          <div className="absolute top-[-20%] right-[-20%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px]" />
        </div>

        <div className="w-full max-w-[440px] relative z-10 animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out">
          {/* Header */}
          <div className="text-center lg:text-left mb-10">
            <h2 className="text-4xl font-black text-foreground tracking-tight mb-3">Bienvenido</h2>
            <p className="text-muted-foreground font-medium text-lg">
              Ingresa tus credenciales para acceder a tu panel.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2.5">
              <Label htmlFor="email" className="text-sm font-bold text-foreground/80 ml-1 uppercase tracking-wider">
                Correo Electrónico
              </Label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none group-focus-within:text-indigo-500 transition-colors text-muted-foreground">
                  <Mail className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="ejemplo@dominio.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-muted/30 border-border/50 h-14 pl-12 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 text-[16px] font-medium transition-all"
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between ml-1">
                <Label htmlFor="password" className="text-sm font-bold text-foreground/80 uppercase tracking-wider">
                  Contraseña
                </Label>
                <Link href="#" className="text-xs font-bold text-indigo-500 hover:text-indigo-400 transition-colors">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none group-focus-within:text-indigo-500 transition-colors text-muted-foreground">
                  <Lock className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••••••"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-muted/30 border-border/50 h-14 pl-12 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 text-[16px] font-medium transition-all"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-lg shadow-xl shadow-indigo-600/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Iniciando sesión...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Entrar a mi cuenta</span>
                    <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
                  </div>
                )}
              </Button>
            </div>
          </form>

          {/* Divider */}
          <div className="my-10 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase font-black text-muted-foreground">
              <span className="bg-background px-4 tracking-widest">¿Nuevo por aquí?</span>
            </div>
          </div>

          <Link 
            href="/register" 
            className="group flex items-center justify-center gap-3 w-full h-14 rounded-2xl border border-border/50 hover:bg-muted/50 font-bold transition-all text-foreground"
          >
            <span>Crear una cuenta nueva</span>
            <div className="w-6 h-6 rounded-lg bg-indigo-500/10 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all">
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={3} />
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
