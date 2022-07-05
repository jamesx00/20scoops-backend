import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TwentyScoopsAuthHeaderMiddleware } from './auth/middleware/auth.middleware';
import 'dotenv/config';
import { UserController } from './user/user.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    MongooseModule.forRoot(process.env.DATABASE_URL),
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TwentyScoopsAuthHeaderMiddleware)
      .exclude({
        path: 'users(.*)',
        method: RequestMethod.GET,
      })
      .forRoutes(UserController);
  }
}
