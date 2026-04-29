import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/how_am_i_feeling/',
  plugins: [react()],
});
