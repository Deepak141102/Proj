import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: './stats.html', // Generates a visualization file
      open: true, // Opens the stats file in your browser automatically
    }),
  ],
  build: {
    // Set chunk size warning limit to 1.5 MB (1500 kB)
    chunkSizeWarningLimit: 1500, 

    // Rollup options to optimize chunk splitting
    rollupOptions: {
      output: {
        // Manually split large dependencies into separate chunks
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // If the dependency is lottie-web, create a separate chunk for it
            if (id.includes('lottie-web')) {
              return 'lottie'; // Chunk name for lottie-web
            }
            // For all other node_modules, create a vendor chunk
            return 'vendor';
          }
        },
      },
    },

    // Configuring Terser for better handling of minification, especially for 'eval'
    terserOptions: {
      compress: {
        // Ignore eval-related warnings during compression
        pure_funcs: ['eval'],
      },
      // Optionally you can disable `eval` if it's problematic for you
      mangle: {
        toplevel: true,
        eval: false, // Avoid mangling eval
      },
    },

    // Handle commonjs-specific options to mitigate eval usage
    commonjsOptions: {
      ignoreTryCatch: false, // Fix issues related to "eval" in commonjs modules
    },
  },
});
