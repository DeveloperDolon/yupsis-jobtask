import httpStatus from 'http-status';
import catchAsync from '../../utiils/catchAsync';
import sendRespnse from '../../utiils/sendResponse';
import config from '../../config';
import { UserService } from './user.service';

const register = catchAsync(async (req, res) => {
  
  const user = {
    name: req.body?.user?.name,
    email: req.body?.user?.email,
    password: req.body?.password
  }

  const result = await UserService.createUserIntoDB(user);

  return sendRespnse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User created successful',
    data: result,
  });
});

const login = catchAsync(async (req, res) => {
  const result = await UserService.loginUser(req.body);

  const cookieOptions = {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: 'strict' as const,
  };

  res.cookie('accessToken', result?.accessToken, {
    ...cookieOptions,
    maxAge: parseInt(config.jwt_access_token_expires_time || '3600') * 1000,
  });

  res.cookie('refreshToken', result?.refreshToken, {
    ...cookieOptions,
    maxAge: parseInt(config.jwt_refresh_token_expires_time || '6300') * 1000,
  });

  return sendRespnse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User login successful!',
    data: result,
  });
});

const me = catchAsync(async (req, res) => {
  const userId = (req?.user as { userId: string })?.userId;

  const result = await UserService.fetchUserData(userId);

  return sendRespnse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Me data fetched successful!',
    data: result,
  });
});

export const UserController = { register, login, me };