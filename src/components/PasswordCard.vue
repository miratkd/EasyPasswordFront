<template>
    <div class="password-card-container">
        <span v-if="isLocal" v-on:click="saveLocalPassword(password)" class="material-icons password-card-alert-icon"
            :title="localPasswordMessage">error_outline</span>
        <div style="display: flex; gap: 1vw; align-items: center;">
            <p class="password-card-input-label">Site:</p>
            <input class="password-card-input password-card-input-label" type="text" disabled :value="password.site">
        </div>
        <div style="display: flex; gap: 1vw; align-items: center;">
            <p class="password-card-input-label">Senha:</p>
            <input class="password-card-input password-card-input-label password-card-password-input" :type="getType()"
                readonly :value="password.password">
            <span v-if="showPassword" class="material-icons password-card-show-icon" style="color: #A4FFAF"
                v-on:click="showPassword = !showPassword">visibility</span>
            <span v-else class="material-icons password-card-show-icon" style="color: gray"
                v-on:click="showPassword = !showPassword">visibility_off</span>
            <span class="material-icons password-card-copy-icon" v-on:click="copyToClipboard()">content_copy</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PasswordCard',
    props: ['password', 'callNotification', 'isLocal', 'saveLocalPassword'],
    data() {
        return {
            showPassword: false,
            localPasswordMessage: 'Esta senha esta salva apenas nesse dispositivo (nootebook, tablet, celular...), clique aqui para salvar esta senha nas nuvens e ter acesso a ela em outros dispositivos.'
        }
    },
    methods: {
        getType() {
            if (this.showPassword) return 'text'
            return 'password'
        },
        copyToClipboard() {
            navigator.clipboard.writeText(this.password.password)
            this.callNotification('Texto copiado.')
        },
    }
}
</script>

<style scoped>
.password-card-container {
    background-color: #24232C;
    padding: 1.5vh 2vw;
    margin: 3vh 0;
}

.password-card-alert-icon {
    font-size: 1.6em;
    color: #F8CD65;
    margin-left: 95%;
    cursor: pointer;
}

.password-card-input-label {
    color: #E6E5EA;
    font-weight: 700;
    font-size: 1.3em;
}

.password-card-input {
    border: 0;
    border-bottom: 1px solid #A4FFAF;
    background-color: transparent;
    margin: 2vh 0;
    width: 80%;
}

.password-card-input:focus {
    outline: 0;
}

.password-card-password-input {
    width: 70%;
}

.password-card-copy-icon {
    cursor: pointer;
    font-size: 1.6em;
    color: #A4FFAF;
}

.password-card-show-icon {
    cursor: pointer;
    font-size: 1.6em;
    margin-left: auto;
}

@media screen and (max-width: 800px) {
    .password-card-copy-icon {
        display: none;
    }
}
</style>