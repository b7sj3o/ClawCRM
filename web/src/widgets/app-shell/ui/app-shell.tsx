import { OrganizationSwitcher, UserButton } from '@clerk/react'
import { LayoutGrid, ShoppingBag } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'

const navButtonBase =
  'flex h-11 w-11 items-center justify-center rounded-xl border border-transparent text-zinc-400 transition-colors hover:bg-white/5 hover:text-violet-300'

const navButtonActive =
  'border-violet-500/40 bg-violet-500/15 text-violet-300 shadow-[0_0_20px_-5px_rgba(139,92,246,0.5)]'

export function AppShell() {
  return (
    <div className="flex min-h-screen bg-[#0c0c0f] text-zinc-200">
      <aside className="flex h-screen min-h-0 w-[72px] shrink-0 flex-col border-r border-white/6 bg-zinc-950/80 backdrop-blur-xl">
        <div className="flex flex-1 flex-col items-center justify-center gap-2 py-4">
          <NavLink
            to="/dashboard"
            title="Дашборд"
            className={({ isActive }) => `${navButtonBase} ${isActive ? navButtonActive : ''}`}
          >
            <LayoutGrid className="h-5 w-5" strokeWidth={1.75} />
          </NavLink>
          <NavLink
            to="/products"
            title="Товари"
            className={({ isActive }) => `${navButtonBase} ${isActive ? navButtonActive : ''}`}
          >
            <LayoutGrid className="h-5 w-5" strokeWidth={1.75} />
          </NavLink>
          <NavLink
            to="/sales"
            title="Продажі"
            className={({ isActive }) => `${navButtonBase} ${isActive ? navButtonActive : ''}`}
          >
            <ShoppingBag className="h-5 w-5" strokeWidth={1.75} />
          </NavLink>
        </div>

        <div className="shrink-0 border-t border-white/6 p-3">
          <div className="flex justify-center">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'h-10 w-10 ring-2 ring-white/10',
                },
              }}
            />
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-white/6 px-6 py-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">ClawCRM</h1>
              <p className="mt-1 text-sm text-zinc-500">
                Масштабована структура по сутностях, фічах і сторінках.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <OrganizationSwitcher
                hidePersonal
                afterCreateOrganizationUrl="/dashboard"
                appearance={{
                  elements: {
                    rootBox: 'flex justify-end',
                    organizationSwitcherTrigger:
                      'rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200 hover:bg-white/10',
                  },
                }}
              />
            </div>
          </div>
        </header>

        <main className="min-w-0 flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

