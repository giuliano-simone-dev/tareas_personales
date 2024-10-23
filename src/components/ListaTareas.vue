<template>
    <div class="card has-background-light">
        <div class="card-header">
            <p class="card-header-title">{{ title }}</p>
        </div>
        <section v-if="tareas.length">
            <div class="card-content" v-for="(tarea) in tareas">
                <section class="columns">
                    <div class="column is-8">
                        <p class="titulo" :class="{ 'has-text-danger': expired }">{{ tarea.title }}</p>
                    </div>
                    <div class="column is-4 force-vertical-center">
                        <b-field>
                            <b-checkbox type="is-success" :value="Boolean(tarea.finishedAt)"
                                @input="markAsDone(tarea)">Hecho</b-checkbox>
                        </b-field>
                    </div>
                </section>
                <p>{{ tarea.description }}</p>
                <section class="columns mt-2">
                    <div class="column is-half">
                        <a href="#" class="small" @click="editarTareaEvent(tarea)">Editar</a>
                    </div>
                    <div class="column is-half">
                        <p class="small text-end" :class="{ 'has-text-danger': expired }">
                            {{ tarea.finishedAt ? `Hecho el ${tarea.finishedAt.toLocaleDateString('es-ES')}` : `Vence el ${tarea.expiration.toLocaleDateString('es-ES')}` }}
                        </p>                
                    </div>
                </section>
                <hr>
            </div>
        </section>
        <section class="card-content" v-else>
            <p class="has-text-centered">No hay tareas</p>
            <hr>
        </section>

    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';
import Tareas from '@/classes/tareas/Tareas';
import tareas from '@/store/modules/tareas';

export default Vue.extend({
    name: 'ListaTareas',
    props: {
        title: {
            type: String,
            required: true
        },
        lista: {
            type: String,
            required: true
        },
        expired: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    computed: {
        tareas(): Tareas[] {
            return this.getService()[this.lista].sort((a: Tareas, b: Tareas) => {
                if (a.expiration < b.expiration) {
                    return 1;
                }
                if (a.expiration > b.expiration) {
                    return -1;
                }
                return 0;
            });
        }
    },
    methods: {
        ...mapActions('tareas', ['fetchTareas', 'agregarTarea', 'editarTarea', 'eliminarTarea', 'editarTareaEditando']),
        ...mapGetters('tareas', ['getService']),
        async markAsDone(tarea: Tareas) {
            const loadingComponent = this.$buefy.loading.open({
                container: null,
            })
            if (tarea.finishedAt) {
                tarea.finishedAt = null;
            } else {
                tarea.finishedAt = new Date();
            }
            try{
                await this.editarTarea(tarea);
                this.$buefy.notification.open({
                    message: `Tarea ${tarea.finishedAt ? 'completada' : 'reabierta'}`,
                    type: 'is-success'
                });
            }catch(e){
                console.error(e);
                this.$buefy.notification.open({
                    message: 'Error al actualizar la tarea',
                    type: 'is-danger'
                });
            }finally{
                loadingComponent.close();
            }
        },
        editarTareaEvent(tarea: Tareas) {
            console.log(this.editarTareaEditando)
            this.editarTareaEditando(tarea);
        }
    },
    async created() {
        const loadingComponent = this.$buefy.loading.open({
                    container: null,
        })
        await this.fetchTareas(this.lista);
        loadingComponent.close();
    }
});
</script>

<style scoped>

.card-content {
    text-align: start;
    padding-bottom: 0;
}

.titulo {
    font-size: 1.5rem;
    font-weight: bold;
    padding: 0;
}

.small {
    font-size: 0.8rem;
}

.text-end {
    text-align: end;
}

hr {
    border: 0;
    border-top: 1px solid #ddd;
    width: 100%;
}

.force-vertical-center {
    display: flex;
    align-items: center;
    justify-content: end;
}
</style>