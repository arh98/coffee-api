import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp(),
            res = ctx.getResponse<Response>(),
            req = ctx.getRequest<Request>(),
            status = exception.getStatus(),
            exceptionResponse = exception.getResponse();

        const err =
            typeof res === 'string'
                ? { message: exceptionResponse }
                : (exceptionResponse as object);

        res.status(status).json({
            statusCode: status,
            timestamp: Date().toString(),
            // timestamp: new Date().toISOString(),
            path: req.url,
            ...err,
        });
    }
}
