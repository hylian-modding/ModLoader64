export const enum Command {
  NULL,
  SPAWN_ACTOR,
  UPDATE_C_BUTTON_ICON,
  PLAY_SOUND,
  LOAD_OBJECT,
  WARP,
  PLAY_MUSIC,
  RELOCATE_OVL
}

export interface ICommandBuffer {
  runCommand(command: Command, param: number, callback?: Function): void;
  runWarp(entrance: number, cutscene: number, callback?: Function): void;
}
