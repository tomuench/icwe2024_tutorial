import typescript from 'rollup-plugin-typescript2';
import serve from 'rollup-plugin-serve';

export default {
	input: 'src/index.ts',
	output: {
		file: 'public/index.js',
		format: 'es'
	},
	plugins: [
		typescript(),
		serve('public'),
	]
};