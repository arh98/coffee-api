import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
    use(req: Request, res: any, next: () => void) {
        console.time('request-response time');
        console.log(
            `Request from : host :${req.hostname} - ip :${req.ip} recieved !`,
        );
        res.on('finish', () => console.timeEnd('request-response time'));
        next();
    }
}
