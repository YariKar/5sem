//import { MapManager } from "./MapManager";

export class SpriteManager {
    image = new Image()
    sprites = new Array()
    imgLoaded = false
    jsonLoaded = false;

    loadAtlas(atlasJson, atlasImg) {
        let self = this
        let request = new XMLHttpRequest()
        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200) {
                self.parseAtlas(request.responseText)
            }
        }
        //console.log(path)
        request.open('GET', atlasJson, true)
        request.send()
        this.loadImg(atlasImg)
    }
    parseAtlas(atlasJson) {
        let atlas = JSON.parse(atlasJson)
        for (let name in atlas.frames) {
            let frame = atlas.frames[name].frame
            this.sprites.push({ name: name, x: frame.x, y: frame.y, w: frame.w, h: frame.h })
        }
        this.jsonLoaded =true
    }
    loadImg(imgName) {
        let self = this
        this.image.onload = function () {
            self.imgLoaded = true
        }
        this.image.src = imgName
    }
    drawSprite(ctx, name, x, y){
        /*if(name == "Exit")
            console.log(name, x, y)*/
        let self = this
        if(!this.imgLoaded || !this.jsonLoaded){
            setTimeout(function(){
                self.drawSprite(ctx, name, x, y)}, 100)
        }
        else{
            let sprite = this.getSprite(name)
            //console.log(sprite, x, y)
            ctx.drawImage(this.image, sprite.x, sprite.y, sprite.w, sprite.h, x, y, sprite.w, sprite.h)

        }
    }

    getSprite(name){
        for(let i =0; i<this.sprites.length; i++){
            //console.log(i, this.sprites[i])
            let s = this.sprites[i]
            //console.log("finding", name, s.name)
            if(s.name === name){
                //console.log("find", name)
                return s
            }
        }
        return null
    }
}

//let sprite_manger = new SpriteManager()