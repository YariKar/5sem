
<template>
  <div class="login_box">
    <p>Choose or input your name</p>
    <p><input class="button" list="brokers" v-model="selected">
      <datalist id="brokers">
        <option v-for="item in info" v-bind:key="item.id" :value="item.name">{{ item.name }}</option>
      </datalist>
      <button class="button" v-bind:disabled="!selected" v-on:click="loginClick">
        Login
      </button>
    </p>
  </div>
</template>


<script>
import axios from 'axios'
import router from '../Router.js'
const get_path = 'http://localhost:3001/getAllBrokers'


export default {
  name: 'LoginComponent',
  props: {

  },
  data() {
    return {
      info: null,
      selected: undefined
    };
  },
  created() {

    axios
      .get(get_path)
      .then(response => (this.info = response.data))
      .catch(error => {
        this.errorMessage = error.message;
        console.error("There was an error!", error);
      });

  },
  methods: {
    loginClick() {
      if (!this.selected)
        return;



      router.push({
        path: `/user/${this.selected}`
      })
    }
  }
}
</script>


<style>
body {
  background-image: linear-gradient(90deg, #8d917a, #C4C8B0);
  display: flex;
  align-items: center;
  justify-content: center;
}

.login_box {
  max-width: min-content;
  background-color: #B0A1B0;
  border-radius: 2vh;
  border-color: black;
  border-style: outset;
  font-size: large;
  font-weight: 600;
}

.button {
  background-color: #C5C8B7;
  font-weight: 300;
  border-radius: 2vh;
  border-color: black;
  border-style: outset;
}
</style>