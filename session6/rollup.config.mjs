import typescript from 'rollup-plugin-typescript2';
import html from '@rollup/plugin-html';
import serve from 'rollup-plugin-serve';
import copy from 'rollup-plugin-copy';

export default [
	{
		input: 'src/serviceWorker.ts',
		output: {
			file: 'public/serviceWorker.js',
			format: 'es'
		},
		plugins: [
			typescript(),
		]
	},
	{
	input: 'src/index.ts',
	output: {
		file: 'public/index.js',
		format: 'es'
	},
	plugins: [
		typescript(),
		copy({
			targets: [
			  { src: 'src/pages/*', dest: 'public/' },
			]
		  }),
		serve('public'),
	]
}];