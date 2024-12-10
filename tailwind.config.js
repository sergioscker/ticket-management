/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    Mode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx}', './index.html'],
  theme: {
  	container: {
  		center: true,
  		padding: '15px'
  	},
  	screens: {
  		sm: '640px',
  		md: '768px',
  		lg: '1024px',
  		xl: '1400px',
  		'2xl': '1600px'
  	},
  	fontFamily: {
  		primary: [
  			'JetBrains',
  			'sans-serif'
  		]
  	},
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {}
  	}
  },
    plugins: [require("tailwindcss-animate")]
};
