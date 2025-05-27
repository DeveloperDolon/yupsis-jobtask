import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import config from '../../config';
import { TLoginUser, TUser } from './user.interface';
import { User } from './user.model';
import { createToken } from './user.utils';

const createUserIntoDB = async (payload: TUser) => {

  const user = await User.create(payload);

  return user;
};

const loginUser = async (payload: TLoginUser) => {
  const user = await User.isUserExistByEmail(payload.email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This is user is not found!');
  }

  if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched!');
  }

  const JwtPayload = {
    userId: user?.id as string,
    email: user?.email
  };

  const accessToken = createToken(
    JwtPayload,
    config.jwt_secret as string,
    parseInt(config.jwt_access_token_expires_time || '3600') as number,
  );

  const refreshToken = createToken(
    JwtPayload,
    config.jwt_refresh_secret as string,
    parseInt(config.jwt_refresh_token_expires_time || '6300') as number,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const fetchUserData = async (id: string) => {
  const user = await User.findOne({ id });

  return user;
};

export const UserService = { createUserIntoDB, loginUser, fetchUserData };
