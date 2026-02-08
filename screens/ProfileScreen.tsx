
import React from 'react';
import { MapPin, ShieldCheck, ChevronRight } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { CourierStatus } from '../types';

const Team6Logo: React.FC<{ size?: number }> = ({ size = 64 }) => (
  <div style={{ width: size, height: size * 1.2 }} className="relative flex flex-col items-center justify-center mb-2">
    <svg viewBox="0 0 100 110" className="w-full h-full drop-shadow-lg">
      <defs>
        <radialGradient id="ballGrad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FF7EB3" />
          <stop offset="40%" stopColor="#FA3D67" />
          <stop offset="100%" stopColor="#D62D52" />
        </radialGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
          <feOffset dx="1" dy="1" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.3" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      {/* Outer Hexagon Frame (3D look) */}
      <path 
        d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z" 
        fill="white" 
        stroke="#FA3D67" 
        strokeWidth="3"
        strokeLinejoin="round"
      />
      
      {/* Circuit board paths */}
      <path d="M25 30 L35 30 L35 20" stroke="#FA3D67" strokeWidth="1.5" fill="none" opacity="0.6" />
      <circle cx="25" cy="30" r="2" fill="#FA3D67" opacity="0.6" />
      <path d="M75 70 L65 70 L65 80" stroke="#FA3D67" strokeWidth="1.5" fill="none" opacity="0.6" />
      <circle cx="75" cy="70" r="2" fill="#FA3D67" opacity="0.6" />
      
      {/* Binary bits placeholders */}
      <text x="35" y="20" fontSize="8" fontWeight="900" fill="#FA3D67" opacity="0.4" fontFamily="monospace">0111</text>
      <text x="60" y="85" fontSize="8" fontWeight="900" fill="#FA3D67" opacity="0.4" fontFamily="monospace">0110</text>
      
      {/* The Ball */}
      <circle cx="50" cy="50" r="28" fill="url(#ballGrad)" filter="url(#shadow)" />
      
      {/* Highlight on ball */}
      <ellipse cx="40" cy="40" rx="8" ry="5" fill="white" opacity="0.3" transform="rotate(-30 40 40)" />
      
      {/* Number Circle */}
      <circle cx="45" cy="45" r="12" fill="white" />
      <text x="45" y="50" fontSize="16" fontWeight="900" textAnchor="middle" fill="#1e1e1e" fontFamily="Arial">6</text>
    </svg>
    <div className="flex flex-col items-center -mt-2">
      <span className="text-[12px] font-black text-gray-900 tracking-tighter">Team 6</span>
      <span className="text-[7px] font-bold text-gray-400 uppercase tracking-widest">Samokat Dev</span>
    </div>
  </div>
);

const ProfileScreen: React.FC = () => {
  const { profile, courierStatus } = useApp();

  const isInCFZ = courierStatus === CourierStatus.IN_CFZ;

  return (
    <div className="p-6">
      <div className="bg-white squircle shadow-sm p-8 flex flex-col items-center text-center mb-6 border border-gray-50">
        {/* Avatar with Gradient Border and Shield */}
        <div className="relative mb-6">
          <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-[#FA3D67] to-[#FF8FA7]">
            <img 
              src={profile.photo} 
              alt={profile.name} 
              className="w-full h-full rounded-full border-4 border-white shadow-sm object-cover" 
            />
          </div>
          <div className="absolute bottom-1 right-1 bg-[#FA3D67] border-[3px] border-white w-8 h-8 rounded-full flex items-center justify-center shadow-md">
             <ShieldCheck className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Name and Partner Status */}
        <h1 className="text-2xl font-black text-[#1A1C1E] tracking-tight mb-1">
          {profile.name}
        </h1>
        <p className="text-[#94A3B8] text-sm font-medium mb-6">
          Курьер-партнер
        </p>
        
        {/* Status Badge */}
        <div className={`px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
          isInCFZ 
            ? 'bg-green-500 text-white shadow-lg shadow-green-100' 
            : 'bg-gray-100 text-gray-700 border border-gray-200'
        }`}>
          {courierStatus}
        </div>
      </div>

      {/* Info Cards */}
      <div className="space-y-3">
        <div className="bg-white rounded-3xl shadow-sm p-5 flex items-center gap-4 border border-gray-50 transition-all active:scale-[0.98]">
          <div className="bg-gray-100 p-3 rounded-2xl">
            <MapPin className="w-6 h-6 text-gray-400" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Базовый ЦФЗ</h3>
            <p className="text-sm font-bold text-gray-700 leading-tight">{profile.cfzAddress}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-200" />
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-5 flex items-center gap-4 border border-gray-100 opacity-60">
           <div className="bg-gray-50 p-3 rounded-2xl">
              <div className="w-6 h-6 border-2 border-gray-300 rounded-lg flex items-center justify-center text-[10px] font-black text-gray-300">%</div>
           </div>
           <div className="flex-1 text-left">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Статистика смены</h3>
              <p className="text-sm font-bold text-gray-400">В разработке</p>
           </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="mt-12 text-center flex flex-col items-center gap-4">
        <Team6Logo size={90} />
        <div className="space-y-1">
          <p className="text-[11px] text-gray-800 font-black uppercase tracking-[0.05em]">
            Версия V.0.0.5
          </p>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
            Команда 6 BA CAMP
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
