import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './config/jwt-config';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './authentication/guards/access-token.guard';
import { AuthenticationGuard } from './authentication/guards/auth.guard';
import { RefreshTokenIdsStorage } from './authentication/refresh-token-ids.storage';
import { RolesGuard } from './authorization/guards/roles.guard';
import { PermissionsGuard } from './authorization/guards/permission.guard';
import { FrameworkContributorPolicyHandler } from './authorization/policies/framework-contributor.policy';
import { PolicyHandlerStorage } from './authorization/policies/policy-handler.storage';
import { PoliciesGuard } from './authorization/guards/policies.guard';
import { ApiKey } from 'src/users/api-keys/entities/api-key.entity';
import { ApiKeyGuard } from './authentication/guards/api-key.guard';
import { ApiKeysService } from './authentication/api-key.service';
import { GoogleAuthenticationService } from './authentication/social/google-authentication.service';
import { GoogleAuthenticationController } from './authentication/social/google-authentication.controller';
import { OtpAuthenticationService } from './authentication/otp-authentication.service';
import { SessionAuthenticationService } from './authentication/session-authentication.service';
import { SessionAuthenticationController } from './authentication/session-authentication.controller';
import { UserSerializer } from './authentication/serializers/user-serializer';
import * as session from 'express-session';
import * as passport from 'passport';
import Redis from 'ioredis';
import RedisStore from 'connect-redis';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, ApiKey]),
        JwtModule.registerAsync(jwtConfig.asProvider()),
        ConfigModule.forFeature(jwtConfig),
    ],
    providers: [
        {
            provide: HashingService,
            useClass: BcryptService,
        },
        {
            provide: APP_GUARD,
            useClass: AuthenticationGuard,
        },
        {
            provide: APP_GUARD,
            useClass: PoliciesGuard, //PermissionsGuard, //RolesGuard,
        },
        AccessTokenGuard,
        ApiKeyGuard,
        ApiKeysService,
        AuthenticationService,
        RefreshTokenIdsStorage,
        PolicyHandlerStorage,
        FrameworkContributorPolicyHandler,
        GoogleAuthenticationService,
        OtpAuthenticationService,
        SessionAuthenticationService,
        UserSerializer,
    ],
    controllers: [
        AuthenticationController,
        GoogleAuthenticationController,
        SessionAuthenticationController,
    ],
})
export class AuthModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        const redisClient = new Redis(6379, 'localhost');
        const redisStore = new RedisStore({
            client: redisClient,
            prefix: 'myapp:',
        });

        consumer
            .apply(
                session({
                    store: redisStore,
                    secret: process.env.SESSION_SECRET,
                    resave: false,
                    saveUninitialized: false,
                    cookie: {
                        sameSite: true,
                        httpOnly: true,
                    },
                }),
                passport.initialize(),
                passport.session(),
            )
            .forRoutes('*');
    }
}
