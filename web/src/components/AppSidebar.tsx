import { LayoutGrid, ShoppingBag } from 'lucide-react'
import { UserButton, useAuth } from '@clerk/react'

export type AppView = 'products' | 'sales'

type AppSidebarProps = {
  active: AppView
  onChange: (view: AppView) => void
}

const navBtn =
  'flex h-11 w-11 items-center justify-center rounded-xl border border-transparent text-zinc-400 transition-colors hover:bg-white/5 hover:text-violet-300'

const navBtnActive = 'border-violet-500/40 bg-violet-500/15 text-violet-300 shadow-[0_0_20px_-5px_rgba(139,92,246,0.5)]'

export function AppSidebar({ active, onChange }: AppSidebarProps) {
  const { isSignedIn } = useAuth()

  return (
    <aside className="flex h-screen min-h-0 w-[72px] shrink-0 flex-col border-r border-white/6 bg-zinc-950/80 backdrop-blur-xl">
      <div className="flex flex-1 flex-col items-center justify-center gap-2 py-4">
        <button
          type="button"
          title="Товари"
          onClick={() => onChange('products')}
          className={`${navBtn} ${active === 'products' ? navBtnActive : ''}`}
        >
          <LayoutGrid className="h-5 w-5" strokeWidth={1.75} />
        </button>
        <button
          type="button"
          title="Продажі"
          onClick={() => onChange('sales')}
          className={`${navBtn} ${active === 'sales' ? navBtnActive : ''}`}
        >
          <ShoppingBag className="h-5 w-5" strokeWidth={1.75} />
        </button>
      </div>

      <div className="shrink-0 border-t border-white/6 p-3">
        {isSignedIn ? (
          <div className="flex justify-center">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'h-10 w-10 ring-2 ring-white/10',
                },
              }}
            />
          </div>
        ) : (
          // <p className="text-center text-[10px] leading-tight text-zinc-500">Увійдіть</p>
          <></>
        )}
      </div>
    </aside>
  )
}
