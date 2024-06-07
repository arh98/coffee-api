import {
    Injectable,
    CanActivate,
    ExecutionContext,
    Type,
    ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ActiveUserData } from '../../interfaces/active-user-data.interface';
import { Policy } from '../policies/interfaces/policy.interface';
import { REQUEST_USER_KEY } from 'src/auth/auth.constants';
import { POLICIES_KEY } from '../decorators/policy.decorator';
import { PolicyHandlerStorage } from '../policies/policy-handler.storage';

@Injectable()
export class PoliciesGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly policyHandlerStorage: PolicyHandlerStorage,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const policies = this.reflector.getAllAndOverride<Policy[]>(
            POLICIES_KEY,
            [context.getHandler(), context.getClass()],
        );
        if (policies) {
            const user: ActiveUserData = context.switchToHttp().getRequest()[
                REQUEST_USER_KEY
            ];
            await Promise.all(
                policies.map((policy) => {
                    const policyHandler = this.policyHandlerStorage.get(
                        policy.constructor as Type,
                    );
                    return policyHandler.handle(policy, user);
                }),
            ).catch((err) => {
                throw new ForbiddenException(err.message);
            });
        }
        return true;
    }
}
