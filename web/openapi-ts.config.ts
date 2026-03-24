import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  plugins: ['@hey-api/client-axios'],
  input: 'http://localhost:8000/api/v1/openapi.json',
  output: 'src/shared/api/openapi',
})