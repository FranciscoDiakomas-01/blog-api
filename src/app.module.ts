import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UsersModule } from './domain/users/users.module';
import { PostsModule } from './domain/posts/posts.module';
import PrismaModule from './infra/prisma/prisma.module';
import ConfigurationModule from './infra/config/config.module';
import JsonWebTokenModule from './infra/jwt/jwt.module';
import BcriptModule from './infra/bcrypt/bcrypt.module';
import { AuthMiddleware } from './core/middleware/isAuthenticated';

@Module({
  imports: [
    UsersModule,
    PostsModule,
    PrismaModule,
    ConfigurationModule,
    JsonWebTokenModule,
    BcriptModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'users/login', method: RequestMethod.POST },
        { path: 'users', method: RequestMethod.POST },
        { path: 'users/refresh', method: RequestMethod.POST },
      )
      .forRoutes('*');
  }
}
