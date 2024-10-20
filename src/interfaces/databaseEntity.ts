export default interface IDatabaseEntity {
    save (): Promise<this>;
    delete (): Promise<boolean>;
}