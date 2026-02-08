
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, ChevronRight, Plus, CheckCircle2, Clock } from 'lucide-react';
import { useApp } from '../store/AppContext';

const SupportScreen: React.FC = () => {
  const { tickets } = useApp();
  const navigate = useNavigate();

  return (
    <div className="p-6 pb-32 flex flex-col min-h-full">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">Поддержка</h1>
      </div>

      <div className="flex-1 space-y-4">
        <div className="flex justify-between items-end px-2 mb-2">
          <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">История обращений</h3>
          <span className="text-[10px] font-bold text-gray-300">{tickets.length} всего</span>
        </div>

        {tickets.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-12 text-center border border-gray-100 shadow-sm">
             <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
               <MessageCircle className="w-8 h-8 text-gray-200" />
             </div>
             <p className="text-sm font-bold text-gray-300">Список обращений пуст</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map(t => (
              <div 
                key={t.id} 
                onClick={() => navigate(`/support/ticket/${t.id}`)}
                className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm active:scale-[0.98] transition-all cursor-pointer"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="bg-gray-50 p-2.5 rounded-xl">
                    <MessageCircle className="w-5 h-5 text-brand" />
                  </div>
                  <span className={`text-[9px] font-black px-2 py-1 rounded uppercase tracking-wider ${
                    t.status === 'Решено' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {t.status}
                  </span>
                </div>
                
                <h4 className="text-base font-black text-gray-800 mb-1 leading-tight">{t.subject}</h4>
                <div className="flex items-center gap-2 mb-4">
                   <span className="text-[10px] font-bold text-gray-400 uppercase">ID: {t.id}</span>
                   <span className="text-gray-200">•</span>
                   <span className="text-[10px] font-bold text-gray-400">{t.date}</span>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-gray-50">
                   <button className="text-[10px] font-black text-brand uppercase tracking-widest flex items-center gap-1">
                     Просмотреть
                     <ChevronRight className="w-3 h-3" />
                   </button>
                   {t.status === 'Решено' ? (
                     <CheckCircle2 className="w-4 h-4 text-green-400" />
                   ) : (
                     <Clock className="w-4 h-4 text-blue-400" />
                   )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8">
        <button 
          className="w-full bg-brand text-white font-black py-5 rounded-2xl shadow-xl shadow-brand/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
          onClick={() => navigate('/support/create')}
        >
          <Plus className="w-6 h-6" />
          <span className="text-base uppercase tracking-tight">Создать обращение</span>
        </button>
      </div>
    </div>
  );
};

export default SupportScreen;
