/**
 * Breakdown Modal - Shows STR vs MTR split
 */

function BreakdownModal({ bookings, onClose }) {
    // Calculate STR vs MTR breakdown
    const strBookings = bookings.filter(b => b.type === 'STR');
    const mtrBookings = bookings.filter(b => b.type === 'MTR');
    
    const strStats = {
      count: strBookings.length,
      nights: strBookings.reduce((sum, b) => sum + b.nights, 0),
      netIncome: strBookings.reduce((sum, b) => sum + b.netIncome, 0),
    };
    
    const mtrStats = {
      count: mtrBookings.length,
      days: mtrBookings.reduce((sum, b) => sum + b.nights, 0),
      netIncome: mtrBookings.reduce((sum, b) => sum + b.netIncome, 0),
    };
    
    const totalIncome = strStats.netIncome + mtrStats.netIncome;
    
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
      }).format(amount);
    };
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
          {/* Header */}
          <div className="border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-neutral-900">Jan 2026 Breakdown</h2>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-600 text-2xl"
            >
              ×
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6 space-y-6">
            
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
              {/* MTR Card */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-900 mb-3">MTR Bookings</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-blue-700">Bookings:</span>
                    <span className="font-semibold text-blue-900">{mtrStats.count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-blue-700">Days:</span>
                    <span className="font-semibold text-blue-900">{mtrStats.days}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-blue-700">Net Income:</span>
                    <span className="font-semibold text-blue-900">{formatCurrency(mtrStats.netIncome)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-blue-200">
                    <span className="text-xs text-blue-700">% of Total:</span>
                    <span className="font-semibold text-blue-900">
                      {Math.round((mtrStats.netIncome / totalIncome) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
              
              {/* STR Card */}
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-green-900 mb-3">STR Bookings</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-green-700">Bookings:</span>
                    <span className="font-semibold text-green-900">{strStats.count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-green-700">Nights:</span>
                    <span className="font-semibold text-green-900">{strStats.nights}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-green-700">Net Income:</span>
                    <span className="font-semibold text-green-900">{formatCurrency(strStats.netIncome)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-green-200">
                    <span className="text-xs text-green-700">% of Total:</span>
                    <span className="font-semibold text-green-900">
                      {Math.round((strStats.netIncome / totalIncome) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Total */}
            <div className="bg-neutral-100 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-neutral-700">Total Net Income</span>
                <span className="text-2xl font-bold text-neutral-900">{formatCurrency(totalIncome)}</span>
              </div>
            </div>
            
            {/* Detailed Table */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-3">Booking Details</h3>
              <div className="border border-neutral-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-neutral-50 border-b border-neutral-200">
                    <tr>
                      <th className="text-left px-3 py-2 text-xs font-semibold text-neutral-700">Unit</th>
                      <th className="text-left px-3 py-2 text-xs font-semibold text-neutral-700">Type</th>
                      <th className="text-right px-3 py-2 text-xs font-semibold text-neutral-700">Nights/Days</th>
                      <th className="text-right px-3 py-2 text-xs font-semibold text-neutral-700">Net Income</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking, index) => (
                      <tr key={index} className="border-b border-neutral-100">
                        <td className="px-3 py-2 text-neutral-900">
                          {booking.unitId === 'robins-roost' ? "Robin's Roost" : 
                           booking.unitId === 'doves-den' ? "Dove's Den" : 
                           'Stadium District'}
                        </td>
                        <td className="px-3 py-2">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            booking.type === 'MTR' 
                              ? 'bg-blue-100 text-blue-900' 
                              : 'bg-green-100 text-green-900'
                          }`}>
                            {booking.type}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-right text-neutral-900">{booking.nights}</td>
                        <td className="px-3 py-2 text-right font-semibold text-neutral-900">
                          {formatCurrency(booking.netIncome)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
          </div>
          
          {/* Footer */}
          <div className="border-t border-neutral-200 px-6 py-4">
            <button
              onClick={onClose}
              className="w-full px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  export default BreakdownModal;