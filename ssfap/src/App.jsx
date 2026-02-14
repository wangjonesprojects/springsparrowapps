/**
 * ============================================================================
 * SPRING SPARROW FINANCIAL ADVISOR (SSFAP)
 * ============================================================================
 * 
 * Component: App (Main Dashboard)
 * Version: 1.0.0
 * Last Updated: 2026-02-14
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
 * DATA STATUS: Currently using fake/mock data from Feb 2026. Will connect
 * to Firebase in future iterations.
 * 
 * ============================================================================
 */

import { useState } from 'react';
import TestButton from './components/TestButton';
import BookingForm from './components/BookingForm';
import { Home, TrendingUp, Gem, DollarSign, Zap } from 'lucide-react';

function App() {
  // ========================================================================
  // MOCK DATA (Will be replaced with Firebase data later)
  // ========================================================================

  // Booking form modal state
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  
  const capexReserve = {
    current: 0,
    target: 20000,
    percentage: 0, // (0 / 20000) * 100
  };
  
  const monthlyIncome = {
    current: 0,
    target: 10000,
    percentage: 0,
  };
  
  const units = [
    {
      id: 'robins-roost',
      name: "Robin's Roost",
      emoji: '🏡',
      nights: 0,
      target: 0,
      netIncome: 0,
      status: 'warning', // behind target
    },
    {
      id: 'doves-den',
      name: "Dove's Den",
      emoji: '🕊️',
      nights: 0,
      target: 0,
      netIncome: 0,
      status: 'success', // on track
    },
    {
      id: 'stadium',
      name: 'Stadium District',
      emoji: '🏟️',
      nights: 0,
      target: 0,
      netIncome: 0,
      status: 'warning', // MTR search active
    },
  ];
  
  const distributions = {
    total: 0,
    keeya: 0,
    tie: 0,
  };
  
  const actionItems = [
    { text: 'Push Robin bookings', priority: 'high' },
    { text: 'Stadium MTR decision', priority: 'high' },
    { text: 'Electrical repair pending', priority: 'medium' },
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
  // RENDER
  // ========================================================================
  
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-neutral-900">
            Spring Sparrow, LLC
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
              <span className="text-sm text-success-600 font-medium">
                On track
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
              <span className="text-sm text-warning-600 font-medium">
                Behind pace
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
                  className="bg-warning-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${monthlyIncome.percentage}%` }}
                />
              </div>
              
              <p className="text-sm text-neutral-600">
                {monthlyIncome.percentage}% • Need $0/day • 0 days left
              </p>
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
                className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{unit.emoji}</span>
                    <h3 className="font-semibold text-neutral-900">
                      {unit.name}
                    </h3>
                  </div>
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
              <div className="bg-success-50 border border-success-200 rounded-lg p-4">
                <p className="text-sm text-success-700 mb-2">Ready to distribute</p>
                <p className="text-2xl font-bold text-success-900">
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
              
              <button className="w-full mt-2 px-4 py-3 bg-blue-100 border-2 border-blue-600 text-blue-900 hover:bg-blue-200 rounded-lg font-medium transition-colors">
                Distribute Now
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
      </main>
    </div>
  );
}

export default App;