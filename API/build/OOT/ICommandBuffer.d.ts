export declare const enum Command {
    NULL = 0,
    SPAWN_ACTOR = 1,
    UPDATE_C_BUTTON_ICON = 2,
    PLAY_SOUND = 3
}
export interface ICommandBuffer {
    runCommand(command: Command, param: number, callback?: Function): void;
}
