import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cors from "cors"

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  /*app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    
  });*/
  /*app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", req.header('Origin'));
    res.header("Access-Control-Allow-Credentials", true);
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
  });*/
  await app.listen(3001);
}
bootstrap();
