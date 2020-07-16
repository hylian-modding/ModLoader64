interface RefCounted {
    /**
     * Increments the reference count.
     *
     * After this call the reference will be a strong reference because its refcount is >0, and the referenced object is effectively "pinned".
     * Calling this when the refcount is 0 and the object is unavailable results in an error.
     *
     * @returns Current reference count
     */
    ref(): number;

    /**
     * Decrements the reference count.
     *
     * If the result is 0 the reference is now weak and the object may be GC'd at any time if there are no other references.
     * Calling this when the refcount is already 0 results in an error.
     *
     * @returns Current reference count
     */
    unref(): number;

    /**
     * Deletes a reference.
     *
     * The referenced value is released, and may be GC'd unless there are other references to it.
     */
    release(): void;
}

/**
 * 3-dimensional vector (f32).
 */
export type Vec3 = { x: number, y: number, z: number };

/**
 * Represents a time value in milliseconds.
 */
export type Time = number;

/**
 * Structure defining a time range.
 */
export interface TimeSpan {
    /**
     * The beginning offset of the time range.
     */
    offset: Time;

    /**
     * The length of the time range.
     */
    length: Time;
}

/**
 * Enumeration of the sound source states.
 */
export const enum SoundSourceStatus {
    /**
     * Sound is not playing.
     */
    Stopped,
    /**
     * Sound is paused.
     */
    Paused,
    /**
     * Sound is playing.
     */
    Playing
}

/**
 * Interface defining a sound's properties.
 *
 * SoundSource serves as a common base for all audio objects that can live in the audio environment.
 *
 * It defines several properties for the sound: pitch, volume, position, attenuation, etc. All of them can be changed at any time with no impact
 * on performances.
 */
export interface SoundSource {
    /**
     * Get or set the pitch of the sound.
     *
     * The pitch represents the perceived fundamental frequency of a sound; thus you can make a sound more acute or grave by changing its pitch.
     * A side effect of changing the pitch is to modify the playing speed of the sound as well. The default value for the pitch is 1.
     */
    pitch: number;

    /**
     * Get or set the volume of the sound.
     *
     * The volume is a value between 0 (mute) and 100 (full volume). The default value for the volume is 100.
     */
    volume: number;

    /**
     * Get or set the 3D position of the sound in the audio scene.
     *
     * Only sounds with one channel (mono sounds) can be spatialized. The default position of a sound is (0, 0, 0).
     */
    position: Vec3;

    /**
     * Get or set whether the sound's position is relative to the listener or is absolute.
     *
     * Making a sound relative to the listener will ensure that it will always be played the same way regardless of the position of the listener.
     * This can be useful for non-spatialized sounds, sounds that are produced by the listener, or sounds attached to it.
     * The default value is false (position is absolute).
     */
    relativeToListener: boolean;

    /**
     * Get or set the minimum distance of the sound.
     *
     * The "minimum distance" of a sound is the maximum distance at which it is heard at its maximum volume.
     * Further than the minimum distance, it will start to fade out according to its attenuation factor.
     * A value of 0 ("inside the head of the listener") is an invalid value and is forbidden.
     * The default value of the minimum distance is 1.
     */
    minDistance: number;

    /**
     * Get or set the attenuation factor of the sound.
     *
     * The attenuation is a multiplicative factor which makes the sound more or less loud according to its distance from the listener.
     * An attenuation of 0 will produce a non-attenuated sound, i.e. its volume will always be the same whether it is heard from near or from far.
     * On the other hand, an attenuation value such as 100 will make the sound fade out very quickly as it gets further from the listener.
     * The default value of the attenuation is 1.
     */
    attenuation: number;

    /**
     * Get the current status of the sound (stopped, paused, playing).
     */
    status: SoundSourceStatus;

    /**
     * Start or resume playing the sound source.
     *
     * This function starts the source if it was stopped, resumes it if it was paused, and restarts it from the beginning if it was already playing.
     */
    play(): void;

    /**
     * Pause the sound source.
     *
     * This function pauses the source if it was playing, otherwise (source already paused or stopped) it has no effect.
     */
    pause(): void;

    /**
     * Stop playing the sound source.
     *
     * This function stops the source if it was playing or paused, and does nothing if it was already stopped.
     * It also resets the playing position (unlike pause()).
     */
    stop(): void;
}

