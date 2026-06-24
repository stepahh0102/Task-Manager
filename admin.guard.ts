import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

interface RequestWithUser {
  user: {
    id: number;
    username: string;
    role: string;
  };
}

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    if (user && user.role === 'admin') {
      return true;
    }
    throw new ForbiddenException(
      'Доступ запрещён. Требуются права администратора.',
    );
  }
}
