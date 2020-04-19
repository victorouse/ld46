import commonjs from 'rollup-plugin-commonjs'
import html from '@rollup/plugin-html'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import resolve from 'rollup-plugin-node-resolve'

const isProd = process.env.NODE_ENV === 'production'

export default {
  input: './src/index.js',
  output: {
    file: './dist/bundle.js',
    name: 'bundle',
    format: 'iife',
  },
  plugins: [
    resolve(),
    commonjs({
      include: /node_modules/,
    }),
    html({
      fileName: 'index.html',
      title: '🌝',
      template: ({ title }) => {
        return `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="utf-8">
            <title>${title}</title>
          </head>
          <body>
            <div id="app"></div>
            <script src="./bundle.js"></script>
          </body>
          </html>
        `
      },
    }),
    !isProd &&
      serve({
        host: 'localhost',
        port: 1337,
        contentBase: ['dist'],
      }),
    !isProd &&
      livereload({
        watch: 'src/*',
      }),
  ],
}
