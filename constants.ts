import { MenuItem } from './types';

export const RESTAURANT_NAME = "Golden Friendship Feast";
export const RESTAURANT_LOCATION = "Divisoria, Cagayan de Oro City";

export const MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: 'Sinuglaw Special',
    description: 'Grilled pork belly (Sinugba) mixed with fresh fish ceviche (Kinilaw). A CDO classic.',
    price: 350,
    category: 'main',
    imageUrl: 'https://picsum.photos/400/300?random=1'
  },
  {
    id: '2',
    name: 'Ostrich Salpicao',
    description: 'Tender ostrich meat sautéed in garlic and olive oil. A local delicacy.',
    price: 580,
    category: 'main',
    imageUrl: 'https://picsum.photos/400/300?random=2'
  },
  {
    id: '3',
    name: 'Chicken Inasal',
    description: 'Grilled chicken marinated in lemongrass, calamansi, and achuete oil.',
    price: 220,
    category: 'main',
    imageUrl: 'https://picsum.photos/400/300?random=3'
  },
  {
    id: '4',
    name: 'Pancit Canton',
    description: 'Stir-fried noodles with fresh vegetables, shrimp, and pork cracklings.',
    price: 280,
    category: 'main',
    imageUrl: 'https://picsum.photos/400/300?random=4'
  },
  {
    id: '5',
    name: 'Pastel de Camiguin',
    description: 'Soft bun filled with sweet yema custard. Perfect for dessert.',
    price: 150,
    category: 'dessert',
    imageUrl: 'https://picsum.photos/400/300?random=5'
  },
  {
    id: '6',
    name: 'Halo-Halo Overload',
    description: 'Shaved ice with ube, leche flan, sweet beans, and fruits.',
    price: 180,
    category: 'dessert',
    imageUrl: 'https://picsum.photos/400/300?random=6'
  },
  {
    id: '7',
    name: 'Calamansi Juice',
    description: 'Freshly squeezed Philippine lime juice with honey.',
    price: 80,
    category: 'drink',
    imageUrl: 'https://picsum.photos/400/300?random=7'
  },
  {
    id: '8',
    name: 'San Miguel Beer',
    description: 'Ice cold local pale pilsen.',
    price: 90,
    category: 'drink',
    imageUrl: 'https://picsum.photos/400/300?random=8'
  }
];
