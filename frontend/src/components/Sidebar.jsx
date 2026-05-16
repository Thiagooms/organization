import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Calendar, BookOpen, Clock, CheckSquare, Flag, GraduationCap, Grid3x3, X } from 'lucide-react'

const menuItems = [
  { label: 'Dashboard',    path: '/',           icon: LayoutDashboard },
  { label: 'Períodos',     path: '/periodos',   icon: Calendar },
  { label: 'Disciplinas',  path: '/disciplinas', icon: BookOpen },
  { label: 'Aulas',        path: '/aulas',      icon: Clock },
  { label: 'Atividades',   path: '/atividades', icon: CheckSquare },
  { label: 'Quadro',       path: '/quadro',     icon: Grid3x3 },
  { label: 'Prioridade',   path: '/prioridade', icon: Flag },
  { label: 'Monitoria',    path: '/monitoria',  icon: GraduationCap },
]

const activeClass = 'bg-blue-600 text-white'
const inactiveClass = 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'

export default function Sidebar({ onClose }) {
  const location = useLocation()

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full">
      <div className="p-6 border-b border-slate-200 flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">Organization</h1>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-2 hover:bg-slate-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? activeClass : inactiveClass
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
