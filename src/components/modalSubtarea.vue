<template>
   <b-modal v-model="mustShowModal" :width="640" scroll="keep">
            <div class="card">
                <header class="modal-card-head">
                    <p class="modal-card-title">Nueva Subtarea para: {{ tareaEditando?.title }}</p>
                </header>
                <div class="card-content">
                    <form @submit="sendForm">
                        <div class="py-5">
                            <b-field label="Titulo" required="true" label-position="on-border">
                                <b-input type="text" v-model="tarea.title" placeholder="Titulo" icon="format-title"></b-input>
                            </b-field>
                        </div>
                        <div class="py-5">
                            <b-field label="Descripción" required="true" label-position="on-border">
                                <b-input type="text" v-model="tarea.description" placeholder="Descripción" icon="text"></b-input>
                            </b-field>
                        </div>
                        <div class="is-flex is-justify-content-flex-end">
                            <b-button type="is-primary" tag="input" native-type="submit" value="Agregar Subtarea" />
                        </div>
                    </form>
                </div>
            </div>
        </b-modal>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import Tareas from '@/classes/tareas/Tareas';
import {ISubTarea, IdefaultForm as IdefaultData } from '@/interfaces/tareas';

const getDefaults = (): IdefaultData => {
    return {
        tarea: {
            title: '',
            description: '',
            expiration: null
        }
    }
}

export default Vue.extend({
    name:"modalSubtarea",
    data(): IdefaultData{
        return getDefaults();
    },
    computed:{
        tareaEditando:{
            get(): Tareas{
                return this.getTareaEditando();
            },
            set(val: Tareas): void{
                this.editarTareaEditando(val);
            }
        },
        mustShowModal: {
            get(): boolean {
                return this.getShowSubtareaModal();
            },
            set(value): void {
                this.setShowSubtareaModal(value);
            }
        }
    },
    methods:{
        ...mapActions('tareas', ['editarTareaEditando', 'editarTarea']),
        ...mapMutations('tareas', ['setShowSubtareaModal']),
        ...mapGetters(["getSession"]),
        ...mapGetters('tareas', ['getTareaEditando', 'getShowSubtareaModal']),

        async sendForm(e: Event): Promise<void> {
            let subtarea:ISubTarea = {
                title: this.tarea?.title,
                description: this.tarea.description,
                finishedAt: null
            }
            this.tareaEditando.subTareas.push(subtarea);
            await this.editarTarea(this.tareaEditando);
            await this.editarTareaEditando(null);
            this.tarea = getDefaults().tarea;
            this.mustShowModal = false;
        }
    }
})

</script>