
import { Order, OrderStatus } from './types';

// Полная валидная base64 строка изображения Angry Pingu
export const PINGU_AVATAR_BASE64 = 'data:image/jpeg;base64,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';

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
