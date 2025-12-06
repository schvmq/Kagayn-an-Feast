import React, { useState } from 'react';
import { Calendar, Users, Clock, User } from 'lucide-react';
import { Reservation } from '../types';

interface ReservationFormProps {
  onSubmit: (data: Reservation) => void;
  initialData?: Partial<Reservation>;
}

const ReservationForm: React.FC<ReservationFormProps> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    date: initialData?.date || new Date().toISOString().split('T')[0],
    time: initialData?.time || '18:00',
    pax: initialData?.pax || 2,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, confirmed: true });
  };

  return (
    <div className="p-6 bg-white h-full">
      <h2 className="text-2xl font-bold text-stone-800 mb-6 font-serif flex items-center gap-2">
        <Calendar className="text-orange-500" />
        Table Reservation
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Guest Name</label>
          <div className="relative">
            <User className="absolute left-3 top-3 text-stone-400" size={18} />
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              placeholder="Juan dela Cruz"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 text-stone-400" size={18} />
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Time</label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 text-stone-400" size={18} />
              <input
                type="time"
                required
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
                className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Number of Guests</label>
          <div className="relative">
            <Users className="absolute left-3 top-3 text-stone-400" size={18} />
            <input
              type="number"
              min="1"
              max="20"
              required
              value={formData.pax}
              onChange={(e) => setFormData({...formData, pax: parseInt(e.target.value)})}
              className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-stone-800 text-white py-3 rounded-xl font-medium hover:bg-stone-900 transition-colors mt-4"
        >
          Book Table
        </button>
      </form>
      
      <div className="mt-8 p-4 bg-orange-50 rounded-lg border border-orange-100">
        <p className="text-sm text-orange-800 text-center">
          Note: We hold reservations for 15 minutes. Please come on time! Amping!
        </p>
      </div>
    </div>
  );
};

export default ReservationForm;
