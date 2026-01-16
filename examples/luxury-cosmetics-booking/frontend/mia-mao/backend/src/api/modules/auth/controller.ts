import { OAuth2Client } from 'google-auth-library';
import config from '../../../config';
import { ErrorHandler } from '../../../helpers/ErrorHandler';
import { Request, Response } from 'express';
import { ServerInferRequest, ServerInferResponseBody } from '@ts-rest/core';
import { authContract } from './schema';

export async function login(
  req: Request<ServerInferRequest<typeof authContract.login>>,
  res: Response<ServerInferResponseBody<typeof authContract.login, 200>>
) {
  const accessToken: string = req.headers['x-user-access-token'] as string;
  const refreshToken: string = req.headers['x-user-refresh-token'] as string;
  const idToken: string = req.headers['x-user-id-token'] as string;
  const oAuth2Client: OAuth2Client = new OAuth2Client({
    clientId: config.appGcpClientId,
    clientSecret: config.appGcpClientSecret,
    redirectUri: config.appGcpRedirectUri,
  });
  try {
    const tokenInfo = await oAuth2Client.getTokenInfo(accessToken);

    if (!accessToken || !refreshToken || !idToken) {
      return Promise.reject(new ErrorHandler(401, 'Invalid user Tokens'));
    }

    const expireAtDate = new Date(tokenInfo.expiry_date);
    expireAtDate.setMinutes(expireAtDate.getMinutes() - 5);
    const expireAt = expireAtDate.getTime();

    res.status(200).send({
      accessToken: `Bearer ${accessToken}`,
      refreshToken: refreshToken,
      expireAt: expireAt,
    });
  } catch (err: any) {
    return Promise.reject(
      new ErrorHandler(
        500,
        `An error occured during login process: ${JSON.stringify({
          error: err,
          errorData: err?.response?.data,
        })}`
      )
    );
  }
}
