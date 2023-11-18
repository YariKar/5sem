import * as socketIo from 'socket.io-client'
import {useEffect} from "react";
const server_url = 'http://localhost:3001'



export class SocketService{
    static socket = null
    static createConnection(){
        this.socket = socketIo.connect(server_url)
        this.socket.on('connect',()=>{
            console.log("connected")
        })
        this.socket.on('disconnect',()=>{
            console.log("disconnect")
        })

    }
}



export const useConnectSocket = () =>{
    const connectSocket = ()=>{
        SocketService.createConnection();
    }
    useEffect(()=>{
       connectSocket()
    },[])
}