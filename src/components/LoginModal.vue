<template>
  <b-modal v-model="showLogin" title="Login">
    <div class="card">
      <header class="card-header">
        <p class="card-header-title">{{ showRegister ? "Registrarse" : "Iniciar Sesión" }}</p>
      </header>
      <transition name="fade-down">
        <form class="card-content h-80" v-if="showRegister" @submit="sendRegister">
          <b-field horizontal label="Nombre">
            <b-input type="text" placeholder="Nombre" required icon="account" v-model="registerData.name" />
          </b-field>
          <b-field horizontal label="Email" required :type="messageRegisterStatus.email.type"
            :message="messageRegisterStatus.email.message">
            <b-input type="email" placeholder="Email" required v-model="registerData.email" icon="email" />
          </b-field>
          <b-field horizontal label="Contraseña">
            <b-input type="password" placeholder="Contraseña" required icon="lock" password-reveal
              v-model="registerData.password" />
          </b-field>
          <div class="doble-card">
            <section class="cell">
              <b-field label="Imágen de perfil">
                <b-upload v-model="registerData.image" required class="cell" drag-drop accept="image/*">
                  <section class="section">
                    <div class="content has-text-centered">
                      <p>
                        <b-icon icon="upload" size="is-large">
                        </b-icon>
                      </p>
                      <p>Arrastra y suelta una imagen</p>
                    </div>
                  </section>
                </b-upload>
              </b-field>
            </section>
            <section class="cell">
              <b-image :src="getFileUrl(registerData.image)" alt="Imagen de perfil">
              </b-image>
            </section>
          </div>
          <div class="is-flex is-justify-content-flex-end">
            <b-button type="is-primary" tag="input" native-type="submit" value="Registrarse" />
          </div>
        </form>
      </transition>
      <transition name="fade-up">
        <form class="card-content" v-if="!showRegister" @submit="sendLogin">
          <b-field horizontal label="Email" required="true" :type="messageLoginStatus.type">
            <b-input type="email" v-model="loginData.email" placeholder="Email" icon="email"></b-input>
          </b-field>
          <b-field horizontal label="Contraseña" required="true" :type="messageLoginStatus.type" :message="messageLoginStatus.message">
            <b-input type="password" password-reveal v-model="loginData.password" placeholder="Contraseña"
              icon="lock"></b-input>
          </b-field>
          <div class="is-flex is-justify-content-flex-end">
            <b-button tag="input" native-type="submit" value="Iniciar Sesión" type="is-primary" />
          </div>
        </form>
      </transition>
      <footer class="card-footer">
        <p class="card-footer-item">
          <span v-if="showRegister">¿Ya tienes cuenta?<a href="#" @click="showRegister = false"> Inicie
              Sesión</a></span>
          <span v-else="showRegister">¿Aún no tienes cuenta?<a href="#" @click="showRegister = true">
              Regístrese</a></span>
        </p>
      </footer>
    </div>
  </b-modal>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { IdefaultData } from '../interfaces/login';

let getDefaultData = function():IdefaultData{
  return {
    showRegister: false,
    messageLoginStatus: {
      type: '',
      message: ''
    },
    messageRegisterStatus: {
      email: {
        type: '',
        message: ''
      }
    },
    loginData: {
      email: '',
      password: ''
    },
    registerData: {
      name: '',
      email: '',
      password: '',
      image: null as File | null
    }

  }
}


export default Vue.extend({
  name: 'LoginModal',
  data() {
    return getDefaultData();
  },
  computed: {
    showLogin: {
      get(): boolean {
        return this.mustShowLogin();
      },
      set(value) {
        this.setShowLogin(value);
      }
    }
  },

  methods: {
    ...mapMutations(['setShowLogin']),
    ...mapGetters(['mustShowLogin']),
    ...mapActions(['login', 'register']),

    getFileUrl: (file: File | null): string => file?.type.startsWith('image/') ? URL.createObjectURL(file) : require('@/assets/default_profile.png'),

    async sendLogin(e: Event): Promise<void> {
      e.preventDefault();
      if(!this.loginData.email || !this.loginData.password){
        this.messageLoginStatus = {
          type: 'is-danger',
          message: 'Email o contraseña incorrectos'
        };
        return;
      }
      try {
        await this.login({
          email: this.loginData.email,
          password: this.loginData.password
        });
        this.$buefy.notification.open({
          message: 'Inicio de sesión exitoso',
          type: 'is-success'
        });
        this.loginData = getDefaultData().loginData;
        this.showLogin = false;
        this.$router.push({ path: '/dashboard' });

      } catch (error: any) {
        if (error.code === 'error/login') {
          this.messageLoginStatus = {
            type: 'is-danger',
            message: 'Email o contraseña incorrectos'
          };
          return;
        }
        this.messageLoginStatus = {
          type: 'is-danger',
          message: 'Ha ocurrido un error inesperado'
        };
      }
    },

    async sendRegister(e: Event): Promise<void> {
      e.preventDefault();
      try {
        const loading = this.$buefy.loading.open({
          container: null
        });
        await this.register(this.registerData);

        this.$buefy.notification.open({
          message: 'Registro exitoso',
          type: 'is-success'
        })

        this.$router.push({ path: '/dashboard' });
        this.registerData = getDefaultData().registerData;
        this.showLogin = false;
        loading.close();

      } catch (error: any) {
        if (error.code === 'error/register') {
          this.messageRegisterStatus.email = {
            type: 'is-danger',
            message: error.message
          };
          return;
        }
        this.$buefy.notification.open({
          message: 'Ha ocurrido un error inesperado',
          type: 'is-danger'
        })
      }
    }
  }
});
</script>

<style scoped>
.fade-up-enter-active,
.fade-down-enter-active {
  transition: all 1s ease;
}

.fade-up-enter {
  position: absolute;
  background-color: rgba(255, 255, 255, 0);
  transform: translateY(-100%);
  opacity: 0;
}

.fade-down-enter {
  position: absolute;
  background-color: rgba(255, 255, 255, 0);
  transform: translateY(100%);
  opacity: 0;
}

.fade-up-leave-active,
.fade-down-leave-active {
  position: absolute;
  opacity: 0;
  transition: all 0s ease;
}



.card {
  overflow: hidden;
}

.card-content {
  min-height: 30vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.is-flex.is-justify-content-flex-end {
  align-self: flex-end;
}

.doble-card {
  width: 100%;
  margin: 2% 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.doble-card>.cell {
  width: 45% !important;
  margin-right: 1%;
}
</style>