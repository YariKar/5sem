

export class Tiles {
    constructor(firstgid, img, name, imagewidth, imageheight, tSizeX, tSizeY) {
        this.firstgid = firstgid
        this.image = img
        this.name = name
        this.xCount = Math.floor(imagewidth / tSizeX)
        this.yCount = Math.floor(imageheight / tSizeY)
    }

}

export class MapManager {
    mapData = null;
    tLayer = null;
    xCount = 0;
    yCount = 0;
    tSize = { x: 32, y: 32 };
    mapSize = { x: 50, y: 25 };
    tilesets = new Array();
    matrixMap = []
    imgLoadCount = 0;
    imgLoaded = false;
    jsonLoaded = false;


    parseMap(tilesJSON) {
        //console.log(JSON.parse(tilesJSON))
        this.mapData = JSON.parse(tilesJSON);
        this.xCount = this.mapData.width;
        this.yCount = this.mapData.height;
        this.tSize.x = this.mapData.tilewidth;
        this.tSize.y = this.mapData.tileheight;
        this.mapSize.x = this.xCount * this.tSize.x;
        this.mapSize.y = this.yCount * this.tSize.y;
        let self = this
        for (let i = 0; i < this.mapData.tilesets.length; i++) {
            let img = new Image();
            img.onload = function () {
                self.imgLoadCount++;
                if (self.imgLoadCount === self.mapData.tilesets.length) {
                    self.imgLoaded = true;
                }
            }
            //img.onload()
            let t = this.mapData.tilesets[i];

            img.src = t.image;

            let ts = new Tiles(t.firstgid, img, t.name, t.imagewidth, t.imageheight, this.tSize.x, this.tSize.y)
            this.tilesets.push(ts);
        }
        this.jsonLoaded = true;

    }
    parseEntities(game_manager) {
        if (this.mapData !== null){
            for(let i=0;i < this.mapData.layers[0].data.length;i = i+this.xCount)
                this.matrixMap.push(this.mapData.layers[0].data.slice(i,i+this.xCount));
        }
        let self = this

        if (!this.imgLoaded || !this.jsonLoaded) {
            setTimeout(function () {
                self.parseEntities(game_manager);
            }, 100);
        } else {
            //console.log(game_manager, "parseEntities")
            //console.log(this.mapData, this.mapData.layers.length)
            for (let j = 0; j < this.mapData.layers.length; j++) {
                if (this.mapData.layers[j].type === 'objectgroup') {
                    let entities = this.mapData.layers[j];
                    //console.log(entities)
                    for (let i = 0; i < entities.objects.length; i++) {
                        let e = entities.objects[i];
                        //console.log("e", e)
                        try {
                            /*if(e.type == "TP"){
                                console.log(e)
                            }*/
                            //let obj = Object.create(game_manager.factory[e.type]);
                            let obj = new game_manager.factory[e.type]
                            obj.id = e.id
                            obj.name = e.name;
                            obj.pos_x = e.x;
                            obj.pos_y = e.y - e.height;
                            obj.size_x = e.width;
                            obj.size_y = e.height;
                            if (e.type == "Player") {
                                if (game_manager.player !== null) {
                                    obj.lifetime = game_manager.player.lifetime
                                    obj.speed = game_manager.player.speed
                                    obj.score = game_manager.player.score
                                }
                            }
                            if (e.type == "Bonus" || e.type == "TP") {
                                //console.log(e)
                                obj.type = e.name
                            }
                            //console.log(obj)
                            game_manager.entities.push(obj);
                            if (obj.name === "player") {
                                console.log("init player")
                                game_manager.initPlayer(obj);
                            }
                        } catch (ex) {
                            console.log("Error while creating: [" + e.gid + "] " + e.type +
                                ", " + ex);
                        }
                    }
                }
            }
        }
    }
    loadMap(path) {
        let self = this
        var request = new XMLHttpRequest();
        //let parseMap = this.parseMap 
        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200) {
                self.parseMap(request.responseText);
                //setTimeout( this.parseMap.bind(this), 100, request.responseText)
            }
        }
        //console.log(path)
        request.open('GET', path, true)

        request.send()
        //console.log(request)
    }

    draw(canvas, ctx) {
        let self = this
        if (!this.imgLoaded || !this.jsonLoaded) {
            setTimeout(function () {
                self.draw(canvas, ctx);
            }, 100);
        } else {
            if (this.tLayer === null) {
                for (let id = 0; id < this.mapData.layers.length; id++) {
                    let layer = this.mapData.layers[id];
                    if (layer.type === "tilelayer") {
                        this.tLayer = layer;
                        break;
                    }
                }
            }
            canvas.width = this.mapSize.x
            canvas.height = this.mapSize.y
            //console.log(canvas.height, canvas.width)
            for (let i = 0; i < this.tLayer.data.length; i++) {
                if (this.tLayer.data[i] !== 0) {
                    let tile = this.getTile(this.tLayer.data[i]);

                    let pX = (i % this.xCount) * this.tSize.x;

                    let pY = Math.floor(i / this.xCount) * this.tSize.y;
                    ctx.drawImage(tile.img, tile.px, tile.py, self.tSize.x,
                        self.tSize.y, pX, pY, self.tSize.x, self.tSize.y);
                }
            }
        }
    }
    getTile(tileIndex) {
        let tile = {
            img: null,
            px: 0, py: 0
        };
        let tileset = this.getTileset(tileIndex);
        tile.img = tileset.image;
        let id = tileIndex - tileset.firstgid;

        let x = id % tileset.xCount;

        let y = Math.floor(id / tileset.xCount);

        tile.px = x * this.tSize.x;
        tile.py = y * this.tSize.y;
        return tile;
    }
    getTileset(tileIndex) {
        for (let i = this.tilesets.length - 1; i >= 0; i--) {

            if (this.tilesets[i].firstgid <= tileIndex) {

                return this.tilesets[i];
            }
        }
        return null;
    }
    getTilesetIdx(x, y) {
        //console.log("gettilesetdx", x, y)
        //console.log(this.tLayer.data)
        let wX = x;
        let wY = y;
        // console.log("wx, wy",wX, wY)
        //console.log(this.xCount)
        //console.log(wY/this.tSize.y, this.xCount, wX/this.tSize.x)
        //let idx = round_func((wY / this.tSize.y)) * this.xCount + round_func((wX / this.tSize.x));
        let idx = Math.floor(wY / this.tSize.y) * this.xCount + Math.floor(wX / this.tSize.x)
        // console.log(this.tLayer.data,idx)
        return this.tLayer.data[idx];
    }
}

/*let canvas = document.getElementById("screen");
let ctx = canvas.getContext("2d");

let map_manager = new MapManager()

map_manager.loadMap("/game")
map_manager.draw(canvas, ctx)
console.log("draw", map_manager)*/