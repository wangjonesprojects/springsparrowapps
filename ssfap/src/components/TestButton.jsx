/**
 * ============================================================================
 * SPRING SPARROW FINANCIAL ADVISOR (SSFAP)
 * ============================================================================
 * 
 * Component: TestButton
 * Version: 1.0.0
 * Last Updated: 2026-02-14
 * 
 * PURPOSE:
 * Simple test button to verify Firestore connection works. Adds a sample
 * booking to Firebase when clicked. Will be removed once real forms are built.
 * 
 * ============================================================================
 */

import { useState } from 'react';
import { signInAnonymously } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { addBooking } from '../services/firebase/firestoreService';

function TestButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAddTestBooking = async () => {
    setLoading(true);
    setMessage('');

    try {
      // Firestore requires an authenticated user (Security Rules).
      // Sign in anonymously so request.auth.uid exists, then write to that user's collection.
      let user = auth.currentUser;
      if (!user) {
        const cred = await signInAnonymously(auth);
        user = cred.user;
      }
      const userId = user.uid;

      // Test booking data
      const testBooking = {
        unitId: 'robins-roost',
        type: 'STR',
        checkIn: new Date('2026-03-15'),
        checkOut: new Date('2026-03-18'),
        nights: 3,
        grossPayout: 450,
        platform: 'Airbnb',
        platformFee: 67.50,
        cleaningCost: 150,
        netIncome: 232.50,
        month: '2026-03',
      };

      const bookingId = await addBooking(userId, testBooking);
      setMessage(`✅ Success! Booking added with ID: ${bookingId}`);
      console.log('Booking added:', bookingId);
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
      console.error('Error adding booking:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
      <h2 className="text-lg font-semibold text-neutral-900 mb-4">
        🧪 Firebase Test
      </h2>
      
      <button
        onClick={handleAddTestBooking}
        disabled={loading}
        className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-300 text-white rounded-lg font-medium transition-colors"
      >
        {loading ? 'Adding...' : 'Add Test Booking to Firebase'}
      </button>

      {message && (
        <p className={`mt-3 text-sm ${
          message.includes('Success') ? 'text-success-600' : 'text-danger-600'
        }`}>
          {message}
        </p>
      )}
    </div>
  );
}

export default TestButton;