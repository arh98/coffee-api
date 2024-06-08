import { Body, Controller, Post } from '@nestjs/common';
import { Auth } from '../decorators/auth.decorator';
import { GoogleAuthenticationService } from './google-authentication.service';
import { AuthType } from '../enums/auth-types.enum';
import { GoogleTokenDto } from '../dto/google-token.dto';

@Auth(AuthType.None)
@Controller('auth/google')
export class GoogleAuthenticationController {
    constructor(
        private readonly googleAuthService: GoogleAuthenticationService,
    ) {}

    @Post()
    authenticate(@Body() tokenDto: GoogleTokenDto) {
        return this.googleAuthService.authenticate(tokenDto.token);
    }
}
