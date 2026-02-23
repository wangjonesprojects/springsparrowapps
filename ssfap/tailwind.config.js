/**
 * ============================================================================
 * SPRING SPARROW FINANCIAL ADVISOR (SSFAP)
 * ============================================================================
 * 
 * File: tailwind.config.js
 * Version: 1.1.0
 * Last Updated: 2026-02-15
 * 
 * PURPOSE:
 * Configures Tailwind CSS with Spring Sparrow's design system. Defines
 * colors, spacing, typography, and responsive breakpoints for the app.
 * 
 * BUSINESS CONTEXT:
 * Uses Spring Sparrow brand green (#22c55e) as primary color. Financial
 * data uses semantic colors (green = positive, red = negative, yellow = warning).
 * Mobile-first design with breakpoints optimized for iPhone 13 and desktop.
 * 
 * CHANGELOG v1.1.0:
 * - Added custom status indicator colors (danger, pending, easy, undecided)
 * - Expanded success/warning/danger color palettes for consistency
 * - Status colors support priority indicators in Action Items
 * 
 * ============================================================================
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Spring Sparrow brand colors
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',  // Main brand green
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        
        // Financial status colors (expanded)
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',  // Positive numbers, on-track metrics
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        warning: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',  // Approaching limits, needs attention
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',  // Over budget, critical issues
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        
        // Custom Status Indicators (for Action Items, priorities)
        status: {
          // Danger/Urgent - Red (High priority, big expenses like $3K electrical)
          danger: {
            50: '#fef2f2',
            100: '#fee2e2',
            200: '#fecaca',
            300: '#fca5a5',
            400: '#f87171',
            500: '#ef4444',
            600: '#dc2626',
            700: '#b91c1c',
            800: '#991b1b',
            900: '#7f1d1d',
          },
          
          // Pending/Warning - Yellow (Medium priority, decisions needed)
          pending: {
            50: '#fefce8',
            100: '#fef9c3',
            200: '#fef08a',
            300: '#fde047',
            400: '#facc15',
            500: '#eab308',
            600: '#ca8a04',
            700: '#a16207',
            800: '#854d0e',
            900: '#713f12',
          },
          
          // Easy/Low Priority - Green (Quick wins, simple tasks)
          easy: {
            50: '#f0fdf4',
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efac',
            400: '#4ade80',
            500: '#22c55e',
            600: '#16a34a',
            700: '#15803d',
            800: '#166534',
            900: '#14532d',
          },
          
          // Undecided/Neutral - Gray (Not prioritized yet)
          undecided: {
            50: '#f9fafb',
            100: '#f3f4f6',
            200: '#e5e7eb',
            300: '#d1d5db',
            400: '#9ca3af',
            500: '#6b7280',
            600: '#4b5563',
            700: '#374151',
            800: '#1f2937',
            900: '#111827',
          },
        },
        
        // Neutral grays (for text, backgrounds)
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
      },
      
      // Mobile-first breakpoints
      // sm: iPhone 13 landscape, md: iPad, lg: laptop, xl: desktop
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      
      // Custom spacing for financial cards
      spacing: {
        '18': '4.5rem',  // Custom spacing for card padding
        '88': '22rem',   // Custom width for sidebar
      },
      
      // Typography
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['ui-monospace', 'SF Mono', 'Monaco', 'monospace'],
      },
    },
  },
  plugins: [],
}