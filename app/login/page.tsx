'use client'

import { useState, useEffect } from 'react'
import { useRouter }           from 'next/navigation'
import Cookies                 from 'js-cookie'

import { Button }   from '@/components/ui/button'
import { Input }    from '@/components/ui/input'
import { Label }    from '@/components/ui/label'
import {
  Eye, EyeOff, Mail, Lock, ArrowRight,
  Sparkles, Shield, Zap
} from 'lucide-react'

import AnimatedFigure from '@/styles/AnimatedFigure'

/* ────────────────────────────────────────────────────────────── */
/*  Máquina de estados para las fases de transición               */
/* ────────────────────────────────────────────────────────────── */
type Phase = 'login' | 'fade-login' | 'figure'

export default function PremiumLogin () {
  const router = useRouter()

  /* --------------------------- STATE -------------------------- */
  const [phase, setPhase]               = useState<Phase>('login')
  const [intro, setIntro]               = useState(false)      // slide‑in 1ª vez
  const [showPw, setShowPw]             = useState(false)
  const [email, setEmail]               = useState('')
  const [pass,  setPass]                = useState('')
  const [loading, setLoading]           = useState(false)

  useEffect(() => { setIntro(true) }, [])

  /* Cuando llegamos a la fase “figure” → ir al dashboard */
  useEffect(() => {
    if (phase !== 'figure') return
    const id = setTimeout(() => router.push('/inicio'), 2500)
    return () => clearTimeout(id)
  }, [phase, router])

  /* ---------------------  HANDLER LOGIN  ---------------------- */
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    /* ⚠️ Demo / pruebas – guarda cookies falsas */
    Cookies.set('token',   'fake-token')
    Cookies.set('userId',  '1234567890')
    Cookies.set('dominio', 'fake.dominio.com')
    Cookies.set('semilla', 'fake-semilla')

    /* Fades */
    setPhase('fade-login')            // ① desvanece formulario
    setTimeout(() => setPhase('figure'), 700) // ② muestra cubo
  }

  /* ------------------ Fase ③ – cubo 3‑D ----------------------- */
  if (phase === 'figure') {
    return (
      <div className="fixed inset-0 z-50">
        <AnimatedFigure />
      </div>
    )
  }

  /* ------------------ Fase ① / ② – login ---------------------- */
  const fade =
    phase === 'fade-login'
      ? 'opacity-0 pointer-events-none'
      : 'opacity-100'

  return (
    <div className={`min-h-screen flex overflow-hidden transition-opacity duration-700 ${fade}`}>
      {/* ░░░░░░░ COLUMNA IZQUIERDA ░░░░░░░ */}
      <aside className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-900 via-black to-neutral-800 overflow-hidden">
        {/* halos */}
        <div className="absolute inset-0">
          <div className="absolute w-96 h-96 bg-gradient-to-r from-gray-700/30 to-gray-500/30 rounded-full blur-3xl" />
          <div className="absolute w-80 h-80 bg-gradient-to-r from-zinc-700/20 to-stone-500/20 rounded-full blur-3xl" />
        </div>

        {/* texto */}
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className={`transition-all duration-1000 ${intro ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <header className="flex items-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mr-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h1 className="text-3xl font-bold">G‑App</h1>
            </header>

            <h2 className="text-5xl font-bold mb-6 leading-tight">
              Bienvenido al&nbsp;
              <span className="block bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Futuro Digital
              </span>
            </h2>

            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Plataforma empresarial diseñada para optimizar la gestión y
              productividad de tu organización.
            </p>

            <ul className="space-y-4">
              {[
                { icon: Shield,  text: 'Seguridad empresarial' },
                { icon: Zap,     text: 'Rendimiento ultrarrápido' },
                { icon: Sparkles,text: 'IA integrada' },
              ].map(({ icon: Icon, text }, idx) => (
                <li
                  key={idx}
                  className={`flex items-center transition-all duration-700 ${intro ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`}
                  style={{ transitionDelay: `${(idx + 1) * 200}ms` }}
                >
                  <Icon className="w-5 h-5 text-emerald-400 mr-3" />
                  <span className="text-gray-300">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>

      {/* ░░░░░░░ COLUMNA DERECHA (form) ░░░░░░░ */}
      <main className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 via-white to-gray-100 relative">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,#000_1px,transparent_0)] bg-[20px_20px]" />
        <div className="absolute top-20 right-20  w-32 h-32 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full blur-2xl opacity-30" />
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-br from-slate-100   to-gray-100 rounded-full blur-xl opacity-40" />

        <section className={`w-full max-w-lg transition-all duration-1000 ${intro ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-10 relative overflow-hidden">
            {/* decoraciones */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-emerald-50 to-transparent rounded-full -translate-y-20 translate-x-20" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-slate-50  to-transparent rounded-full  translate-y-16 -translate-x-16" />

            {/* cabecera móvil */}
            <div className="lg:hidden flex items-center justify-center mb-8 relative z-10">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">G‑App</h1>
            </div>

            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent mb-3 relative z-10">
              Iniciar&nbsp;Sesión
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full mx-auto mb-6 relative z-10" />

            {/* ---------------- FORM ---------------- */}
            <form onSubmit={handleLogin} className="space-y-6 relative z-10">
              {/* email */}
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5" />
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@empresa.com"
                    className="pl-14"
                  />
                </div>
              </div>

              {/* password */}
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5" />
                  <Input
                    id="password"
                    type={showPw ? 'text' : 'password'}
                    required
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    placeholder="•••••••••"
                    className="pl-14 pr-14"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full gap-2">
                {loading ? 'Cargando…' : 'Iniciar Sesión'}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </form>
          </div>
        </section>
      </main>
    </div>
  )
}
