import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';

export default function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchReservations = () => {
    fetch('http://localhost:5000/api/reservations')
      .then(r => r.json())
      .then(data => { setReservations(Array.isArray(data) ? data : []); setLoading(false); });
  };

  useEffect(() => { fetchReservations(); }, []);

  const updateStatus = async (id, status, payment_status) => {
    await fetch(`http://localhost:5000/api/reservations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, payment_status }),
    });
    fetchReservations();
  };

  const handleDelete = async (id) => {
    if (!confirm('Cancel this reservation?')) return;
    await fetch(`http://localhost:5000/api/reservations/${id}`, { method: 'DELETE' });
    fetchReservations();
  };

  const filtered = reservations.filter(r =>
    r.guest_name?.toLowerCase().includes(search.toLowerCase()) ||
    r.guest_email?.toLowerCase().includes(search.toLowerCase()) ||
    r.room_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Reservations</h1>
          <p className="text-slate-500">Manage all hotel bookings</p>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search guest or room..."
            className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin" /></div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr className="text-left text-slate-500">
                <th className="px-6 py-4 font-medium">Guest</th>
                <th className="px-6 py-4 font-medium">Room</th>
                <th className="px-6 py-4 font-medium">Check In</th>
                <th className="px-6 py-4 font-medium">Check Out</th>
                <th className="px-6 py-4 font-medium">Guests</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Payment</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9} className="px-6 py-12 text-center text-slate-400">No reservations found</td></tr>
              ) : filtered.map(r => (
                <tr key={r.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-700">{r.guest_name}</p>
                    <p className="text-xs text-slate-400">{r.guest_email}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{r.room_name}</td>
                  <td className="px-6 py-4 text-slate-500">{r.check_in}</td>
                  <td className="px-6 py-4 text-slate-500">{r.check_out}</td>
                  <td className="px-6 py-4 text-slate-500">{r.guests_count}</td>
                  <td className="px-6 py-4 font-medium text-slate-700">${parseFloat(r.total_price).toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <select
                      value={r.status}
                      onChange={e => updateStatus(r.id, e.target.value, r.payment_status)}
                      className={`text-xs px-2 py-1 rounded-full font-medium border-0 cursor-pointer ${
                        r.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        r.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}
                    >
                      <option value="pending">pending</option>
                      <option value="confirmed">confirmed</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={r.payment_status}
                      onChange={e => updateStatus(r.id, r.status, e.target.value)}
                      className={`text-xs px-2 py-1 rounded-full font-medium border-0 cursor-pointer ${
                        r.payment_status === 'paid' ? 'bg-green-100 text-green-700' :
                        r.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}
                    >
                      <option value="pending">pending</option>
                      <option value="paid">paid</option>
                      <option value="refunded">refunded</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleDelete(r.id)} className="text-xs text-red-500 hover:text-red-700 hover:underline">Cancel</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
