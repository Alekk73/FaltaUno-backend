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
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,

    private readonly userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const req = context.switchToHttp().getRequest<Request>();
    const cookies = req.headers.cookie;

    const token = extractTokenFromCookie(cookies);

    if (!token) throw new UnauthorizedException('Token no proporcionado');

    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Token expirado');
    }

    let existUser: UserEntity | null = null;

    try {
      existUser = await this.userService.findByEmail(
        payload.correo_electronico,
      );
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        throw error;
      }
    }

    if (!existUser) throw new NotFoundException('Usuario no encontrado');

    const userData = {
      id: existUser.id,
      correo_electronico: existUser.correo_electronico,
      rol: existUser.rol,
      equipoId: existUser.equipo?.id || null,
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
