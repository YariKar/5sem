import { Entity, Player, NPC, Bonus, TP } from "./Entities.js"

export class GameManager {
    factory = {}
    entities = []
    player = null
    laterKill = []
    level = 1
    is_update_level = false
    is_win = false
    initPlayer(obj) {
        this.player = obj
    }

    kill(obj) {
        this.laterKill.push(obj)
    }

   

    draw(ctx, sprite_manager) {
        //console.log(this.entities)
        for (let e = 0; e < this.entities.length; e++) {
            //console.log(this.entities[e])
            
            this.entities[e].draw(ctx, sprite_manager)
        }
    }

    loadAll(map_manager, sprite_manager, event_manager, sound_manager, canvas, ctx) {
        let map_level = this.level === 1? "/game" : "game_2"
        map_manager.loadMap(map_level)
        sprite_manager.loadAtlas("/sprites", "./public/images/spritesheet_all.png")
        this.factory['Player'] = Player
        this.factory["NPC"] = NPC
        this.factory["Bonus"] = Bonus
        this.factory["TP"] = TP
        console.log(this.factory, "factory")
        map_manager.parseEntities(this)
        sound_manager.loadArray(["../public/sounds/wind5.wav", "../public/sounds/crunch.1.ogg", "../public/sounds/damage_taken.mp3", "../public/sounds/vgdeathsound.wav", "../public/sounds/water_sounds.wav","../public/sounds/WinMutedGuitar.ogg"])
        map_manager.draw(canvas, ctx)
        //console.log("in load all",this.entities)
        event_manager.setup(canvas)
    }
    
    deleteEntity(id){
        //console.log(id, this.entities.length)
        for (let i = 0; i < this.entities.length; i++){
            if (this.entities[i].id == id){
                this.entities.splice(i, 1);
            }
        }
    }
    NPC_moving(npc, map_manager){
        //console.log(Math.abs((this.player.pos_x - npc.pos_x)/this.player.size_x), Math.abs((this.player.pos_y - npc.pos_y)/this.player.size_y), Math.sqrt(((this.player.pos_x - npc.pos_x)/this.player.size_x)**2+((this.player.pos_y - npc.pos_y)/this.player.size_y)**2), npc)
        //console.log(Math.sqrt(((this.player.pos_x - npc.pos_x)/this.player.size_x)**2)+(((this.player.pos_y - npc.pos_y)/this.player.size_y)**2), npc)
        //if(Math.sqrt(((this.player.pos_x - npc.pos_x)/this.player.size_x)**2+((this.player.pos_y - npc.pos_y)/this.player.size_y)**2)<=8){
        //console.log("hihi")
        if(Math.sqrt(((this.player.pos_x - npc.pos_x)/this.player.size_x)**2+((this.player.pos_y - npc.pos_y)/this.player.size_y)**2)<=8){
            //console.log("alg follow", npc)
            npc.following(this.player, map_manager)
        }
        else{
            npc.passive_moving()
            
        }
        //npc.passive_moving()
        
    }
}