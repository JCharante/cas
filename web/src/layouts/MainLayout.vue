<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          Central Authentication System (jcharante.com)
        </q-toolbar-title>

        <div>Served by {{ hostname }}</div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({})
export default class MainLayout extends Vue {
  hostname = '';

  async mounted() {
    const servedBy: string = (await this.$axios.get('/naapi/hostname')).data;
    this.hostname = servedBy;
  }
}
</script>
