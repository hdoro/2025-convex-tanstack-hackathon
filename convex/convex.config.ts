import betterAuth from '@convex-dev/better-auth/convex.config'
import presence from '@convex-dev/presence/convex.config'
import resend from '@convex-dev/resend/convex.config'
import { defineApp } from 'convex/server'

const app = defineApp()
app.use(betterAuth)
app.use(presence)
app.use(resend)

export default app
