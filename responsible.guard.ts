import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

interface RequestWithUser {
  user: {
    id: number;
    username: string;
    role: string;
    email: string;
  };
  body: {
    responsibleId?: number;
    title?: string;
    description?: string;
    status?: string;
    priority?: number;
    dueDate?: string;
    isFavorite?: boolean;
  };
}

@Injectable()
export class ResponsibleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    const body = request.body;

    if (body.responsibleId && body.responsibleId !== user.id) {
      if (user.role !== 'admin') {
        throw new ForbiddenException(
          'Только администратор может назначать ответственного',
        );
      }
    }
    return true;
  }
}
