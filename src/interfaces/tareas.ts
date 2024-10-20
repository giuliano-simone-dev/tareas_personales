export default interface ITarea {
    _id: string | null;
    title: string;
    userID: string;
    description: string;
    finishedAt: Date | null;
    expiration: Date;
}
export interface IdefaultForm {
    tarea: {
        title: string,
        description: string,
        expiration: Date | null,
    }
}