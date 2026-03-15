/**
 * Realtime Database Initialization Script
 * Run this once to set up the complete database structure
 * 
 * Usage:
 * 1. Import this in App.tsx or main.tsx
 * 2. Call initializeDatabase() once
 * 3. Or run in browser console after importing
 */

import { ref, set, get } from 'firebase/database';
import { rtdb } from '../firebase';

export const initializeDatabase = async () => {
  try {
    console.log('🔄 Initializing Realtime Database structure...');

    const dbRef = ref(rtdb);
    const snapshot = await get(dbRef);

    // Only initialize if database is empty
    if (snapshot.exists()) {
      console.log('✅ Database already initialized');
      return true;
    }

    const initialData = {
      users: {},
      menu: {
        appetizers: {},
        main_courses: {},
        breads: {},
        desserts: {},
        beverages: {},
      },
      categories: {
        appetizers: {
          id: 'appetizers',
          name: 'Appetizers',
          icon: '🥗',
        },
        main_courses: {
          id: 'main_courses',
          name: 'Main Courses',
          icon: '🍛',
        },
        breads: {
          id: 'breads',
          name: 'Breads',
          icon: '🍞',
        },
        desserts: {
          id: 'desserts',
          name: 'Desserts',
          icon: '🍰',
        },
        beverages: {
          id: 'beverages',
          name: 'Beverages',
          icon: '🥤',
        },
      },
      dishes: {
        _sample: {
          id: '_sample',
          name: 'Sample Dish',
          description: 'Sample description',
          price: 0,
          category: 'appetizers',
          image: 'https://via.placeholder.com/400x300',
          available: true,
          preparationTime: 30,
          createdAt: new Date().toISOString(),
        },
      },
      orders: {
        _demo: {
          id: '_demo',
          customerId: 'demo',
          customerName: 'Demo Customer',
          phone: '+91-xxxx-xxxx-xxxx',
          items: [],
          totalPrice: 0,
          orderType: 'dine-in',
          tableNumber: null,
          address: null,
          status: 'pending',
          paymentStatus: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
      tables: {
        table_1: {
          id: 'table_1',
          number: 1,
          capacity: 4,
          status: 'available', // available, occupied, reserved
          qrCode: 'https://via.placeholder.com/200x200',
        },
        table_2: {
          id: 'table_2',
          number: 2,
          capacity: 2,
          status: 'available',
          qrCode: 'https://via.placeholder.com/200x200',
        },
        table_3: {
          id: 'table_3',
          number: 3,
          capacity: 6,
          status: 'available',
          qrCode: 'https://via.placeholder.com/200x200',
        },
      },
      deliveryPartners: {},
      adminSettings: {
        storeName: 'Vrindavan Bargawan',
        description: 'Premium Food Delivery Service',
        phone: '+91-xxx-xxx-xxxx',
        email: 'info@vrindhavanbargawan.com',
        address: 'Your Restaurant Address',
        isOpen: true,
        deliveryCharge: 50,
        minOrderValue: 200,
      },
    };

    await set(ref(rtdb), initialData);
    console.log('✅ Database initialized successfully!');
    console.log('📁 Created folders: users, menu, categories, dishes, orders, tables, deliveryPartners, adminSettings');
    return true;
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    return false;
  }
};

/**
 * Call this in your App.tsx useEffect to auto-initialize
 * 
 * Example:
 * useEffect(() => {
 *   initializeDatabase();
 * }, []);
 */

/**
 * Browser Console Usage:
 * 
 * 1. Open browser console (F12)
 * 2. Go to Application → Local Storage
 * 3. Paste and run in console:
 * 
 * import('./utils/dbInitialize.ts').then(m => m.initializeDatabase());
 */
