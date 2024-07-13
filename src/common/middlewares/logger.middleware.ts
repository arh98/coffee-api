import { FieldMiddleware, MiddlewareContext, NextFn } from '@nestjs/graphql';

export const loggerMiddleware: FieldMiddleware = async (
    ctx: MiddlewareContext,
    next: NextFn,
) => {
    const value: string = await next();
    console.log(`Field: ${ctx.info.fieldName}, Value: ${value}`);
    return value;
};
