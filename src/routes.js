import { name, version } from '../package.json'
import Router from 'koa-router'

import tableRoutes from '../routes/table'

const router = new Router()

tableRoutes(router)

/**
 * GET /
 */
router.get('/', async ctx => {
  ctx.body = {
    app: name,
    version: version
  }
})

export default router
