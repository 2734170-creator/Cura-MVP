
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, Camera, Send } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { SUPPORT_THEMES } from '../constants';
import { SupportTicket } from '../types';

const CreateTicketScreen: React.FC = () => {
  const navigate = useNavigate();
  const { addTicket } = useApp();
  const [subject, setSubject] = useState('');
  const [text, setText] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const charLimit = 500;

  const handleSend = () => {
    if (!subject || !text.trim()) return;

    const newTicket: SupportTicket = {
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: Date.now(),
      date: new Date().toLocaleString('ru-RU'),
      subject,
      status: 'На рассмотрении',
      statusDate: new Date().toLocaleString('ru-RU'),
      text: text.trim(),
    };

    addTicket(newTicket);
    navigate('/support');
  };

  return (
    <div className="bg-white min-h-screen p-6">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-800" />
        </button>
        <h1 className="text-xl font-black text-gray-800 uppercase tracking-tighter">Новое обращение</h1>
      </div>

      <div className="space-y-6">
        {/* Тема обращения */}
        <div className="space-y-2">
          <h3 className="text-[11px] font-black text-[#A0AFC7] uppercase tracking-[0.2em] px-2">Тема обращения</h3>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full bg-[#F8F9FB] rounded-[1.5rem] p-5 flex justify-between items-center border border-[#EDF2F7] transition-all"
            >
              <span className={`text-sm font-bold ${subject ? 'text-gray-800' : 'text-[#A0AFC7]'}`}>
                {subject || 'Выберите тему...'}
              </span>
              <ChevronDown className={`w-5 h-5 text-[#A0AFC7] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#EDF2F7] rounded-[1.5rem] shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                {SUPPORT_THEMES.map((theme) => (
                  <button
                    key={theme}
                    onClick={() => {
                      setSubject(theme);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-6 py-4 text-sm font-bold hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 ${
                      subject === theme ? 'text-brand bg-brand-light/20' : 'text-gray-700'
                    }`}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Текст обращения */}
        <div className="space-y-2">
          <div className="flex justify-between items-end px-2">
            <h3 className="text-[11px] font-black text-[#A0AFC7] uppercase tracking-[0.2em]">Описание проблемы</h3>
            <span className={`text-[10px] font-bold ${text.length > charLimit ? 'text-red-500' : 'text-gray-300'}`}>
              {text.length}/{charLimit}
            </span>
          </div>
          <textarea
            placeholder="Опишите ситуацию подробно..."
            className="w-full bg-[#F8F9FB] border border-[#EDF2F7] rounded-[1.5rem] p-5 text-sm font-bold text-gray-800 outline-none focus:border-brand/30 min-h-[160px] resize-none transition-all"
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, charLimit))}
          />
        </div>

        {/* Фото */}
        <div className="space-y-2">
          <h3 className="text-[11px] font-black text-[#A0AFC7] uppercase tracking-[0.2em] px-2">Фотографии (до 10 шт)</h3>
          <button 
            className="w-full h-24 border-2 border-dashed border-gray-100 rounded-[1.5rem] flex flex-col items-center justify-center gap-1 text-gray-300 hover:text-gray-400 hover:border-gray-200 transition-all"
            onClick={() => alert('Загрузка фото будет доступна в следующем обновлении')}
          >
            <Camera className="w-6 h-6" />
            <span className="text-[10px] font-black uppercase">Прикрепить фото</span>
          </button>
        </div>

        {/* Отправить */}
        <button
          disabled={!subject || !text.trim() || text.length > charLimit}
          onClick={handleSend}
          className={`w-full py-6 rounded-full font-black text-lg transition-all shadow-2xl flex items-center justify-center gap-3 ${
            subject && text.trim() && text.length <= charLimit
              ? 'bg-brand text-white shadow-brand/30 active:scale-95' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
          }`}
        >
          <Send className="w-5 h-5" />
          <span className="uppercase tracking-tight">Отправить</span>
        </button>
      </div>
    </div>
  );
};

export default CreateTicketScreen;
