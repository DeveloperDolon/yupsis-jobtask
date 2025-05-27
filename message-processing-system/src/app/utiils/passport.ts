import { Request } from 'express';
import passport from 'passport';
import passportJWT from 'passport-jwt';
import config from '../config';

const JWTStrategy = passportJWT.Strategy;

const secret = config.jwt_secret || 'secret';

const cookieExtractor = (req: Request) => {
  let jwt = null;

  if (req && req.cookies) {
    jwt = req.cookies['accessToken'];
  }

  return jwt;
};

passport.use(
  'jwt',
  new JWTStrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: secret,
    },
    (jwtPayload, done) => {
      const { expiration } = jwtPayload;
      if (Date.now() > expiration) {
        done('Unauthorized.', false);
      }
      done(null, jwtPayload);
    },
  ),
);

export {};
