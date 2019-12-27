import { Api, JsonRpc } from 'eosjs'
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'
import fetch from 'node-fetch'
import { TextDecoder, TextEncoder } from 'text-encoding'
import dotenv from 'dotenv-safe'

// Your keys and things
// TABLE_CODE is the CrossWorlds contract account, for Lynx it's `crossworlds` for EOS it's `crossworlds1`
// TABLE_SCOPE is the owner of the data for a specific game, for example the `dawntd` account on Lynx
let { LYNX_TEST = '', MAIN_NET = '', IS_TESTNET = true, PRIVATE_KEY = '', TABLE_CODE = '', TABLE_SCOPE = '' } = dotenv.config().required
let rpc = null

// Eventually we'll need to add in a handler that switching to different chains
// This is setup for Lynx right now
if (IS_TESTNET) {
  // For Jungle Test
  TABLE_CODE = `crossworlds`
  rpc = new JsonRpc(LYNX_TEST, { fetch })
} else {
  // For Live
  TABLE_CODE = `crossworlds`
  rpc = new JsonRpc(MAIN_NET, { fetch })
}

const signatureProvider = new JsSignatureProvider([PRIVATE_KEY]);
const EOS_API = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() })

module.exports = { EOS_API, TABLE_CODE, TABLE_SCOPE, IS_TESTNET }
