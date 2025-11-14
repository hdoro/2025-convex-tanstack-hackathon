import type { GenericCtx } from '@convex-dev/better-auth'
import { convex } from '@convex-dev/better-auth/plugins'
import { betterAuth } from 'better-auth'
import { anonymous, magicLink } from 'better-auth/plugins'
import { DB_TRUSTED_ORIGINS } from '@/lib/constants.db'
import type { DataModel } from './_generated/dataModel'
import { authComponent } from './auth/client'

const PROVIDERS_CONFIG = {
	google: {
		clientId: process.env.AUTH_GOOGLE_ID as string,
		clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
	},
} as const

export const createAuth = (
	ctx: GenericCtx<DataModel>,
	{ optionsOnly } = { optionsOnly: false },
) => {
	return betterAuth({
		// disable logging when createAuth is called just to generate options.
		// this is not required, but there's a lot of noise in logs without it.
		logger: {
			disabled: optionsOnly,
		},
		trustedOrigins: DB_TRUSTED_ORIGINS,
		database: authComponent.adapter(ctx),
		baseURL: DB_TRUSTED_ORIGINS[0],
		account: {
			accountLinking: {
				enabled: true,
				trustedProviders: ['google'],
			},
		},
		emailAndPassword: {
			enabled: false,
		},
		socialProviders: {
			google: {
				...PROVIDERS_CONFIG.google,
				accessType: 'offline',
			},
		},
		plugins: [
			convex(),
			anonymous(),
			// We don't have email & passwords, only email
			magicLink({
				async sendMagicLink(data) {
					// await runEffectWithNotificationServices(
					// 	sendEmail({
					// 		to: [data.email],
					// 		subject: `Logg inn på Wileo`,
					// 		react: MagicLinkEmail({ url: data.url }),
					// 	}),
					// )
				},
			}),
		],
	})
}
