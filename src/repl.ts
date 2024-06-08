import { repl } from '@nestjs/core';
import { AppModule } from './app.module';

async function run() {
    await repl(AppModule);
}
run();
