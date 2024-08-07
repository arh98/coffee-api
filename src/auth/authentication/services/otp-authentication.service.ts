import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../users/entities/user.entity';
import { authenticator } from 'otplib';

@Injectable()
export class OtpAuthenticationService {
    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) {}

    async generateSecret(email: string) {
        const secret = authenticator.generateSecret();
        const appName = this.configService.getOrThrow('TFA_APP_NAME');
        const uri = authenticator.keyuri(email, appName, secret);
        return {
            uri,
            secret,
        };
    }

    verifyCode(code: string, secret: string) {
        return authenticator.verify({
            token: code,
            secret,
        });
    }

    async enableTfaForUser(email: string, secret: string) {
        const { id } = await this.userRepo.findOneOrFail({
            where: { email },
            select: { id: true },
        });
        await this.userRepo.update(
            { id },
            // TIP: Ideally, we would want to encrypt the "secret" instead of
            // storing it in a plaintext. Note - we couldn't use hashing here as
            // the original secret is required to verify the user's provided code.
            { tfaSecret: secret, isTfaEnabled: true },
        );
    }
}
