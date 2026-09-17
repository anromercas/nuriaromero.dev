/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: 'class',
	theme: {
		extend: {},
	},
	// @tailwindcss/typography (clase `.prose`) se ha quitado: solo la usaban
	// LegalLayout.astro y BlogPostLayout.astro, pero al estar registrada aquí
	// entraba en el único chunk CSS de Tailwind que comparten TODAS las
	// páginas (incluida la home), inflando su <head> con estilos que nunca usa.
	// El contenido con tipografía larga (legal/blog) ahora usa la clase
	// `.entry-content` (ver src/components/EntryContentStyles.astro), con las
	// mismas utilidades de Tailwind escritas a mano en vez del plugin.
	plugins: [],
}
