import {
    ArgumentMetadata,
    BadRequestException,
    Injectable,
    PipeTransform,
} from '@nestjs/common';

@Injectable()
export class IntParserPipe implements PipeTransform {
    transform(value: string, _metadata: ArgumentMetadata) {
        const val = parseInt(value, 10);
        if (isNaN(val)) {
            throw new BadRequestException('Invalid number/integer');
        }

        return val;
    }
}
