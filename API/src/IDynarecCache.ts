export default interface IDynarecCache{
    invalidateCachedCode(address?: number, size?: number, forced?: boolean): void;
}