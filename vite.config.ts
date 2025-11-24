import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega as variáveis de ambiente baseadas no modo atual (development, production)
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // Mapeia process.env.API_KEY para a variável do arquivo .env (VITE_API_KEY)
      // Isso permite que o código original funcione sem alterações
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY)
    }
  }
})