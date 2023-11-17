import { Injectable } from '@nestjs/common';
import brokers from "./brokers.json"
import stock from "./stock.json"
import fs from "fs"
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getAllBrokers():string{
    console.log(brokers)
    return JSON.stringify(brokers)
  }

  getAllStocks():string{
    return JSON.stringify(stock)
  }

  addBroker(broker){
    let last_ind  = brokers.length-1
    let new_id = brokers[last_ind].id +1
    broker.id = new_id
    console.log(broker)

      brokers.push(broker)
      fs.writeFile('src/brokers.json', JSON.stringify(brokers), (err) => {
        if (err) throw err
        console.log('hehe hihi haha');
      });

      return JSON.stringify({"mes":"success"})
  }

  changeBroker(id, broker):string{
    console.log(id, broker)
    id = Number(id)
    const index = brokers.map((g) => {
      return g.id;
    }).indexOf(id);

    console.log(id, index, broker)

    if(index===-1){
      return JSON.stringify({"mes":"fail"})
    }else{
      brokers[index].money = parseInt(broker.money)
      fs.writeFile('src/brokers.json', JSON.stringify(brokers), (err) => {
        if (err) throw err;
        console.log('hehe hihi haha');
      });
      return JSON.stringify({"mes":"success"})
    }
  }

  deleteBroker(id):string{
    id = Number(id)
    //console.log(id)
    const index = brokers.map((g) => {
      return g.id;
    }).indexOf(id);
    console.log(index)

    if(index===-1){
      return JSON.stringify({"mes":"fail"})
    }else{
      brokers.splice(index, 1);
      fs.writeFile('src/brokers.json', JSON.stringify(brokers), (err) => {
        if (err) throw err;
        console.log('hehe hihi haha', err);
      });
      return JSON.stringify({"mes":"success"})
    }
  }
}
