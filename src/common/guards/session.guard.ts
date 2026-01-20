import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUserRepository } from '../../modules/users/interfaces/user-repository.interface';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Missing authorization header');
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new UnauthorizedException('Invalid authorization header format');
    }

    const token = parts[1];

    try {
      // Verificar e decodificar o token
      console.log('🔍 [SessionGuard] PASSO 1: Verificando token...');
      const payload = await this.jwtService.verifyAsync(token);
      console.log('✅ [SessionGuard] Token verificado. Payload:', { sub: payload.sub, role: payload.role, hasSessionId: !!payload.sessionId });

      // Extrair userId e sessionId do payload
      const userId = payload.sub;
      const sessionId = payload.sessionId;

      console.log('🔍 [SessionGuard] PASSO 2: Extraído do token:', { userId, sessionId });

      if (!userId || !sessionId) {
        console.error('❌ [SessionGuard] Token inválido - faltando userId ou sessionId');
        throw new UnauthorizedException('Invalid token payload');
      }

      // Buscar usuário no banco
      console.log('🔍 [SessionGuard] PASSO 3: Buscando usuário no banco...');
      const user = await this.userRepository.findById(userId);

      if (!user) {
        console.error('❌ [SessionGuard] Usuário não encontrado no banco');
        throw new UnauthorizedException('User not found');
      }

      console.log('✅ [SessionGuard] Usuário encontrado:', {
        id: user.id,
        email: user.email,
        currentSessionId: user.currentSessionId,
        hasCurrentSessionId: !!user.currentSessionId
      });

      // Validar se o sessionId do token corresponde ao sessionId atual do usuário
      console.log('🔍 [SessionGuard] PASSO 4: Comparando sessionIds:', {
        tokenSessionId: sessionId,
        dbSessionId: user.currentSessionId,
        match: user.currentSessionId === sessionId
      });

      if (user.currentSessionId !== sessionId) {
        console.error('❌ [SessionGuard] SessionId não corresponde! Token invalidado.');
        throw new UnauthorizedException('Session expired or invalidated. Please login again.');
      }

      console.log('✅ [SessionGuard] SessionId válido! Acesso permitido.');

      // Anexar usuário ao request para uso nos controllers
      request.user = user;

      return true;
    } catch (error) {
      console.error('❌ [SessionGuard] Erro:', error instanceof Error ? error.message : String(error));
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
