const Bind = {
    87: 'move_up',
    83: 'move_down',
    65: 'move_left',
    68: 'move_right',
    32: 'hit'
}

export const Actions = {
    'move_up': 1,
    'move_down': 2,
    'move_left': 3,
    'move_right': 4,
    'hit' : 5,
    'stop': 6
}

export let event_manager = new class EventManager{
    //bind = []
    //action = []
    action = Actions.stop
    mouse_coords= {'x':0, 'y:':0}
    setup (canvas){
        /*this.bind[87] = 'up'
        this.bind[65] = 'left'
        this.bind[83] = 'down'
        this.bind[68] = 'right'
        this.bind[32] = 'hit'*/
        //this.action = Actions.stop
        
        canvas.addEventListener("mousedown", this.onMouseDown)
        canvas.addEventListener("mouseup", this.onMouseUp)
        document.body.addEventListener("keydown", this.onKeyDown)
        document.body.addEventListener("keyup", this.onKeyUp)
        //console.log("binded")
    }

    onMouseDown(event){
        //this.action['hit'] = 'hit'
        event_manager.action = Actions.hit
        //console.log(this.action)
    }
    onMouseUp(event){
        //this.action['hit'] = 'stop'
        event_manager.action = Actions.stop
    }
    onKeyDown(event){
        //let action = this.bind[event.keyCode]
        /*if(action){
            this.action[action] = true
        }*/
        //console.log(event.keyCode)
        let action = Bind[event.keyCode]
        if(action){
            event_manager.action = Actions[action]
           //console.log(this.action)
        }
        //console.log(this.action)
    }
    onKeyUp(event){
        /*let action = this.bind[event.keyCode]
        if(action){
            this.action[action] = false
        }*/
        event_manager.action = Actions.stop
    }
    
}