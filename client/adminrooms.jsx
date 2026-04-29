import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';

const empty = { name: '', type: 'Standard', room_number: '', floor: 1, capacity: 1, price_per_night: '', description: '', image_url: '', is_available: true };

export default function AdminRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const fetchRooms = () => {
    fetch('http://localhost:5000/api/rooms')
      .then(r => r.json())
      .then(data => { setRooms(Array.isArray(data) ? data : []); setLoading(false); });
  };

  useEffect(() => { fetchRooms(); }, []);

  const openAdd = () => { setForm(empty); setEditing(null); setShowModal(true); };
  const openEdit = (room) => { setForm({ ...room }); setEditing(room.id); setShowModal(true); };

  const handleSave = async () => {
    setSaving(true);
    const url = editing ? `http://localhost:5000/api/rooms/${editing}` : 'http://localhost:5000/api/rooms';
    const method = editing ? 'PUT' : 'POST';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setSaving(false);
    setShowModal(false);
    fetchRooms();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this room?')) return;
    await fetch(`http://localhost:5000/api/rooms/${id}`, { method: 'DELETE' });
    fetchRooms();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manage Rooms</h1>
          <p className="text-slate-500">Add, edit or remove hotel rooms</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors">
          <Plus size={18} /> Add Room
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin" /></div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr className="text-left text-slate-500">
                <th className="px-6 py-4 font-medium">Room</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Number</th>
                <th className="px-6 py-4 font-medium">Floor</th>
                <th className="px-6 py-4 font-medium">Capacity</th>
                <th className="px-6 py-4 font-medium">Price/Night</th>
                <th className="px-6 py-4 font-medium">Available</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map(room => (
                <tr key={room.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-700">{room.name}</td>
                  <td className="px-6 py-4 text-slate-500">{room.type}</td>
                  <td className="px-6 py-4 text-slate-500">{room.room_number}</td>
                  <td className="px-6 py-4 text-slate-500">{room.floor}</td>
                  <td className="px-6 py-4 text-slate-500">{room.capacity}</td>
                  <td className="px-6 py-4 text-slate-700">${parseFloat(room.price_per_night).toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${room.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {room.is_available ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(room)} className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"><Pencil size={16} /></button>
                      <button onClick={() => handleDelete(room.id)} className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800">{editing ? 'Edit Room' : 'Add Room'}</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Room Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400">
                  {['Standard', 'Deluxe', 'Suite', 'Economy', 'Family'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Room Number</label>
                <input value={form.room_number} onChange={e => setForm({ ...form, room_number: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Floor</label>
                <input type="number" value={form.floor} onChange={e => setForm({ ...form, floor: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Capacity</label>
                <input type="number" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Price / Night ($)</label>
                <input type="number" value={form.price_per_night} onChange={e => setForm({ ...form, price_per_night: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Available</label>
                <select value={form.is_available ? 'true' : 'false'} onChange={e => setForm({ ...form, is_available: e.target.value === 'true' })} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400">
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
                <input value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400" placeholder="https://..." />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors disabled:opacity-60">
                {saving ? 'Saving...' : 'Save Room'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
