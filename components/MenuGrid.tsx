import React from 'react';
import { MENU_ITEMS } from '../constants';
import { MenuItem } from '../types';
import { Plus } from 'lucide-react';

interface MenuGridProps {
  onAddItem: (item: MenuItem) => void;
}

const MenuGrid: React.FC<MenuGridProps> = ({ onAddItem }) => {
  return (
    <div className="p-4 h-full overflow-y-auto bg-stone-50 pb-24">
      <h2 className="text-2xl font-bold text-stone-800 mb-6 font-serif">Our Menu</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {MENU_ITEMS.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-32 w-full overflow-hidden">
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-stone-800">{item.name}</h3>
                <span className="text-orange-600 font-bold">₱{item.price}</span>
              </div>
              <p className="text-stone-500 text-sm mb-4 h-10 line-clamp-2">{item.description}</p>
              <button
                onClick={() => onAddItem(item)}
                className="w-full flex items-center justify-center gap-2 bg-stone-800 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm"
              >
                <Plus size={16} /> Add to Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuGrid;
