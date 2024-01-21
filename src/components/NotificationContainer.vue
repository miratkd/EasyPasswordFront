<template>
  <div id="notificationContainerDiv" data-test="notification-container" class="notification-container">
    {{ text }}
    <span v-on:click="closeNotification()" class="material-icons notification-container-icon">cancel</span>
  </div>
</template>

<script>

export default {
  name: 'NotificationContainer',
  props: ['text', 'clearNotification'],
  data () {
    return {
      isAlive: true
    }
  },
  mounted() { this.init() },
  methods: {
    init() {
      setTimeout(() => {
        this.openNotification()
        setTimeout(() => {
          this.closeNotification()
          setTimeout(() => { this.clearNotification() }, 1000);
        }, 5000);
      }, 100)
    },
    closeNotification() { if (this.isAlive) document.getElementById('notificationContainerDiv').style.right = '-40vw' },
    openNotification() { if (this.isAlive) document.getElementById('notificationContainerDiv').style.right = '5vw' }
  },
  unmounted () {
    this.isAlive = false
  }
}
</script>

<style scoped>
.notification-container {
  min-width: 18vw;
  max-width: 28vw;
  background-color: #24232C;
  border: 1px solid #A4FFAF;
  border-radius: 8px;
  padding: 0.5vh 1vw;
  position: fixed;
  z-index: 10;
  bottom: 5vh;
  right: -30vw;
  transition: right 0.5s;
  font-size: 1.2em;
  color: #E6E5EA;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.notification-container-icon {
  cursor: pointer;
  font-size: 1.5em;
}
@media screen and (max-width: 450px){
  .notification-container{
    max-width: 38vw;
  }
}
</style>
