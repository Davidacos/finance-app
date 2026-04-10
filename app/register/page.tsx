"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserPlus, Mail, Lock, User, ArrowRight, Wallet, CheckCircle2, ShieldCheck, Zap } from "lucide-react"
import { toast } from "sonner"

/**
 * Redesigned Professional Register Page
 * Features a split-screen layout for desktop and premium dark aesthetics consistent with the Login page.
 */
export default function RegisterPage() {
  const { register, isLoading } = useAuth()
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Las contraseñas no coinciden")
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...dataToSend } = formData
      await register(dataToSend)
    } catch (error) {
      // Error handled by hook toast
    }
  }

  return (
    <div className="min-h-screen flex bg-background selection:bg-indigo-500/30">
      {/* --- Left Side: Branding & Visuals (Desktop Only) --- */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden bg-slate-950 border-r border-border/50">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px]" />
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
            Únete a la nueva era de la <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-sky-400">gestión personal</span>.
          </h1>
          <p className="text-xl text-slate-400 font-medium leading-relaxed mb-10">
            Crea tu cuenta en segundos y empieza a transformar tus finanzas con herramientas profesionales diseñadas para ti.
          </p>

          <div className="space-y-5">
            {[
              { icon: Zap, text: "Configuración instantánea y sin fricción" },
              { icon: CheckCircle2, text: "Categorías personalizables ilimitadas" },
              { icon: ShieldCheck, text: "Privacidad total de tus datos financieros" }
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
            Diseñado para el control total. © 2026 FinanceApp.
          </p>
        </div>
      </div>

      {/* --- Right Side: Register Form --- */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden bg-background">
        {/* Mobile Background Elements */}
        <div className="lg:hidden absolute inset-0 z-0">
          <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px]" />
        </div>

        <div className="w-full max-w-[480px] relative z-10 animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out">
          {/* Logo Mobile */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
             <Image src="/icon-192x192.png" alt="FenixFinance Logo" width={48} height={48} className="object-contain" />
             <span className="text-3xl font-black tracking-tight">Fenix<span className="text-indigo-600 dark:text-indigo-400">Finance</span></span>
          </div>

          {/* Header */}
          <div className="text-center lg:text-left mb-8">
            <h2 className="text-4xl font-black text-foreground tracking-tight mb-3">Empezar ahora</h2>
            <p className="text-muted-foreground font-medium text-lg">
              Crea tu cuenta gratuita y toma el control.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Fields Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name" className="text-[11px] font-black text-foreground/60 ml-1 uppercase tracking-[0.15em]">
                  Nombre
                </Label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none group-focus-within:text-indigo-500 transition-colors text-muted-foreground">
                    <User className="h-4 w-4" strokeWidth={2} />
                  </div>
                  <Input
                    id="first_name"
                    name="first_name"
                    placeholder="Juan"
                    required
                    value={formData.first_name}
                    onChange={handleChange}
                    className="bg-muted/30 border-border/50 h-12 pl-11 rounded-xl focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name" className="text-[11px] font-black text-foreground/60 ml-1 uppercase tracking-[0.15em]">
                  Apellido
                </Label>
                <Input
                  id="last_name"
                  name="last_name"
                  placeholder="Pérez"
                  required
                  value={formData.last_name}
                  onChange={handleChange}
                  className="bg-muted/30 border-border/50 h-12 px-4 rounded-xl focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium transition-all"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[11px] font-black text-foreground/60 ml-1 uppercase tracking-[0.15em]">
                Correo Electrónico
              </Label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none group-focus-within:text-indigo-500 transition-colors text-muted-foreground">
                  <Mail className="h-4 w-4" strokeWidth={2} />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="nombre@ejemplo.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-muted/30 border-border/50 h-12 pl-11 rounded-xl focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label htmlFor="password" className="text-[11px] font-black text-foreground/60 ml-1 uppercase tracking-[0.15em]">
                   Contraseña
                 </Label>
                 <div className="relative group">
                   <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none group-focus-within:text-indigo-500 transition-colors text-muted-foreground">
                     <Lock className="h-4 w-4" strokeWidth={2} />
                   </div>
                   <Input
                     id="password"
                     name="password"
                     type="password"
                     placeholder="••••••••"
                     required
                     value={formData.password}
                     onChange={handleChange}
                     className="bg-muted/30 border-border/50 h-12 pl-11 rounded-xl focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium transition-all"
                   />
                 </div>
               </div>

               <div className="space-y-2">
                 <Label htmlFor="confirmPassword" className="text-[11px] font-black text-foreground/60 ml-1 uppercase tracking-[0.15em]">
                   Confirmar
                 </Label>
                 <Input
                   id="confirmPassword"
                   name="confirmPassword"
                   type="password"
                   placeholder="••••••••"
                   required
                   value={formData.confirmPassword}
                   onChange={handleChange}
                   className="bg-muted/30 border-border/50 h-12 px-4 rounded-xl focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium transition-all"
                 />
               </div>
            </div>

            <div className="pt-4">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-lg shadow-xl shadow-indigo-600/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creando cuenta...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Crear mi cuenta</span>
                    <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
                  </div>
                )}
              </Button>
            </div>
          </form>

          {/* Footer Card */}
          <div className="mt-8 p-1 rounded-2xl bg-muted/30 border border-border/50">
             <div className="p-4 text-center">
                 <p className="text-sm font-medium text-muted-foreground mb-3">¿Ya tienes una cuenta?</p>
                 <Link 
                   href="/login" 
                   className="inline-flex items-center gap-2 text-indigo-500 hover:text-indigo-400 font-black text-sm uppercase tracking-widest transition-all"
                 >
                   Iniciar sesión ahora
                   <ArrowRight className="h-4 w-4" strokeWidth={3} />
                 </Link>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
