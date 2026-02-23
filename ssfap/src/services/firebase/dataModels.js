/**
 * ============================================================================
 * SPRING SPARROW FINANCIAL ADVISOR (SSFAP)
 * ============================================================================
 * 
 * Service: Data Models (Type Definitions)
 * Version: 1.0.0
 * Last Updated: 2026-02-14
 * 
 * PURPOSE:
 * Defines the structure of all data stored in Firestore using JSDoc.
 * Provides type safety and documentation for financial data (bookings,
 * expenses, units, accounts).
 * 
 * WHY JSDOC (not TypeScript):
 * - Gives us type hints in VSCode/Cursor without TypeScript setup
 * - Documents expected data structure
 * - Catches bugs during development
 * - Can migrate to TypeScript later if needed
 * 
 * BUSINESS CONTEXT:
 * These types represent Spring Sparrow's financial data model:
 * - Units (properties being managed)
 * - Bookings (STR/MTR reservations)
 * - Expenses (cleaning, maintenance, supplies)
 * - Accounts (bank account balances)
 * - Monthly summaries (aggregated performance)
 * 
 * ============================================================================
 */

/**
 * @typedef {'robins-roost' | 'doves-den' | 'stadium-district'} UnitId
 * 
 * Unit identifiers for the three Spring Sparrow properties.
 */

/**
 * @typedef {'STR' | 'MTR' | 'Hybrid' | 'Vacant'} UnitStrategy
 * 
 * Operating strategy for a unit:
 * - STR: Short-term rental (Airbnb/Vrbo)
 * - MTR: Medium-term rental (Furnished Finder, 1-6 month leases)
 * - Hybrid: Mix of STR and MTR (accept whichever books first)
 * - Vacant: Not currently accepting bookings
 */

/**
 * @typedef {Object} Unit
 * @property {UnitId} id - Unique identifier
 * @property {string} name - Display name (e.g., "Robin's Roost")
 * @property {string} emoji - Icon for UI display
 * @property {UnitStrategy} strategy - Current operating strategy
 * @property {boolean} owned - True if owned, false if arbitrage
 * @property {number} fixedCosts - Monthly fixed costs (mortgage or rent)
 * @property {Object} currentMonth - Current month performance
 * @property {number} currentMonth.nightsBooked - STR nights or MTR months
 * @property {number} currentMonth.grossRevenue - Total revenue before fees
 * @property {number} currentMonth.netIncome - After fees and costs
 * @property {number} currentMonth.occupancyRate - Percentage (0-100)
 */

/**
 * @typedef {'STR' | 'MTR'} BookingType
 * 
 * Type of booking:
 * - STR: Nightly rental
 * - MTR: Monthly rental
 */

/**
 * @typedef {Object} Booking
 * @property {string} id - Firestore document ID
 * @property {UnitId} unitId - Which property
 * @property {BookingType} type - STR or MTR
 * @property {Date} checkIn - Start date
 * @property {Date} checkOut - End date
 * @property {number} nights - Number of nights (or prorated days for MTR)
 * @property {number} grossPayout - Total payout from platform
 * @property {'Airbnb' | 'Vrbo' | 'Direct' | 'Furnished Finder'} platform
 * @property {number} platformFee - Fee charged by platform
 * @property {number} cleaningCost - Cost of turnover cleaning
 * @property {number} netIncome - Gross - fees - cleaning
 * @property {string} month - Month string (e.g., "2026-03") for filtering
 * @property {Date} createdAt - When booking was added to system
 */

/**
 * @typedef {'Cleaning' | 'Maintenance' | 'Supplies' | 'Utilities' | 'Other'} ExpenseCategory
 */

/**
 * @typedef {Object} Expense
 * @property {string} id - Firestore document ID
 * @property {ExpenseCategory} category - Type of expense
 * @property {number} amount - Dollar amount
 * @property {UnitId | null} unitId - Which property (null if general)
 * @property {Date} date - When expense occurred
 * @property {string} notes - Description
 * @property {string} month - Month string for filtering
 * @property {Date} createdAt - When added to system
 */

/**
 * @typedef {'operating' | 'fixed-obligations' | 'capex-reserve' | 'owner-distribution' | 'security-deposits'} AccountType
 */

/**
 * @typedef {Object} AccountBalance
 * @property {AccountType} type - Which account
 * @property {number} balance - Current balance
 * @property {Date} lastUpdated - When balance was last synced
 */

/**
 * @typedef {Object} MonthlyPerformance
 * @property {string} month - Month string (e.g., "2026-03")
 * @property {number} totalRevenue - All income
 * @property {number} totalExpenses - All costs
 * @property {number} netIncome - Revenue - expenses
 * @property {number} strNights - Total STR nights booked
 * @property {number} mtrMonths - Total MTR months occupied
 * @property {Object.<UnitId, Object>} unitPerformance - Per-unit breakdown
 * @property {Date} createdAt - When summary was generated
 */

/**
 * @typedef {Object} BudgetAlert
 * @property {'OK' | 'Warning' | 'Critical'} level
 * @property {string} message - User-friendly description
 * @property {ExpenseCategory} category - Which budget category
 * @property {number} monthlyBudget - Target amount
 * @property {number} monthlyActual - Current spend
 * @property {number} annualBudget - Yearly target
 * @property {number} annualActual - YTD spend
 */

// Export empty object to make this a module
export {};

/**
 * ============================================================================
 * USAGE IN OTHER FILES
 * ============================================================================
 * 
 * Import at top of file:
 * 
 * /**
 *  * @typedef {import('./dataModels').Booking} Booking
 *  * @typedef {import('./dataModels').Expense} Expense
 *  *\/
 * 
 * Then use in JSDoc comments:
 * 
 * /**
 *  * Add a new booking to Firestore
 *  * @param {Booking} booking - Booking data
 *  * @returns {Promise<string>} Document ID
 *  *\/
 * async function addBooking(booking) {
 *   // VSCode/Cursor will show autocomplete for booking properties!
 * }
 * 
 * ============================================================================
 */