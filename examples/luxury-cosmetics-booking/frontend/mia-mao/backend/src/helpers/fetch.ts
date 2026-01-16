export type RequestMethode = 'POST' | 'PUT' | 'GET' | 'DELETE';

export interface RequestOptions<BodyT> {
  url: string;
  specURL?: string;
  method: RequestMethode;
  data?: BodyT;
  token?: string;
  userToken?: string;
  userRefreshToken?: string;
  headers?: { [key: string]: string };
}

export async function fetchData<ResponseT, BodyT>({
  url,
  specURL = '',
  method,
  data,
  token = '',
  userToken = '',
  userRefreshToken = '',
}: RequestOptions<BodyT>): Promise<ResponseT> {
  try {
    const resp = await fetch(`${url}${specURL}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        ConsistencyLevel: 'eventual',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'user-token': userToken,
        'refresh-token': userRefreshToken,
      },
      ...(data && { body: JSON.stringify(data) }),
    });

    const result: ResponseT = await resp.json();
    if (!result) {
      throw new Error('No data sent');
    }
    return result;
  } catch (error: any) {
    throw new Error(
      JSON.stringify(error?.response?.data?.detail) || JSON.stringify(error?.message)
    );
  }
}

export async function fetchDataLocalAPI<ResponseT, BodyT>({
  url,
  specURL = '',
  method,
  data,
  token = '',
  userToken = '',
  userRefreshToken = '',
}: RequestOptions<BodyT>): Promise<ResponseT> {
  const resp = await fetch(`${url}${specURL}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ConsistencyLevel: 'eventual',
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-user-access-token': userToken,
      'x-user-refresh-token': userRefreshToken,
    },
    ...(data && { body: JSON.stringify(data) }),
  });

  const result: ResponseT = await resp.json();
  if (!result) {
    throw new Error('No data sent');
  }
  return result;
}
