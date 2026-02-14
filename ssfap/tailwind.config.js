/**
 * ============================================================================
 * SPRING SPARROW FINANCIAL ADVISOR (SSFAP)
 * ============================================================================
 * 
 * File: tailwind.config.js
 * Version: 1.0.0
 * Last Updated: 2026-02-14
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
          
          // Financial status colors
          success: {
            500: '#22c55e',  // Positive numbers, on-track metrics
            600: '#16a34a',
          },
          warning: {
            500: '#f59e0b',  // Approaching limits, needs attention
            600: '#d97706',
          },
          danger: {
            500: '#ef4444',  // Over budget, critical issues
            600: '#dc2626',
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