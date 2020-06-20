<template>
  <q-page class="row items-center justify-evenly">
    <div class="q-pa-md">
      <div class="q-gutter-y-md" style="max-width: 600px">
        <template v-if="$route.query.callback">
          <p>After logging in, you will be sent back to</p>
          <p>{{ $route.query.callback }}</p>
          <hr>
          <q-input type="email" v-model="email" label="Your email"/>
          <q-input type="password" v-model="password" label="Password"/>
          <template v-if="intent === 'signup'">
            <q-input type="password" v-model="passwordAgain" label="Confirm your password"/>
          </template>
          <div class="row justify-around">
            <q-btn :label="intent" outline color="primary" @click="submit"/>
            <q-btn outline
                   v-if="intent === 'login'"
                   label="Need an account?"
                   color="secondary"
                   @click="intent = 'signup'"
            />
            <q-btn outline
                   v-if="intent === 'signup'"
                   label="Login instead"
                   color="secondary"
                   @click="intent = 'login'"
            />
          </div>
        </template>
        <template v-else>
          <p>Sorry, you must be sent here from an application.</p>
          <p>We have plenty of great tools!</p>
          <p>If you expected a login page here, please help us improve.</p>
          <p>contactme AT jcharante.com</p>
          <p>I'm speaking in third person to appear more humble,</p>
          <p>because it's really just me and my (Docker) Swarm.</p>
        </template>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';


@Component({})
export default class Index extends Vue {
  private email = ''

  private password = ''

  private passwordAgain = ''

  private intent = 'login';

  private async submit() {
    try {
      if (this.intent === 'login') {
        const resp = await this.$axios
          .post('https://cas-api.jcharante.com/auth/login',
            {
              email: this.email,
              password: this.password,
            });
        const { data } = resp.data;
        console.log(data);
      } else if (this.intent === 'signup') {
        const resp = this.$axios
          .post('https://cas-api.jcharante.com/auth/signup',
            {
              email: this.email,
              password: this.password,
            });
      }
    } catch (error) {
      // eslint-disable-next-line no-alert
      window.alert(error.toString());
    }
  }
}
</script>
