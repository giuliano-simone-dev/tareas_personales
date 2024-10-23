// store/index.ts
import Vue from 'vue';
import Vuex from 'vuex';
import { auth, db, storage } from '../firebase';
import { LoginError, RegisterError } from '@/classes/errors/login';
import tareas from './modules/tareas';
import type firebase from 'firebase/compat';

Vue.use(Vuex);

export interface RootState {
  showLogin: boolean;
  session: firebase.User | null;
}

export default new Vuex.Store<RootState>({
  state: {
    showLogin: false,
    session: null
  },
  getters: {
    mustShowLogin: state => state.showLogin,
    isLogged: state => (state.session ?? JSON.parse(localStorage.getItem('session') || 'null')) !== null,
    getSession: state => {
      state.session ??= JSON.parse(localStorage.getItem('session') || 'null');
      return state.session;
    },
    getUserDBData: async (state) => {
      let session = (state.session ?? JSON.parse(localStorage.getItem('session') || 'null'));
      if (!session) {
        return null;
      }
      const user = await db.collection('users').doc(session.uid).get();
      return user.data() || null;
    }
  },
  mutations: {
    setShowLogin(state, value: boolean) {
      const session = state.session ?? JSON.parse(localStorage.getItem('session') || 'null');
      if (session !== null) {
        state.showLogin = false;
        return;
      }
      state.showLogin = value;
    },
    async setSession(state, value: firebase.User | null) {
      state.session = value;
      if (value) {
        localStorage.setItem('session', JSON.stringify(value));
      } else {
        localStorage.removeItem('session');
      }
    }
  },
  actions: {
    async login({ commit }, { email, password }) {
      try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        commit('setSession', userCredential.user);
      } catch (e: any) {
        if (e.code === 'auth/invalid-credential') {
          throw new LoginError('Usuario no encontrado');
        }
        throw e;
      }
    },
    async logoutAction({ commit }) {
      await commit('setSession', null);
      await auth.signOut();
    },
    async register({ commit }, { email, password, name, image }: { email: string, password: string, name: string, image: File }) {
      try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        if (!user) {
          throw new LoginError('No se pudo crear el usuario');
        }

        const storedRef = storage.ref();
        const fileRef = storedRef.child('profileImages/' + user.uid);
        await fileRef.put(image);
        const photoURL = await fileRef.getDownloadURL();
        db.collection('users').doc(user.uid).set({
          name,
          email: user.email,
          photoURL
        });
        commit('setSession', userCredential.user);
      } catch (e: any) {
        if (e.code === 'auth/email-already-in-use') {
          throw new RegisterError('El correo ya está en uso');
        }
        throw e;
      }
    }
  },
  modules: {
    tareas
  }
});