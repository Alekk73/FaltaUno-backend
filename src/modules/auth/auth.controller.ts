import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { Request, Response } from 'express';
import { Public } from 'src/common/decorators/public.decorator';
import {
  ApiOperation,
  ApiBody,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  // -------------------------
  //  PROFILE
  // -------------------------
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  @ApiOkResponse({ description: 'Perfil obtenido correctamente' })
  @Get('profile')
  async profile(@Req() req: Request) {
    const user = req.user;
    return await this.authService.profile(user);
  }

  // -------------------------
  //  REGISTER
  // -------------------------
  @Public()
  @ApiBody({ type: RegisterDto })
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiCreatedResponse({ description: 'Usuario creado correctamente' })
  @ApiBadRequestResponse({
    description:
      'Correo electrónico ingresado ya existente o error al crear el usuario',
  })
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return await this.authService.register(dto);
  }

  // -------------------------
  //  LOGIN
  // -------------------------
  @Public()
  @ApiBody({ type: LoginDto })
  @ApiOperation({ summary: 'Inicio de sesión' })
  @ApiOkResponse({ description: 'Usuario autenticado' })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  @ApiBadRequestResponse({ description: 'Contraseña incorrecta' })
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, user } = await this.authService.login(dto);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: false,
      maxAge: 60 * 60 * 1000,
    });

    return user;
  }

  // -------------------------
  //  LOGOUT
  // -------------------------
  @ApiOperation({ summary: 'Cerrar sesión' })
  @ApiOkResponse({ description: 'Sesión cerrada correctamente' })
  @Post('logout')
  @HttpCode(200)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('accessToken');
    return { message: 'Sesión cerrada correctamente.' };
  }

  // -------------------------
  //  VERIFY USER
  // -------------------------
  @Public()
  @Get('verify')
  async verify(@Query('token') token: string) {
    const user = await this.userService.findByActivationToken(token);
    if (!user) throw new BadRequestException('Token inválido');

    await this.userService.activateUser(user);

    return { message: 'Cuenta verificada exitosamente.' };
  }
}
