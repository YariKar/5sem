import { MapManager } from "./MapManager.js";
import { SpriteManager } from "./SpriteManager.js"
import { GameManager } from "./GameManager.js";
import { PhysicManager } from "./PhysicManager.js"
import { Entity, Player, NPC, Bonus } from "./Entities.js"
import { Actions, event_manager } from "./EventManager.js"
import {SoundManager} from "./SoundManager.js"

const SoundPath = {
    "eat": "../public/sounds/crunch.1.ogg",
    "wind": "../public/sounds/wind5.wav",
    "damage": "../public/sounds/damage_taken.mp3",
    "death": "../public/sounds/vgdeathsound.wav",
    "drink": "../public/sounds/water_sounds.wav",
    "win": "../public/sounds/WinMutedGuitar.ogg"
}


function draw(ctx, pos) {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)
    ctx.strokeRect(pox.x, pos.y, 20, 20)
    ctx.stroke()
}

/*function update(ctx, pos) {
    if (pos < canvas.clientWidth - 20) {
        pos.x += 4
    }
    else {
        pos.x = 0
    }
    if (pos.y < canvas.clientHeight - 20) {
        pos.y += 4
    }
    else {
        pos.y = 0
    }
    draw(ctx, pos)
}*/

function update() {
    //console.log("entities", game_manager.entities)\
    //console.log(event_manager.action)
    if (game_manager.player == null) {
        return
    }
    if( game_manager.player.check_death()){
        //console.log("game over")
        //localStorage.current_score = game_manager.player.score
        show_records("death")
        return "game over"
    }
    if (game_manager.is_win == true){
        console.log("you win")
        //localStorage.current_score = game_manager.player.score
        /*window.onload = function(){
            sound_manager.play(SoundPath.win)
        }*/
        game_manager.player.score +=500
        show_records("win")
        return "you win"
    }
    if(game_manager.is_update_level){
        game_manager.is_update_level = false
        map_manager = new MapManager()
        sprite_manger = new SpriteManager()
        game_manager.entities =[]
        game_manager.loadAll(map_manager,sprite_manger,event_manager, sound_manager, canvas, ctx)
        console.log("update level")
    }
    //console.log(game_manager.player.lifetime, game_manager.player.score)
    /*let health = document.getElementById("health").value = game_manager.player.lifetime
    let score = document.getElementById("score").value = game_manager.player.score*/
    document.getElementById("health").innerHTML = `${game_manager.player.lifetime}`
    document.getElementById("score").innerHTML = `${game_manager.player.score}`
    game_manager.player.move_x = 0
    game_manager.player.move_y = 0
    switch (event_manager.action) {
        case Actions.move_up:
            game_manager.player.move_y = -1
            break;
        case Actions.move_down:
            game_manager.player.move_y = 1
            break
        case Actions.move_left:
            game_manager.player.move_x = -1
            break
        case Actions.move_right:
            //console.log("right")
            game_manager.player.move_x = 1
            break
        case Actions.hit:
            game_manager.player.hit()
            break
        case Actions.stop:
            game_manager.player.move_y = 0
            game_manager.player.move_x = 0
            break
    }
    //console.log(game_manager.player)
    game_manager.entities.forEach(function (e) {
        try {
            if(e.name === "LD"){
                game_manager.NPC_moving(e, map_manager)
            }
            //console.log(e)
            e.update(physic_manager, map_manager, game_manager, sound_manager)
        }
        catch (ex) { }
    })
    for (let i = 0; i < game_manager.laterKill.length; i++) {
        let idx = game_manager.entities.indexOf(game_manager.laterKill[i])
        if (idx > -1) {
            game_manager.entities.splice(idx, 1)
        }
    }
    if (game_manager.laterKill.length > 0) {
        game_manager.laterKill.length = 0
    }
    map_manager.draw(canvas, ctx)
    //map_manager.centerAt(game_manager.player.pos_x, game_manager.player.pos_y)
    // console.log(game_manager.entities)
    game_manager.draw(ctx, sprite_manger)
}

let canvas = document.getElementById("screen");
let ctx = canvas.getContext("2d");
/*let health = document.getElementById("health").value =100
let score = document.getElementById("score").value =0*/

let map_manager = new MapManager()
let sprite_manger = new SpriteManager()
//let event_manager = event_manager
let physic_manager = new PhysicManager()
let game_manager = new GameManager()
let sound_manager = new SoundManager()
sound_manager.init()
function main() {
    game_manager.loadAll(map_manager, sprite_manger, event_manager,sound_manager, canvas, ctx)
    //console.log("draw", map_manager)
    //game_manager.play(event_manager, map_manager)
    console.log("before start", game_manager.entities)
    window.onload = function(){
        sound_manager.play(SoundPath.wind)
    }
    setInterval(update, 100)
    return "game_over"

}
function show_records(status) {
    localStorage["game.status"] = JSON.stringify(status)
    //setInterval(function(){}, 1500)
    console.log(game_manager.player.score)
    let score_table = JSON.parse(localStorage["game.score_table"])

    score_table.push({
        name: localStorage["game.username"],
        score: game_manager.player.score
    })

    localStorage["game.score_table"] = JSON.stringify(score_table)
    window.location = "./record";
}
/*console.log(game_manager.factory, "factory")
map_manager.loadMap("/game")
sprite_manger.loadAtlas("/sprites", "../public/images/spritesheet.png")
map_manager.parseEntities(game_manager)
map_manager.draw(canvas,ctx)*/


/*sprite_manger.loadAtlas("","")
sprite_manger.drawSprite(ctx, "player", 1, 10)*/

main()
//show_records()

