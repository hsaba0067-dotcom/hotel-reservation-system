import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/Authcontex';
import { BedDouble, Users, Calendar, DollarSign, CheckCircle } from 'lucide-react';

export default function BookRoom() {
  const { roomId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({
    check_in: today,
    check_out: '',
    guests_count: 1,
    payment_method: 'Credit Card',
    special_requests: '',
  });

  useEffect(() => {
    fetch(`http://localhost:5000/api/rooms/${roomId}`)
      .then(r => r.json())
      .then(data => { setRoom(data); setLoading(false); });
  }, [roomId]);

  const nights = form.check_in && form.check_out
    ? Math.max(0, Math.ceil((new Date(form.check_out) - new Date(form.check_in)) / (1000 * 60 * 60 * 24)))
    : 0;

  const total = room ? (nights * parseFloat(room.price_per_night)).toFixed(2) : '0.00';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (nights <= 0) { setError('Check-out must be after check-in'); return; }
    setSaving(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          room_id: room.id,
          guest_name: user.full_name,
          guest_email: user.email,
          check_in: form.check_in,
          check_out: form.check_out,
          guests_count: form.guests_count,
          total_price: total,
          payment_method: form.payment_method,
          special_requests: form.special_requests,
        }),
      });
      if (!res.ok) throw new Error('Booking failed');
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin" /></div>;

  if (success) return (
    <div className="p-8 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-10 text-center max-w-md">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Booking Confirmed!</h2>
        <p className="text-slate-500 mb-6">Your reservation for <strong>{room.name}</strong> has been placed successfully.</p>
        <div className="flex gap-3">
          <button onClick={() => navigate('/my-reservations')} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-lg transition-colors">View Reservations</button>
          <button onClick={() => navigate('/rooms')} className="flex-1 border border-slate-200 text-slate-600 py-2 rounded-lg hover:bg-slate-50 transition-colors">Browse More</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Book a Room</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Room info */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="h-48 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
            {room.image_url ? <img src={room.image_url} alt={room.name} className="w-full h-full object-cover" /> : <BedDouble className="w-12 h-12 text-slate-400" />}
          </div>
          <div className="p-5">
            <div className="flex items-start justify-between mb-2">
              <h2 className="font-semibold text-slate-800 text-lg">{room.name}</h2>
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">{room.type}</span>
            </div>
            <p className="text-sm text-slate-500 mb-4">{room.description}</p>
            <div className="flex gap-4 text-sm text-slate-500 mb-4">
              <span className="flex items-center gap-1"><Users size={14} /> {room.capacity} guests</span>
              <span className="flex items-center gap-1"><BedDouble size={14} /> Floor {room.floor}</span>
            </div>
            <div className="border-t border-slate-100 pt-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-500">Price per night</span>
                <span className="font-medium">${parseFloat(room.price_per_night).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-500">Nights</span>
                <span className="font-medium">{nights}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-800 mt-2 pt-2 border-t border-slate-100">
                <span>Total</span>
                <span className="text-amber-600">${total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Booking form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Check In</label>
              <input type="date" required min={today} value={form.check_in} onChange={e => setForm({ ...form, check_in: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Check Out</label>
              <input type="date" required min={form.check_in || today} value={form.check_out} onChange={e => setForm({ ...form, check_out: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Number of Guests</label>
            <input type="number" min={1} max={room.capacity} value={form.guests_count} onChange={e => setForm({ ...form, guests_count: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Payment Method</label>
            <select value={form.payment_method} onChange={e => setForm({ ...form, payment_method: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm">
              <option>Credit Card</option>
              <option>Debit Card</option>
              <option>Cash</option>
              <option>Bank Transfer</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Special Requests</label>
            <textarea value={form.special_requests} onChange={e => setForm({ ...form, special_requests: e.target.value })} rows={3}
              placeholder="Any special requests or notes..."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm" />
          </div>
          {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-lg">{error}</div>}
          <button type="submit" disabled={saving || nights <= 0}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60">
            {saving ? 'Booking...' : `Confirm Booking — $${total}`}
          </button>
        </form>
      </div>
    </div>
  );
}
