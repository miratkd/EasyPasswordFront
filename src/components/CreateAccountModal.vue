<template>
    <div class="create-modal-container" v-on:click="closeModal()">
        <div class="create-modal" @click.stop>
            <h1 class="create-account-header">Para poder salvar suas senhas, por favor crie uma conta.</h1>
            <div class="create-account-form-row">
                <p class="create-account-input-label">Usuário :</p>
                <div class="create-account-input-container">
                    <input type="text" class="create-account-input" :class="checkMessage(userMessage)" v-model="user">
                    <p>{{userMessage}}</p>
                </div>
            </div>
            <div class="create-account-form-row">
                <p class="create-account-input-label">Email :</p>
                <div class="create-account-input-container">
                    <input type="email" class="create-account-input" v-model="email" :class="checkMessage(emailMessage)">
                    <p>{{emailMessage}}</p>
                </div>
            </div>
            <div class="create-account-form-row">
                <p class="create-account-input-label">Senha :</p>
                <div class="create-account-input-container">
                    <input type="password" class="create-account-input" v-model="password" :class="checkMessage(passwordMessage)">
                    <p>{{passwordMessage}}</p>
                </div>
            </div>
            <div class="create-account-form-row">
                <p class="create-account-input-label">Confirmar senha :</p>
                <div class="create-account-input-container">
                    <input type="password" class="create-account-input" v-model="checkPassword" :class="checkMessage(checkPasswordMessage)">
                    <p>{{checkPasswordMessage}}</p>
                </div>
            </div>
            <div class="create-account-button-container">
                <button class="create-account-button" v-on:click="createAccount()">Criar conta</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CreateAccountModal',
    props: ['closeModal', 'saveFirstPassword', 'callNotification'],
    data() {
        return {
            email: '',
            emailMessage: '',
            password: '',
            passwordMessage:'',
            checkPassword: '',
            checkPasswordMessage: '',
            user: '',
            userMessage: ''
        }
    },
    methods:{
        createAccount () {
            if (!this.user) this.userMessage = 'Campo obrigatório.'
            if (!this.email) this.emailMessage = 'Campo obrigatório.'
            if (!this.password) this.passwordMessage = 'Campo obrigatório.'
            if (!this.checkPassword) this.checkPasswordMessage = 'Campo obrigatório.'
            if(!this.user || !this.email || !this.password || !this.checkPassword) return
            if (this.password != this.checkPassword) {
                this.checkPasswordMessage = 'As senhas não estão iguais.'
                return
            }
            const credentials = {
                userName: this.user,
                email: this.email,
                password: this.password
            }
            this.$store.commit('setIsLoading', true)
            this.$store.dispatch('createAccount', credentials).then (() => {
                this.$store.dispatch('login', credentials).then (resp => {
                    if (resp.success) {
                        this.callNotification('Conta criada com sucesso')
                        this.saveFirstPassword()
                    } else {
                        this.callNotification(resp.message)
                        this.$store.commit('setIsLoading', false)
                    }
                })
            }).catch (error => {
                if (error.response.status == 400) {
                    if (error.response.data.user.username) this.userMessage = error.response.data.user.username[0]
                    if (error.response.data.user.password) this.passwordMessage = error.response.data.user.password[0]
                    if (error.response.data.user.email) this.emailMessage = error.response.data.user.email[0]
                }
                this.$store.commit('setIsLoading', false)
            })
        },
        checkMessage (message) {
            if (message) return 'create-account-input-error'
        }
    }
}
</script>

<style scoped>
.create-modal-container {
    position: fixed;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(3px);
    display: flex;
    align-items: center;
    justify-content: center;
}

.create-modal {
    background-color: #24232C;
    width: 60vw;
    max-height: 80vh;
    padding: 5vh 6vw 0 6vw;
    border: 1px solid #A4FFAF;
    border-radius: 10px;
}

.create-account-header {
    font-weight: 700;
    text-align: center;
    font-size: 2em;
    margin-bottom: 4vh;
}

.create-account-form-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4vh;
}

.create-account-input-label {
    color: #E6E5EA;
    font-weight: 700;
    font-size: 1.3em;
    padding-right: 2vw;
}
.create-account-input-container{
    max-width: 70%;
    flex: 1;
}
.create-account-input {
    border: 0;
    background-color: transparent;
    border-bottom: 1px solid #A4FFAF;
    width: 100%;
    color: #E6E5EA;
    font-weight: 700;
    font-size: 1.2em;
}
.create-account-input-error{
    border-bottom: 1px solid #FB7C58;
}

.create-account-input:focus {
    outline: 0;
}

.create-account-button-container {
    display: flex;
    justify-content: center;
    margin: 5vh 0;
}

.create-account-button {
    background: #A4FFAF;
    border: 1px solid #A4FFAF;
    border-radius: 5px;
    padding: 1vh 0;
    width: 50%;
    text-align: center;
    color: #24232C;
    font-size: 1.2em;
    font-weight: 700;
    text-transform: uppercase;
    cursor: pointer;
}

.create-account-button:hover {
    background-color: transparent;
    color: #A4FFAF;
}
@media screen and (max-width: 450px) {
    .create-modal{width: 80vw;}
  }
</style>