interface ISaveState {
  setStateSlot(slot: number): void;
  loadState(): void;
  loadStateFromSlot(slot: number): void;
  loadStateFromFile(path: string): void;
  saveState(): void;
  saveStateToSlot(slot: number): void;
  saveStateToFile(path: string): void;
}

export default ISaveState;
