import React from 'react';
import { CartItem } from '../types';
import { Trash2, ShoppingBag, Receipt } from 'lucide-react';

interface CartProps {
  items: CartItem[];
  onRemoveItem: (id: string) => void;
  onPlaceOrder: () => void;
}

const Cart: React.FC<CartProps> = ({ items, onRemoveItem, onPlaceOrder }) => {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const serviceCharge = total * 0.05;
  const grandTotal = total + serviceCharge;

  if (items.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-stone-400">
        <ShoppingBag size={48} className="mb-4 opacity-50" />
        <p>Your cart is empty.</p>
        <p className="text-sm">Ask the chatbot to see the menu!</p>
      </div>
    );
  }

  return (
    <div className="p-6 h-full flex flex-col bg-white">
      <h2 className="text-2xl font-bold text-stone-800 mb-6 font-serif flex items-center gap-2">
        <Receipt className="text-orange-500" />
        Bill Summary
      </h2>
      
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-4">
          {items.map((item) => (
            <div key={`${item.id}-${item.quantity}`} className="flex justify-between items-center p-3 bg-stone-50 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-stone-800">{item.name}</h4>
                <p className="text-sm text-stone-500">₱{item.price} x {item.quantity}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold">₱{item.price * item.quantity}</span>
                <button 
                  onClick={() => onRemoveItem(item.id)}
                  className="text-red-400 hover:text-red-600 p-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-stone-200 pt-4 mt-4 space-y-2">
        <div className="flex justify-between text-stone-600">
          <span>Subtotal</span>
          <span>₱{total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-stone-600 text-sm">
          <span>Service Charge (5%)</span>
          <span>₱{serviceCharge.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xl font-bold text-stone-900 pt-2 border-t border-stone-100">
          <span>Total</span>
          <span>₱{grandTotal.toFixed(2)}</span>
        </div>

        <button 
          onClick={onPlaceOrder}
          className="w-full mt-6 bg-orange-600 text-white py-3 rounded-xl font-medium shadow-lg shadow-orange-200 hover:bg-orange-700 transition-all transform hover:scale-[1.02]"
        >
          Confirm Order
        </button>
      </div>
    </div>
  );
};

export default Cart;
