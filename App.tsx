import React, { useState, useEffect, useRef } from 'react';
import { createChatSession } from './services/geminiService';
import { Message, AppView, CartItem, MenuItem, Reservation } from './types';
import { MENU_ITEMS, RESTAURANT_NAME, RESTAURANT_LOCATION } from './constants';
import MenuGrid from './components/MenuGrid';
import Cart from './components/Cart';
import ReservationForm from './components/ReservationForm';
import { Send, MapPin, Phone, ChefHat, X, MessageSquare, UtensilsCrossed, Receipt, User } from 'lucide-react';

const App = () => {
  // State
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      content: 'Maayong adlaw! Welcome to Golden Friendship Feast. I am your Kagay-an Bot. How can I feed your hunger today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState<AppView>(AppView.CHAT);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [reservationData, setReservationData] = useState<Partial<Reservation>>({});
  
  // Refs
  const chatSessionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  // Initialize Chat
  useEffect(() => {
    if (!hasInitialized.current) {
      chatSessionRef.current = createChatSession();
      hasInitialized.current = true;
    }
  }, []);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Handlers
  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatSessionRef.current.sendMessage({ message: userMessage.content });
      
      // Handle Function Calls
      const functionCalls = response.functionCalls;
      
      let botResponseText = response.text;
      let toolOutputs: any[] = [];

      if (functionCalls && functionCalls.length > 0) {
        for (const call of functionCalls) {
          const { name, args } = call;
          
          if (name === 'showMenu') {
            setActiveView(AppView.MENU);
            toolOutputs.push({
               functionResponse: {
                 name,
                 response: { result: 'Menu displayed to user' }
               }
            });
            if (!botResponseText) botResponseText = "Here is our delicious menu, Chada kaayo!";
          } 
          else if (name === 'addToOrder') {
            const itemName = args.itemName;
            const qty = Number(args.quantity) || 1;
            const menuItem = MENU_ITEMS.find(i => i.name.toLowerCase().includes(itemName.toLowerCase()));
            
            if (menuItem) {
              addToCart(menuItem, qty);
              toolOutputs.push({
                functionResponse: {
                  name,
                  response: { result: `Added ${qty} ${menuItem.name} to cart` }
                }
             });
             if (!botResponseText) botResponseText = `I've added ${qty} ${menuItem.name} to your order. Anything else?`;
            } else {
              toolOutputs.push({
                functionResponse: {
                  name,
                  response: { result: `Item ${itemName} not found` }
                }
             });
             if (!botResponseText) botResponseText = `Sorry, I couldn't find "${itemName}" on the menu.`;
            }
          }
          else if (name === 'showBill') {
            setActiveView(AppView.BILL);
            toolOutputs.push({
                functionResponse: {
                  name,
                  response: { result: 'Bill displayed to user' }
                }
             });
             if (!botResponseText) botResponseText = "Here is your current bill.";
          }
          else if (name === 'makeReservation') {
            setReservationData({
              name: args.prefillName,
              date: args.prefillDate,
              time: args.prefillTime,
              pax: args.prefillPax ? Number(args.prefillPax) : undefined
            });
            setActiveView(AppView.RESERVATION);
            toolOutputs.push({
                functionResponse: {
                  name,
                  response: { result: 'Reservation form opened' }
                }
             });
             if (!botResponseText) botResponseText = "Please confirm your details in the form.";
          }
        }
        
        // Send tool response back to model to acknowledge action (optional for strict turn-taking but good for context)
        // For simplicity in this UI-driven flow, we just display the text derived or returned.
        // If the model didn't return text but called a function, we constructed a fallback text above.
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: botResponseText || "I've processed that for you!",
        timestamp: new Date()
      }]);

    } catch (error) {
      console.error("Chat Error", error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: "Sorry, I had a little trouble connecting. Can you say that again?",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = (item: MenuItem, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, { ...item, quantity }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const handlePlaceOrder = () => {
    // Simulate order placement
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'model',
      content: `Salamat! Your order has been placed. Kitchen is preparing your food now. Total: ₱${cart.reduce((a,b) => a + (b.price * b.quantity), 0) * 1.05}`,
      timestamp: new Date()
    }]);
    setCart([]);
    setActiveView(AppView.CHAT);
  };

  const handleReservationSubmit = (data: Reservation) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'model',
      content: `Reservation confirmed for ${data.name} on ${data.date} at ${data.time}. See you puhon!`,
      timestamp: new Date()
    }]);
    setActiveView(AppView.CHAT);
  };

  // Render Helpers
  const renderSidebarContent = () => {
    switch (activeView) {
      case AppView.MENU:
        return <MenuGrid onAddItem={(item) => addToCart(item)} />;
      case AppView.BILL:
        return <Cart items={cart} onRemoveItem={removeFromCart} onPlaceOrder={handlePlaceOrder} />;
      case AppView.RESERVATION:
        return <ReservationForm onSubmit={handleReservationSubmit} initialData={reservationData} />;
      default:
        return null; // Should not happen in mobile logic if overlay used
    }
  };

  return (
    <div className="flex h-full w-full bg-stone-100 font-sans">
      
      {/* --- Main Chat Area --- */}
      <div className={`flex flex-col h-full w-full transition-all duration-300 ${activeView !== AppView.CHAT ? 'md:w-1/2 lg:w-7/12 hidden md:flex' : 'w-full'}`}>
        
        {/* Header */}
        <div className="bg-white border-b border-stone-200 p-4 flex justify-between items-center shadow-sm z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center text-white shadow-orange-200 shadow-lg">
              <ChefHat size={20} />
            </div>
            <div>
              <h1 className="font-bold text-stone-800 leading-tight">{RESTAURANT_NAME}</h1>
              <div className="flex items-center text-xs text-stone-500 gap-1">
                <MapPin size={10} /> {RESTAURANT_LOCATION}
              </div>
            </div>
          </div>
          
          {/* Mobile View Toggles (Only visible on small screens when in Chat View) */}
          <div className="flex md:hidden gap-2">
            <button onClick={() => setActiveView(AppView.MENU)} className="p-2 text-stone-600 bg-stone-100 rounded-full hover:bg-stone-200">
              <UtensilsCrossed size={18} />
            </button>
            <button onClick={() => setActiveView(AppView.BILL)} className="p-2 text-stone-600 bg-stone-100 rounded-full hover:bg-stone-200 relative">
              <Receipt size={18} />
              {cart.length > 0 && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>}
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-stone-50 scrollbar-hide">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-4 shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-stone-800 text-white rounded-br-none' 
                  : 'bg-white text-stone-800 border border-stone-100 rounded-bl-none'
              }`}>
                {msg.role === 'model' && (
                  <div className="text-xs font-bold text-orange-600 mb-1 flex items-center gap-1">
                    <ChefHat size={12} /> Kagay-an Bot
                  </div>
                )}
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                <div className={`text-[10px] mt-2 opacity-60 ${msg.role === 'user' ? 'text-stone-300' : 'text-stone-400'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
               <div className="bg-white p-4 rounded-2xl rounded-bl-none border border-stone-100 shadow-sm flex items-center gap-2">
                 <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                 <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                 <div className="w-2 h-2 bg-orange-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-stone-200">
          <div className="flex items-center gap-2 bg-stone-100 rounded-full px-4 py-2 border border-stone-200 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100 transition-all">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask for menu, reserve a table..." 
              className="flex-1 bg-transparent outline-none text-stone-800 placeholder-stone-400 text-sm py-2"
            />
            <button 
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="p-2 bg-stone-800 text-white rounded-full hover:bg-orange-600 disabled:opacity-50 disabled:hover:bg-stone-800 transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
          <div className="flex justify-center gap-4 mt-3 text-xs text-stone-400">
             <span className="flex items-center gap-1"><Phone size={10} /> 0917-123-4567</span>
             <span className="flex items-center gap-1"><MapPin size={10} /> Divisoria, CDO</span>
          </div>
        </div>
      </div>

      {/* --- Side Panel (Desktop) / Full Overlay (Mobile) --- */}
      {activeView !== AppView.CHAT && (
        <div className="fixed inset-0 z-50 md:static md:z-0 md:flex-1 bg-stone-50 flex flex-col md:border-l md:border-stone-200 animate-in slide-in-from-right-10 duration-300">
          {/* Mobile Back Button Header */}
          <div className="bg-white p-4 border-b border-stone-200 flex justify-between items-center md:hidden">
            <h2 className="font-bold text-stone-800">
              {activeView === AppView.MENU && 'Menu'}
              {activeView === AppView.BILL && 'Your Bill'}
              {activeView === AppView.RESERVATION && 'Reservation'}
            </h2>
            <button onClick={() => setActiveView(AppView.CHAT)} className="p-2 hover:bg-stone-100 rounded-full">
              <X size={20} className="text-stone-600" />
            </button>
          </div>

          {/* Desktop Close Button (Usually not needed if split screen, but good for UX if they want to close panel) */}
           <div className="hidden md:flex justify-end p-2 bg-stone-50">
             <button onClick={() => setActiveView(AppView.CHAT)} className="p-2 text-stone-400 hover:text-stone-800 flex items-center gap-1 text-sm">
                Close Panel <X size={16} />
             </button>
           </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden h-full">
            {renderSidebarContent()}
          </div>
        </div>
      )}

      {/* --- Desktop Floating Actions (When Chat is Full Width and no panel open) --- */}
      {activeView === AppView.CHAT && (
        <div className="hidden md:flex flex-col gap-3 absolute right-8 bottom-24">
           <button 
            onClick={() => setActiveView(AppView.MENU)}
            className="bg-white p-3 rounded-full shadow-lg border border-stone-100 text-stone-600 hover:text-orange-600 hover:scale-110 transition-all tooltip-trigger"
            title="View Menu"
           >
             <UtensilsCrossed size={24} />
           </button>
           <button 
            onClick={() => setActiveView(AppView.RESERVATION)}
            className="bg-white p-3 rounded-full shadow-lg border border-stone-100 text-stone-600 hover:text-orange-600 hover:scale-110 transition-all"
            title="Book Table"
           >
             <User size={24} />
           </button>
           <button 
            onClick={() => setActiveView(AppView.BILL)}
            className="bg-white p-3 rounded-full shadow-lg border border-stone-100 text-stone-600 hover:text-orange-600 hover:scale-110 transition-all relative"
            title="View Bill"
           >
             <Receipt size={24} />
             {cart.length > 0 && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>}
           </button>
        </div>
      )}

    </div>
  );
};

export default App;