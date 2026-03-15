/**
 * Admin Account Setup Script
 * 
 * Usage:
 * 1. First, register the account normally in the app
 * 2. Run this script in browser console OR import and call from a setup page
 * 3. Enter the user email when prompted
 * 
 * Once Email/Password is enabled in Firebase, you can:
 * - Register: Sanjay Kumar Vaishya (sanjaykumarvaishya.com@gmail.com, Ankit@9055)
 * - Then run this script to set role to admin
 */

import { doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { db, auth } from './firebase';

export const setupAdminAccount = async (userEmail: string) => {
  try {
    if (!auth.currentUser) {
      console.error('❌ No user logged in');
      return false;
    }

    const uid = auth.currentUser.uid;
    const userRef = doc(db, 'users', uid);
    
    // Check if user exists
    const userSnapshot = await getDoc(userRef);
    
    if (!userSnapshot.exists()) {
      console.error('❌ User document not found');
      return false;
    }

    // Update role to admin
    await updateDoc(userRef, {
      role: 'admin',
      updatedAt: new Date().toISOString(),
    });

    console.log('✅ User promoted to admin successfully!');
    console.log('User Email:', userEmail);
    console.log('UID:', uid);
    console.log('Role: admin');
    
    return true;
  } catch (error) {
    console.error('❌ Error setting up admin:', error);
    return false;
  }
};

/**
 * Browser Console Usage:
 * 
 * Copy-paste in browser console after importing this file:
 * 
 * const email = prompt("Enter user email to promote to admin:");
 * if (email) {
 *   setupAdminAccount(email).then(success => {
 *     if (success) alert('✅ Admin setup complete!');
 *   });
 * }
 */

/**
 * Alternative: Direct Firestore Update (if you have access)
 */
export const promoteUserToAdmin = async (uid: string) => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      role: 'admin',
      promotedAt: new Date().toISOString(),
    });
    console.log(`✅ User ${uid} is now admin`);
    return true;
  } catch (error) {
    console.error('❌ Error promoting user:', error);
    return false;
  }
};
