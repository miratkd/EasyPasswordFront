<template>
  <div class="page-container">
    <div class="page-card">
      <h1 class="page-title">Password Generator</h1>
      <PasswordInput :callNotification="callNotification" :setPassword="getPasswordCreated" :password="password" />
      <PasswordConfig :savePassword="showPasswordModal" :getPasswordCreated="getPasswordCreated"/>
      <PasswordCard v-for="(savedPassword, idx) in localPasswordList" :key="idx" :password="savedPassword" :callNotification="callNotification"/>
    </div>
    
    <NotificationContainer v-if="notificationText" :clearNotification="clearNotification" :text="notificationText" />
    <SavePasswordModal v-if="showSaveModal" :savePassword="savePassword" :closeModal="closeSaveModal"/>
  </div>
</template>

<script>
import PasswordInput from './components/PasswordInput.vue';
import NotificationContainer from './components/NotificationContainer.vue';
import PasswordConfig from './components/PasswordConfig.vue';
import SavePasswordModal from './components/SavePasswordModal.vue';
import PasswordCard from './components/PasswordCard.vue';

export default {
  name: 'App',
  components: {
    PasswordInput,
    NotificationContainer,
    PasswordConfig,
    SavePasswordModal,
    PasswordCard
  },
  data() {
    return {
      notificationText: undefined,
      password: undefined,
      showSaveModal: false,
      localPasswordList: []
    }
  },
  created() {
    if (localStorage.getItem('localPasswordList')) this.localPasswordList = JSON.parse(localStorage.getItem('localPasswordList'))
  },
  methods: {
    callNotification(text) { this.notificationText = text },
    clearNotification() { this.notificationText = undefined },
    getPasswordCreated(value) { this.password = value },
    showPasswordModal () { this.showSaveModal = true },
    closeSaveModal () { this.showSaveModal = false },
    savePassword (siteName, saveOnClound) {
      if (saveOnClound) {
        console.log('Site: ' + siteName);
        console.log('Salvando nas nuvens');
      } else {
        this.localPasswordList.push({site: siteName, password: this.password})
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
}

.page-card {
  width: 50vw;
  margin-top: 7vw;
  font-size: 1vw;
}

.page-title {
  font-weight: 700;
  text-align: center;
  color: #817D92;
  font-size: 2.2em;
}

@media screen and (max-width: 800px) {
  .page-card {
    width: 75vw;
    margin-top: 5vw;
    font-size: 2vw;
  }
}

@media screen and (max-width: 450px) {
  .page-card {
    width: 80vw;
    margin-top: 5vw;
    font-size: 3vw;
  }
}</style>
