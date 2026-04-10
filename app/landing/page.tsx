"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ShieldCheck, PieChart, Target, Zap, LayoutDashboard, Wallet, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

export default function LandingPage() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-indigo-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <Image src="/icon-192x192.png" alt="FenixFinance Logo" width={32} height={32} className="object-contain" />
             <span className="text-xl font-black tracking-tight">Fenix<span className="text-indigo-600 dark:text-indigo-400">Finance</span></span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2.5 rounded-full hover:bg-muted text-muted-foreground transition-colors"
            >
              <Moon className="h-5 w-5 dark:hidden" strokeWidth={1.5} />
              <Sun className="h-5 w-5 hidden dark:block" strokeWidth={1.5} />
            </button>
            <div className="hidden sm:flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" className="font-semibold rounded-xl h-11 px-6 hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Iniciar sesión
                </Button>
              </Link>
              <Link href="/register">
                <Button className="font-semibold rounded-xl h-11 px-6 shadow-lg shadow-indigo-600/20 bg-indigo-600 hover:bg-indigo-700 text-white transition-all hover:scale-105 active:scale-95">
                  Comenzar gratis
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-16 px-6 sm:pt-40 sm:pb-24 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto relative">
          
          {/* Background Decorative Gradients */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/20 opacity-50 blur-[120px] rounded-full pointer-events-none" />

          <div className="text-center relative z-10 max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium text-sm border border-indigo-500/20 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
               <Zap className="h-4 w-4" />
               Aplicación Web Progresiva
            </div>

            <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
              Controla tu dinero.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-400">
                 Alcanza tu libertad.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              Registra cada gasto, visualiza tus ingresos y toma decisiones inteligentes con una plataforma diseñada para darte absoluta claridad financiera. 
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg font-bold rounded-2xl shadow-xl shadow-indigo-600/20 bg-indigo-600 hover:bg-indigo-700 text-white transition-all hover:scale-105 active:scale-95 group">
                  Empezar ahora totalmente gratis
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto sm:hidden">
                 <Button size="lg" variant="outline" className="w-full h-14 rounded-2xl border-border/50 text-foreground font-semibold">
                    Iniciar sesión
                 </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Feature Grid / Como Funciona */}
        <div className="max-w-7xl mx-auto mt-32 relative z-10">
           <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Cómo funciona FenixFinance</h2>
              <p className="text-muted-foreground mt-4 max-w-xl mx-auto">Una experiencia de usuario inigualable en solo 3 componentes esenciales.</p>
           </div>

           <div className="grid md:grid-cols-3 gap-8 px-4">
              <div className="group relative bg-card p-8 rounded-[2rem] border border-border/50 hover:border-indigo-500/30 transition-all hover:shadow-2xl hover:shadow-indigo-500/10">
                 <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                   <Target className="h-7 w-7" />
                 </div>
                 <h3 className="text-xl font-bold tracking-tight mb-3">1. Define</h3>
                 <p className="text-muted-foreground leading-relaxed">Crea tus propias categorías y fija presupuestos mensuales para dominar cuánto puedes gastar sin preocupación.</p>
              </div>

              <div className="group relative bg-card p-8 rounded-[2rem] border border-border/50 hover:border-cyan-500/30 transition-all hover:shadow-2xl hover:shadow-cyan-500/10">
                 <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-6 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform">
                   <Wallet className="h-7 w-7" />
                 </div>
                 <h3 className="text-xl font-bold tracking-tight mb-3">2. Registra</h3>
                 <p className="text-muted-foreground leading-relaxed">Añade cada consumo o ingreso desde cualquier dispositivo al instante. Usa iconos y colores personalizados para organizarte.</p>
              </div>

              <div className="group relative bg-card p-8 rounded-[2rem] border border-border/50 hover:border-emerald-500/30 transition-all hover:shadow-2xl hover:shadow-emerald-500/10">
                 <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                   <LayoutDashboard className="h-7 w-7" />
                 </div>
                 <h3 className="text-xl font-bold tracking-tight mb-3">3. Analiza</h3>
                 <p className="text-muted-foreground leading-relaxed">Obtén gráficos visuales hermosos sobre tus tendencias en el tiempo, identificando fácilmente dónde se va tu dinero.</p>
              </div>
           </div>
        </div>

        {/* Security Trust Section */}
        <div className="max-w-4xl mx-auto mt-32 text-center bg-muted/30 p-12 rounded-[3rem] border border-border/50">
           <ShieldCheck className="w-16 h-16 mx-auto text-indigo-500 mb-6" />
           <h2 className="text-2xl font-bold mb-4">Privacidad Ante Todo</h2>
           <p className="text-muted-foreground max-w-xl mx-auto">Toda tu información está protegida mediante Tokens Web cifrados en nivel servidor. FenixFinance no comparte, ni vende tu métrica. Es tu información, nosotros solo te damos un lente HD para mirarla.</p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card py-12 text-center text-muted-foreground">
        <div className="flex items-center justify-center gap-2 mb-4 opacity-50">
           <Image src="/icon-192x192.png" alt="FenixFinance Logo" width={24} height={24} className="grayscale" />
           <span className="font-bold tracking-widest text-sm">FENIXFINANCE</span>
        </div>
        <p className="text-sm">Aplicación de demostración para el control financiero comercial.</p>
      </footer>
    </div>
  )
}