/**
 * Storage for audio samples defining a sound.
 *
 * A sound buffer holds the data of a sound, which is an array of audio samples.
 *
 * A sample is a 16 bits signed integer that defines the amplitude of the sound at a given time.
 * The sound is then reconstituted by playing these samples at a high rate (for example, 44100 samples per second is the standard rate used
 * for playing CDs).
 *
 * A sound buffer can be loaded from a file (see loadFromFile() for the complete list of supported formats), from memory or directly from an
 * array of samples. It can also be saved back to a file.
 *
 * Sound buffers alone are not very useful: they hold the audio data but cannot be played.
 * To do so, you need to use the Sound class, which provides functions to play/pause/stop the sound as well as changing the way it is
 * outputted (volume, pitch, 3D position, ...). This separation allows more flexibility and better performances: indeed a SoundBuffer
 * is a heavy resource, and any operation on it is slow (often too slow for real-time applications). On the other side, a Sound is a
 * lightweight object, which can use the audio data of a sound buffer and change the way it is played without actually modifying that data.
 * Note that it is also possible to bind several Sound instances to the same SoundBuffer.
 *
 * It is important to note that the Sound instance doesn't copy the buffer that it uses, it only keeps a reference to it. Thus, a SoundBuffer
 * must not be destructed while it is used by a Sound.
 *
 * Usage example:
 * ```typescript
 * // Create a new sound buffer
 * let buffer = new SoundBuffer();
 *
 * // Load it from a file
 * buffer.loadFromFile('sound.wav');
 *
 * let sound1 = new Sound();
 * sound1.buffer = buffer;
 *
 * // Play the sound
 * sound1.play();
 *
 * // Create another sound source bound to the same buffer
 * let sound2 = new Sound();
 * sound2.buffer = buffer;
 *
 * // Play it with a higher pitch -- the first sound remains unchanged
 * sound2.pitch = 2;
 * sound2.play();
 * ```
 */
export interface SoundBuffer extends RefCounted {
    /**
     * Get the array of audio samples stored in the buffer.
     *
     * The format of the returned samples is 16 bits signed integer. The total number of samples in this array is given by the sampleCount property.
     */
    samples: Int16Array;

    /**
     * Get the number of samples stored in the buffer.
     *
     * The array of samples can be accessed with the samples property.
     */
    sampleCount: number;

    /**
     * Get the sample rate of the sound.
     *
     * The sample rate is the number of samples played per second. The higher, the better the quality (for example, 44100 samples/s is CD quality).
     */
    sampleRate: number;

    /**
     * Get the number of channels used by the sound.
     *
     * If the sound is mono then the number of channels will be 1, 2 for stereo, etc.
     */
    channelCount: number;

    /**
     * Get the total duration of the sound in milliseconds.
     */
    duration: Time;

    /**
     * Load the sound buffer from a file.
     *
     * The supported audio formats are: WAV (PCM only), OGG/Vorbis, FLAC, MP2, MP3. The supported sample sizes for FLAC and WAV are 8, 16, 24 and 32 bit.
     *
     * Throws an exception if loading failed.
     *
     * @param path Path of the sound file to load
     */
    loadFromFile(path: string): void;

    /**
     * Load the sound buffer from a file in memory.
     *
     * The supported audio formats are: WAV (PCM only), OGG/Vorbis, FLAC, MP2, MP3. The supported sample sizes for FLAC and WAV are 8, 16, 24 and 32 bit.
     *
     * Throws an exception if loading failed.
     *
     * @param data Sound file data
     */
    loadFromMemory(data: Uint8Array): void;

    /**
     * Load the sound buffer from an array of audio samples.
     *
     * The assumed format of the audio samples is 16 bits signed integer.
     *
     * Throws an exception if loading failed.
     *
     * @param samples Array of samples
     * @param channelCount Number of channels (1 = mono, 2 = stereo, ...)
     * @param sampleRate Sample rate (number of samples to play per second)
     */
    loadFromSamples(samples: Int16Array, channelCount: number, sampleRate: number): void;

    /**
     * Save the sound buffer to an audio file.
     *
     * The supported audio formats are: WAV, OGG/Vorbis, FLAC.
     *
     * Throws an exception if saving failed.
     *
     * @param path Path of the sound file to write
     */
    saveToFile(path: string): void;
}

