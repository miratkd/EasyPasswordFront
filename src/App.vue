<template>
  <div class="page-container">
    <div class="page-card">
      <h1 class="page-title">Easy Passsword</h1>
      <div v-if="account" class="page-welcome-container">
        <h3 data-test="page-title" class="page-title">Bem vindo {{ account.user.username }}</h3>
        <span class="material-icons page-welcome-cancel" v-on:click="showEndSession = true">cancel</span>
      </div>
      <h1 v-else class="page-login-message">
        Faça <b class="page-login-message-buttons" v-on:click="showLoginModal = true">Login</b> ou <b
          class="page-login-message-buttons" data-test="create-account-button" v-on:click="showCreateAccount = true">Crie uma conta</b>
      </h1>
      <PasswordInput :callNotification="callNotification" :setPassword="getPasswordCreated" :password="password" />
      <PasswordConfig :savePassword="showPasswordModal" :getPasswordCreated="getPasswordCreated" />
      <PasswordCard v-for="(savedPassword, idx) in localPasswordList" :key="idx" :isLocal="true"
        :saveLocalPassword="saveLocalPassword" :password="savedPassword" :callNotification="callNotification" />
      <PasswordCard v-for="(savedPassword, idx) in cloundPasswordList" :key="idx" :password="savedPassword"
        :callNotification="callNotification" />
    </div>

    <NotificationContainer v-if="notificationText" :clearNotification="clearNotification" :text="notificationText" />
    <SavePasswordModal v-if="showSaveModal" :savePassword="savePassword" :closeModal="closeSaveModal" :callNotification="callNotification"/>
    <CreateAccountModal v-if="showCreateAccount" :closeModal="closeCreateModal" :saveFirstPassword="saveFirstPassword"
      :callNotification="callNotification" />
    <EndSessionModal v-if="showEndSession" :close="closeEndSession" :action="endSession" />
    <Loader v-if="$store.state.isLoading" />
    <LoginModal v-if="showLoginModal" :getPasswords="getPasswords" :close="() => showLoginModal = false"
      :callNotification="callNotification" />
  </div>
</template>

<script>
import PasswordInput from './components/PasswordInput.vue';
import NotificationContainer from './components/NotificationContainer.vue';
import PasswordConfig from './components/PasswordConfig.vue';
import SavePasswordModal from './components/SavePasswordModal.vue';
import PasswordCard from './components/PasswordCard.vue';
import CreateAccountModal from './components/CreateAccountModal.vue';
import EndSessionModal from './components/EndSessionModal.vue';
import Loader from './components/Loader.vue';
import LoginModal from './components/LoginModal.vue';

