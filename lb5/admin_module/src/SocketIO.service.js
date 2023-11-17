import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as socketIo from 'socket.io-client'
const server_url = 'http://localhost:3001'
@Injectable({
  providedIn: 'root'
})
export class SocketIoService {

  #client_socket
  constructor() { 
    this.#client_socket = socketIo.connect(server_url)
  }
  ListenToServer(connection){
    return new Observable((subscribe)=>{
      this.#client_socket.on(connection,(data)=>{
        subscribe.next(data)
      })
    })
  }
  emitToServer(connection, data){
    this.#client_socket.emit(connection,data)

  }
}