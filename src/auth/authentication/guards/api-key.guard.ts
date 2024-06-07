import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { REQUEST_USER_KEY } from 'src/auth/auth.constants';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { ApiKey } from 'src/users/api-keys/entities/api-key.entity';
import { ApiKeysService } from '../api-key.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
    constructor(
        private readonly apiKeysService: ApiKeysService,
        @InjectRepository(ApiKey)
        private readonly apiKeysRepo: Repository<ApiKey>,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const apiKey = this.extractKeyFromHeader(request);
        if (!apiKey) {
            throw new UnauthorizedException();
        }
        const apiKeyEntityId = this.apiKeysService.extractIdFromApiKey(apiKey);
        try {
            const apiKeyEntity = await this.apiKeysRepo.findOne({
                where: { uuid: apiKeyEntityId },
                relations: { user: true },
            });
            await this.apiKeysService.validate(apiKey, apiKeyEntity.key);
            request[REQUEST_USER_KEY] = {
                sub: apiKeyEntity.user.id,
                email: apiKeyEntity.user.email,
                role: apiKeyEntity.user.role,
                permissions: apiKeyEntity.user.permissions,
            } as ActiveUserData;
        } catch {
            throw new UnauthorizedException();
        }
        return true;
    }

    private extractKeyFromHeader(request: Request): string | undefined {
        const [type, key] = request.headers.authorization?.split(' ') ?? [];
        return type === 'ApiKey' ? key : undefined;
    }
}
