export const enum Command {
  NULL,
  SPAWN_ACTOR,
  UPDATE_C_BUTTON_ICON,
  PLAY_SOUND,
}

export interface ICommandBuffer {
  runCommand(command: Command, param: number, callback?: Function): void;
}
