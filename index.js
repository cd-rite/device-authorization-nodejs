import got from 'got'
import open from 'open'
import prompt from 'prompt-sync'

const oidcBase = 'http://localhost:8080/realms/stigman'
const apiBase = 'http://localhost:64001/api'
const client_id = 'stig-manager'
const scope = 'openid stig-manager:collection'

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
    open(process.argv[2] === 'complete' ? response.verification_uri_complete : response.verification_uri)

    let fetchToken = () => getToken(response.device_code)
    let validate = result => !!result.access_token
    let tokens = await poll(fetchToken, validate, response.interval * 1000)
    console.log(`Got access token from Keycloak`)

    console.log(`Requesting STIG Manager Collections`)
    const collections = await getCollections(tokens.access_token)
    console.log(collections)
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

async function getToken(device_code) {
  try {
    console.log('Requesting token')
    const response = await got.post('http://localhost:8080/realms/stigman/protocol/openid-connect/token', {
    // const response = await got.post('https://login.microsoftonline.com/863af28d-88be-4b4d-a58a-d5c40ee1fa22/oauth2/v2.0/token', {
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


