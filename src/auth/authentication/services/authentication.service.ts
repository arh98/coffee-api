import { ActiveUserData } from '../../interfaces/active-user-data.interface';
import {
    ConflictException,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { SignUpDto } from '../dto/sign-up.dto';
import { HashingService } from '../../hashing/hashing.service';
import { SignInDto } from '../dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../../config/jwt-config';
import { ConfigType } from '@nestjs/config';
import { RefreshTokenIdsStorage } from './refresh-token-ids.storage';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { InvalidateRefreshTokenError } from '../errors/invalidate-refresh-token.error';
import { randomUUID } from 'crypto';
import { OtpAuthenticationService } from './otp-authentication.service';

@Injectable()
export class AuthenticationService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        private readonly hasher: HashingService,
        private readonly jwtService: JwtService,
        @Inject(jwtConfig.KEY)
        private readonly jwtConf: ConfigType<typeof jwtConfig>,
        private readonly idsStorage: RefreshTokenIdsStorage,
        private readonly otpAuthService: OtpAuthenticationService,
    ) {}
    async signUp(signUpDto: SignUpDto) {
        try {
            const user = new User();
            user.email = signUpDto.email;
            user.password = await this.hasher.hash(signUpDto.password);

            await this.userRepo.save(user);
        } catch (err) {
            const pgUniqueViolationCode = '23505';
            if (err.code === pgUniqueViolationCode) {
                throw new ConflictException('User already exists');
            }
            throw err;
        }
    }

    async signIn(signInDto: SignInDto) {
        const user = await this.userRepo.findOneBy({
            email: signInDto.email,
        });
        if (!user) {
            throw new UnauthorizedException('User does not exist');
        }
        const isEqual = await this.hasher.compare(
            signInDto.password,
            user.password,
        );
        if (!isEqual) {
            throw new UnauthorizedException('Wrong password');
        }
        if (user.isTfaEnabled) {
            const isValid = this.otpAuthService.verifyCode(
                signInDto.tfaCode,
                user.tfaSecret,
            );
            if (!isValid) {
                throw new UnauthorizedException('Invalid 2FA code');
            }
        }

        return await this.generateTokens(user);
    }

    async generateTokens(user: User) {
        const refreshTokenId = randomUUID(),
            refreshTokenExp = this.jwtConf.refreshTokenTtl,
            accTokenExp = this.jwtConf.accessTokenTtl;

        const [accessToken, refreshToken] = await Promise.all([
            this.signToken<Partial<ActiveUserData>>(user.id, accTokenExp, {
                email: user.email,
                role: user.role,
                // made jwt heavy!!
                permissions: user.permissions,
            }),
            this.signToken(user.id, refreshTokenExp, { refreshTokenId }),
        ]);
        await this.idsStorage.insert(user.id, refreshTokenId);

        return { accessToken, refreshToken };
    }

    async refreshTokens(refreshTokenDto: RefreshTokenDto) {
        try {
            const { sub, refreshTokenId } = await this.jwtService.verifyAsync<
                Pick<ActiveUserData, 'sub'> & { refreshTokenId: string }
            >(refreshTokenDto.refreshToken, {
                secret: this.jwtConf.secret,
                audience: this.jwtConf.audience,
                issuer: this.jwtConf.issuer,
            });
            const user = await this.userRepo.findOneOrFail({
                where: { id: sub },
            });
            const isValid = await this.idsStorage.validate(
                user.id,
                refreshTokenId,
            );
            if (isValid) {
                await this.idsStorage.invalidate(user.id);
            } else {
                throw new Error('Refresh Token is invalid');
            }
            return this.generateTokens(user);
        } catch (err) {
            if (err instanceof InvalidateRefreshTokenError) {
                throw new UnauthorizedException('Access denied!');
            }
            throw new UnauthorizedException();
        }
    }

    private async signToken<T>(userId: number, expiresIn: number, payload?: T) {
        return await this.jwtService.signAsync(
            {
                sub: userId,
                ...payload,
            },
            {
                audience: this.jwtConf.audience,
                issuer: this.jwtConf.issuer,
                secret: this.jwtConf.secret,
                expiresIn,
            },
        );
    }
}
