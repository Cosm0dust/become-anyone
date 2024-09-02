import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';


import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        privateKey: configService.get('JWT_ACCESS_SECRET'),
        signOptions: {
          algorithm: 'HS256',
          expiresIn: '1d',
        },
        verifyOptions: {
          algorithms: ['HS256'],
        },
      }),
    }),
    ConfigModule,
    UserModule,
  ],
  providers: [
    AuthResolver,
    AuthService,
    JwtStrategy,
    LocalStrategy,
    JwtRefreshStrategy,
  ],
})
export class AuthModule { }
