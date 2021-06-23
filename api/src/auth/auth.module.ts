import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service/auth.service';
import { JwtAuthGuard } from './guards/jwt.guard';
import { JwtStrategy } from './guards/jwt.strategy';
import { RolesGuard } from './guards/roles.guard';

@Module({
    imports: [
        forwardRef(() => UserModule),
        JwtModule.registerAsync({
            imports: [ConfigModule, JwtStrategy, JwtAuthGuard],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET'),
                signOptions: {expiresIn: '666s'} /* HIER MUSS DIE GÜLITIKEIT DES TOKENS NOCH ANGEPASST WERDEN Zwei Jahre sind zu viel*/
            })
        })
    ],
    providers: [AuthService, RolesGuard, JwtAuthGuard, JwtStrategy ],
    exports: [AuthService]

})
export class AuthModule {}
