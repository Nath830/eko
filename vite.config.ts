import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  // Chemins relatifs : le site fonctionne aussi bien en local que publié
  // dans un sous-dossier sur GitHub Pages (https://user.github.io/eko/).
  base: './',
  plugins: [react(), tailwindcss()],
})
