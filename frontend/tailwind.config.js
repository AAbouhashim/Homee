import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  daisyui: {
    themes: [
      {
        mytheme: {
            "primary": "#c1440e",      
            "secondary": "#e07b39",
            "accent": "#d3d3d3",
            "neutral": "#4e4e4e",
            "base-100": "#f5e8c7", 
            "info": "#a0522d",  
            "success": "#22c55e",
            "warning": "#f97316",
            "error": "#dc2626",
          },
        },
      ],
    },
  plugins: [daisyui],
};