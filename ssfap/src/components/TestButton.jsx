/**
 * ============================================================================
 * SPRING SPARROW FINANCIAL ADVISOR (SSFAP)
 * ============================================================================
 *
 * Component: TestButton
 * Version: 2.1.0
 * Last Updated: 2026-02-15
 *
 * PURPOSE:
 * Firebase test card with sign-in, test booking, reset data, and DEMO MODE.
 * Demo mode loads realistic mock data to show Tie how the app will work.
 *
 * ============================================================================
 */

import { useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig.js';
import { addBooking, deleteAllBookings } from '../services/firebase/firestoreService.js';

function TestButton() {
  const [user, setUser] = useState(auth.currentUser);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) setMessage('');
    });
    return () => unsub();
  }, []);

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setMessage('❌ Enter email and password');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      setMessage('✅ Signed in');
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setMessage('');
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      setMessage('✅ Signed in with Google');
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    signOut(auth);
    setMessage('');
  };

  const handleAddTestBooking = async () => {
    if (!user) {
      setMessage('❌ Sign in first');
      return;
    }
    setLoading(true);
    setMessage('');

    try {
      const userId = user.uid;
      const testBooking = {
        unitId: 'robins-roost',
        type: 'STR',
        checkIn: new Date('2026-01-15'),
        checkOut: new Date('2026-01-18'),
        nights: 3,
        grossPayout: 450,
        platform: 'Airbnb',
        platformFee: 67.50,
        cleaningCost: 150,
        netIncome: 232.50,
        month: '2026-01',
      };

      const bookingId = await addBooking(userId, testBooking);
      setMessage(`✅ Success! Booking added with ID: ${bookingId}`);
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
      console.error('Error adding booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetData = async () => {
    if (!user) {
      setMessage('❌ Sign in first');
      return;
    }

    const confirmed = window.confirm(
      '⚠️ WARNING: This will DELETE ALL bookings!\n\nAre you sure you want to reset to zero?'
    );
    
    if (!confirmed) return;

    setLoading(true);
    setMessage('');

    try {
      const count = await deleteAllBookings(user.uid);
      setMessage(`✅ Deleted ${count} bookings. Refreshing...`);
      
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
      console.error('Error resetting data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMockData = async () => {
    if (!user) {
      setMessage('❌ Sign in first');
      return;
    }

    const confirmed = window.confirm(
      '🎬 DEMO MODE\n\nThis will load realistic mock data to show Tie how the app works!\n\n6 bookings total\n\nContinue?'
    );
    
    if (!confirmed) return;

    setLoading(true);
    setMessage('Loading demo data...');

    try {
      const userId = user.uid;
      
      console.log('🎬 Starting mock data load...');
      
      // HARDCODED MOCK DATA
      const mockBookings = [
        {
          unitId: 'robins-roost',
          type: 'STR',
          checkIn: new Date('2026-01-03'),
          checkOut: new Date('2026-01-06'),
          nights: 3,
          grossPayout: 420,
          platform: 'Airbnb',
          platformFee: 63,
          cleaningCost: 150,
          netIncome: 207,
          month: '2026-01',
        },
        {
          unitId: 'robins-roost',
          type: 'STR',
          checkIn: new Date('2026-01-10'),
          checkOut: new Date('2026-01-14'),
          nights: 4,
          grossPayout: 560,
          platform: 'Vrbo',
          platformFee: 84,
          cleaningCost: 150,
          netIncome: 326,
          month: '2026-01',
        },
        {
          unitId: 'robins-roost',
          type: 'STR',
          checkIn: new Date('2026-01-20'),
          checkOut: new Date('2026-01-25'),
          nights: 5,
          grossPayout: 700,
          platform: 'Airbnb',
          platformFee: 105,
          cleaningCost: 150,
          netIncome: 445,
          month: '2026-01',
        },
        {
          unitId: 'doves-den',
          type: 'MTR',
          checkIn: new Date('2026-01-01'),
          checkOut: new Date('2026-01-31'),
          nights: 30,
          grossPayout: 2400,
          platform: 'Furnished Finder',
          platformFee: 240,
          cleaningCost: 350,
          netIncome: 1810,
          baseMonthlyRent: 2000,
          damageProtection: 80,
          hasPets: true,
          petCount: 1,
          petFeePerMonth: 50,
          petDeposit: 250,
          securityDeposit: 500,
          month: '2026-01',
        },
        {
          unitId: 'stadium-district',
          type: 'STR',
          checkIn: new Date('2026-01-08'),
          checkOut: new Date('2026-01-11'),
          nights: 3,
          grossPayout: 390,
          platform: 'Airbnb',
          platformFee: 58.50,
          cleaningCost: 150,
          netIncome: 181.50,
          month: '2026-01',
        },
        {
          unitId: 'stadium-district',
          type: 'STR',
          checkIn: new Date('2026-01-15'),
          checkOut: new Date('2026-01-25'),
          nights: 10,
          grossPayout: 1300,
          platform: 'Airbnb',
          platformFee: 195,
          cleaningCost: 150,
          netIncome: 955,
          month: '2026-01',
        },
      ];

      console.log('✅ Mock bookings ready:', mockBookings);

      // Add all mock bookings to Firebase
      let addedCount = 0;
      for (const booking of mockBookings) {
        console.log(`➕ Adding booking ${addedCount + 1}/${mockBookings.length}...`);
        const bookingId = await addBooking(userId, booking);
        console.log(`✅ Added booking with ID: ${bookingId}`);
        addedCount++;
      }

      console.log(`🎉 SUCCESS! Added ${addedCount} bookings total!`);
      setMessage(`✅ Demo data loaded! ${addedCount} bookings added. Refreshing...`);
      
      setTimeout(() => {
        console.log('🔄 Reloading page...');
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('❌ ERROR loading mock data:', error);
      console.error('Error details:', error.message);
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
      <h2 className="text-lg font-semibold text-neutral-900 mb-4">
        🧪 Firebase Test
      </h2>

      {!user ? (
        <>
          <p className="text-sm text-neutral-600 mb-4 p-[5px]">
            Sign in with Email or Google so test data is saved to your account.
          </p>
          <form onSubmit={handleEmailSignIn} className="space-y-3 mb-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-sm"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full px-5 py-3.5 bg-blue-100 border-2 border-blue-600 text-blue-900 hover:bg-blue-200 disabled:bg-neutral-100 disabled:border-neutral-300 disabled:text-neutral-500 rounded-lg font-medium text-sm transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign in with Email'}
            </button>
          </form>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full px-5 py-3.5 bg-blue-100 border-2 border-blue-600 text-blue-900 hover:bg-blue-200 rounded-lg font-medium text-sm transition-colors"
          >
            Sign in with Google
          </button>
        </>
      ) : (
        <>
          <p className="text-sm text-neutral-600 mb-4 p-[5px]">
            Signed in as <strong>{user.email || user.uid}</strong>
          </p>
          <div className="space-y-3">
            {/* Add Test Booking Button */}
            <button
              onClick={handleAddTestBooking}
              disabled={loading}
              className="w-full px-5 py-3.5 bg-blue-100 border-2 border-blue-600 text-blue-900 hover:bg-blue-200 disabled:bg-neutral-100 disabled:border-neutral-300 disabled:text-neutral-500 rounded-lg font-medium transition-colors"
            >
              {loading ? 'Adding...' : 'Add Test Booking to Firebase'}
            </button>

            {/* Load Mock Data Button */}
            <button
              onClick={handleLoadMockData}
              disabled={loading}
              className="w-full px-5 py-3.5 bg-green-100 border-2 border-green-600 text-green-900 hover:bg-green-200 disabled:bg-neutral-100 disabled:border-neutral-300 disabled:text-neutral-500 rounded-lg font-medium transition-colors"
            >
              {loading ? 'Loading...' : '🎬 Load Mock Data (Demo for Tie)'}
            </button>

            {/* Reset All Bookings Button */}
            <button
              onClick={handleResetData}
              disabled={loading}
              className="w-full px-5 py-3.5 bg-danger-100 border-2 border-danger-600 text-danger-900 hover:bg-danger-200 disabled:bg-neutral-100 disabled:border-neutral-300 disabled:text-neutral-500 rounded-lg font-medium transition-colors"
            >
              {loading ? 'Resetting...' : '🔄 Reset All Bookings (Start Fresh)'}
            </button>

            {/* Sign Out Button */}
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full px-5 py-3.5 bg-violet-100 border-2 border-violet-600 text-violet-900 hover:bg-violet-200 rounded-lg text-sm font-medium transition-colors"
            >
              Sign out
            </button>
          </div>
        </>
      )}

      {message && (
        <p
          className={`mt-[30px] text-sm p-[5px] ${
            message.includes('Success') || message.includes('Signed in') || message.includes('Deleted') || message.includes('Demo data')
              ? 'text-success-600'
              : 'text-danger-600'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}

export default TestButton;