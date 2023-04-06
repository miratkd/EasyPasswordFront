import { createStore } from 'vuex'

export default createStore({
  state: {
    axios: require('axios'),
    backEndUrl: 'https://easy-password.up.railway.app/',
    clientId: 'YDuYI25DN7YpLwbdYhBKAnvh4koc6TsUbSPd29hU',
    clientSecret: 'nvHlefnciLQ285ejgt1FrJy4NXtXBeIK9lvugjH71mnAqDGs8m0ZmuRBJz2TSBaze85pd8WQwnThxCIJoTvJQM15M7S8vf6nRl2UNrIGTzmCwozUsFBepuCyLcAIvcyo',
    accessToken: undefined,
    refreshToken: undefined,
    account: undefined,
    isLoading: true,
  },
  getters: {
  },
  mutations: {
    setTokens (state, tokens) {
      state.accessToken = tokens.accessToken
      localStorage.setItem('accessToken', JSON.stringify(tokens.accessToken))
      state.refreshToken = tokens.refreshToken
      localStorage.setItem('refreshToken', JSON.stringify(tokens.refreshToken))
    },
    saveAccount (state, account) { state.account = account },
    cleanAccount (state) {
      state.account = undefined
      state.accessToken = undefined
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    },
    setIsLoading (state, value) { state.isLoading = value },
  },
  actions: {
    createAccount(context, payload) {
      return context.state.axios.post(
        context.state.backEndUrl + 'account/',
        {
          user: {
            username: payload.userName,
            email: payload.email,
            password: payload.password
          }
        },
        {}
      )
    },
    login (context, payload) {
      let config = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      const params = new URLSearchParams()
      params.append('grant_type', 'password')
      params.append('username', payload.userName)
      params.append('client_id', context.state.clientId)
      params.append('password', payload.password)
      params.append('client_secret', context.state.clientSecret)
      return context.state.axios.post(context.state.backEndUrl + 'o/token/', params, config).then(response => {
        context.commit('setTokens', {
          accessToken: response.data.token_type + ' ' + response.data.access_token,
          refreshToken: response.data.refresh_token
        })
        config = { headers: { Authorization: context.state.accessToken } }
        return context.state.axios.get(context.state.backEndUrl + 'account/me/', config).then(response => {
          context.commit('saveAccount', response.data)
          return { success: true, message: '' }
        })
      }).catch(error => {
        if (error.response && error.response.data.error_description === 'Invalid credentials given.') {
          return { success: false, message: 'Senha ou usuario incoretos.' }
        } else {
          return { success: false, message: 'Desculpe, não foi posivel fazer o login.' }
        }
      })
    },
    getMe (context) {
      let config = { headers: { Authorization: context.state.accessToken } }
      return context.state.axios.get(context.state.backEndUrl + 'account/me/', config)
    },
    refreshToken (context) {
      return new Promise(function (resolve, reject) {
        const config = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        const params = new URLSearchParams()
        params.append('grant_type', 'refresh_token')
        params.append('client_id', context.state.clientId)
        params.append('client_secret', context.state.clientSecret)
        params.append('refresh_token', context.state.refreshToken)
        context.state.axios.post(context.state.backEndUrl + 'o/token/', params, config).then(response => {
          context.commit('setTokens', {
            accessToken: response.data.token_type + ' ' + response.data.access_token,
            refreshToken: response.data.refresh_token
          })
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    savePassword (context, payload) {
      let config = { headers: { Authorization: context.state.accessToken } }
      return context.state.axios.post(context.state.backEndUrl + 'account/save_password/', payload, config)
    },
    getPasswords (context) {
      let config = { headers: { Authorization: context.state.accessToken } }
      return context.state.axios.get(context.state.backEndUrl + 'account/passwords/', config)
    }
  },
  modules: {
  }
})