export default {
  name: 'App',
  components: {
    PasswordInput,
    NotificationContainer,
    PasswordConfig,
    SavePasswordModal,
    PasswordCard,
    CreateAccountModal,
    EndSessionModal,
    Loader,
    LoginModal
  },
  data() {
    return {
      notificationText: undefined,
      password: undefined,
      showSaveModal: false,
      localPasswordList: [],
      cloundPasswordList: [],
      showCreateAccount: false,
      showEndSession: false,
      siteName: '',
      showLoginModal: false,
    }
  },
  computed: {
    account() {
      return this.$store.state.account
    }
  },
  beforeMount() {
    if (localStorage.getItem('localPasswordList')) this.localPasswordList = JSON.parse(localStorage.getItem('localPasswordList'))
    this.$store.state.accessToken = JSON.parse(localStorage.getItem('accessToken'))
    this.$store.state.refreshToken = JSON.parse(localStorage.getItem('refreshToken'))
    if (this.$store.state.accessToken) {
      this.getMe()
    } else { this.$store.commit('setIsLoading', false) }
  },
  methods: {
    saveLocalPassword(password) {
      if (this.account) {
        this.$store.commit('setIsLoading', true)
        this.$store.dispatch('savePassword', {
          site: password.site,
          password: password.password
        }).then(() => {
          this.removePasswordFromLocal(password)
          this.getPasswords()
        })
      } else {
        this.siteName = password.site
        this.password = password.password
        this.showCreateAccount = true
      }
    },
    removePasswordFromLocal(password) {
      let newLocalList = []
      this.localPasswordList.forEach(element => {
        if (element.site != password.site || element.password != password.password) {
          newLocalList.push(element)
        }
      })
      this.localPasswordList = newLocalList
      localStorage.setItem('localPasswordList', JSON.stringify(this.localPasswordList));
    },
    getPasswords() {
      this.$store.dispatch('getPasswords').then(resp => {
        this.cloundPasswordList = resp.data
      }).catch(error => {
        console.log(error);
      })
      this.$store.commit('setIsLoading', false)
    },
    endSession() {
      this.$store.commit('cleanAccount')
      this.cloundPasswordList = []
      this.localPasswordList = []
      this.closeEndSession()
    },
    closeEndSession() { this.showEndSession = false },
    getMe() {
      this.$store.dispatch('getMe').then(resp => {
        this.$store.commit('saveAccount', resp.data)
        this.getPasswords()
      }).catch(() => {
        this.$store.dispatch('refreshToken').then(() => {
          this.$store.dispatch('getMe').then(resp => {
            this.$store.commit('saveAccount', resp.data)
            this.getPasswords()
          })
        })
      })
    },
    callNotification(text) { this.notificationText = text },
    clearNotification() { this.notificationText = undefined },
    getPasswordCreated(value) { this.password = value },
    showPasswordModal() { 
      if (this.password) this.showSaveModal = true
      else this.callNotification('Por favor insira uma senha.')
    },
    closeSaveModal() { this.showSaveModal = false },
    closeCreateModal() { this.showCreateAccount = false },
    saveFirstPassword() {
      if (!this.siteName) {
        this.$store.commit('setIsLoading', false)
        this.showCreateAccount = false
        return
      }
      this.$store.dispatch('savePassword', {
        site: this.siteName,
        password: this.password
      }).then(() => {
        this.getPasswords()
        this.removePasswordFromLocal({site: this.siteName, password: this.password})
        this.showCreateAccount = false
        this.siteName = ''
      })
    },
    savePassword(siteName, saveOnClound) {
      if(!this.password) console.log('asdasdsa');
      console.log(this.password);
      if (saveOnClound && !this.account) {
        this.siteName = siteName
        this.showCreateAccount = true
      } else if (saveOnClound) {
        this.$store.commit('setIsLoading', true)
        this.$store.dispatch('savePassword', {
          site: siteName,
          password: this.password
        }).then(() => {
          this.getPasswords()
        })
      } else {
        this.localPasswordList.push({ site: siteName, password: this.password })
        localStorage.setItem('localPasswordList', JSON.stringify(this.localPasswordList));
      }
      this.closeSaveModal()
    }
  }

}
</script>

<style>
body {
  background-color: #18171F;
  color: #E6E5EA;
  margin: 0;
}

div {
  font-family: 'JetBrains Mono';
  font-style: normal;
}

p {
  margin: 0;
}

span {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  font-size: 1vw;
}

.page-card {
  width: 50vw;
  margin-top: 6vh;
}

.page-title {
  font-weight: 700;
  text-align: center;
  color: #817D92;
  font-size: 2.2em;
  margin: 0;
}

.page-login-message {
  font-weight: 500;
  text-align: center;
  color: #817D92;
  font-size: 2.2em;
}

.page-welcome-cancel {
  font-size: 2.5em;
  color: #817D92;
  cursor: pointer;
}

.page-welcome-cancel:hover {
  color: #FB7C58;
}

.page-welcome-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2vw;
  margin-top: 1vh;
}

.page-login-message-buttons {
  font-weight: 900;
  cursor: pointer;
}

.page-login-message-buttons:hover {
  color: lightgray;
  text-decoration: underline;
}

@media screen and (max-width: 850px) {
  .page-card {
    width: 75vw;
    margin-top: 5vw;

  }

  .page-container {
    font-size: 2vw;
  }
}

@media screen and (max-width: 450px) {
  .page-card {
    width: 80vw;
    margin-top: 5vw;
  }

  .page-container {
    font-size: 3vw;
  }
}
</style>
