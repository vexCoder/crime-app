import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserDocument } from './user.model';

export interface CurrentUserData {
  _id: string;
  email: string;
}

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): UserDocument => {
    const user = GqlExecutionContext.create(context).getContext().req.user;
    return user;
  },
);
