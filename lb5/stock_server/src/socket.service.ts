import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    SubscribeMessage,
    WebSocketGateway
} from "@nestjs/websockets";

@WebSocketGateway(
    {
        cors: {
            origin:"*"
        }
    }
)

export class SocketService implements OnGatewayConnection{
     private index = 0;
     private interval;

    handleConnection(client: any) {
        console.log(client);
        console.log("CONNECTED");
    }
    @SubscribeMessage("getData")
    handleEvent(@MessageBody() dto:any, @ConnectedSocket() client: any){

        console.log(dto)
        const res = {type:"send", dto}
        this.interval = setInterval(()=>{
            this.index+=1
            console.log(this.index)
            client.emit("trading", this.index)
        }, dto.speed*1000)

    }

    @SubscribeMessage("stop")
    handleStopEvent(@MessageBody() dto:any, @ConnectedSocket() client: any){
        clearInterval(this.interval)
        console.log("stop")
        this.index = 0
    }
}