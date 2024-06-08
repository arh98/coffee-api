import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception/http-exception.filter';
import { TimeoutInterceptor } from './common/interceptor/timeout.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );
    const option = new DocumentBuilder()
        .setTitle('iluvcoffee')
        .setDescription('coffee api')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, option);
    SwaggerModule.setup('api', app, document);

    // app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(
        // new WrapResponseInterceptor(),
        new TimeoutInterceptor(),
    );
    await app.listen(3000);
}
bootstrap();
