import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BedDouble, Users, DollarSign, Search } from 'lucide-react';

export default function BrowseRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  useEffect(() => {
    fetch('http://localhost:5000/api/rooms')
      .then(r => r.json())
      .then(data => { setRooms(Array.isArray(data) ? data : []); setLoading(false); });
  }, []);

  const types = ['All', ...new Set(rooms.map(r => r.type))];

  const filtered = rooms.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.description?.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'All' || r.type === typeFilter;
    return matchSearch && matchType && r.is_available;
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-1">Browse Rooms</h1>
      <p className="text-slate-500 mb-6">Find and book your perfect room</p>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search rooms..."
            className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
        <div className="flex gap-2">
          {types.map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${typeFilter === t ? 'bg-amber-500 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-amber-400'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.length === 0 ? (
            <p className="col-span-3 text-center text-slate-400 py-12">No rooms found</p>
          ) : filtered.map(room => (
            <div key={room.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                {room.image_url ? (
                  <img src={room.image_url} alt={room.name} className="w-full h-full object-cover" />
                ) : (
                  <BedDouble className="w-12 h-12 text-slate-400" />
                )}
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-slate-800">{room.name}</h3>
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">{room.type}</span>
                </div>
                <p className="text-sm text-slate-500 mb-4 line-clamp-2">{room.description}</p>
                <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                  <span className="flex items-center gap-1"><Users size={14} /> {room.capacity} guests</span>
                  <span className="flex items-center gap-1"><BedDouble size={14} /> Floor {room.floor}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xl font-bold text-slate-800">${parseFloat(room.price_per_night).toFixed(0)}</span>
                    <span className="text-slate-400 text-sm"> / night</span>
                  </div>
                  <Link
                    to={`/book/${room.id}`}
                    className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
