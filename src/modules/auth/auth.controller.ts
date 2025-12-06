import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
  Res,
  UnauthorizedException,
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
import { MailChangePasswordDto } from './dto/mail-change-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

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
  @Get('verify-email/:token')
  async verify(@Param('token') token: string) {
    await this.userService.activateUser(token);
    return { message: 'Cuenta verificada exitosamente.' };
  }

  // -------------------------
  //  SEND MAIL CHANGE PASSWORD
  // -------------------------
  @Public()
  @Post('send-mail-change-password')
  async sendMailChangePassword(@Body() dto: MailChangePasswordDto) {
    return await this.authService.sendMailChangePassword(dto);
  }

  @Public()
  @Post('change-password/:token')
  async changePassword(
    @Param('token') token: string,
    @Body() dto: ChangePasswordDto,
  ) {
    return await this.authService.changePassword(token, dto);
  }
}
