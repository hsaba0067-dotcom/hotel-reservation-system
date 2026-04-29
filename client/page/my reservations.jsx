import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/Authcontex';
import { CalendarCheck, BedDouble, X } from 'lucide-react';

export default function MyReservations() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = () => {
    if (!user?.email) return;
    fetch(`http://localhost:5000/api/reservations/my/${user.email}`)
      .then(r => r.json())
      .then(data => { setReservations(Array.isArray(data) ? data : []); setLoading(false); });
  };

  useEffect(() => { fetchReservations(); }, [user]);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this reservation?')) return;
    await fetch(`http://localhost:5000/api/reservations/${id}`, { method: 'DELETE' });
    fetchReservations();
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-1">My Reservations</h1>
      <p className="text-slate-500 mb-8">All your hotel bookings in one place</p>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin" /></div>
      ) : reservations.length === 0 ? (
        <div className="text-center py-20">
          <CalendarCheck className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-lg">No reservations yet</p>
          <p className="text-slate-400 text-sm mt-1">Browse our rooms and make your first booking</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map(r => (
            <div key={r.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                    <BedDouble className="text-amber-500" size={22} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">{r.room_name}</h3>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {r.check_in} → {r.check_out} · {r.guests_count} guest{r.guests_count > 1 ? 's' : ''}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        r.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        r.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>{r.status}</span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        r.payment_status === 'paid' ? 'bg-green-100 text-green-700' :
                        r.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>{r.payment_status}</span>
                    </div>
                    {r.special_requests && (
                      <p className="text-xs text-slate-400 mt-2">Note: {r.special_requests}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-800">${parseFloat(r.total_price).toFixed(2)}</p>
                  <p className="text-xs text-slate-400 mb-3">{r.payment_method}</p>
                  {r.status !== 'cancelled' && (
                    <button onClick={() => handleCancel(r.id)} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition-colors">
                      <X size={14} /> Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
