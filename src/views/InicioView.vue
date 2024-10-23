<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <Inicio/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Inicio from '@/components/Inicio.vue';

export default Vue.extend({
  name: 'HomeView',
  components: {
    Inicio,
  },
});
</script>
