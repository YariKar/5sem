import { Injectable } from '@nestjs/common';
import brokers from "./brokers.json"
import stock from "./stock.json"
import fs from "fs"
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getAllBrokers(): string {
    //console.log(brokers)
    return JSON.stringify(brokers)
  }

  getAllStocks(): string {
    return JSON.stringify(stock)
  }

  addBroker(broker) {
    let last_ind = brokers.length - 1
    let new_id = brokers[last_ind].id + 1
    broker.id = new_id
    console.log(broker)

    brokers.push(broker)
    fs.writeFile('src/brokers.json', JSON.stringify(brokers), (err) => {
      if (err) throw err
      console.log('hehe hihi haha');
    });

    return JSON.stringify({ "mes": "success" })
  }

  changeBroker(id, broker): string {
    console.log(id, broker)
    id = Number(id)
    const index = brokers.map((g) => {
      return g.id;
    }).indexOf(id);

    console.log(id, index, broker)

    if (index === -1) {
      return JSON.stringify({ "mes": "fail" })
    } else {
      brokers[index].money = parseInt(broker.money)
      fs.writeFile('src/brokers.json', JSON.stringify(brokers), (err) => {
        if (err) throw err;
        console.log('hehe hihi haha');
      });
      return JSON.stringify({ "mes": "success" })
    }
  }

  deleteBroker(id): string {
    id = Number(id)
    //console.log(id)
    const index = brokers.map((g) => {
      return g.id;
    }).indexOf(id);
    console.log(index)

    if (index === -1) {
      return JSON.stringify({ "mes": "fail" })
    } else {
      brokers.splice(index, 1);
      fs.writeFile('src/brokers.json', JSON.stringify(brokers), (err) => {
        if (err) throw err;
        console.log('hehe hihi haha', err);
      });
      return JSON.stringify({ "mes": "success" })
    }
  }
  getBroker(broker_name): any {
    const broker = brokers.filter((current_broker) => {
      if (broker_name.name == current_broker.name) {
        return true
      }
    })[0]
    return broker
  }

  buyStocks(body:any): any {
    console.log("buyStocks at app.service", body)
    const broker = brokers.filter((current_broker)=>{
      if (body.broker_id == current_broker.id) {
        return true
      }
    })[0]
    const current_stock = stock.filter((s) => {
      if (body.stock_id == s.id) {
        return true
      }
    })[0]
    if (!broker) {
      console.log("broker not find. error on server in buyStocks request")
      return {"mes": "fail", "about": "broker not find"}
    }
    //const stock_price = parseFloat(current_stock?.data[current_stock?.data?.length - 1 - body.index]?.Open);
    const stock_price = Number(current_stock?.data[current_stock?.data?.length - 1 - body.index]?.Open.slice(1))
    let stock_id = body.stock_id
    if (!broker.stocks[stock_id]) {
      broker.stocks[stock_id] = {
        "count": 0,
        "sum": 0
      }
    }
    if (stock_price * body.count < broker.money) {
      broker.stocks[stock_id].count += body.count
      broker.stocks[stock_id].sum += stock_price * body.count
      broker.money -= stock_price * body.count
      fs.writeFile('src/brokers.json', JSON.stringify(brokers), (err) => {
        if (err) throw err;
      });
      return { "mes": "success", "changed_broker": broker }
    }
    else{
      return {"mes": "fail", "about": "not enough money"}
    }

  }

  sellStocks(body) {
    console.log("sellStocks at app.service", body)
    const broker = brokers.filter((current_broker)=>{
      if (body.broker_id == current_broker.id) {
        return true
      }
    })[0]
    const current_stock = stock.filter((s) => {
      if (body.stock_id == s.id) {
        return true
      }
    })[0]
    if (!broker) {
      console.log("broker not find. error on server in buyStocks request")
      return {"mes": "fail", "about": "broker not find"}
    }
    //console.log("broker and stock", broker, current_stock)
    const stock_price = Number(current_stock?.data[current_stock?.data?.length - 1 - body.index]?.Open.slice(1))
    let stock_id = body.stock_id
    if (!broker.stocks[stock_id]) {
      broker.stocks[stock_id] = {
        "count": 0,
        "sum": 0
      }
    }
    //console.log("broker and stock_price", broker, stock_price)
    const average_sum = (broker.stocks[stock_id].sum/broker.stocks[stock_id].count)*body.count
    //console.log("average_sum", average_sum)
    if (broker.stocks[stock_id].count>=body.count) {
      broker.stocks[stock_id].count -= body.count
      broker.stocks[stock_id].sum -= average_sum
      broker.money += stock_price * body.count
      console.log("updted value on server", broker)
      fs.writeFile('src/brokers.json', JSON.stringify(brokers), (err) => {
        if (err) throw err;
      });
      return { "mes": "success", "changed_broker": broker }
    }
    else{
      return {"mes": "fail", "about": "not enough stocks"}
    }

  }
}




