export default interface ITarea {
    _id: string | null;
    title: string;
    userID: string;
    description: string;
    subTareas: ISubTarea[];
    finishedAt: Date | null;
    expiration: Date | null;
}

export interface ISubTarea {
    title: string;
    description: string;
    finishedAt: Date | null;
}

export interface IdefaultForm {
    tarea: {
        title: string,
        description: string,
        expiration: Date | null,
    }
}