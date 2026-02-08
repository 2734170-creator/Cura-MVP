
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Clock, CheckCircle2 } from 'lucide-react';
import { useApp } from '../store/AppContext';

const TicketDetailsScreen: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tickets } = useApp();
  const ticket = tickets.find(t => t.id === id);

  if (!ticket) return <div className="p-10 text-center font-bold">Обращение не найдено</div>;

  const isSolved = ticket.status === 'Решено';

  return (
    <div className="bg-white min-h-screen">
      <div className="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-gray-100 z-10 px-4 py-5 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-50 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-800" />
        </button>
        <h1 className="font-black text-gray-800 uppercase tracking-tighter text-lg">Детали обращения</h1>
      </div>

      <div className="p-6 space-y-6">
        {/* Статус и ID */}
        <div className="bg-gray-50 rounded-[2rem] p-6 border border-gray-100">
           <div className="flex justify-between items-center mb-4">
              <span className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider ${
                isSolved ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
              }`}>
                {ticket.status}
              </span>
              <span className="text-[10px] font-black text-gray-300 uppercase">ID: {ticket.id}</span>
           </div>
           
           <h2 className="text-xl font-black text-gray-800 mb-2">{ticket.subject}</h2>
           <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
             Создано: {ticket.date}
           </p>
           {isSolved && (
             <p className="text-xs font-bold text-green-600 uppercase tracking-wide mt-1">
               Решено: {ticket.statusDate}
             </p>
           )}
        </div>

        {/* Вопрос курьера */}
        <div className="space-y-3">
           <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">Ваш вопрос</h3>
           <div className="bg-[#F8F9FB] rounded-[1.5rem] p-5 border border-gray-100">
              <p className="text-sm font-medium text-gray-700 leading-relaxed whitespace-pre-wrap">
                {ticket.text}
              </p>
           </div>
        </div>

        {/* Ответ поддержки */}
        {isSolved && ticket.answer && (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <h3 className="text-[11px] font-black text-green-600 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
               <CheckCircle2 className="w-3 h-3" />
               Ответ поддержки
             </h3>
             <div className="bg-green-50 rounded-[1.5rem] p-5 border border-green-100">
                <p className="text-sm font-bold text-green-800 leading-relaxed whitespace-pre-wrap">
                  {ticket.answer}
                </p>
             </div>
          </div>
        )}

        {!isSolved && (
          <div className="flex flex-col items-center py-8 text-center opacity-40">
             <Clock className="w-10 h-10 text-gray-300 mb-2 animate-pulse" />
             <p className="text-xs font-bold text-gray-400 uppercase">Обращение в работе</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketDetailsScreen;
