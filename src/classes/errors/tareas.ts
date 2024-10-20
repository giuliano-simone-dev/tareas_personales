export class TareaError extends Error{
    public code: string;
    constructor(msg: string){
        super(msg);
        this.name = 'TareaError';
        this.code = 'error/tarea';
        this.stack = undefined;
    }
}