import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => {
    return {
        secret: process.env.JWT_SECRET_KEY,
        audience: process.env.JWT_AUDIENCE,
        issuer: process.env.JWT_ISSUER,
        accessTokenTtl: parseInt(process.env.JWT_EXP ?? '3600', 10),
        refreshTokenTtl: parseInt(
            process.env.JWT_REFRESH_TTL ?? '86400',
            10,
        ),
    };
});
