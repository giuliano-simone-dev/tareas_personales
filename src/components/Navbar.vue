<template>
  <b-navbar>
    <template #brand>
      <b-navbar-item tag="router-link" :to="{ path: '/' }">
        <img src="../assets/logo.png" alt="Logo Personta">
      </b-navbar-item>
    </template>
    <template #start>
      <b-navbar-item href="/">
        Inicio
      </b-navbar-item>
      <b-navbar-item href="/dashboard" v-if="alreadyLoggedIn">
        Dashboard
      </b-navbar-item>
    </template>
    <template #end>
      <b-navbar-item tag="div">
        <a href="#" class="is-primary" v-if="alreadyLoggedIn" @click="logout">
            Cerrar Sesión
          </a>
        <div class="buttons" v-else>
          <a class="button is-primary" @click="showLogin = true">
            Iniciar Sesión
          </a>
        </div>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapMutations, mapGetters, mapActions } from 'vuex';

export default Vue.extend({
  name: 'Navbar',
  computed: {
    showLogin: {
      get(): false {
        return false;
      },
      set(value) {
        this.setShowLogin(value);
      }
    },
    alreadyLoggedIn:{
      get(): boolean {
        return this.isLogged();
      },
      set(value:boolean): boolean  {
        return this.isLogged();
      }
    }
  },
  methods: {
    ...mapMutations(['setShowLogin']),
    ...mapGetters(['isLogged']),
    ...mapActions(['logoutAction']),
    async logout(){
      await this.logoutAction();
      if(this.$route.path !== '/'){
        this.$router.push('/');
      }else{
        this.$router.go(0);
      }
    }
  }
});
</script>