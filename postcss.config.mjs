/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}, // <--- importante para compatibilidad de estilos
  },
};

export default config;
