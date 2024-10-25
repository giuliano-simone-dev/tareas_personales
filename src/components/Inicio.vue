<template>
  <div>
    <h1 class="has-text-weight-bold	">Gestor de Tareas de uso personal a tu medida</h1>
    <section v-if="alreadyLoggedIn" ref="helloUser">
      <div v-if="sessionData">
      <h2>¡Hola <span class="has-text-weight-bold	">{{sessionData.name}}</span>!</h2>
      <router-link to="/dashboard">Ir al Dashboard</router-link>
      <div class="container">
        <b-image v-if="sessionData.photoURL" class="is-3"
              ratio="1980by1080"
              :src="sessionData.photoURL"
              alt="Imagen de perfil" />
      </div>
    </div>
    </section>
    <section v-else>
      <h2>¡Bienvenido!</h2>
      <p>Para comenzar a usar la aplicación, inicia sesión</p>
      <a href="#" @click="()=>showLogin=true">Iniciar Sesión</a>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters, mapMutations } from 'vuex';
import type IUser from '@/interfaces/user';
export default Vue.extend({
  name: 'InicioView',
  data(){
    return {sessionData: null as IUser | null};
  },
  computed: {
    alreadyLoggedIn:{
      get(): boolean {
        return this.isLogged();
      },
      set(value:boolean): boolean  {
        return this.isLogged();
      }
    },
    showLogin: {
      get(): false {
        return false;
      },
      set(value) {
        this.setShowLogin(value);
      }
    },
    userData: {
      async get(): Promise<IUser|null> {
        return await this.getUserDBData();
      },
      set(value) {
        return this.getUserDBData();
      }
    }
  },
  methods: {
    ...mapGetters(['isLogged', 'getUserDBData']),
    ...mapMutations(['setShowLogin'])
  },
  async mounted() {
    const loadingComponent = this.$buefy.loading.open({
      container: this.$refs.helloUser,
    })
    this.sessionData = await this.userData as IUser|null;
    loadingComponent.close();
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
section{
  margin: 2.5% 0;
  padding: 0;
}
</style>
