
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { User, Package, MessageSquare, Bell, RefreshCw, PlusCircle } from 'lucide-react';
import { useApp } from '../store/AppContext.tsx';
import { OrderStatus, CourierStatus } from '../types.ts';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orders, courierStatus, notification, setNotification, restartApp, addNewOrder } = useApp();

  const assignedCount = orders.filter(o => [OrderStatus.ASSEMBLY, OrderStatus.READY, OrderStatus.TRANSFERRED_TO_COURIER].includes(o.status)).length;

  const navItems = [
    { label: 'Поддержка', path: '/support', icon: MessageSquare },
    { label: 'Доставки', path: '/deliveries', icon: Package, badge: assignedCount },
    { label: 'Профиль', path: '/profile', icon: User },
  ];

  const handleNotificationClick = () => {
    navigate('/deliveries');
    setNotification(null);
  };

  const isNotInCFZ = courierStatus !== CourierStatus.IN_CFZ;

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-gray-50 shadow-xl overflow-hidden relative">
      
      {/* Демо-панель управления */}
      <div className="bg-slate-900 px-4 py-3 flex gap-3 border-b border-slate-800 z-50">
        <button 
          onClick={restartApp}
          className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-black uppercase tracking-wider py-2 rounded-lg flex items-center justify-center gap-2 transition-colors active:scale-95"
        >
          <RefreshCw className="w-3 h-3" />
          Заново
        </button>
        <button 
          onClick={addNewOrder}
          disabled={isNotInCFZ}
          className={`flex-[1.5] text-[10px] font-black uppercase tracking-wider py-2 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg ${
            isNotInCFZ 
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed opacity-50 shadow-none' 
              : 'bg-brand hover:bg-brand-dark text-white active:scale-95 shadow-brand/20'
          }`}
        >
          <PlusCircle className="w-3 h-3" />
          Назначить новое задание
        </button>
      </div>

      {/* Отступ в 20 пикселей между панелью и приложением */}
      <div className="h-5 bg-gray-50 shrink-0"></div>

      <div className="flex-1 relative overflow-hidden flex flex-col">
        {notification && (
          <div className="absolute top-4 left-4 right-4 z-50 animate-in slide-in-from-top duration-300">
            <div 
              onClick={handleNotificationClick}
              className="bg-white rounded-2xl shadow-2xl p-4 flex items-start gap-3 border-l-4 border-brand cursor-pointer active:scale-95 transition-all"
            >
              <div className="bg-brand-light p-2 rounded-full shrink-0">
                <Bell className="w-5 h-5 text-brand" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-gray-800">Уведомление</h4>
                <p className="text-xs text-gray-600 leading-tight truncate">{notification}</p>
              </div>
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  setNotification(null); 
                }} 
                className="text-gray-300 hover:text-gray-600 text-xl font-light px-2 shrink-0"
              >
                ×
              </button>
            </div>
          </div>
        )}
        
        <main className="flex-1 overflow-y-auto pb-24 bg-white rounded-t-[2.5rem] shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)] border-t border-gray-100">
          {children}
        </main>
      </div>

      <nav className="fixed bottom-0 w-full max-w-md bg-white/80 backdrop-blur-md border-t border-gray-100 safe-bottom z-40">
        <div className="flex justify-around items-center py-3">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <button key={item.path} onClick={() => navigate(item.path)} className={`flex flex-col items-center gap-1.5 transition-all duration-200 px-4 ${isActive ? 'text-brand scale-105' : 'text-gray-400 opacity-70 hover:opacity-100'}`}>
                <div className="relative">
                  <item.icon className={`w-6 h-6 ${isActive ? 'fill-brand/10' : ''}`} />
                  {typeof item.badge === 'number' && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-brand text-white text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[20px] text-center border-2 border-white shadow-sm">{item.badge}</span>
                  )}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'opacity-100' : 'opacity-80'}`}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
