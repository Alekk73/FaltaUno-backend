import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';
import { JwtPayload } from 'src/common/jwt-payload';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,

    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const req = context.switchToHttp().getRequest<Request>();
    const cookieHeader = req.headers.cookie;

    const token = extractTokenFromCookie(cookieHeader);
    if (!token) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    let paylaod: JwtPayload;

    try {
      paylaod = this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Token expirado');
    }

    const user = await this.userService.findByEmail(paylaod.correo_electronico);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const userData = {
      id: user.id,
      correo_electronico: user.correo_electronico,
      rol: user.rol,
      equipoId: user.equipo_id || null,
    };

    req.user = userData;
    return true;
  }
}

function extractTokenFromCookie(
  cookieHeader: string | undefined,
): string | null {
  if (!cookieHeader) return null;

  const token = cookieHeader
    .split(';')
    .find((c) => c.trim().startsWith('accessToken'))
    ?.split('=')[1];

  return token || null;
}
