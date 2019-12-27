const { TABLE_CODE, TABLE_SCOPE, EOS_API } = require('../utils/statics')
const { BUILD_ACTION, GET_TABLE, HANDLE_ERROR } = require('../utils/routeUtils')

module.exports =  (router) => {
  router.prefix('/lynx/crossworlds')
  
  router.get('/', async (ctx) => {
    // Get a list of on-chain items
  
    const res = {
      success: true,
      status: 200,
      error: null,
      data: [],
      more: false
    }

    try {
      // Try/Catch async/await pattern
      const availableTables = [
        'achievement',
        'attribute',
        'game',
        'xwgenesis',
        'internal',
        'player',
        'item',
        'modifier',
        'target',
        'rule',
        'ruletype',
        'ruletrigger',
        'unit',
      ]

      if (!ctx.query.table || availableTables.indexOf(ctx.query.table) === -1) throw new Error('Invalid table')

      const call = GET_TABLE({ code: TABLE_CODE, scope: ctx.query.scope ? ctx.query.scope : TABLE_SCOPE, ...ctx.query })

      // Sample call to 
      const { rows, more } = await EOS_API.rpc.get_table_rows(call)

      res.data = rows
      res.more = more

      ctx.body = res
      ctx.respond = true
    } catch (ex) {
      HANDLE_ERROR(ex, 'Error retrieving your table', res, ctx)
    }
  })
  
  router.post('/', async (ctx) => {
    // [Describe route purpose]
    // Store params in ctx.request.body a la bodyparser

    const res = {
      success: true,
      status: 200,
      error: null,
      data: {},
      transactionIds: []
    }

    try {
      // Async/Await pattern
      const availableActions = [
        'uplayer',
        'eplayer',
        'upsertgame',
        'addachiev',
        'updateachiev',
        'addattribute',
        'updateattr',
        'additem',
        'updateitem',
        'addmod',
        'updatemod',
        'addtarget',
        'updatetarget',
        'addrule',
        'updaterule',
        'addtrig',
        'updatetrig',
        'addrtype',
        'updatertype',
        'addunit',
        'updateunit',
        'cleardata'
      ]
      
      if (availableActions.indexOf(ctx.request.body.action) === -1) throw new Error('Invalid action')

      const actions = [
        BUILD_ACTION({ 
          name: ctx.request.body.action,
          account: ctx.request.body.account || TABLE_CODE,
          data: { ...ctx.request.body.data },
          actor: ctx.request.body.actor
        })
      ]

      // Destructure when appropriate
      const callResponse = await EOS_API.transact({
        actions
      }, {
        blocksBehind: 3,
        expireSeconds: 30,
      })
      
      res.data = ctx.request.body.data
      res.transactionIds = [callResponse.transaction_id]
      ctx.body = res
      ctx.respond = true
    } catch (ex) {
      HANDLE_ERROR(ex, 'Error performing action', res, ctx)
    }
  })
}
