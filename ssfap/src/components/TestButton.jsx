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
 * Simple test card to verify Firestore: sign in with Email or Google, then
 * add a sample booking to your account. Will be removed once real forms exist.
 *
 * Primary dev user UUID (when signed in with real account, data goes here):
 * B52ye9yyQ0QINoHdEe4nH5niDef2
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
import { auth } from '../firebase/firebaseConfig';
import { addBooking, deleteAllBookings } from '../services/firebase/firestoreService';

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
      
      // Auto-refresh after 2 seconds
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
            message.includes('Success') || message.includes('Signed in') || message.includes('Deleted')
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