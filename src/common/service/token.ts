import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';


@Injectable()
export class TokenService {
    constructor(private JwtService: JwtService) { }

    generateToken(payload: any, options: JwtSignOptions): string {
        return this.JwtService.sign(payload, options);
    }
    verifyToken(token: string, options: JwtSignOptions): any {
        return this.JwtService.verify(token, options)
    }
}