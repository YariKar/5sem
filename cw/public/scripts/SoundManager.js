

export class SoundManager{
    clips ={}
    context = null
    gainNode = null
    loaded = false

    init(){
        this.context = new AudioContext()
        this.gainNode = this.context.createGain ? this.context.createGain() : this.context.createGainNode()
        this.gainNode.connect(this.context.destination)

    }
    load(path, callback){
        let self = this
        if (this.clips[path]) { 
            callback(this.clips[path]); 
            return;
        }
        let clip = {path: path, buffer: null, loaded: false};

        clip.play = function (volume, loop) {
            self.play(this.path, {looping: loop?loop:false,
            volume: volume?volume:1});
        };
        this.clips[path] = clip; 
        let request = new XMLHttpRequest();
        request.open('GET', path, true);
        request.responseType = 'arraybuffer';
        request.onload = function () {
            self.context.decodeAudioData(request.response, function (buffer) {
                clip.buffer = buffer;
                clip.loaded = true;
                callback(clip);
            });
        };
        request.send();
    }
    loadArray(array) { 
        let self = this
        for (let i = 0; i < array.length; i++) {
            self.load(array[i], function () {
                if (array.length ===Object.keys(self.clips).length) {
                    for (let sd in self.clips){
                        if (!self.clips[sd].loaded) return;
                    }
                    self.loaded = true; 
                }
            }); 
        } 
    }   
    play(path, settings){
        let self = this
        if (!this.loaded) { 
            setTimeout(function () { 
                self.play(path, settings); 
            }, 1000);
            return;
        }
        let looping = false; 
        let volume = 1;
        if (settings) { 
            if (settings.looping){
                looping = settings.looping;
            }
            if (settings.volume){
                volume = settings.volume;
            }
        }
        let sd = this.clips[path];
        if (sd === null){
            return false;
        }

        let sound = this.context.createBufferSource();
        sound.buffer = sd.buffer;
        sound.connect(this.gainNode);
        sound.loop = looping;
        this.gainNode.gain.value = volume;
        sound.start(0);
        return true;
    }
    
}