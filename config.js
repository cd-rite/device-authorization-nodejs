// import package from './package.json'


let config = {
    // version: package.version,

    client: {
        clientId: process.env.STIGMAN_CLIENT_ID || "stig-manager",
        authority: process.env.STIGMAN_CLIENT_OIDC_PROVIDER || process.env.STIGMAN_OIDC_PROVIDER || "https://cd-rite-ideal-waffle-7564w9x7x6wcw4r4-8080.preview.app.github.dev/realms/stigman",
        // apiBase: process.env.STIGMAN_CLIENT_API_BASE || "http://localhost:54000/api",
        apiBase: process.env.STIGMAN_CLIENT_API_BASE_EXTERNAL || "http://localhost:54000/api",
        
        // disabled: process.env.STIGMAN_CLIENT_DISABLED === "true",
        // directory: process.env.STIGMAN_CLIENT_DIRECTORY || '../../client/dist',
        // extraScopes: process.env.STIGMAN_CLIENT_EXTRA_SCOPES,
        // scopePrefix: process.env.STIGMAN_CLIENT_SCOPE_PREFIX,
        // refreshToken: {
        //     disabled: process.env.STIGMAN_CLIENT_REFRESH_DISABLED ? process.env.STIGMAN_CLIENT_REFRESH_DISABLED === "true" : false,
        // },
        // welcome: {
        //     image: process.env.STIGMAN_CLIENT_WELCOME_IMAGE || "",
        //     message: process.env.STIGMAN_CLIENT_WELCOME_MESSAGE || "",
        //     title: process.env.STIGMAN_CLIENT_WELCOME_TITLE || "",
        //     link: process.env.STIGMAN_CLIENT_WELCOME_LINK || ""
        // }
    },
    oauth: {
        // authority: process.env.STIGMAN_OIDC_PROVIDER || process.env.STIGMAN_API_AUTHORITY || "http://localhost:8080/auth/realms/stigman",
        // claims: {
        //     scope: process.env.STIGMAN_JWT_SCOPE_CLAIM || "scope",
        //     username: process.env.STIGMAN_JWT_USERNAME_CLAIM || "preferred_username",
        //     servicename: process.env.STIGMAN_JWT_SERVICENAME_CLAIM || "clientId",
        //     name: process.env.STIGMAN_JWT_NAME_CLAIM || process.env.STIGMAN_JWT_USERNAME_CLAIM || "name",
        //     privileges: formatChain(process.env.STIGMAN_JWT_PRIVILEGES_CLAIM || "realm_access.roles"),
        //     email: process.env.STIGMAN_JWT_EMAIL_CLAIM || "email"
        // }
    },
    log: {
        // level: parseInt(process.env.STIGMAN_LOG_LEVEL) || 3,
        // mode: process.env.STIGMAN_LOG_MODE || 'combined' 
    }
}

function formatChain(path) {
    const components = path?.split('.')
    if (components?.length === 1) return path
    for (let x=0; x < components.length; x++) {
      components[x] = `['${components[x]}']`
    }
    return components.join('?.')
  }
  
  // module.exports = config
  // export config = "config"
  export {config}
