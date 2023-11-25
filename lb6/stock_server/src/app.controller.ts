import { Controller, Get, Post, Delete, Put, Param, Body, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("/getAllBrokers")
  getAllBrokers(): string {
    //console.log("getting all brokers")
    return this.appService.getAllBrokers()
  }

  /*@Get("/getBroker") ?
  getBrokers(@Query() params: any): string {
    return this.appService.getBrokers(params)
  }*/

  @Post("/postBroker")
  postBroker(@Body() body: any):any{
    return this.appService.addBroker(body)
  }

  @Put("/changeBroker/:id")
  changeBroker(@Param() { id }: any, @Body() body: any){
    return this.appService.changeBroker(id, body)
  }

  @Delete("/deleteBroker/:id")
  deleteBroker(@Param() { id }: any){
    return this.appService.deleteBroker(id)
  }

  @Get("/getAllStock")
  getStock():string{
    return this.appService.getAllStocks()
  }

  @Get("/getBroker")
  getBroker(@Query() params:any){
    return this.appService.getBroker(params)
  }

  @Post("/buyStocks")
  postBuyStocks(@Body() body:any):any{
    console.log("buyStocks on app.controller", body)
    return this.appService.buyStocks(body)
  }

  @Post("/sellStocks")
  postSellStocks(@Body() body:any):any{
    console.log("sellStocks on app.controller", body)
    return this.appService.sellStocks(body)
  }
}
