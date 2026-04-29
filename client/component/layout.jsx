import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/Authcontex';
import { Hotel, LayoutDashboard, BedDouble, CalendarCheck, LogOut, ShieldCheck } from 'lucide-react';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <Hotel className="w-6 h-6 text-amber-400" />
            <span className="text-xl font-bold">Sheba Hotel</span>
          </div>
          <p className="text-slate-400 text-sm mt-1">Welcome, {user?.full_name}</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {user?.role === 'client' && (
            <>
              <NavLink to="/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" active={isActive('/dashboard')} />
              <NavLink to="/rooms" icon={<BedDouble size={18} />} label="Browse Rooms" active={isActive('/rooms')} />
              <NavLink to="/my-reservations" icon={<CalendarCheck size={18} />} label="My Reservations" active={isActive('/my-reservations')} />
            </>
          )}
          {user?.role === 'admin' && (
            <>
              <NavLink to="/admin" icon={<LayoutDashboard size={18} />} label="Dashboard" active={isActive('/admin')} />
              <NavLink to="/admin/rooms" icon={<BedDouble size={18} />} label="Manage Rooms" active={isActive('/admin/rooms')} />
              <NavLink to="/admin/reservations" icon={<CalendarCheck size={18} />} label="Reservations" active={isActive('/admin/reservations')} />
            </>
          )}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

function NavLink({ to, icon, label, active }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
        active
          ? 'bg-amber-500 text-white'
          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
