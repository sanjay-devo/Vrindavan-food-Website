import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDoc, 
  getDocs, 
  onSnapshot, 
  query, 
  where, 
  orderBy,
  getDocFromServer,
  getDocsFromServer,
  limit
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Order, OrderStatus } from '../types';
import { handleFirestoreError, OperationType } from '../utils/firestoreErrorHandler';

export const testConnection = async () => {
  try {
    // Try to fetch a single document from the public menu collection
    const menuRef = collection(db, 'menu');
    const q = query(menuRef, limit(1));
    await getDocsFromServer(q);
    console.log("Firebase connection successful");
  } catch (error) {
    if(error instanceof Error) {
      if (error.message.includes('the client is offline')) {
        console.error("Please check your Firebase configuration. The client is offline.");
      } else {
        console.error("Firebase connection error:", error.message);
      }
    } else {
      console.error("An unknown error occurred during Firebase connection test");
    }
  }
};

export const createOrder = async (orderData: any) => {
  const path = 'orders';
  try {
    return await addDoc(collection(db, path), orderData);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
  const path = `orders/${orderId}`;
  try {
    await updateDoc(doc(db, 'orders', orderId), { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};
