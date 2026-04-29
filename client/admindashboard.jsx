import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BedDouble, CalendarCheck, Users, DollarSign, ArrowRight } from 'lucide-react';

export default function AdminDashboard() {
  const [rooms, setRooms] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:5000/api/rooms').then(r => r.json()),
      fetch('http://localhost:5000/api/reservations').then(r => r.json()),
    ]).then(([r, res]) => {
      setRooms(Array.isArray(r) ? r : []);
      setReservations(Array.isArray(res) ? res : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const totalRevenue = reservations
    .filter(r => r.status === 'confirmed')
    .reduce((sum, r) => sum + parseFloat(r.total_price || 0), 0);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-1">Admin Dashboard</h1>
      <p className="text-slate-500 mb-8">Hotel overview & statistics</p>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard icon={<BedDouble className="text-amber-500" />} label="Total Rooms" value={rooms.length} />
        <StatCard icon={<CalendarCheck className="text-green-500" />} label="Reservations" value={reservations.length} />
        <StatCard icon={<Users className="text-blue-500" />} label="Available Rooms" value={rooms.filter(r => r.is_available).length} />
        <StatCard icon={<DollarSign className="text-purple-500" />} label="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} />
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link to="/admin/rooms" className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl p-6 flex items-center justify-between transition-colors">
          <div>
            <p className="font-semibold text-lg">Manage Rooms</p>
            <p className="text-amber-100 text-sm">Add, edit or remove rooms</p>
          </div>
          <ArrowRight />
        </Link>
        <Link to="/admin/reservations" className="bg-slate-800 hover:bg-slate-700 text-white rounded-xl p-6 flex items-center justify-between transition-colors">
          <div>
            <p className="font-semibold text-lg">Reservations</p>
            <p className="text-slate-400 text-sm">View all bookings</p>
          </div>
          <ArrowRight />
        </Link>
      </div>

      {/* Recent reservations */}
      {!loading && reservations.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h2 className="font-semibold text-slate-800 mb-4">Recent Reservations</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-100">
                  <th className="pb-3 font-medium">Guest</th>
                  <th className="pb-3 font-medium">Room</th>
                  <th className="pb-3 font-medium">Check In</th>
                  <th className="pb-3 font-medium">Check Out</th>
                  <th className="pb-3 font-medium">Total</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {reservations.slice(0, 8).map(r => (
                  <tr key={r.id} className="border-b border-slate-50 last:border-0">
                    <td className="py-3 font-medium text-slate-700">{r.guest_name}</td>
                    <td className="py-3 text-slate-500">{r.room_name}</td>
                    <td className="py-3 text-slate-500">{r.check_in}</td>
                    <td className="py-3 text-slate-500">{r.check_out}</td>
                    <td className="py-3 text-slate-700">${parseFloat(r.total_price).toFixed(2)}</td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        r.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        r.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>{r.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
