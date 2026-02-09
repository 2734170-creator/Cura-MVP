
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Order, OrderStatus, CourierStatus, CourierProfile, SupportTicket } from '../types';
import { MOCK_ORDERS, PINGU_AVATAR_BASE64 } from '../constants';

interface AppContextType {
  orders: Order[];
  courierStatus: CourierStatus;
  profile: CourierProfile;
  tickets: SupportTicket[];
  returnTimeLeft: number;
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  setCourierStatus: (status: CourierStatus) => void;
  addTicket: (ticket: SupportTicket) => void;
  acceptOrders: () => void;
  finishOrder: (id: string) => void;
  cancelOrder: (id: string, reason: string) => void;
  returnToCFZ: () => void;
  notification: string | null;
  setNotification: (msg: string | null) => void;
  restartApp: () => void;
  addNewOrder: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'TKT-1204',
    createdAt: Date.now() - 86400000,
    date: new Date(Date.now() - 86400000).toLocaleString('ru-RU'),
    subject: 'Вопросы по оплате',
    status: 'Решено',
    statusDate: new Date(Date.now() - 43200000).toLocaleString('ru-RU'),
    text: 'Здравствуйте! Не пришла доплата за тяжелый заказ ORD-5521.',
    answer: 'Добрый день! Доплата начислена, отобразится в следующем отчете. Приносим извинения за задержку.'
  },
  {
    id: 'TKT-1288',
    createdAt: Date.now() - 3600000,
    date: new Date(Date.now() - 3600000).toLocaleString('ru-RU'),
    subject: 'Проблема с приложением',
    status: 'На рассмотрении',
    statusDate: new Date(Date.now() - 3600000).toLocaleString('ru-RU'),
    text: 'Приложение вылетает при попытке прикрепить фото в чат.'
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [courierStatus, setCourierStatus] = useState<CourierStatus>(CourierStatus.IN_CFZ);
  const [returnTimeLeft, setReturnTimeLeft] = useState<number>(600);
  const [profile] = useState<CourierProfile>({
    name: 'Иван Курьеров',
    // Используем base64 строку, сохраненную в константах
    photo: PINGU_AVATAR_BASE64,
    cfzAddress: 'СПб, Дворцовая пл. д. 1'
  });
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    const timer = setInterval(() => {
      setOrders(prev => {
        const now = Date.now();
        return prev.map(order => {
          if ([OrderStatus.ASSEMBLY, OrderStatus.READY, OrderStatus.TRANSFERRED_TO_COURIER].includes(order.status)) {
            const nextDeliveryTime = Math.max(0, order.deliveryTimeLeft - 1);
            let nextStatus = order.status;
            let nextAssemblyTime = order.assemblyTimeLeft;
            if (order.status === OrderStatus.ASSEMBLY) {
              nextAssemblyTime = Math.max(0, order.assemblyTimeLeft - 1);
              if (nextAssemblyTime === 0) {
                nextStatus = OrderStatus.READY;
                setNotification(`Заказ ${order.id} готов к выдаче!`);
              }
            }
            return { ...order, status: nextStatus, assemblyTimeLeft: nextAssemblyTime, deliveryTimeLeft: nextDeliveryTime };
          }
          if (order.returnProcessStartedAt) {
            const elapsed = (now - order.returnProcessStartedAt) / 1000;
            if (order.status === OrderStatus.CANCELLED && elapsed >= 15) {
              return { ...order, status: OrderStatus.RETURNED_TO_CFZ };
            }
            if (order.status === OrderStatus.RETURNED_TO_CFZ && elapsed >= 25) {
              return null as any;
            }
          }
          return order;
        }).filter(Boolean);
      });
      if (courierStatus === CourierStatus.RETURN_TO_CFZ) {
        setReturnTimeLeft(t => Math.max(0, t - 1));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [courierStatus]);

  useEffect(() => {
    const activeOrders = orders.filter(o => [OrderStatus.ASSEMBLY, OrderStatus.READY].includes(o.status));
    if (activeOrders.length > 0 && courierStatus === CourierStatus.IN_CFZ) {
      setCourierStatus(CourierStatus.DELIVERY_ASSIGNED);
      setNotification("Назначена доставка");
    }
  }, [orders, courierStatus]);

  const restartApp = useCallback(() => {
    setOrders(MOCK_ORDERS);
    setCourierStatus(CourierStatus.IN_CFZ);
    setNotification(null);
  }, []);

  const addNewOrder = useCallback(() => {
    if (courierStatus !== CourierStatus.IN_CFZ) {
      setNotification("Новое задание можно назначить только находясь в ЦФЗ");
      return;
    }

    const house = Math.floor(Math.random() * 24) + 1;
    const apt = Math.floor(Math.random() * 99) + 1;
    const floor = Math.floor(Math.random() * 9) + 1;
    
    const newOrder: Order = {
      id: `ORD-${Math.floor(7000 + Math.random() * 1000)}`,
      address: `СПб, Невский пр. д. ${house}, кв. ${apt}`,
      floor: floor.toString(),
      comment: 'Новый заказ из панели управления',
      status: OrderStatus.ASSEMBLY,
      assemblyTimeLeft: 10,
      deliveryTimeLeft: 900,
      items: [
        { id: `new-${Date.now()}-1`, name: 'Молоко фермерское', quantity: 1 },
        { id: `new-${Date.now()}-2`, name: 'Печенье овсяное', quantity: 1 }
      ]
    };
    setOrders(prev => [...prev, newOrder]);
    setNotification(`Назначена доставка: ${newOrder.id}`);
  }, [courierStatus]);

  const checkReturnToCFZ = useCallback(() => {
     setTimeout(() => {
        setOrders(current => {
            const stillActive = current.some(o => [OrderStatus.ASSEMBLY, OrderStatus.READY, OrderStatus.TRANSFERRED_TO_COURIER].includes(o.status));
            if (!stillActive) {
                setCourierStatus(CourierStatus.RETURN_TO_CFZ);
                setReturnTimeLeft(600);
            }
            return current;
        });
     }, 100);
  }, []);

  const acceptOrders = useCallback(() => {
    setOrders(prev => prev.map(o => o.status === OrderStatus.READY ? { ...o, status: OrderStatus.TRANSFERRED_TO_COURIER } : o));
    setCourierStatus(CourierStatus.DELIVERY);
  }, []);

  const finishOrder = useCallback((id: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: OrderStatus.DELIVERED, deliveredAt: new Date() } : o));
    checkReturnToCFZ();
  }, [checkReturnToCFZ]);

  const cancelOrder = useCallback((id: string, reason: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: OrderStatus.CANCELLED, cancelReason: reason } : o));
    checkReturnToCFZ();
  }, [checkReturnToCFZ]);

  const returnToCFZ = useCallback(() => {
    const startTime = Date.now();
    setCourierStatus(CourierStatus.IN_CFZ);
    setOrders(prev => prev
      .filter(o => o.status === OrderStatus.CANCELLED)
      .map(o => ({ ...o, returnProcessStartedAt: startTime }))
    );
  }, []);

  const addTicket = (ticket: SupportTicket) => setTickets(prev => [ticket, ...prev]);

  return (
    <AppContext.Provider value={{ 
      orders, courierStatus, profile, tickets, returnTimeLeft,
      setOrders, setCourierStatus, addTicket, acceptOrders, finishOrder, cancelOrder, returnToCFZ,
      notification, setNotification, restartApp, addNewOrder
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
