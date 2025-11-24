import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    define: {
      // Make env variables available in the app
      'import.meta.env.VITE_AUTH_SERVICE_URL': JSON.stringify(env.VITE_AUTH_SERVICE_URL),
      'import.meta.env.VITE_CONGLOMERADO_SERVICE_URL': JSON.stringify(env.VITE_CONGLOMERADO_SERVICE_URL),
      'import.meta.env.VITE_BRIGADA_SERVICE_URL': JSON.stringify(env.VITE_BRIGADA_SERVICE_URL),
      'import.meta.env.VITE_ESPECIE_SERVICE_URL': JSON.stringify(env.VITE_ESPECIE_SERVICE_URL),
      'import.meta.env.VITE_OBSERVACION_SERVICE_URL': JSON.stringify(env.VITE_OBSERVACION_SERVICE_URL),
      'import.meta.env.VITE_GATEWAY_URL': JSON.stringify(env.VITE_GATEWAY_URL),
      'import.meta.env.VITE_NODE_ENV': JSON.stringify(env.VITE_NODE_ENV),
    }
  }
})
