/**
 * ============================================================================
 * SPRING SPARROW FINANCIAL ADVISOR (SSFAP)
 * ============================================================================
 * 
 * Component: App (Main Dashboard)
 * Version: 1.2.0
 * Last Updated: 2026-02-15
 * 
 * PURPOSE:
 * Main dashboard showing Spring Sparrow LLC's financial health at a glance.
 * Displays CapEx reserves, monthly income, unit performance, and action items.
 * 
 * BUSINESS CONTEXT:
 * This is Keeya's command center for managing 3 rental units (Robin's Roost,
 * Dove's Den, Stadium District). Shows real-time financial position to make
 * strategic decisions: MTR vs STR, when to spend, distribution timing.
 * 
 * CHANGELOG v1.2.0:
 * - Added STR vs MTR breakdown modal
 * - Fixed action items priority indicators (red, yellow, yellow)
 * - Updated action item text with Financial Therapist note
 * - All images working (imported from src/assets)
 * - Mock data integration ready for Tie demo
 * 
 * CHANGELOG v1.1.0:
 * - Added property thumbnail images (Airbnb-style)
 * - Replaced emoji with Lucide React icons
 * - Connected Firebase real-time data fetching
 * - Fixed regression: Jan 2026 (was March), Dec 31 target (was May 1)
 * - Fixed regression: $0/day calculations (was $217/day)
 * - Updated CTAs to light blue style (bg-blue-100, border-blue-600)
 * - Reset all data to zero for fresh January 2026 entry
 * - Added loading/error states for better UX
 * 
 * ============================================================================
 */

import { useState, useEffect } from 'react';
import TestButton from './components/TestButton';
import BookingForm from './components/BookingForm';
import BreakdownModal from './components/BreakdownModal';
import { Home, TrendingUp, Gem, DollarSign, Zap } from 'lucide-react';
import { getBookingsByMonth, getCurrentMonth } from './services/firebase/firestoreService';
import robinsRoostImg from './assets/robinsroost_thumbnail.png';
import dovesDenImg from './assets/doveden_thumbnail.png';
import stadiumDistrictImg from './assets/stadiumdistrict_thumbnail.png';

