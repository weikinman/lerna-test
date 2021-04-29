/**
 * @deprecated use node api build
 */
// import vue from 'rollup-plugin-vue'
import typescript from 'rollup-plugin-typescript2'
import css from 'rollup-plugin-css-only'
import { nodeResolve } from '@rollup/plugin-node-resolve'
// import commonjs from '@rollup/plugin-commonjs'
// import { terser } from 'rollup-plugin-terser'
import path from 'path'
import { getPackagesSync } from '@lerna/project'
import pkg from '../package.json'
const deps = Object.keys(pkg.dependencies)
    // eslint-disable-next-line @typescript-eslint/no-var-requires
const vue = require('./plugin.js')
const inputs = getPackagesSync()
    .map(pkg => pkg.name)
    .filter(name =>
        name.includes('@vue-fw-lerna') &&
        !name.includes('transition') &&
        !name.includes('utils'),
    )

export default inputs.map(name => ({
    input: path.resolve(__dirname, `../packages/${name.split('@vue-fw-lerna/')[1]}/index.js`),
    output: {
        format: 'es',
        file: `lib/${name.split('@vue-fw-lerna/')[1]}/index.js`,
        paths(id) {
            if (/^@vue-fw-lerna/.test(id)) {
                return id.replace('@vue-fw-lerna', '..')
            }
        },
    },
    plugins: [
        // terser({
        //   module: true,
        //   compress: {
        //     ecma: 2015,
        //     pure_getters: true,
        //   },
        // }),
        nodeResolve(),
        // // commonjs(),
        // typescript({
        //     tsconfigOverride: {
        //         compilerOptions: {
        //             declaration: false,
        //         },
        //         'exclude': [
        //             'node_modules',
        //             '__tests__',
        //         ],
        //     },
        //     abortOnError: false,
        //     clean: true,
        // }),
        css(),
        vue({
            target: 'browser',
            css: false,
        }),
    ],
    external(id) {
        return /^vue/.test(id) ||
            /^@vue-fw-lerna/.test(id) ||
            deps.some(k => new RegExp('^' + k).test(id))
    },
}))