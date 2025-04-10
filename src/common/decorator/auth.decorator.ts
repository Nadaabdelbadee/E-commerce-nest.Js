
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { UserRole } from '../Types/types';
import { AuthGuard } from '../Guards/authentication';
import { RolesGuard } from '../Guards/authorization';

export function Auth(...roles: UserRole[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(AuthGuard, RolesGuard),
  );
}
