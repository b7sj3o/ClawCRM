import { Link } from 'react-router-dom'

export function DashboardPage() {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      <article className="rounded-2xl border border-white/8 bg-[#14141a]/80 p-6 shadow-xl shadow-black/50 backdrop-blur-xl">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Dashboard</p>
        <h2 className="mt-2 text-2xl font-semibold text-zinc-50">Огляд CRM</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Навігація тепер розділена по реальних route-ах, а не зберігається в одному
          компоненті.
        </p>
      </article>

      <article className="rounded-2xl border border-white/8 bg-[#14141a]/80 p-6 shadow-xl shadow-black/50 backdrop-blur-xl">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Швидкі переходи</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            to="/products"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-200 transition hover:bg-white/10"
          >
            Перейти до товарів
          </Link>
          <Link
            to="/sales"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-200 transition hover:bg-white/10"
          >
            Перейти до продажів
          </Link>
        </div>
      </article>
    </section>
  )
}

