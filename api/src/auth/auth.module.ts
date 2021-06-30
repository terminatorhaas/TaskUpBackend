import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AktivitaetenModule } from 'src/aktivitaeten/aktivitaeten.module';
import { InteressenModule } from 'src/interessen/interessen.module';
import { KalenderModule } from 'src/kalender/kalender.module';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service/auth.service';
import { JwtAuthGuard } from './guards/jwt.guard';
import { JwtStrategy } from './guards/jwt.strategy';
import { RolesGuard } from './guards/roles.guard';

@Module({
    imports: [
        forwardRef(() => UserModule),
        forwardRef(() => AktivitaetenModule),
        forwardRef(() => InteressenModule),
        forwardRef(() => KalenderModule),
        JwtModule.registerAsync({
            imports: [ConfigModule, JwtStrategy, JwtAuthGuard],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET'),
                signOptions: {expiresIn: configService.get('JWT_TIMEOUT')}
            })
        })
    ],
    providers: [AuthService, RolesGuard, JwtAuthGuard, JwtStrategy ],
    exports: [AuthService, RolesGuard]

})
export class AuthModule {}
