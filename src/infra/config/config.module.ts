import { EnvShema } from './../../core/shcema/index';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      validate(config: any) {
        try {
          EnvShema.parse(config);
        } catch (error) {
          throw new Error(error);
        }

        return config;
      },
      isGlobal: true,
    }),
  ],
})
export default class ConfigurationModule {}
