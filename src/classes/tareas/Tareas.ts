import ITarea from "@/interfaces/tareas";
import IDatabaseEntity from "@/interfaces/databaseEntity";
import { db } from "@/firebase";
export default class Tareas implements ITarea, IDatabaseEntity{
    _id: string | null;
    title: string;
    description: string;
    userID: string;
    finishedAt: Date | null;
    expiration: Date;
    
    constructor({_id = null, title, description, userID, finishedAt = null, expiration} : {_id: string | null, title: string, description: string, userID: string, finishedAt: Date | null, expiration: Date}) {
        this._id = _id;
        this.title = title;
        this.description = description;
        this.userID = userID;
        this.finishedAt = finishedAt;
        this.expiration = expiration;
    }

    public async save(){
        try{
            
            if(this._id){
                await db.collection("tareas").doc(this._id).set({
                    title: this.title,
                    description: this.description,
                    userID: this.userID,
                    finishedAt: this.finishedAt,
                    expiration: this.expiration
                });
            }else{
                await db.collection("tareas").add({
                    title: this.title,
                    description: this.description,
                    userID: this.userID,
                    finishedAt: this.finishedAt,
                    expiration: this.expiration
                }).then((docRef) => {
                    this._id = docRef.id;
                });
            }
            return this;
        }catch(e){
            console.error(e);
            throw new Error("Error al guardar la tarea");
        }
    }

    public async delete(){
        try{
            if(this._id){
                db.collection("tareas").doc(this._id).delete();
                return true;
            }
            throw new Error("No se puede eliminar una tarea sin id");
        }catch(e){
            console.error(e);
            return false;
        }
    }

    static async getTareas(userID: string): Promise<Tareas[]>{
        try{
            
            const tareas: Tareas[] = [];
            const tareasSnapshot = (await db.collection("tareas").where("userID", "==", userID).get());
            tareasSnapshot.forEach((doc) => {
                
                let id = doc.id;
                const data = doc.data();
                tareas.push(new Tareas({
                    _id: id,
                    title: data.title,
                    description: data.description,
                    userID: data.userID,
                    finishedAt: data.finishedAt?.toDate(),
                    expiration: data.expiration.toDate()
                }));
            });
            return tareas;
        }catch(e){
            console.error("Error al fetch de tareas: ", e);
            throw new Error("Error al obtener las tareas");
        }
    }
}