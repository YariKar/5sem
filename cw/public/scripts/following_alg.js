const TyleIndexes = {
    'grass': 795,
    'road': 389,
    'wall': 2,
    'grass_2': 794
}
let moving_tyles = [TyleIndexes.grass, TyleIndexes.grass_2, TyleIndexes.road]

class Node{
    constructor(x, y, is_moving, finish){
        //finish is like {"x": , "y":}
        this.x = x
        this.y = y
        this.is_moving = is_moving
        this.h = this.heuristic(finish)
        this.g = 100000
        this.f = 100000
        this.parent = null
        /*this.h = this.heuristic(finish)
        this.g = 0
        this.f = this.heuristic(finish)*/
    }
    heuristic (finish) {
        let d1 = Math.abs (this.x - finish.x);
        let d2 = Math.abs (this.y - finish.y);
        return d1 + d2;
    }
}

export function aStar(start, finish, map_manager){ //start, finish is like {"x": , "y":}
    //console.log('start')
    let nodeMap = getNodeMap(map_manager.matrixMap, finish)
    //console.log(nodeMap)
    //console.log(start, finish)
    let start_node = nodeMap[start.y][start.x]
    let finish_node = nodeMap[finish.y][finish.x]
    //console.log(start_node, finish_node)
    start_node.g = 0 
    start_node.f  = start_node.g+start_node.h
    //console.log(start_node, finish_node)
    let U = []
    let Q = []
    Q.push(start_node)
    while (Q.length !=0){
        let current_ind= get_current_index(Q)
        let current_node = Q[current_ind]
        if (JSON.stringify(current_node) == JSON.stringify(finish_node)){
            //console.log("return way")
            return getBackWay(finish_node)
        }
        Q.splice(current_ind, 1)
        U.push(current_node)
        let neighb = []
        //console.log(current_ind, current_node)
        neighb.push(nodeMap[current_node.y-1][current_node.x])
        neighb.push(nodeMap[current_node.y+1][current_node.x])
        neighb.push(nodeMap[current_node.y][current_node.x-1])
        neighb.push(nodeMap[current_node.y][current_node.x+1])
        for (let i = 0; i<neighb.length;i++){
            if(neighb[i] == undefined || neighb[i].is_moving == false){
                continue
            }
            let g_score = current_node.g +1
            if(isNodeIn(neighb[i], U) && g_score >= neighb[i].g){
                continue
            }
            if(!isNodeIn(neighb[i], U) || g_score < neighb[i].g){
                neighb[i].parent = current_node
                neighb[i].g = g_score
                neighb[i].f = g_score+ neighb[i].h
                if(!isNodeIn(neighb[i],Q)){
                    Q.push(neighb[i])
                }
            }
            
        }
        
    }
    //console.log("not find")
    return 
}

function isNodeIn(node, array){
    let flag = false
    array.forEach(element=>{
        if (JSON.stringify(element) == JSON.stringify(node)){
            flag = true
        }
    })
    return flag
}

function get_current_index(Q){
    let min_f = 1000
    let min_ind = -1
    for(let i =0; i<Q.length; i++){
        if (Q[i].f < min_f){
            min_f = Q[i].f
            min_ind = i
        }
    }
    return min_ind
}

function getNodeMap(map, finish){
    //console.log(map, finish)
    let nodeMap = []
    for(let i =0; i< map.length;i++){
        let row = []
        for(let j = 0; j<map[i].length;j++){
            row.push(new Node(j,i, moving_tyles.includes(map[i][j]), finish))
        }
        nodeMap.push(row)
    }
    return nodeMap
}

function getBackWay(finish_node){
    let current_node = finish_node
    let way = []
    while (current_node.parent !== null){
        way.push(current_node)
        current_node = current_node.parent
    }
    way.reverse()
    return way
}