/**
 * Regular sound that can be played in the audio environment.
 *
 * Sound is the class to use to play sounds.
 *
 * It provides:
 * * Control (play, pause, stop)
 * * Ability to modify output parameters in real-time (pitch, volume, ...)
 * * 3D spatial features (position, attenuation, ...).
 *
 * Sound is perfect for playing short sounds that can fit in memory and require no latency, like foot steps or gun shots.
 * For longer sounds, like background musics or long speeches, rather see Music (which is based on streaming).
 *
 * In order to work, a sound must be given a buffer of audio data to play. Audio data (samples) is stored in SoundBuffer,
 * and attached to a sound with the buffer property. The buffer object attached to a sound must remain alive as long as the
 * sound uses it. Note that multiple sounds can use the same sound buffer at the same time.
 *
 * Usage example:
 * ```typescript
 * let buffer = new SoundBuffer();
 * buffer.loadFromFile('sound.wav');
 *
 * let sound = new Sound();
 * sound.buffer = buffer;
 * sound.play();
 * ```
 */
export interface Sound extends RefCounted, SoundSource {
    /**
     * Get or set whether or not the sound should loop after reaching the end.
     *
     * If set, the sound will restart from beginning after reaching the end and so on, until it is stopped or loop is set to false.
     * The default looping state for sound is false.
     */
    loop: boolean;

    /**
     * Get or set the current playing position of the sound.
     *
     * The playing position can be changed when the sound is either paused or playing.
     * Changing the playing position when the sound is stopped has no effect, since playing the sound will reset its position.
     */
    playingOffset: Time;

    /**
     * Get or set the source buffer containing the audio data to play.
     *
     * It is important to note that the sound buffer is not copied, thus the SoundBuffer instance must remain alive as long as it
     * is attached to the sound.
     */
    buffer: SoundBuffer;
}

/**
 * Interface for streamed audio sources.
 *
 * Unlike audio buffers (see SoundBuffer), audio streams are never completely loaded in memory.
 *
 * Instead, the audio data is acquired continuously while the stream is playing.
 * This behavior allows to play a sound with no loading delay, and keeps the memory consumption very low.
 *
 * Sound sources that need to be streamed are usually big files (compressed audio musics that would eat hundreds of MB in memory).
 */
export interface SoundStream extends SoundSource {
    /**
     * Get the number of channels of the stream.
     *
     * 1 channel means a mono sound, 2 means stereo, etc.
     */
    channelCount: number;

    /**
     * Get the stream sample rate of the stream.
     *
     * The sample rate is the number of audio samples played per second. The higher, the better the quality.
     */
    sampleRate: number;

    /**
     * Get or set the current playing position of the stream.
     *
     * The playing position can be changed when the stream is either paused or playing.
     * Changing the playing position when the stream is stopped has no effect, since playing the stream would reset its position.
     */
    playingOffset: Time;

    /**
     * Get or set whether or not the stream should loop after reaching the end.
     *
     * If set, the stream will restart from beginning after reaching the end and so on, until it is stopped or loop is set to false.
     * The default looping state for streams is false.
     */
    loop: boolean;
}

/**
 * Streamed music played from an audio file.
 *
 * Musics are sounds that are streamed rather than completely loaded in memory.
 *
 * This is especially useful for compressed musics that usually take hundreds of MB when they are uncompressed: by streaming it instead
 * of loading it entirely, you avoid saturating the memory and have almost no loading delay. This implies that the underlying resource
 * (file, stream or memory buffer) must remain valid for the lifetime of the Music object.
 *
 * Apart from that, a Music has almost the same features as the SoundBuffer / Sound pair: you can play/pause/stop it, request its parameters
 * (channels, sample rate), change the way it is played (pitch, volume, 3D position, ...), etc.
 *
 * As a sound stream, a music is played in its own thread in order not to block the rest of the program. This means that you can leave the
 * music alone after calling play(), it will manage itself very well.
 *
 * Usage example:
 * ```typescript
 * // Create a new music
 * let music = new Music();
 *
 * // Open it from an audio file
 * music.openFromFile('music.ogg');
 *
 * // Change some parameters
 * music.position = { x: 0, y: 1, z: 10 };  // change its 3D position
 * music.pitch = 2;                         // increase the pitch
 * music.volume = 50;                       // reduce the volume
 * music.loop = true;                       // make it loop
 *
 * // Play it
 * music.play();
 * ```
 */
export interface Music extends RefCounted, SoundStream {
    /**
     * Get the total duration of the music in milliseconds.
     */
    duration: Time;

