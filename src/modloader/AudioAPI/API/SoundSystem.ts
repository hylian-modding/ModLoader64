import { bus } from 'modloader64_api/EventHandler';
import { ISoundSystem } from 'modloader64_api/Sound/ISoundSystem';
import * as sf from 'modloader64_api/Sound/sfml_audio';

export class SoundSystem implements ISoundSystem{

    private native: any;

    constructor(){
        this.native = require('@sound/sfml_audio');
    }

    get listener(): sf.Listener{
        return this.native.Listener;
    }

    loadSound(file: string): sf.Sound {
        let buf = new this.native.SoundBuffer();
        buf.loadFromFile(file);
        let snd = new this.native.Sound(buf);
        bus.emit(AudioAPIEvents.LOAD_SOUND, snd);
        return snd;
    }

    initSound(buf: Buffer): sf.Sound{
        let b = new this.native.SoundBuffer();
        b.loadFromMemory(buf);
        let snd = new this.native.Sound(b);
        bus.emit(AudioAPIEvents.LOAD_SOUND, snd);
        return snd;
    }

    loadMusic(file: string): sf.Music {
        let mus = new this.native.Music();
        mus.openFromFile(file);
        bus.emit(AudioAPIEvents.LOAD_SOUND, mus);
        return mus;
    }

    initMusic(buf: Buffer): sf.Music{
        let mus = new this.native.Music();
        mus.openFromMemory(buf);
        bus.emit(AudioAPIEvents.LOAD_SOUND, mus);
        return mus;
    }
}

export const enum AudioAPIEvents{
    LOAD_SOUND = "LOAD_SOUND"
}