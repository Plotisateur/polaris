import https from 'https';
import { LoginTicket, TokenPayload } from 'google-auth-library';
import { ErrorHandler } from '../../../../helpers/ErrorHandler';
import models from '../../../models';
import logger from '../../../../logger';
import { IUser } from '../../../models/types/user';

export const VERIFY_DOMAIN_REGEX = /^[\w-.]+@(loreal+\.)+[\w-]{2,4}$/;

export async function checkUserScopes(scopes: string[], accessToken: string) {
  const hasNeededScope = scopes.includes('https://www.googleapis.com/auth/bigquery');

  if (!hasNeededScope && accessToken) {
    await revokeUserToken(accessToken);
  }

  return hasNeededScope;
}
export async function revokeUserToken(accessToken: string) {
  const postData = 'token=' + accessToken;
  // Options for POST request to Google's OAuth 2.0 server to revoke a token
  const postOptions = {
    host: 'oauth2.googleapis.com',
    port: '443',
    path: '/revoke',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData),
    },
  };

  // Set up the request
  const postReq = https.request(postOptions, function (res) {
    res.setEncoding('utf8');
  });

  postReq.on('error', (error) => {
    logger.error(error);
  });

  // Post the request with data
  postReq.write(postData);
  postReq.end();
}

export async function checkAndGetAuthUser(
  scopes: string[],
  accessToken: string,
  tokenPayload: LoginTicket
): Promise<TokenPayload> {
  const userHasNeededScopes = await checkUserScopes(scopes, accessToken);
  const authUser = tokenPayload.getPayload();

  if (!authUser) {
    throw Promise.reject(new ErrorHandler(401, 'Invalid user'));
  }

  const isUserDomainValid = VERIFY_DOMAIN_REGEX.test(authUser.email ?? '');

  if (!isUserDomainValid) {
    throw Promise.reject(new ErrorHandler(401, 'Invalid user email domain'));
  }

  if (!userHasNeededScopes) {
    throw Promise.reject(new ErrorHandler(401, 'Invalid user scopes'));
  }

  return authUser;
}

export async function createOrUpdateUser(authUser: TokenPayload) {
  try {
    let existingUser: IUser | null = await models.User.findOne({
      email: authUser.email,
      name: authUser.name,
    });

    if (!existingUser) {
      existingUser = await models.User.create({
        email: authUser.email,
        name: authUser.name,
      });
    }

    if (!!existingUser && !existingUser.name) {
      await models.User.updateOne(
        { _id: existingUser._id },
        {
          name: authUser.name,
        }
      );
    }

    return existingUser;
  } catch (error) {
    logger.error(error);
    throw new ErrorHandler(500, 'Error while creating user');
  }
}
