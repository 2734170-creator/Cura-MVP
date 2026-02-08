
import { Order, OrderStatus } from './types';

export const SLA_TOTAL_SECONDS = 15 * 60;
export const MAX_ASSEMBLY_SECONDS = 60; 

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-6737',
    address: 'СПб, Невский пр. д. 3, кв. 42',
    floor: '5',
    comment: 'Заранее позвонить, звонка нет, стучите',
    status: OrderStatus.ASSEMBLY,
    assemblyTimeLeft: 20, 
    deliveryTimeLeft: 840, 
    items: [
      { id: '1', name: 'Молоко 3.2%', quantity: 2 },
      { id: '2', name: 'Хлеб пшеничный', quantity: 1 },
      { id: '3', name: 'Яблоки Голден', quantity: 3 }
    ]
  },
  {
    id: 'ORD-6742',
    address: 'СПб, Невский пр. д. 5, кв. 15',
    floor: '12',
    comment: 'Оставить у двери',
    status: OrderStatus.ASSEMBLY,
    assemblyTimeLeft: 35,
    deliveryTimeLeft: 900, 
    items: [
      { id: '4', name: 'Вода 0,5л', quantity: 2 },
      { id: '5', name: 'Творог 5%', quantity: 1 }
    ]
  }
];

export const CANCEL_REASONS = [
  'Клиента нет дома',
  'Клиент отказался от заказа',
  'Неверный адрес',
  'Не открывает / не отвечает',
  'Брак (обнаружен при выдаче клиенту)',
  'Другое'
];

export const SUPPORT_THEMES = [
  'Вопросы по заказу',
  'Вопросы по оплате',
  'Проблема с приложением',
  'Проблема на маршруте',
  'Другое'
];
