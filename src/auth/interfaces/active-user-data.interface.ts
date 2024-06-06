import { Role } from "src/users/enums/user-role.enum";

export interface ActiveUserData {
    // user id
    sub: number;
    
    email: string;

    role: Role;
    
    /** user permissions */
    // permissions: PermissionType[];
}
