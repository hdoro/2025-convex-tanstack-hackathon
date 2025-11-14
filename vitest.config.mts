import path from 'node:path'
import dotenv from 'dotenv'
import { defineConfig } from 'vitest/config'

dotenv.config({ path: ['.env', '.env.local'] })

export default defineConfig({
	test: {
		projects: [
			{
				test: {
					include: ['convex/**/*.test.ts'],
					environment: 'edge-runtime',
					server: { deps: { inline: ['convex-test'] } },
				},
				resolve: {
					alias: {
						'@': path.resolve(__dirname, './src'),
						'@db': path.resolve(__dirname, './convex'),
					},
				},
			},
			{
				test: {
					include: ['src/**/*.test.ts'],
					environment: 'node',
				},
				resolve: {
					alias: {
						'@': path.resolve(__dirname, './src'),
						'@db': path.resolve(__dirname, './convex'),
					},
				},
			},
		],
	},
})
