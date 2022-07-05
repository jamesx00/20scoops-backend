import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TwentyScoopsAuthHeaderMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const secret_auth_header_value = this.configService.get(
      'TWENTY_SCOOPS_AUTH_SECRET',
    );

    if (req.headers.authorization !== secret_auth_header_value) {
      throw new ForbiddenException(
        'Access denied. Valid Authorization header required.',
      );
    }

    next();
  }
}
