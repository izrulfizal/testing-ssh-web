<template>
  <div id="app">
    <div>
      <input v-model="host" placeholder="Host" />
      <input v-model="port" placeholder="Port" />
      <input v-model="username" placeholder="Username" />
      <input v-model="password" type="password" placeholder="Password" />
      <button @click="connectToSSH">Connect</button>
    </div>
    <div id="terminal"></div>
  </div>
</template>

<script>
import { Terminal } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';

export default {
  data() {
    return {
      host: '',
      port: '',
      username: '',
      password: '',
      terminal: null
    };
  },
  methods: {
    async connectToSSH() {
      this.terminal = new Terminal();
      this.terminal.open(document.getElementById('terminal'));

      const response = await fetch('http://localhost:3000/ssh/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          host: this.host,
          port: this.port,
          username: this.username,
          password: this.password
        })
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        this.terminal.write(decoder.decode(value));
      }

      this.terminal.onData((data) => {
        fetch('http://localhost:3000/ssh/connect', {
          method: 'POST',
          body: data
        });
      });
    }
  }
};
</script>

<style>
#terminal {
  margin-top: 30px;
  width: 50%;
  height: 500px;
  background: black;
}
</style>
