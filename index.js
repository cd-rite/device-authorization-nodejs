import got from 'got'
import open from 'open'
import prompt from 'prompt-sync'

// const config = import('./config')
import {config} from "./config.js"
// logger.writeInfo('index','configuration', config)

const oidcBase = config.client.authority
const apiBase = config.client.apiBase
const client_id = config.client.clientId
const scope = 'openid stig-manager:collection stig-manager:user stig-manager:stig stig-manager:op'

run()

async function run () {
  try {
    const oidcMeta = await getOidcMetadata(oidcBase)
    if (!oidcMeta.device_authorization_endpoint) {
      console.log(`Device Authorization grant is not supported by the OIDC Provider`)
      process.exit(1);
    }
    const response = await getDeviceCode(oidcMeta.device_authorization_endpoint, client_id, scope)
    
    console.log(response)
    // promptSync('Press any key to open browser')
    // open(process.argv[2] === 'complete' ? response.verification_uri_complete : response.verification_uri)
    open(process.argv[2] === 'complete' ? response.verification_uri_complete : response.verification_uri_complete)

    let fetchToken = () => getToken(oidcMeta.token_endpoint, response.device_code)
    let validate = result => !!result.access_token
    let tokens = await poll(fetchToken, validate, response.interval * 1000)
    console.log(`Got access token from Keycloak`)

    console.log(`Requesting STIG Manager Collections`)
    const collections = await getCollections(tokens.access_token)
    console.log(collections)
    console.log(JSON.stringify(collections))
  }
  catch (e) {
    console.log(e)
  }
}

function wait (ms = 1000) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

async function poll (fn, fnCondition, ms) {
  let result = await fn()
  while (!fnCondition(result)) {
    await wait(ms)
    result = await fn()
  }
  return result
}

async function getToken(url, device_code) {
  try {
    console.log('Requesting token')
    const response = await got.post(url, {
      form: {
        grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
        client_id: 'stig-manager',
        device_code
      }
    }).json()
    return response
  }
  catch (e) {
    return {}
  }
}

async function getDeviceCode (url, client_id, scope) {
  return await got.post(url, {
    form: {
      client_id,
      scope
    }
  }).json()
}

async function getOidcMetadata(url) {
  return await got.get(`${url}/.well-known/openid-configuration`).json()
}

async function getCollections (accessToken) {
  return await got.get(`${apiBase}/collections`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  }).json()

}


