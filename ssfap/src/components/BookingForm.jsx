/**
 * ============================================================================
 * SPRING SPARROW FINANCIAL ADVISOR (SSFAP)
 * ============================================================================
 * 
 * Component: BookingForm
 * Version: 1.0.0
 * Last Updated: 2026-02-14
 * 
 * PURPOSE:
 * Comprehensive booking entry form supporting both STR (short-term rental)
 * and MTR (medium-term rental) modes. Handles all revenue calculations,
 * fees, deposits, and pet policies.
 * 
 * BUSINESS CONTEXT:
 * STR bookings are nightly (Airbnb/Vrbo) with turnover cleaning per stay.
 * MTR bookings are monthly (Furnished Finder) with move-out cleaning, 
 * security deposits, damage protection, and optional pet fees.
 * 
 * ============================================================================
 */

import { useState, useEffect } from 'react';
import { addBooking, getCurrentMonth } from '../services/firebase/firestoreService';

function BookingForm({ unitId, onClose, onSuccess }) {
  // ========================================================================
  // STATE MANAGEMENT
  // ========================================================================
  
  const [bookingType, setBookingType] = useState('STR'); // STR or MTR
  const [formData, setFormData] = useState({
    // Common fields
    unitId: unitId || 'robins-roost',
    checkIn: '',
    checkOut: '',
    platform: 'Airbnb',
    grossPayout: '',
    platformFee: '',
    
    // STR-specific
    cleaningCost: '150', // Default STR cleaning
    
    // MTR-specific
    baseMonthlyRent: '',
    moveOutCleaning: '350', // Default MTR cleaning
    securityDeposit: '',
    damageProtection: '80', // Default damage protection
    hasDamageProtection: true,
    hasPets: false,
    petCount: '1',
    petFeePerMonth: '',
    petDeposit: '250', // Non-refundable
  });
  
  const [calculated, setCalculated] = useState({
    nights: 0,
    months: 0,
    days: 0,
    displayText: '',
    netIncome: 0,
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const userId = 'B52ye9yyQ0QINoHdEe4nH5niDef2'; // Hardcoded for now
  
  // ========================================================================
  // AUTO-CALCULATIONS (runs whenever dates or amounts change)
  // ========================================================================
  
  useEffect(() => {
    calculateBooking();
  }, [formData, bookingType]);
  
  function calculateBooking() {
    const { checkIn, checkOut, grossPayout, platformFee } = formData;
    
    if (!checkIn || !checkOut) {
      setCalculated({ nights: 0, months: 0, days: 0, displayText: '', netIncome: 0 });
      return;
    }
    
    // Calculate duration
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let displayText = '';
    let netIncome = 0;
    
    if (bookingType === 'STR') {
      // STR: Count nights
      displayText = `${diffDays} night${diffDays !== 1 ? 's' : ''}`;
      
      // STR Net Income = Gross - Platform Fee - Cleaning
      const gross = parseFloat(grossPayout) || 0;
      const fee = parseFloat(platformFee) || 0;
      const cleaning = parseFloat(formData.cleaningCost) || 0;
      netIncome = gross - fee - cleaning;
      
      setCalculated({
        nights: diffDays,
        months: 0,
        days: diffDays,
        displayText,
        netIncome,
      });
    } else {
      // MTR: Count months and remaining days
      const months = Math.floor(diffDays / 30);
      const remainingDays = diffDays % 30;
      
      if (months > 0 && remainingDays > 0) {
        displayText = `${months} month${months !== 1 ? 's' : ''}, ${remainingDays} day${remainingDays !== 1 ? 's' : ''}`;
      } else if (months > 0) {
        displayText = `${months} month${months !== 1 ? 's' : ''}`;
      } else {
        displayText = `${remainingDays} day${remainingDays !== 1 ? 's' : ''}`;
      }
      
      // MTR Net Income calculation
      const baseRent = parseFloat(formData.baseMonthlyRent) || 0;
      const totalMonths = diffDays / 30; // Prorated
      
      let totalRevenue = baseRent * totalMonths;
      
      // Add damage protection if enabled
      if (formData.hasDamageProtection) {
        const damageProtection = parseFloat(formData.damageProtection) || 0;
        totalRevenue += damageProtection * totalMonths;
      }
      
      // Add pet fees if applicable
      if (formData.hasPets) {
        const petFee = parseFloat(formData.petFeePerMonth) || 0;
        const petCount = parseInt(formData.petCount) || 0;
        const petDeposit = parseFloat(formData.petDeposit) || 0;
        totalRevenue += (petFee * petCount * totalMonths) + petDeposit;
      }
      
      // Subtract costs
      const fee = parseFloat(platformFee) || 0;
      const moveOutCleaning = parseFloat(formData.moveOutCleaning) || 0;
      netIncome = totalRevenue - fee - moveOutCleaning;
      
      setCalculated({
        nights: 0,
        months: Math.floor(totalMonths),
        days: diffDays,
        displayText,
        netIncome,
      });
    }
  }
  
  // ========================================================================
  // FORM HANDLERS
  // ========================================================================
  
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }
  
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Prepare booking data
      const bookingData = {
        unitId: formData.unitId,
        type: bookingType,
        checkIn: new Date(formData.checkIn),
        checkOut: new Date(formData.checkOut),
        nights: bookingType === 'STR' ? calculated.nights : calculated.days,
        grossPayout: parseFloat(formData.grossPayout) || 0,
        platform: formData.platform,
        platformFee: parseFloat(formData.platformFee) || 0,
        cleaningCost: bookingType === 'STR' 
          ? parseFloat(formData.cleaningCost) || 0 
          : parseFloat(formData.moveOutCleaning) || 0,
        netIncome: calculated.netIncome,
        month: getCurrentMonth(),
        
        // MTR-specific fields
        ...(bookingType === 'MTR' && {
          baseMonthlyRent: parseFloat(formData.baseMonthlyRent) || 0,
          securityDeposit: parseFloat(formData.securityDeposit) || 0,
          damageProtection: formData.hasDamageProtection ? parseFloat(formData.damageProtection) || 0 : 0,
          hasPets: formData.hasPets,
          petCount: formData.hasPets ? parseInt(formData.petCount) || 0 : 0,
          petFeePerMonth: formData.hasPets ? parseFloat(formData.petFeePerMonth) || 0 : 0,
          petDeposit: formData.hasPets ? parseFloat(formData.petDeposit) || 0 : 0,
        }),
      };
      
      await addBooking(userId, bookingData);
      
      console.log('Booking saved:', bookingData);
      
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      console.error('Error saving booking:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  
  // ========================================================================
  // RENDER
  // ========================================================================
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-neutral-900">Add Booking</h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 text-2xl"
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Booking Type Toggle */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Booking Type
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setBookingType('STR')}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                  bookingType === 'STR'
                    ? 'bg-primary-600 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                STR (Short-Term)
              </button>
              <button
                type="button"
                onClick={() => setBookingType('MTR')}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                  bookingType === 'MTR'
                    ? 'bg-primary-600 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                MTR (Medium-Term)
              </button>
            </div>
          </div>
          
          {/* Unit Selection */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Property
            </label>
            <select
              name="unitId"
              value={formData.unitId}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            >
              <option value="robins-roost">🏡 Robin's Roost</option>
              <option value="doves-den">🕊️ Dove's Den</option>
              <option value="stadium-district">🏟️ Stadium District</option>
            </select>
          </div>
          
          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Check-In
              </label>
              <input
                type="date"
                name="checkIn"
                value={formData.checkIn}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Check-Out
              </label>
              <input
                type="date"
                name="checkOut"
                value={formData.checkOut}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
          </div>
          
          {/* Duration Display */}
          {calculated.displayText && (
            <div className="bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3">
              <p className="text-sm text-neutral-600">
                Duration: <span className="font-semibold text-neutral-900">{calculated.displayText}</span>
              </p>
            </div>
          )}
          
          {/* Platform */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Platform
            </label>
            <select
              name="platform"
              value={formData.platform}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            >
              <option value="Airbnb">Airbnb</option>
              <option value="Vrbo">Vrbo</option>
              <option value="Furnished Finder">Furnished Finder</option>
              <option value="Direct">Direct Booking</option>
            </select>
          </div>
          
          {/* STR-SPECIFIC FIELDS */}
          {bookingType === 'STR' && (
            <>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Gross Payout
                </label>
                <input
                  type="number"
                  name="grossPayout"
                  value={formData.grossPayout}
                  onChange={handleChange}
                  step="0.01"
                  placeholder="450.00"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Platform Fee
                </label>
                <input
                  type="number"
                  name="platformFee"
                  value={formData.platformFee}
                  onChange={handleChange}
                  step="0.01"
                  placeholder="67.50"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Cleaning Cost (per turnover)
                </label>
                <input
                  type="number"
                  name="cleaningCost"
                  value={formData.cleaningCost}
                  onChange={handleChange}
                  step="0.01"
                  placeholder="150.00"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
            </>
          )}
          
          {/* MTR-SPECIFIC FIELDS */}
          {bookingType === 'MTR' && (
            <>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Base Monthly Rent
                </label>
                <input
                  type="number"
                  name="baseMonthlyRent"
                  value={formData.baseMonthlyRent}
                  onChange={handleChange}
                  step="0.01"
                  placeholder="2000.00"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Platform Fee (10% typical)
                </label>
                <input
                  type="number"
                  name="platformFee"
                  value={formData.platformFee}
                  onChange={handleChange}
                  step="0.01"
                  placeholder="200.00"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Move-Out Cleaning (charged 1 month before end)
                </label>
                <input
                  type="number"
                  name="moveOutCleaning"
                  value={formData.moveOutCleaning}
                  onChange={handleChange}
                  step="0.01"
                  placeholder="350.00"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Security Deposit (tracking only - not revenue)
                </label>
                <input
                  type="number"
                  name="securityDeposit"
                  value={formData.securityDeposit}
                  onChange={handleChange}
                  step="0.01"
                  placeholder="500.00"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <p className="text-xs text-neutral-500 mt-1">
                  This is held separately and returned to guest
                </p>
              </div>
              
              {/* Damage Protection Toggle */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="hasDamageProtection"
                  checked={formData.hasDamageProtection}
                  onChange={handleChange}
                  className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                />
                <label className="text-sm font-medium text-neutral-700">
                  Damage Protection ($80/month)
                </label>
              </div>
              
              {formData.hasDamageProtection && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Damage Protection Fee (per month)
                  </label>
                  <input
                    type="number"
                    name="damageProtection"
                    value={formData.damageProtection}
                    onChange={handleChange}
                    step="0.01"
                    placeholder="80.00"
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              )}
              
              {/* Pet Toggle */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="hasPets"
                  checked={formData.hasPets}
                  onChange={handleChange}
                  className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                />
                <label className="text-sm font-medium text-neutral-700">
                  Guest has pets
                </label>
              </div>
              
              {formData.hasPets && (
                <div className="space-y-4 pl-8 border-l-2 border-primary-200">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Number of Pets
                    </label>
                    <input
                      type="number"
                      name="petCount"
                      value={formData.petCount}
                      onChange={handleChange}
                      min="1"
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Pet Fee (per pet, per month)
                    </label>
                    <input
                      type="number"
                      name="petFeePerMonth"
                      value={formData.petFeePerMonth}
                      onChange={handleChange}
                      step="0.01"
                      placeholder="50.00"
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Non-Refundable Pet Deposit (one-time)
                    </label>
                    <input
                      type="number"
                      name="petDeposit"
                      value={formData.petDeposit}
                      onChange={handleChange}
                      step="0.01"
                      placeholder="250.00"
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              )}
            </>
          )}
          
          {/* Net Income Display */}
          <div className="bg-success-50 border border-success-200 rounded-lg px-4 py-3">
            <p className="text-sm text-success-700 mb-1">Net Income</p>
            <p className="text-2xl font-bold text-success-900">
              ${calculated.netIncome.toFixed(2)}
            </p>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="bg-danger-50 border border-danger-200 rounded-lg px-4 py-3">
              <p className="text-sm text-danger-700">{error}</p>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-300 text-white rounded-lg font-medium transition-colors"
            >
              {loading ? 'Saving...' : 'Save Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookingForm;