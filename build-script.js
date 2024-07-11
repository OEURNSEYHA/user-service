const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs-extra');
const copy = require('esbuild-plugin-copy').default;

esbuild.build({
  entryPoints: ['src/server.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  outdir: 'build',
  external: ['express'],
  loader: {
    '.ts': 'ts',
  },
  plugins: [
    copy({
      targets: [
        { src: 'node_modules/swagger-ui-dist/*.css', dest: 'build/node_modules/swagger-ui-dist/' },
        { src: 'node_modules/swagger-ui-dist/*.js', dest: 'build/node_modules/swagger-ui-dist/' },
        { src: 'node_modules/swagger-ui-dist/*.png', dest: 'build/node_modules/swagger-ui-dist/' },
        { src: 'src/configs/*', dest: 'build/configs/' }  // Copy the entire configs directory
      ]
    })
  ],
  resolveExtensions: ['.ts', '.js'],
  define: {
    'process.env.NODE_ENV': '"production"',
  },
  alias: {
    '@': path.resolve(__dirname, '.'),
  }
}).then(() => {
  // Ensure .env.production is copied after build
  if (fs.existsSync(path.resolve(__dirname, 'src/configs/.env.production'))) {
    fs.copySync(
      path.resolve(__dirname, 'src/configs/.env.production'),
      path.resolve(__dirname, 'build/configs/.env.production')
    );
    console.log('.env.production copied successfully!');
  } else {
    console.warn('.env.production not found! Ensure it exists before running the build.');
  }

  // Copy swagger.json after successful build
  fs.copySync(path.resolve(__dirname, 'src/docs/swagger.json'), path.resolve(__dirname, 'build/docs/swagger.json'));
  console.log('Swagger JSON and configs directory copied successfully!');
}).catch(error => {
  console.error('Build failed:', error);
  process.exit(1);
});
