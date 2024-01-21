<template>
  <div class="config-container">
    <div class="config-title-container">
      <p>Quantidade de caracteres</p>
      <p class="config-title-number">{{charNumber}}</p>
    </div>
    <input data-test="slide-input" class="config-range-input" v-model="charNumber" min="5" max="15" type="range">
    <div class="config-check-container" data-test="upper-check" v-on:click="updateUpperCase(!upperCase)">
      <span v-if="upperCase" class="material-icons config-check-true">check_box</span>
      <span v-else class="material-icons config-check-false">check_box_outline_blank</span>
      <p>Incluir letra maiúsculas.</p>
    </div>
    <div class="config-check-container" data-test="lower-check" v-on:click="updateLowerCase(!lowerCase)">
      <span v-if="lowerCase" class="material-icons config-check-true">check_box</span>
      <span v-else class="material-icons config-check-false">check_box_outline_blank</span>
      <p>Incluir letra minúsculas.</p>
    </div>
    <div class="config-check-container" data-test="numbers-check" v-on:click="updateNumbers(!numbers)">
      <span v-if="numbers" class="material-icons config-check-true">check_box</span>
      <span v-else class="material-icons config-check-false">check_box_outline_blank</span>
      <p>Incluir numeros.</p>
    </div>
    <div class="config-check-container" data-test="symbols-check" v-on:click="updateSymbols(!symbols)">
      <span v-if="symbols" class="material-icons config-check-true">check_box</span>
      <span v-else class="material-icons config-check-false">check_box_outline_blank</span>
      <p>Incluir simbolos.</p>
    </div>
    <div class="config-level-container">
      <p class="config-level-label">Força</p>
      <div class="config-level-bars-container">
        <p data-test="level-name" class="config-level-name">{{getLevelName()}}</p>
        <div class="config-level-bar" :class="getActiveBar(1)"></div>
        <div class="config-level-bar" :class="getActiveBar(2)"></div>
        <div class="config-level-bar" :class="getActiveBar(3)"></div>
        <div class="config-level-bar" :class="getActiveBar(4)"></div>
      </div>
    </div>
    <GenerateButton :action="generatePassword"/>
    <SaveButton :action="savePassword"/>
  </div>
</template>

<script>
import GenerateButton from './GenerateButton.vue'
import SaveButton from './SaveButton.vue'
export default {
  name: 'PasswordConfig',
  components:{GenerateButton, SaveButton},
  props: ['getPasswordCreated', 'savePassword'],
  data () {
    return {
      charNumber: 10,
      upperCase: true,
      lowerCase: true,
      numbers: true,
      symbols: false,
    }
  },
  methods: {
    updateUpperCase (value) {
      if (this.lowerCase || this.numbers || this.symbols) this.upperCase = value
    },
    updateLowerCase (value) {
      if (this.upperCase || this.numbers || this.symbols) this.lowerCase = value
    },
    updateNumbers (value) {
      if (this.lowerCase || this.upperCase || this.symbols) this.numbers = value
    },
    updateSymbols (value) {
      if (this.upperCase || this.numbers || this.lowerCase) this.symbols = value
    },
    getLevelName() {
      if (this.passwordLevel == 1) return 'Muito fraca!'
      else if (this.passwordLevel == 2) return 'Fraca.'
      else if (this.passwordLevel == 3) return 'Media.'
      else if (this.passwordLevel >= 4) return 'Forte.'
    },
    getActiveBar(level) {
      let className
      if (this.passwordLevel == 1) { className = 'config-level-bar-realy-weak' }
      else if (this.passwordLevel == 2) { className = 'config-level-bar-weak' }
      else if (this.passwordLevel == 3) { className = 'config-level-bar-medium' }
      else if (this.passwordLevel >= 4) { className = 'config-level-bar-strong' }
      if (level <= this.passwordLevel) return className
    },
    generatePassword() {
      let result = '';
      let characters = ''
      if (this.upperCase) characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      if (this.lowerCase) characters += 'abcdefghijklmnopqrstuvwxyz'
      if (this.numbers) characters += '0123456789'
      if (this.symbols) characters += '!@#$%^&*()'
      let counter = 0;
      while (counter < this.charNumber) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
        counter += 1;
      }
      this.getPasswordCreated(result)
    }
  },
  computed: {
    passwordLevel () {
      let level = this.charNumber / 7
      if (this.upperCase) level += 0.5
      if (this.lowerCase) level += 0.5
      if (this.numbers) level += 0.5
      if (this.symbols) level += 0.5
      return Math.round(level)
    }
  }
}
</script>

<style scoped>
.config-container {
  background-color: #24232C;
  padding: 2vh 2.5vw;
  margin-top: 2vh;
}
.config-title-container{
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #E6E5EA;
  font-weight: 700;
  font-size: 1.3em;
}
.config-title-number{
  font-size: 1.7em;
  color: #A4FFAF;
}
.config-range-input{
  width: 100%;
  margin-top: 2vh;
  -webkit-appearance: none;  
  appearance: none;
  background: #18171F; 
  outline: none;
  height: 1em;
  border-radius: 8px;
}
.config-range-input::-webkit-slider-thumb {
  -webkit-appearance: none; 
  appearance: none;
  width: 2em; 
  height: 2em; 
  background: #A4FFAF; 
  cursor: grab; 
  border-radius: 50%;
}

.config-range-input::-moz-range-thumb {
  width: 2em; 
  height: 2em; 
  border-radius: 50%;
  background: #A4FFAF; 
  cursor: grab; 
}
.config-check-container{
  display: flex;
  align-items: center;
  gap: 2vw;
  margin-top: 2vh;
  cursor: pointer;
  font-size: 1.2em;
  width: fit-content;
}
.config-check-true{
  font-size: 1.5em;
  color: #A4FFAF;
}
.config-check-false{
  font-size: 1.5em;
}
.config-level-container{
  background: #18171F;
  padding: 1.5vh 4vw;
  margin-top: 3vh;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.config-level-label{
  color: #817D92;
  font-weight: 700;
  font-size: 1.35em;
  text-transform: uppercase;
}
.config-level-bars-container{
  display: flex;
  align-items: center;
  gap: 1vw;
  
}
.config-level-bar{
  width: 1em;
  outline: 2px solid white;
  height: 3vh;
}
.config-level-bar-strong{background-color: #A4FFAF;}
.config-level-bar-realy-weak{background-color: #F64A4A;}
.config-level-bar-weak{background-color: #FB7C58;}
.config-level-bar-medium{background-color: #F8CD65;}
.config-level-name{
  font-weight: 700;
  font-size: 1.85em;
  text-transform: uppercase;
  margin-right: 1vw;
}
</style>