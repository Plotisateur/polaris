/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const express = require('express');
const dotEnv = require('dotenv');
const app = express();
const path = require('path');
const cors = require('cors');
const { GoogleAuth } = require('google-auth-library');
const cookieParser = require('cookie-parser');

dotEnv.config({ path: path.resolve(`.env`) });

const { VITE_API_URL, PORT } = import.meta.env;

async function useServiceAccount(options) {
  const url = options.url;
  const auth = new GoogleAuth();
  const client = await auth.getIdTokenClient(url);
  const clientHeaders = await client.getRequestHeaders();
  const res = await client.request({
    url: options.url,
    method: options.method,
    data: options.data,
    headers: {
      ...clientHeaders,
      'user-token': options.headers['user-token'],
      'user-code': options.headers['user-code'],
      'user-refresh-token': options.headers['user-refresh-token'],
    },
  });
  return res.data;
}

app.disable('x-powered-by');

app.set('trust proxy', true);
app.use(cookieParser());
app.use(express.json());
app.use('/api/*', async (req, res) => {
  let options = {
    // url: `http://localhost:3000${req.originalUrl}`,
    url: `${VITE_API_URL}${req.originalUrl}`,
    method: req.method,
    headers: req.headers,
  };
  if (options.method === 'POST' || options.method === 'PUT') {
    options = {
      ...options,
      data: req.body,
    };
  }
  try {
    if (req.originalUrl === '/api/user-sub') {
      res.status(200).send(JSON.parse(JSON.stringify({ sub: req.headers['x-appengine-user-id'] })));
    } else {
      let body = await useServiceAccount(options);
      res.status(200).send(JSON.parse(JSON.stringify(body)));
    }
  } catch (e) {
    console.log(e);
    if (e.response) {
      res.status(e.response.status).send({ error: e.response.data?.error });
    }
  }
});

const corsHeaders = (req, res, next) => {
  try {
    // TO DO: add in allowed origin the url we want
    // example:
    // 'https://template-project-dev.beauty.tech/',
    // 'https://template-project-dev.beauty.tech/manifest.json',
    const allowedOrigins = [
      'https://accounts.google.com',
      'https://accounts.google.com/o/oauth2/v2/auth',
    ];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  } catch (e) {
    return next(e);
  }
};

app.use(corsHeaders);
app.use('/', express.static(path.resolve('./build')));
app.get('/*', cors(), (req, res) => {
  res.sendFile(path.resolve('./build/index.html'));
});
app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
