export interface Clipboard {
    getText(): string;
    hasText(): boolean;
    setText(text: string): void;
}