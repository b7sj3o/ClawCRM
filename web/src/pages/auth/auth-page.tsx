import type { ReactNode } from 'react'
import { SignInButton, SignUpButton, useAuth } from '@clerk/react'
import { ArrowRight, Boxes, ChartColumn, ShieldCheck } from 'lucide-react'
import { Navigate } from 'react-router-dom'

export function AuthPage() {
  const { isLoaded, isSignedIn } = useAuth()

  if (isLoaded && isSignedIn) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen bg-[#0c0c0f] text-zinc-200">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center gap-10 px-6 py-10 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="rounded-3xl border border-white/8 bg-[#14141a]/80 p-8 shadow-xl shadow-black/50 backdrop-blur-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-300/80">
              ClawCRM
            </p>
            <h1 className="mt-4 text-5xl font-semibold leading-tight text-zinc-50">
              CRM для товарів, категорій і продажів в одному просторі.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">
              Керуй структурою товарів, відслідковуй продажі по організації та тримай
              всю операційну інформацію в одному інтерфейсі.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-violet-500"
                >
                  Увійти
                  <ArrowRight className="h-4 w-4" />
                </button>
              </SignInButton>

              <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                <button
                  type="button"
                  className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-zinc-200 transition hover:bg-white/10"
                >
                  Зареєструватись
                </button>
              </SignUpButton>
            </div>
          </article>

          <article className="overflow-hidden rounded-3xl border border-white/8 bg-linear-to-br from-violet-500/20 via-fuchsia-500/10 to-cyan-500/10 p-8 shadow-xl shadow-black/50">
            <div className="grid h-full min-h-[320px] place-items-center rounded-2xl border border-white/10 bg-black/20 p-6">
              <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#101017]/90 p-5 shadow-2xl shadow-black/40">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Preview</p>
                    <h2 className="mt-1 text-xl font-semibold text-zinc-50">ClawCRM Workspace</h2>
                  </div>
                  <div className="rounded-full border border-violet-400/30 bg-violet-400/10 px-3 py-1 text-xs text-violet-200">
                    Live
                  </div>
                </div>

                <div className="grid gap-3">
                  <div className="rounded-xl border border-white/8 bg-white/5 p-4">
                    <p className="text-sm text-zinc-300">Категорії</p>
                    <div className="mt-2 flex gap-2">
                      <span className="rounded-md bg-violet-500/15 px-2 py-1 text-xs text-violet-200">
                        Електроніка
                      </span>
                      <span className="rounded-md bg-white/8 px-2 py-1 text-xs text-zinc-300">
                        Аксесуари
                      </span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/8 bg-white/5 p-4">
                    <p className="text-sm text-zinc-300">Продажі</p>
                    <p className="mt-2 text-3xl font-semibold text-zinc-50">128</p>
                    <p className="text-xs text-zinc-500">за останні 30 днів</p>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <FeatureCard
            icon={<Boxes className="h-5 w-5" />}
            title="Категорії й дерево товарів"
            description="Вкладена структура нод і товарів із швидким переходом до деталей."
          />
          <FeatureCard
            icon={<ChartColumn className="h-5 w-5" />}
            title="Продажі по організаціях"
            description="Окремий простір для перегляду та створення продажів із Clerk auth."
          />
          <FeatureCard
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Захищені маршрути"
            description="Неавторизовані користувачі бачать тільки landing, а робочий простір закритий."
          />
        </div>
      </section>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode
  title: string
  description: string
}) {
  return (
    <article className="rounded-2xl border border-white/8 bg-[#14141a]/80 p-5 shadow-xl shadow-black/30 backdrop-blur-xl">
      <div className="mb-4 inline-flex rounded-xl border border-violet-400/20 bg-violet-400/10 p-2 text-violet-200">
        {icon}
      </div>
      <h2 className="text-lg font-semibold text-zinc-50">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-zinc-400">{description}</p>
    </article>
  )
}

