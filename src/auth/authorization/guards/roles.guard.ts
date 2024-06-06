import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { REQUEST_USER_KEY } from 'src/auth/auth.constants';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { Role } from 'src/users/enums/user-role.enum';
import { ROLE_KEY } from '../decorators/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const contextRoles = this.reflector.getAllAndOverride<Role[]>(
            ROLE_KEY,
            [context.getHandler(), context.getClass()],
        );
        if (!contextRoles) {
            return true;
        }
        const user: ActiveUserData = context.switchToHttp().getRequest()[
            REQUEST_USER_KEY
        ];
        return contextRoles.some((role) => user.role === role);
    }
}
