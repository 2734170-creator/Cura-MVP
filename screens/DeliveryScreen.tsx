
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, MapPin, ChevronRight, PackageCheck, Package, CheckCircle2, XCircle } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { Order, OrderStatus, CourierStatus } from '../types';

const DeliveryScreen: React.FC = () => {
  const { orders, courierStatus, acceptOrders, returnToCFZ, returnTimeLeft } = useApp();
  const navigate = useNavigate();

  // Показываем все заказы в списке
  const allOrders = orders;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const isReadyToAccept = orders.some((o: Order) => o.status === OrderStatus.READY) && 
                         orders.every((o: Order) => o.status !== OrderStatus.ASSEMBLY && o.status !== OrderStatus.TRANSFERRED_TO_COURIER);

  const getCardStyles = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.DELIVERED:
      case OrderStatus.RETURNED_TO_CFZ:
        // Фон плашки блока задания - зеленый для успешно закрытых или возвращенных в ЦФЗ
        return 'bg-[#E8F5E9] border-green-100 shadow-none';
      case OrderStatus.CANCELLED:
        // Фон плашки блока задания - желтый для отмененных
        return 'bg-[#FFF9C4] border-yellow-100 shadow-none';
      default:
        return 'bg-white border-gray-100 shadow-sm active:bg-gray-50';
    }
  };

  const getStatusBadgeStyles = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.DELIVERED:
      case OrderStatus.RETURNED_TO_CFZ:
        return 'bg-green-600 text-white';
      case OrderStatus.CANCELLED:
        return 'bg-yellow-600 text-white';
      case OrderStatus.READY:
        return 'bg-brand text-white animate-pulse';
      default:
        return 'bg-gray-100 text-gray-500';
    }
  };

  return (
    <div className="p-4 space-y-4 pb-32">
      <header className="py-6 px-2">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">
          Задания
        </h1>
        {courierStatus === CourierStatus.RETURN_TO_CFZ && (
          <div className="mt-4 bg-red-50 text-red-600 px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest border border-red-100">
            Возврат в ЦФЗ: {formatTime(returnTimeLeft)}
          </div>
        )}
        {courierStatus === CourierStatus.IN_CFZ && allOrders.some(o => o.returnProcessStartedAt) && (
          <div className="mt-4 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest border border-blue-100">
            Идет приемка возвратов...
          </div>
        )}
      </header>

      {allOrders.length === 0 && courierStatus !== CourierStatus.RETURN_TO_CFZ && (
        <div className="flex flex-col items-center justify-center py-20 opacity-40">
           <Package className="w-16 h-16 text-gray-300 mb-4" />
           <p className="font-bold text-gray-400">Активных заказов нет</p>
        </div>
      )}

      <div className="space-y-4">
        {allOrders.map((order) => {
          const isFinished = order.status === OrderStatus.DELIVERED || 
                             order.status === OrderStatus.CANCELLED || 
                             order.status === OrderStatus.RETURNED_TO_CFZ;
          
          return (
            <div 
              key={order.id} 
              onClick={() => navigate(`/order/${order.id}`)}
              className={`rounded-3xl p-6 border transition-all cursor-pointer ${getCardStyles(order.status)}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className={`text-[9px] font-black px-2 py-1 rounded uppercase tracking-wider ${getStatusBadgeStyles(order.status)}`}>
                    {order.status}
                  </span>
                  <div className="text-xs font-bold text-gray-400 mt-2">#{order.id}</div>
                </div>
                {!isFinished && (
                  <div className="text-right">
                    <div className={`text-sm font-black flex items-center gap-1 ${order.deliveryTimeLeft < 300 ? 'text-red-500' : 'text-gray-800'}`}>
                      <Clock className="w-4 h-4" />
                      {formatTime(order.deliveryTimeLeft)}
                    </div>
                  </div>
                )}
                {(order.status === OrderStatus.DELIVERED || order.status === OrderStatus.RETURNED_TO_CFZ) && (
                  <CheckCircle2 className="w-6 h-6 text-green-600 opacity-40" />
                )}
                {order.status === OrderStatus.CANCELLED && (
                  <XCircle className="w-6 h-6 text-yellow-700 opacity-40" />
                )}
              </div>

              <div className="flex items-start gap-3">
                <MapPin className={`w-5 h-5 shrink-0 mt-0.5 ${isFinished ? 'text-gray-400' : 'text-brand'}`} />
                <div>
                  <p className={`text-base font-bold leading-tight text-gray-800`}>
                    {order.address}
                  </p>
                  <p className="text-[10px] font-medium text-gray-400 mt-1 uppercase">Этаж {order.floor}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-black/5 flex justify-between items-center">
                 <span className={`text-[10px] font-bold uppercase tracking-widest ${isFinished ? 'text-gray-500' : 'text-gray-400'}`}>
                   {order.items.length} товара
                 </span>
                 <ChevronRight className={`w-4 h-4 ${isFinished ? 'text-gray-400' : 'text-gray-200'}`} />
              </div>
            </div>
          );
        })}
      </div>

      {isReadyToAccept && courierStatus !== CourierStatus.DELIVERY && (
        <div className="fixed bottom-24 left-0 right-0 px-6 max-w-md mx-auto z-30">
          <button 
            onClick={(e) => { e.stopPropagation(); acceptOrders(); }}
            className="w-full bg-brand text-white font-black py-5 rounded-2xl shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            <PackageCheck className="w-6 h-6" />
            <span className="text-lg uppercase">Принять заказы</span>
          </button>
        </div>
      )}

      {courierStatus === CourierStatus.RETURN_TO_CFZ && (
        <div className="fixed bottom-24 left-0 right-0 px-6 max-w-md mx-auto z-30">
          <button 
            onClick={returnToCFZ}
            className="w-full bg-gray-900 text-white font-black py-5 rounded-2xl shadow-xl active:scale-95 transition-all uppercase tracking-tight text-lg"
          >
            Я в ЦФЗ
          </button>
        </div>
      )}
    </div>
  );
};

export default DeliveryScreen;
