import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const Protocol = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        console.log('default value :', data);
        const req = ctx.switchToHttp().getRequest();
        return req.protocol;
    },
);
