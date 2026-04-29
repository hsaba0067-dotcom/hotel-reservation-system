import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/Authcontex';
import { Link } from 'react-router-dom';
import { BedDouble, CalendarCheck, Clock, ArrowRight } from 'lucide-react';

export default function ClientDashboard() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      fetch(`http://localhost:5000/api/reservations/my/${user.email}`)
        .then(r => r.json())
        .then(data => { setReservations(Array.isArray(data) ? data : []); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [user]);

  const active = reservations.filter(r => r.status === 'confirmed');
  const pending = reservations.filter(r => r.status === 'pending');

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-1">Welcome back, {user?.full_name} 👋</h1>
      <p className="text-slate-500 mb-8">Here's your stay overview</p>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard icon={<CalendarCheck className="text-amber-500" />} label="Total Reservations" value={reservations.length} />
        <StatCard icon={<BedDouble className="text-green-500" />} label="Confirmed" value={active.length} />
        <StatCard icon={<Clock className="text-blue-500" />} label="Pending" value={pending.length} />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link to="/rooms" className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl p-6 flex items-center justify-between transition-colors">
          <div>
            <p className="font-semibold text-lg">Browse Rooms</p>
            <p className="text-amber-100 text-sm">Find your perfect stay</p>
          </div>
          <ArrowRight />
        </Link>
        <Link to="/my-reservations" className="bg-slate-800 hover:bg-slate-700 text-white rounded-xl p-6 flex items-center justify-between transition-colors">
          <div>
            <p className="font-semibold text-lg">My Reservations</p>
            <p className="text-slate-400 text-sm">View & manage bookings</p>
          </div>
          <ArrowRight />
        </Link>
      </div>

      {/* Recent reservations */}
      {!loading && reservations.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h2 className="font-semibold text-slate-800 mb-4">Recent Reservations</h2>
          <div className="space-y-3">
            {reservations.slice(0, 5).map(r => (
              <div key={r.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <div>
                  <p className="font-medium text-slate-700">{r.room_name}</p>
                  <p className="text-sm text-slate-400">{r.check_in} → {r.check_out}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  r.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                  r.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>{r.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-center gap-4">
      <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center">{icon}</div>
      <div>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  );
}
