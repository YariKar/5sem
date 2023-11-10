//import { MapManager } from "./MapManager"
const TyleIndexes = {
    'grass': 795,
    'road': 389,
    'wall': 2,
    'grass_2': 794
}

export class PhysicManager {
    update(obj, map_manager, game_manager, sound_manager) {
        /*if(obj.name == 'player')
            console.log("player", obj)*/
        if (obj.move_x === 0 && obj.move_y === 0) {

            return "stop"
        }
        //console.log(obj.move_x, obj.move_y)
        let newX = obj.pos_x + Math.floor(obj.move_x * obj.speed)
        let newY = obj.pos_y + Math.floor(obj.move_y * obj.speed)
        //console.log(obj, newX, newY)
        //console.log(obj.pos_x, obj.pos_y, newX, newY)
        let ts = map_manager.getTilesetIdx(newX + obj.size_x / 2, newY + obj.size_y / 2)
        //console.log("ts ",ts)
        let e = this.entityAtXY(obj, newX, newY, game_manager)
        //console.log(ts, e)
        if (e !== null && obj.onTouchEntity) {
            //console.log(e)
            let id =obj.onTouchEntity(e, sound_manager)
            //console.log(id)
            if (id!==null){
                if(id == "next_level"){
                    game_manager.level+=1
                    game_manager.is_update_level = true
                    return
                }
                if (id == "you_win"){
                    console.log("find_win")
                    game_manager.is_win = true
                    return
                }
                game_manager.deleteEntity(id)
            }
        }
        if ((ts !== TyleIndexes.grass && ts !==TyleIndexes.road) && obj.onTouchMap){
            obj.onTouchMap(ts)
        }
        if ((ts === TyleIndexes.grass || ts === TyleIndexes.road || ts === TyleIndexes.grass_2) && e === null) {
            obj.pos_x = newX
            obj.pos_y = newY
        }
        else {
            return "break"
        }
        return "move"
    }
    entityAtXY(obj, x, y, game_manager) {
        //console.log(obj, x, y, game_manager)
        //console.log(game_manager.entities.length)
        
        for (let i = 0; i < game_manager.entities.length; i++) {
            let e = game_manager.entities[i]
            //console.log("coords", x, y, obj.size_x, obj.size_y, e.pos_x, e.pos_y)
            if (e.name !== obj.name) {
                
                if (x + obj.size_x - 1 < e.pos_x || y + obj.size_y - 1 < e.pos_y ||
                    x > e.pos_x + e.size_x - 1 || y > e.pos_y + e.size_y - 1) {
                    continue;
                }
                //console.log("find", e)
                return e;
            }
        }
        //console.log("ret null")
        return null
    }
}