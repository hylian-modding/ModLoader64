// TODO: Actually implement this.

class ZeldaString {
    private map: Map<number, string> = require('./ZeldaStringMap'); 
    
    encode(str: string): Buffer{
        return Buffer.alloc(8)
    }

    decode(buf: Buffer): string{
        return "Link"
    }
}

export default ZeldaString