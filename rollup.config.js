import { resolve } from 'path'
import rollupPluginCopy from 'rollup-plugin-copy'
import rollupPluginDelete from 'rollup-plugin-delete'
import rollupPluginJson from 'rollup-plugin-json'

const defaults = {
  // external dependencies
  // if we don't specify, rollup gives an 'unresolved' warning
  external: [
    // node builtin
    'buffer',
    'crypto',
    'fs',
    'os',
    'path',
    'perf_hooks',
    'url',
    'worker_threads',
    // 3rd party
    '@hapi/boom',
    '@hapi/h2o2',
    '@hapi/hapi',
    '@hapi/inert',
    '@hapi/vision',
    'chalk',
    'cuid',
    'execa',
    'hapi-swagger',
    'js-string-escape',
    'jsonpath-plus',
    'jsonwebtoken',
    'luxon',
    'object.fromentries/auto.js',
    'semver',
    'update-notifier',
    'velocityjs',
    'ws',
    // static json (don't include!)
    resolve(__dirname, 'package.json'),
  ],
  input: 'src/index.js',
}

export default [
  {
    ...defaults,
    output: {
      chunkFileNames: '[name].[hash].[format].js',
      dir: 'dist',
      entryFileNames: '[name].[format].js',
      format: 'cjs',
      preferConst: true,
    },
    plugins: [
      rollupPluginJson(),
      rollupPluginDelete({ targets: 'dist/*' }),
      rollupPluginCopy({
        targets: [
          {
            src: 'src/api-gateway/templates/*.vm',
            dest: 'dist/templates',
          },
          { src: 'src/lambda/handler-runner/*.{py,rb}', dest: 'dist' },
        ],
      }),
    ],
  },
]
