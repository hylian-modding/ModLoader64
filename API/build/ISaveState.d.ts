interface ISaveState {
    saveState(file: string): void;
    loadState(file: string): void;
}
export default ISaveState;
