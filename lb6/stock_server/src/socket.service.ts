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
            
            origin: "*",
            allowEIO3: true
           /* allowedHeaders: "*",
            allowCredentials: "true"'http://localhost:8080'*/
            
        }
    }
)

export class SocketService implements OnGatewayConnection {
    private index = 0;
    private interval;
    private clients = []
    private tradingList

    private broadcast(event, message: any) {
        console.log("called broadcast with message to clients:", message)
        const broadCastMessage = JSON.stringify(message);
        for (let i = 0;i<this.clients.length;i++) {
            this.clients[i].emit(event, broadCastMessage);
        }
    }
    handleConnection(client: any) {
        this.clients.push(client)
        //console.log(client);
        console.log("CONNECTED");
    }

    handleDisconnect(client: any) {
        console.log("DISCONNECTED");
        for (let i = 0; i < this.clients.length; i++) {
            if (this.clients[i] === client) {
                this.clients.splice(i, 1);
                break;
            }
        }
    }

    @SubscribeMessage("getData")
    handleEvent(@MessageBody() dto: any, @ConnectedSocket() client: any) {

        console.log(dto.date, dto.speed, dto.index)
        this.index = Number(dto.index)
        const res = { type: "send", dto }
        this.interval = setInterval(() => {
            //console.log(this.index)
            //client.emit("trading", this.index)
            this.broadcast("trading_list", this.tradingList)
            this.broadcast("trading", this.index)
            this.index += 1
        }, dto.speed * 1000)

    }

    @SubscribeMessage("stop")
    handleStopEvent(@MessageBody() dto: any, @ConnectedSocket() client: any) {
        clearInterval(this.interval)
        console.log("stop")
        this.index = 0
    }

    @SubscribeMessage("setTradingList")
    handleTradingList(@MessageBody() dto: any, @ConnectedSocket() client: any) {
        console.log(dto)
        this.tradingList = dto
        this.broadcast("trading_list", dto)
        //client.emit("trading_list", dto.trading_list)
    }

    @SubscribeMessage("buyStocks")
    handleBuyStocks(@MessageBody() body: any, @ConnectedSocket() client: any) {
        console.log("body on buy sockets", body)
        const data = fetch("http://localhost:3001/buyStocks",{
            "method": "POST",
            "body": body,
            "headers": {
                "Content-type": "application/json"
            }
        }).then((res)=>{
            res.json().then((data)=>{
                console.log("response after buy request", data)
                if( data.mes== "success"){
                    this.broadcast("updateBroker", data.changed_broker)
                }
            })
            
        })

    }

    @SubscribeMessage("sellStocks")
    handleSellStocks(@MessageBody() body: any, @ConnectedSocket() client: any) {
        console.log("body on sell sockets", body)
        const data = fetch("http://localhost:3001/sellStocks",{
            "method": "POST",
            "body": body,
            "headers": {
                "Content-type": "application/json"
            }
        }).then((res)=>{
            res.json().then((data)=>{
                console.log("response after sell request", data)
                if( data.mes== "success"){
                    this.broadcast("updateBroker", data.changed_broker)
                }
            })
            
        })

    }
}