const { TABLE_CODE, TABLE_SCOPE } = require('./statics')

const HANDLE_ERROR = (ex, msg='An error occurred! Give them a good message', res, ctx) => {
  // Sample error
  console.error(`${Date.now()} - ERROR - Unexpected error occurred: `, ex) // eslint-disable-line no-console
  let message = msg
  let code = 400
  if (ex.json && (ex.json.code === 401 || ex.json.code === 500)) {
    code = ex.json.code
    if (ex.json.error && ex.json.error.details) {
      message = ex.json.error.details[0].message
    } else {
      message = `${ex.json.message} - ${ex.json.error.what}`
    }
  }
  res.error = message
  res.success = false
  res.status = code
  ctx.body = res
  ctx.respond = true
}

const GET_TABLE = ({
  table, 
  code=TABLE_CODE, 
  scope=TABLE_SCOPE, 
  limit, 
  lower_bound, 
  upper_bound, 
  table_key, 
  index_position, 
  key_type,
  reverse=false,
  show_payer=false
}) => {
  const call = {
    code,
    scope,
    table,
    reverse,
    show_payer
  }

  if (limit) call.limit = limit
  if (lower_bound) call.lower_bound = lower_bound
  if (upper_bound) call.upper_bound = upper_bound
  if (index_position) call.index_position = index_position
  if (key_type) call.key_type = key_type
  if (table_key) call.table_key = table_key

  // console.log('Calling table with', call);

  return call
}

const BUILD_ACTION = ({ account=TABLE_CODE, name, actor=TABLE_SCOPE, permission='active', data}) => {
  return {
    account,
    name,
    authorization: [
      {
        actor,
        permission
      }
    ],
    data
  }
}

module.exports = { BUILD_ACTION, HANDLE_ERROR, GET_TABLE }
