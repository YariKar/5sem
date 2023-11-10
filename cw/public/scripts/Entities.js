import { aStar } from "./following_alg.js"

const SoundPath = {
    "eat": "../public/sounds/crunch.1.ogg",
    "wind": "../public/sounds/wind5.wav",
    "damage": "../public/sounds/damage_taken.mp3",
    "death": "../public/sounds/vgdeathsound.wav",
    "drink": "../public/sounds/water_sounds.wav",
    "win": "../public/sounds/WinMutedGuitar.ogg"
}

const TyleIndexes = {
    'grass': 795,
    'road': 389,
    'wall': 2,
    'grass_2': 794
}
let moving_tyles = [TyleIndexes.grass, TyleIndexes.grass_2, TyleIndexes.road]

const Direction = {
    "0": 'left',
    "1": 'right',
    "2": 'up',
    "3": 'down'
}


export class Entity {
    pos_x = 0
    pos_y = 0
    size_x = 0
    size_y = 0
    move_x = 0
    move_y = 0
    id = 0
    destroy() {

    }
    update(physic_manager, map_manager, game_manager, sound_manager) {
        physic_manager.update(this, map_manager, game_manager, sound_manager);
    }
    /*draw(ctx, sprite_manager){
        console.log("draw entity")
    }*/
}

export class Player extends Entity {
    lifetime = 100
    score = 0
    speed = 8

    hit() {

    }
    take_damage(sound_manager) {
       /* window.onload = function(){
            sound_manager.play(SoundPath.damage)
        }*/
        this.lifetime -= 20
    }
    take_heal(sound_manager) {
       /* window.onload = function(){
            sound_manager.play(SoundPath.eat)
        }*/
        this.lifetime += 20
    }
    take_speed_bonus(sound_manager) {
        /*window.onload = function(){
            sound_manager.play(SoundPath.drink)
        }*/
        this.speed += 4
    }
    check_death() {
        if (this.lifetime <= 0) {
            return true
            //console.log("game over")
            //super.destroy()
        }
        else { return false }
    }
    onTouchEntity(entity, sound_manager) {
        //console.log(entity)

        let res = null
        switch (entity.name) {
            case "LD":
                console.log("why")
                this.take_damage()
                this.score += 100
                res = entity.id
                break
            case "Eat":
                console.log("omnomnom")
                this.take_heal()
                this.score += 100
                res = entity.id
                break;
            case "Coffee":
                console.log("mmmm mocha")
                this.take_speed_bonus()
                this.score += 100
                res = entity.id
                break
            case "Exit":
                console.log("next level")
                res = "next_level"
                break
            case "Win":
                console.log("you win")
                res = "you_win"
                break
        }
        //console.log("result", res)
        return res
    }
    onTouchMap(tilset) {
        console.log("touch map")
    }
    draw(ctx, sprite_manager) {
        //console.log("draw player")
        //console.log(this.pos_x, this.pos_y)
        sprite_manager.drawSprite(ctx, "player", this.pos_x, this.pos_y)
    }
}

export class NPC extends Entity {
    /*constructor(pos_x = 0, pos_y = 0, size_x = 1, size_y = 1) {
        super(pos_x, pos_y, size_x, size_y)
        super.name = 'NPC'
        this.lifetime = 1

    }*/
    speed = 8
    direction = Direction[0]
    change_dir_counter = 0
    hit() {

    }
    check_death() {
        if (this.lifetime <= 0) {
            console.log("NPC was destroying")
            super.destroy()
        }
    }
    onTouchEntity(entity, sound_manager) {
        //console.log("from npc", entity.name, this.id)
        let res = null
        switch (entity.name) {
            case "player":
                console.log("take this leaflet")
                entity.take_damage()
                res = this.id
        }
        return res
    }

    passive_moving() {
        //let direction = 'left'
        this.move_x = 0
        this.move_y = 0
        //console.log(this.direction)
        //console.log(this.direction)
        //console.log(Math.random(4))
        if(this.change_dir_counter == 0){
            this.direction = Direction[String(Math.floor(Math.random() * 4))]
            switch (this.direction) {
                case 'left':
                    this.move_x = -1
                    break
                case 'right':
                    this.move_x = 1
                    break
                case 'up':
                    this.move_y = -1
                    break
                case 'down':
                    this.move_y = 1
                    break
    
            }
            this.change_dir_counter = Math.round(this.size_x/this.speed)
        }
        else{
            this.change_dir_counter -=1
        }
        
        //console.log(this.direction)
        
    }
    following(player, map_manager) {
        let player_coord = { "x": Math.round(player.pos_x / player.size_x), "y": Math.round(player.pos_y / player.size_y) }
        let npc_coord = { "x": Math.round(this.pos_x / this.size_x), "y": Math.round(this.pos_y / this.size_y) }
        //console.log("following")
        //console.log(this.change_dir_counter)
        if(this.change_dir_counter == 0){
            let next_tile = aStar(npc_coord, player_coord,map_manager)[0]
            //console.log(next_tile)
            let dir_x = next_tile.x - npc_coord.x
            let dir_y = next_tile.y - npc_coord.y
            this.move_x = dir_x
            this.move_y = dir_y
            if(this.move_x == -1) this.direction = Direction[0]
            if(this.move_x == 1) this.direction = Direction[1]
            if(this.move_y == -1) this.direction = Direction[2]
            if(this.move_y == 1) this.direction = Direction[3]
            this.change_dir_counter = Math.round(this.size_x/this.speed)
        }
        else{
            this.change_dir_counter -=1
        }

    }
    draw(ctx, sprite_manager) {

        //console.log("draw npc")
        sprite_manager.drawSprite(ctx, "npc", this.pos_x, this.pos_y)
    }
}

export class Bonus extends Entity {
    /*constructor(type, pos_x = 0, pos_y = 0, size_x = 1, size_y = 1) {
        super(pos_x, pos_y, size_x, size_y)
        super.name = 'bonus'
        this.type = type
        this.is_available = true
    }*/
    type = ""
    collecting() {
        this.is_available = false
        super.destroy()
    }
    draw(ctx, sprite_manager) {
        //console.log("draw bonus")
        //console.log(this.type)
        if (this.is_available === false) {
            return
        }
        if (this.type == "Eat") {
            sprite_manager.drawSprite(ctx, 'food', this.pos_x, this.pos_y)
        }
        if (this.type == "Coffee") {
            sprite_manager.drawSprite(ctx, 'coffee', this.pos_x, this.pos_y)
        }

    }
}
export class TP extends Entity {
    type = ""
    draw(ctx, sprite_manager) {
        //console.log(this.type)
        //console.log(this.pos_x, this.pos_y)
        //sprite_manager.drawSprite(ctx, this.type, this.pos_x, this.pos_y) 
        if (this.type == "Exit") {
            sprite_manager.drawSprite(ctx, 'next_level', this.pos_x, this.pos_y)
        }
        if (this.type == "NoExit") {
            sprite_manager.drawSprite(ctx, 'close_exit_sign', this.pos_x, this.pos_y)
        }
        if (this.type == "Win") {
            //console.log("find win")
            sprite_manager.drawSprite(ctx, 'metro', this.pos_x, this.pos_y)
        }
    }
}
/*let player = new Player()
let bonus = new Bonus("life")
let npc = new NPC()
player.on_touch_entity(bonus)
player.on_touch_entity(npc)*/

