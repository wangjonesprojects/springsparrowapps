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

import TestButton from './components/TestButton';


function App() {
  // ========================================================================
  // MOCK DATA (Will be replaced with Firebase data later)
  // ========================================================================
  
  const capexReserve = {
    current: 10565,
    target: 20000,
    percentage: 53, // (10565 / 20000) * 100
  };
  
  const monthlyIncome = {
    current: 8247,
    target: 11721,
    percentage: 70,
  };
  
  const units = [
    {
      id: 'robins-roost',
      name: "Robin's Roost",
      emoji: '🏡',
      nights: 12,
      target: 15,
      netIncome: 1560,
      status: 'warning', // behind target
    },
    {
      id: 'doves-den',
      name: "Dove's Den",
      emoji: '🕊️',
      nights: 18,
      target: 15,
      netIncome: 2700,
      status: 'success', // on track
    },
    {
      id: 'stadium',
      name: 'Stadium District',
      emoji: '🏟️',
      nights: 13,
      target: 18,
      netIncome: -350,
      status: 'warning', // MTR search active
    },
  ];
  
  const distributions = {
    total: 4689,
    keeya: 2344,
    tie: 2345,
  };
  
  const actionItems = [
    { text: 'Push Robin bookings', priority: 'high' },
    { text: 'Stadium MTR decision', priority: 'medium' },
    { text: 'Electrical repair pending', priority: 'low' },
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
          <p className="text-sm text-neutral-600 mt-1">March 2026</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        
        {/* Top Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* CapEx Reserve Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-neutral-900">
                💎 CapEx Reserve
              </h2>
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
                {capexReserve.percentage}% • Target: May 1
              </p>
            </div>
          </div>
          
          {/* Monthly Income Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-neutral-900">
                📊 March Net Income
              </h2>
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
                {monthlyIncome.percentage}% • Need $217/day • 16 days left
              </p>
            </div>
          </div>
        </div>

        {/* Units Performance */}
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">
            🏠 Unit Performance
          </h2>
          
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
                  
                  <button className="w-full mt-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-sm font-medium text-neutral-700 transition-colors">
                    View Details →
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
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">
              💰 Owner Distributions
            </h2>
            
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
              
              <button className="w-full mt-2 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors">
                Distribute Now
              </button>
            </div>
          </div>
          
          {/* Action Items */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">
              ⚡ Action Items
            </h2>
            
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

      </main>
    </div>
  );
}

export default App;