    /**
     * Get or set the beginning and end of the sound's looping sequence
     *
     * Loop points allow one to specify a pair of positions such that, when the music is enabled for looping, it will seamlessly
     * seek to the beginning whenever it encounters the end. Valid ranges for the *offset* and *length* properties are [0, Dur)
     * and (0, Dur-*offset*] respectively, where Dur is the value returned by *duration*. Note that the EOF "loop point" from the
     * end to the beginning of the stream is still honored, in case the caller seeks to a point after the end of the loop range.
     * This function can be safely called at any point after a stream is opened, and will be applied to a playing sound without
     * affecting the current playing offset.
     *
     * @warning Setting the loop points while the stream's status is Paused will set its status to Stopped. The playing offset will
     * be unaffected.
     *
     * @warning Since setting the loop points performs some adjustments on the provided values and rounds them to internal samples, a call to
     * get *loopPoints* is not guaranteed to return the same times passed into a previous call to set *loopPoints*. However, it is
     * guaranteed to return times that will map to the valid internal samples of this Music if they are later passed to set *loopPoints*.
     */
    loopPoints: TimeSpan;

    /**
     * Open a music from an audio file.
     *
     * This function doesn't start playing the music (call play() to do so).
     *
     * The supported audio formats are: WAV (PCM only), OGG/Vorbis, FLAC, MP2, MP3. The supported sample sizes for FLAC and WAV are 8, 16, 24 and 32 bit.
     *
     * Throws an exception if loading failed.
     *
     * @warning Since the music is not loaded at once but rather streamed continuously, the file must remain accessible until the
     * Music object loads a new music or is destroyed.
     *
     * @param filename Path of the music file to open
     */
    openFromFile(filename: string): void;

    /**
     * Open a music from an audio file in memory.
     *
     * This function doesn't start playing the music (call play() to do so).
     *
     * The supported audio formats are: WAV (PCM only), OGG/Vorbis, FLAC, MP2, MP3. The supported sample sizes for FLAC and WAV are 8, 16, 24 and 32 bit.
     *
     * Throws an exception if loading failed.
     *
     * @warning Since the music is not loaded at once but rather streamed continuously, the data buffer must remain accessible until the
     * Music object loads a new music or is destroyed. That is, you can't deallocate the buffer right after calling this function.
     *
     * @param data Music file data
     */
    openFromMemory(data: Uint8Array): boolean;
}

/**
 * The audio listener is the point in the scene from where all the sounds are heard.
 *
 * The audio listener defines the global properties of the audio environment, it defines where and how sounds and musics are heard.
 *
 * Listener is a simple interface, which allows to setup the listener in the 3D audio environment (position, direction and up vector),
 * and to adjust the global volume.
 *
 * Because the listener is unique in the scene, Listener only contains static functions and doesn't have to be instantiated.
 *
 * Usage example:
 * ```typescript
 * // Move the listener to the position (1, 0, -5)
 * Listener.position = { x: 1, y: 0, z: -5 };
 *
 * // Make it face the right axis (1, 0, 0)
 * Listener.direction = { x: 1, y: 0, z: 0 };
 *
 * // Reduce the global volume
 * Listener.globalVolume = 50;
 * ```
 */
export interface Listener {
    /**
     * Get or set the value of the global volume of all the sounds and musics.
     *
     * The volume is a number between 0 and 100; it is combined with the individual volume of each sound / music.
     * The default value for the volume is 100 (maximum).
     */
    globalVolume: number;

    /**
     * Get or set the position of the listener in the scene.
     *
     * The default listener's position is (0, 0, 0).
     */
    position: Vec3;

    /**
     * Get or set the forward vector of the listener in the scene.
     *
     * The direction (also called "at vector") is the vector pointing forward from the listener's perspective.
     * Together with the up vector, it defines the 3D orientation of the listener in the scene.
     * The direction vector doesn't have to be normalized. The default listener's direction is (0, 0, -1).
     */
    direction: Vec3;

    /**
     * Get or set the upward vector of the listener in the scene.
     *
     * The up vector is the vector that points upward from the listener's perspective.
     * Together with the direction, it defines the 3D orientation of the listener in the scene.
     * The up vector doesn't have to be normalized.
     * The default listener's up vector is (0, 1, 0).
     * It is usually not necessary to change it, especially in 2D scenarios.
     */
    upVector: Vec3;
};

export var SoundBuffer: {
    /**
     * Default constructor.
     */
    new(): SoundBuffer;
};

export var Sound: {
    /**
     * Default constructor.
     */
    new(): Sound;

    /**
     * Construct the sound with a buffer.
     *
     * @param buffer Sound buffer containing the audio data to play with the sound
     */
    new(buffer: SoundBuffer): Sound;
};

export var Music: {
    /**
     * Default constructor.
     */
    new(): Music;
};
