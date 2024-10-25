<template>
    <div class="container">
        <h2 class="is-size-2">{{ tareaEditando ? "Editar Tarea" :  "Crear Tarea"  }}</h2>
        <form action="#" @submit="sendForm">
            <div class="columns text-right">
                <div class="" v-if="tareaEditando">
                    <b-button type="is-danger" icon-right="delete" @click="deleteTareaBTN" />
                </div>
            </div>
            <div class="columns">
                <div class="column is-half">
                    <b-field label="Título">
                        <b-input v-model="tarea.title" type="text" required></b-input>
                    </b-field>
                </div>
                <div class="column is-half">
                    <b-field label="Fecha de vencimiento">
                        <b-datepicker v-model="tarea.expiration" placeholder="Click to select..."
                            required></b-datepicker>
                    </b-field>
                </div>
            </div>
            <div class="columns is-centered">
                <div class="column is-half">
                    <b-field label="Descripción">
                        <b-input v-model="tarea.description" type="textarea" required></b-input>
                    </b-field>

                </div>
            </div>
            <div class="columns">
                <div class="column is-half">
                    <div class="is-pulled-left" v-if="tareaEditando">
                        <b-button type="is-secondary" @click="stopEdit">Dejar de editar</b-button>
                    </div>
                </div>
                <div class="column is-half">
                    <div class="text-right">
                        <b-button :disabled="!checkForm()" type="is-primary" native-type="submit">Guardar</b-button>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';
import Tareas from '@/classes/tareas/Tareas';
import { IdefaultForm as IdefaultData } from '@/interfaces/tareas';

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
    name: 'FormTarea',
    data() {
        return getDefaults();
    },
    computed: {
        tareaEditando: {
            get(): Tareas {
                return this.getTareaEditando();
            },
            set(val: Tareas): void {
                this.editarTareaEditando(val);
            }
        }
    },
    watch: {
        tareaEditando: {
            handler: function (val: Tareas) {
                if (val) {
                    this.tarea = {
                        title: val.title,
                        description: val.description,
                        expiration: val.expiration
                    };
                } else {
                    this.tarea = getDefaults().tarea;
                }
            },
            immediate: true
        }
    },
    methods: {
        ...mapActions('tareas', ['agregarTarea', 'editarTareaEditando', 'editarTarea', 'eliminarTarea']),
        ...mapGetters(["getSession"]),
        ...mapGetters('tareas', ['getTareaEditando']),

        async sendForm(e: Event): Promise<void> {
            e.preventDefault();
            if (!this.checkForm()) return;
            let session = this.getSession();
            const loadingComponent = this.$buefy.loading.open({
                container: null,
            })
            let msg = "";
            try{
                if (this.tareaEditando) {
                    this.tareaEditando.title = this.tarea.title;
                    this.tareaEditando.description = this.tarea.description;
                    this.tareaEditando.expiration = this.tarea.expiration as Date;
                    await this.editarTarea(this.tareaEditando);
                    await this.editarTareaEditando(null);
                    msg = 'Tarea Editada Exitosamente';
                } else {
                    let tarea = new Tareas({
                        _id: null,
                        title: this.tarea.title,
                        description: this.tarea.description,
                        expiration: this.tarea.expiration as Date,
                        userID: session.uid,
                        finishedAt: null
                    })

                    await this.agregarTarea(tarea);
                    msg = 'Tarea Agregada Exitosamente';
                }
                this.tarea = getDefaults().tarea;
                    this.$buefy.notification.open({
                        message: msg,
                        type: 'is-success'
                    });
            }catch(e){
                console.error(e);
                this.$buefy.notification.open({
                    message: 'Ha ocurrido un error inesperado',
                    type: 'is-danger'
                });
            }finally{
                loadingComponent.close();
            }

        },
        checkForm(): boolean {
            return Boolean(this.tarea.title && this.tarea.description && this.tarea.expiration);
        },
        stopEdit(): void {
            this.editarTareaEditando(null);
            this.tarea = getDefaults().tarea;
            this.$buefy.notification.open({
                message: 'Edición Cancelada',
                type: 'is-info'
            });
        },
        deleteTareaBTN(): void {
            this.$buefy.dialog.confirm({
                title: 'Borrar Tarea',
                message: '¿Seguro que quieres <b>borrar</b> la tarea? Esta acción no se puede deshacer.',
                confirmText: 'Borrrar Tarea',
                cancelText: 'Cancelar',
                type: 'is-danger',
                hasIcon: true,
                onConfirm: () => {
                    if (this.tareaEditando) {
                        this.eliminarTarea(this.tareaEditando);
                        this.stopEdit();
                        this.$buefy.notification.open({
                            message: 'Tarea Eliminada Exitosamente',
                            type: 'is-success'
                        });
                    }
                }
            })

        }
    }
});
</script>


<style scoped>
form {
    padding: 5% 5%;
}

.text-right {
    text-align: right;
    display: grid;
    justify-content: end;
}
</style>