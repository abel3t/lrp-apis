import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface ICurrentAccount {
  id: string;
  email: string;
  role: string;
}

export const CurrentAccount = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  }
);
