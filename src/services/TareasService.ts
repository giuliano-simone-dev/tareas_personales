import Tareas from "@/classes/tareas/Tareas";
import { TareaError } from "@/classes/errors/tareas";

class TareasServiceClass{
    public tareasVencidas: Tareas[] = [];
    public tareasPendientes: Tareas[] = [];
    public tareasCompletadas: Tareas[] = [];
    
    public acomodarTareas(tareas: Tareas[]): TareasServiceClass {
        
        this.tareasVencidas = [];
        this.tareasPendientes = [];
        this.tareasCompletadas = [];
        tareas.forEach((tarea) => {
            if(!tarea._id) return;
            if(tarea.expiration <= new Date() && !tarea.finishedAt){
                this.tareasVencidas.push(tarea);
            } else if(!tarea.finishedAt){
                this.tareasPendientes.push(tarea);
            } else {
                this.tareasCompletadas.push(tarea);
            }
        });
        return this;
    }

    public async agregarTarea(tarea: Tareas): Promise<TareasServiceClass> {
        try{
            if(tarea._id !== null){
                throw new TareaError("La tarea ya existe");
            }
            tarea = await tarea.save();

            if(tarea.expiration <= new Date()){
                this.tareasVencidas.push(tarea);
            } else if(!tarea.finishedAt){
                this.tareasPendientes.push(tarea);
            } else {
                this.tareasCompletadas.push(tarea);
            }
            return this;
        }catch(e){
            console.error(e);
            return this;
        }
    }    

    public async editarTarea(tarea: Tareas): Promise<TareasServiceClass> {
        try{
            if(tarea._id === null){
                throw new TareaError("La tarea no existe");
            }
            tarea = await tarea.save();
            this.tareasVencidas = this.tareasVencidas.filter((t) => t._id !== tarea._id);
            this.tareasPendientes = this.tareasPendientes.filter((t) => t._id !== tarea._id);
            this.tareasCompletadas = this.tareasCompletadas.filter((t) => t._id !== tarea._id);

            if(tarea.expiration <= new Date() && !tarea.finishedAt){
                this.tareasVencidas.push(tarea);
            } else if(!tarea.finishedAt){
                this.tareasPendientes.push(tarea);
            } else {
                this.tareasCompletadas.push(tarea);
            }
            return this;
        }catch(e){
            console.error(e);
            return this;
        }
    }

    public async eliminarTarea(tarea: Tareas): Promise<TareasServiceClass> {
        try{
            if(tarea._id === null){
                throw new TareaError("La tarea no existe");
            }
            await tarea.delete();

            this.tareasVencidas = this.tareasVencidas.filter((t) => t._id !== tarea._id);
            this.tareasPendientes = this.tareasPendientes.filter((t) => t._id !== tarea._id);
            this.tareasCompletadas = this.tareasCompletadas.filter((t) => t._id !== tarea._id);
            return this;
        }catch(e){
            console.error(e);
            return this;
        }
    }

    public async syncTareas(uid:string){
        let tareas = await Tareas.getTareas(uid);
        this.acomodarTareas(tareas);
    }

    public getAllTareas(): Tareas[]{
        return [...this.tareasVencidas, ...this.tareasPendientes, ...this.tareasCompletadas];
    }
}

export default new TareasServiceClass();

export type TareasServiceType = TareasServiceClass;

export type TareasServiceIndex = 'tareasVencidas' | 'tareasPendientes' | 'tareasCompletadas';