function App() {
  // ========================================================================
  // STATE - Real data from Firebase
  // ========================================================================
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Booking form modal state
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  
  // Breakdown modal state
  const [showBreakdown, setShowBreakdown] = useState(false);
  
  // Hardcoded user ID for now (will add auth later)
  const userId = 'B52ye9yyQ0QINoHdEe4nH5niDef2';
  const currentMonth = getCurrentMonth();
  
  // ========================================================================
  // FETCH DATA FROM FIREBASE
  // ========================================================================
  
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Get current month's bookings
        const monthBookings = await getBookingsByMonth(userId, currentMonth);
        setBookings(monthBookings);
        
        console.log('Loaded bookings:', monthBookings);
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [userId, currentMonth]);
  
  // ========================================================================
  // CALCULATE METRICS FROM REAL DATA
  // ========================================================================
  
  // Calculate total income from bookings
  const totalIncome = bookings.reduce((sum, booking) => sum + booking.netIncome, 0);
  
  // Count nights by unit
  const unitNights = bookings.reduce((acc, booking) => {
    if (!acc[booking.unitId]) acc[booking.unitId] = 0;
    acc[booking.unitId] += booking.nights;
    return acc;
  }, {});
  
  // ========================================================================
  // MOCK DATA (still using for some metrics until we build more)
  // ========================================================================
  
  const capexReserve = {
    current: 0,
    target: 20000,
    percentage: 0,
  };
  
  const monthlyIncome = {
    current: totalIncome,
    target: 11721,
    percentage: Math.round((totalIncome / 11721) * 100),
  };
  
  const units = [
    {
      id: 'robins-roost',
      name: "Robin's Roost",
      image: robinsRoostImg,
      nights: unitNights['robins-roost'] || 0,
      target: 15,
      netIncome: bookings
        .filter(b => b.unitId === 'robins-roost')
        .reduce((sum, b) => sum + b.netIncome, 0),
      status: (unitNights['robins-roost'] || 0) >= 15 ? 'success' : 'warning',
    },
    {
      id: 'doves-den',
      name: "Dove's Den",
      image: dovesDenImg,
      nights: unitNights['doves-den'] || 0,
      target: 15,
      netIncome: bookings
        .filter(b => b.unitId === 'doves-den')
        .reduce((sum, b) => sum + b.netIncome, 0),
      status: (unitNights['doves-den'] || 0) >= 15 ? 'success' : 'warning',
    },
    {
      id: 'stadium-district',
      name: 'Stadium District',
      image: stadiumDistrictImg,
      nights: unitNights['stadium-district'] || 0,
      target: 18,
      netIncome: bookings
        .filter(b => b.unitId === 'stadium-district')
        .reduce((sum, b) => sum + b.netIncome, 0),
      status: (unitNights['stadium-district'] || 0) >= 18 ? 'success' : 'warning',
    },
  ];
  
  const distributions = {
    total: 0,
    keeya: 0,
    tie: 0,
  };
  
  const actionItems = [
    { text: 'Push Robin bookings', priority: 'high' },
    { text: 'Stadium MTR decision', priority: 'medium' },
    { text: 'Electrical repair pending - Talked with Financial Therapist', priority: 'medium' },
  ];

  // ========================================================================
  // HELPER FUNCTIONS
  // ========================================================================
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-success-600';
      case 'warning': return 'text-warning-600';
      case 'danger': return 'text-danger-600';
      default: return 'text-neutral-600';
    }
  };

  const handleAddBooking = (unitId) => {
    setSelectedUnit(unitId);
    setShowBookingForm(true);
  };

  const handleBookingSuccess = () => {
    setShowBookingForm(false);
    setSelectedUnit(null);
    // Refresh data
    window.location.reload();
  };

  // ========================================================================
  // LOADING & ERROR STATES
  // ========================================================================
  
  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔄</div>
          <p className="text-neutral-600">Loading your financial data...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-danger-600 font-semibold mb-2">Error loading data</p>
          <p className="text-neutral-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // ========================================================================
  // RENDER
  // ========================================================================
  
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-neutral-900">
            Spring Sparrow
          </h1>
          <p className="text-sm text-neutral-600 mt-1">Jan 2026</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        
        {/* Top Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* CapEx Reserve Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Gem className="w-5 h-5 text-primary-600" />
                <h2 className="text-lg font-semibold text-neutral-900">
                  CapEx Reserve
                </h2>
              </div>
              <span className="text-sm text-neutral-400 font-medium">
                Not started
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold text-neutral-900">
                  {formatCurrency(capexReserve.current)}
                </span>
                <span className="text-sm text-neutral-600">
                  / {formatCurrency(capexReserve.target)}
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-neutral-200 rounded-full h-3">
                <div 
                  className="bg-success-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${capexReserve.percentage}%` }}
                />
              </div>
              
              <p className="text-sm text-neutral-600">
                {capexReserve.percentage}% • Target: Dec 31, 2026
              </p>
            </div>
          </div>
          
          {/* Monthly Income Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary-600" />
                <h2 className="text-lg font-semibold text-neutral-900">
                  Jan Net Income
                </h2>
              </div>
              <span className="text-sm text-neutral-400 font-medium">
                No data yet
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold text-neutral-900">
                  {formatCurrency(monthlyIncome.current)}
                </span>
                <span className="text-sm text-neutral-600">
                  / {formatCurrency(monthlyIncome.target)}
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-neutral-200 rounded-full h-3">
                <div 
                  className="bg-neutral-300 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${monthlyIncome.percentage}%` }}
                />
              </div>
              
              <p className="text-sm text-neutral-600">
                {monthlyIncome.percentage}% • Need $0/day • 0 days left
              </p>
              
              {/* Breakdown Link - Shows when data exists */}
              {bookings.length > 0 && (
                <button
                  onClick={() => setShowBreakdown(true)}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  View STR vs MTR Breakdown →
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Units Performance */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Home className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-neutral-900">
              Unit Performance
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {units.map(unit => (
              <div 
                key={unit.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-neutral-200"
              >
                {/* Unit Image */}
                <div className="relative h-48 bg-neutral-100">
                  <img 
                    src={unit.image} 
                    alt={unit.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Unit Info */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-neutral-900">
                      {unit.name}
                    </h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-neutral-600">Nights</span>
                      <span className={`font-semibold ${getStatusColor(unit.status)}`}>
                        {unit.nights} / {unit.target}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-neutral-600">Net Income</span>
                      <span className={`font-semibold ${unit.netIncome >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                        {formatCurrency(unit.netIncome)}
                      </span>
                    </div>
                    
                    <button 
                      onClick={() => handleAddBooking(unit.id)}
                      className="w-full mt-2 px-4 py-2 bg-blue-100 border-2 border-blue-600 text-blue-900 hover:bg-blue-200 rounded-lg text-sm font-medium transition-colors"
                    >
                      + Add Booking
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Row: Distributions + Action Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Distributions */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-primary-600" />
              <h2 className="text-lg font-semibold text-neutral-900">
                Owner Distributions
              </h2>
            </div>
            
            <div className="space-y-3">
              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                <p className="text-sm text-neutral-600 mb-2">Ready to distribute</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {formatCurrency(distributions.total)}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-neutral-50 rounded-lg">
                  <p className="text-xs text-neutral-600 mb-1">Keeya</p>
                  <p className="font-semibold text-neutral-900">
                    {formatCurrency(distributions.keeya)}
                  </p>
                </div>
                <div className="text-center p-3 bg-neutral-50 rounded-lg">
                  <p className="text-xs text-neutral-600 mb-1">Tie</p>
                  <p className="font-semibold text-neutral-900">
                    {formatCurrency(distributions.tie)}
                  </p>
                </div>
              </div>
              
              <button 
                disabled
                className="w-full mt-2 px-4 py-3 bg-neutral-100 border-2 border-neutral-300 text-neutral-500 rounded-lg font-medium cursor-not-allowed"
              >
                No funds to distribute
              </button>
            </div>
          </div>
          
          {/* Action Items */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-primary-600" />
              <h2 className="text-lg font-semibold text-neutral-900">
                Action Items
              </h2>
            </div>
            
            <div className="space-y-3">
              {actionItems.map((item, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  <div className={`w-2 h-2 rounded-full ${
                    item.priority === 'high' ? 'bg-danger-500' :
                    item.priority === 'medium' ? 'bg-warning-500' :
                    'bg-neutral-400'
                  }`} />
                  <span className="text-sm text-neutral-700 flex-1">
                    {item.text}
                  </span>
                  <span className="text-neutral-400">→</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Test Button - TEMPORARY */}
        <TestButton />

        {/* Booking Form Modal */}
        {showBookingForm && (
          <BookingForm
            unitId={selectedUnit}
            onClose={() => setShowBookingForm(false)}
            onSuccess={handleBookingSuccess}
          />
        )}

        {/* Breakdown Modal */}
        {showBreakdown && (
          <BreakdownModal
            bookings={bookings}
            onClose={() => setShowBreakdown(false)}
          />
        )}
      </main>
    </div>
  );
}

export default App;