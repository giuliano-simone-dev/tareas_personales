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
                        <a href="#" class="small" @click="editarTareaEvent(tarea)" v-if="tarea.finishedAt==null">Editar</a>
                        <a href="#" class="small px-4" @click="modalSubtarea(tarea)" v-if="tarea.finishedAt==null">Agregar Subtarea</a>
                    </div>
                    <div class="column is-half">
                        <p class="small text-end" :class="{ 'has-text-danger': expired }">
                            {{ tarea.finishedAt ? `Hecho el ${tarea.finishedAt.toLocaleDateString('es-ES')}` : `Vence el ${tarea.expiration.toLocaleDateString('es-ES')}` }}
                        </p>                
                    </div>
                </section>
                <section v-if="tarea.subTareas.length">
                        <b-progress
                            :type="isFinished(tarea) ? 'is-success' : 'is-info'" 
                            :value="calculateProgress(tarea)" 
                            show-value
                            format="percent"
                        >
                        {{ isFinished(tarea) ? 'Completado' : `${calculateProgress(tarea)}%` }}
                        </b-progress>
                    <h4 class="has-text-weight-bold py-2">Subtareas</h4>
                    <ul>
                        <li v-for="(subtarea, key) in tarea.subTareas">
                            <section class="columns py-0">
                                <div class="column is-6">
                                    <p><span class="has-text-weight-semibold">{{ subtarea.title }}</span> : {{ subtarea.description }}</p>
                                </div>
                                <div class="column is-6 force-vertical-center">
                                    <b-field>
                                        <b-checkbox :disabled="Boolean(tarea.finishedAt)" type="is-success" :value="Boolean(tarea.finishedAt) || Boolean(subtarea.finishedAt)"
                                            @input="markAsDone(subtarea, tarea)">Hecho</b-checkbox>
                                    </b-field>
                                </div>
                            </section>
                            <section class="columns pb-3">
                                <a href="#" class="small px-4" @click="eliminarSubTarea(tarea, key)" v-if="tarea.finishedAt==null">Eliminar</a>
                            </section>
                        </li>
                    </ul>
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
import { ISubTarea } from '@/interfaces/tareas';

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
        ...mapActions('tareas', ['fetchTareas', 'agregarTarea', 'editarTarea', 'eliminarTarea', 'editarTareaEditando', 'setShowSubtareaModal']),
        ...mapGetters('tareas', ['getService']),
        async markAsDone(tarea: Tareas|ISubTarea, padre:Tareas|null = null) {
            const loadingComponent = this.$buefy.loading.open({
                container: null,
            })
            if (tarea.finishedAt) {
                tarea.finishedAt = null;
            } else {
                tarea.finishedAt = new Date();
            }
            try{
                await this.editarTarea(padre || tarea);
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
        },
        modalSubtarea(tarea: Tareas){
            this.editarTareaEditando(tarea);
            this.setShowSubtareaModal(true);
        },
        calculateProgress(tarea:Tareas): number {
            if(tarea.finishedAt){
                return 100;
            }
            const subTareas = tarea.subTareas;
            const total = subTareas.length;
            const completadas = subTareas.filter((subtarea) => subtarea.finishedAt).length;
            return (completadas / total)*100;
        },
        isFinished(tarea:Tareas): boolean {
            const subTareas = tarea.subTareas;
            const total = subTareas.length;
            const completadas = subTareas.filter((subtarea) => subtarea.finishedAt).length;
            return total === completadas;
        },
        eliminarSubTarea(tarea: Tareas, key: number){
            //ask for confirmation
            this.$buefy.dialog.confirm({
                title: 'Borrar SubTarea',
                message: '¿Seguro que quieres <b>borrar</b> la subtarea? Esta acción no se puede deshacer.',
                confirmText: 'Borrrar Tarea',
                cancelText: 'Cancelar',
                type: 'is-danger',
                hasIcon: true,
                onConfirm: () => {
                    tarea.subTareas.splice(key, 1);
                    this.editarTarea(tarea);
                    this.$buefy.notification.open({
                        message: 'Subtarea eliminada',
                        type: 'is-success'
                    });
                }
            })
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