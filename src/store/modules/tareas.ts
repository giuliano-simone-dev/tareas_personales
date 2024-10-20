// src/store/modules/tareas.ts
import { Module, ActionContext } from 'vuex';
import Tareas from '@/classes/tareas/Tareas';
import TareasService from '@/services/TareasService';
import type {TareasServiceIndex, TareasServiceType} from '@/services/TareasService';
import type { RootState } from '@/store';

export interface TareasState {
  tareas: Tareas[];
  service: TareasServiceType;
  tareaEditando: Tareas | null;
}

const state: TareasState = {
  tareas: [],
  service: TareasService,
  tareaEditando: null 
};

const getters = {
  getTareas: (state: TareasState): Tareas[] => state.tareas,
  getService: (): TareasServiceType => state.service,
  getTareasVencidas: (): Tareas[] => state.service.tareasVencidas,
  getTareasPendientes: (): Tareas[] => state.service.tareasPendientes,
  getTareasCompletadas: (): Tareas[] => state.service.tareasCompletadas,
  getTareaEditando: (state: TareasState): Tareas | null => {
    console.log(state.tareaEditando);
    return state.tareaEditando
  }
};

const mutations = {
  setTareas(state: TareasState, tareas: Tareas[]) {
    state.tareas = tareas;
  },
  updateService(state: TareasState) {
    state.service = state.service;
  },
  setTareaEditando(state: TareasState, tarea: Tareas) {
    state.tareaEditando = tarea;
  }
};

const actions = {
  async fetchTareas({ commit, rootState }: ActionContext<TareasState, RootState>) {
    let session = rootState.session ?? JSON.parse(localStorage.getItem('session') || 'null');
    await state.service.syncTareas(session.uid);
    commit('setTareas', state.service.getAllTareas());
  },
  async agregarTarea({ commit }: ActionContext<TareasState, RootState>, tarea: Tareas) {
    await state.service.agregarTarea(tarea);
    commit('setTareas', state.service.getAllTareas());

  },
  async editarTarea({ commit }: ActionContext<TareasState, RootState>, tarea: Tareas) {
    debugger;
    await state.service.editarTarea(tarea);
    commit('setTareas', state.service.getAllTareas());

  },
  async eliminarTarea({ commit }: ActionContext<TareasState, RootState>, tarea: Tareas) {
    await state.service.eliminarTarea(tarea);
    commit('setTareas', state.service.getAllTareas());
  },
  editarTareaEditando({ commit }: ActionContext<TareasState, RootState>, tarea: Tareas | null) {
    commit('setTareaEditando', tarea);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
} as Module<TareasState, RootState>;

