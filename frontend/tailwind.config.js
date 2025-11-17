/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      // Enterprise Typography Scale
      fontSize: {
        'enterprise-xs': ['12px', { lineHeight: '1.4' }],      // 0.75rem - Secondary/metadata
        'enterprise-sm': ['13px', { lineHeight: '1.4' }],      // 0.8125rem - Compact body
        'enterprise-base': ['14px', { lineHeight: '1.5' }],    // 0.875rem - Body text (default)
        'enterprise-md': ['16px', { lineHeight: '1.4' }],      // 1rem - Section headers/subheads
        'enterprise-lg': ['18px', { lineHeight: '1.4' }],      // 1.125rem - Page title (alternative)
        'enterprise-xl': ['20px', { lineHeight: '1.4' }],      // 1.25rem - Page title (primary)
      },
      // Enterprise Spacing Scale (8px base grid)
      spacing: {
        'enterprise-1': '4px',   // 0.25rem - Tight spacing
        'enterprise-2': '8px',   // 0.5rem - Base unit
        'enterprise-3': '12px',  // 0.75rem - Field groups
        'enterprise-4': '16px',  // 1rem - Section blocks
        'enterprise-5': '24px',  // 1.5rem - Page padding (min)
        'enterprise-6': '32px',  // 2rem - Page padding (max)
      },
      // Enterprise Border Radius
      borderRadius: {
        'enterprise-sm': '2px',   // Subtle rounding
        'enterprise-md': '4px',   // Standard enterprise (replaces rounded-xl)
        'enterprise-lg': '8px',   // Larger elements (sparingly used)
      },
      // Enterprise Shadows (subtle, professional)
      boxShadow: {
        'enterprise-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'enterprise-md': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        'enterprise-lg': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
      },
      // Enterprise Line Heights
      lineHeight: {
        'enterprise-tight': '1.3',   // Headings
        'enterprise-normal': '1.4',   // Subheads
        'enterprise-relaxed': '1.5',  // Body text
      },
      // Density Mode Scales
      density: {
        'compact': '0.9',
        'standard': '1.0',
        'comfortable': '1.1',
      },
      // Density Row Heights
      rowHeight: {
        'compact': '40px',
        'standard': '44px',
        'comfortable': '48px',
      },
    },
  },
  plugins: [
    // Density mode utilities plugin
    function({ addUtilities, theme }) {
      const densityModes = ['compact', 'standard', 'comfortable'];
      const utilities = {};
      
      densityModes.forEach(mode => {
        const scale = theme(`density.${mode}`);
        const rowHeight = theme(`rowHeight.${mode}`);
        
        utilities[`.density-${mode}`] = {
          '--density-scale': scale,
          '--row-height': rowHeight,
        };
      });
      
      addUtilities(utilities);
    },
  ],
};
