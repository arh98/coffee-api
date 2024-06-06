import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../../config/jwt-config';
import { Request } from 'express';
import { REQUEST_USER_KEY } from 'src/auth/auth.constants';

@Injectable()
export class AccessTokenGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    ) {}

    async canActivate(ctx: ExecutionContext): Promise<boolean> {
        const req = ctx.switchToHttp().getRequest();

        const token = this.extractTokenFromHeader(req);
        if (!token) {
            throw new UnauthorizedException('Token not found');
        }
        try {
            const payload = await this.jwtService.verifyAsync(
                token,
                this.jwtConfiguration,
            );
            req[REQUEST_USER_KEY] = payload;
        } catch (err) {
            throw new UnauthorizedException('Token not valid');
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [_, token] = request.headers.authorization?.split(' ') ?? [];
        return token;
    }
}
