import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { promisify } from 'util';
import { Auth } from './decorators/auth.decorator';
import { SignInDto } from './dto/sign-in.dto';
import { SessionAuthenticationService } from './session-authentication.service';
import { Request } from 'express';
import { ActiveUser } from '../decorators/active-user.decorator';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { AuthType } from './enums/auth-types.enum';
import { SessionGuard } from './guards/session.guard';

@Auth(AuthType.None)
@Controller('session-auth')
export class SessionAuthenticationController {
    constructor(
        private readonly sessionAuthService: SessionAuthenticationService,
    ) {}

    @HttpCode(HttpStatus.OK)
    @Post('sign-in')
    async signIn(@Req() request: Request, @Body() signInDto: SignInDto) {
        const user = await this.sessionAuthService.signIn(signInDto);
        await promisify(request.logIn).call(request, user);
    }

    @UseGuards(SessionGuard)
    @Get()
    async sayHello(@ActiveUser() user: ActiveUserData) {
        return `Hello, ${user.email}!`;
    }
}
