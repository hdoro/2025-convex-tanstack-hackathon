import presence from '@convex-dev/presence/convex.config'
import { defineApp } from 'convex/server'
import betterAuthComponent from './auth/convex.config'

const app = defineApp()
app.use(betterAuthComponent)
app.use(presence)

export default app
