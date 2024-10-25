<template>
  <section>

    <formTarea />
    <div class="columns is-centered">
      <div class="column is-4" v-if="tareasVencidas.length">
        <ListaTareas title="Tareas Vencidas" lista="tareasVencidas" :expired="true" />
      </div>
      <div class="column is-4">
        <ListaTareas title="Tareas" lista="tareasPendientes" />
      </div>
      <div class="column is-4">
        <ListaTareas title="Tareas Completas" lista="tareasCompletadas" />
      </div>
    </div>
  </section>

</template>

<script lang="ts">

import Vue from 'vue';
import ListaTareas from '@/components/ListaTareas.vue';
import formTarea from '@/components/formTarea.vue';
import { mapGetters } from 'vuex';

export default Vue.extend({
  name: 'DashboardView',
  components: {
    ListaTareas,
    formTarea
  },
  methods: {
    ...mapGetters(['tareasServiceGetter']),
    ...mapGetters("tareas",['getTareasVencidas'])
  },
  computed: {
    tareasVencidas() {
      return this.getTareasVencidas();
    }
  }
});

</script>

<style scoped>
.columns {
  margin: 10% 0;
  padding: 0;
}
</style>