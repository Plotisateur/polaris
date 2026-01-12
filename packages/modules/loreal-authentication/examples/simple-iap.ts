import express from 'express';

import { createAuthMiddleware } from '../src/index';

const app = express();

const authMiddleware = createAuthMiddleware({ provider: 'iap' });
app.use(authMiddleware);

app.get('/api/profile', (req, res) => {
  console.log('\n✅ User authentifié via IAP:');
  console.log('  Email:', req.user?.email);
  console.log('  Name:', req.user?.name);
  console.log('  Sub:', req.user?.sub);
  console.log('  HD:', req.user?.hd);
  console.log('  Audience:', req.user?.aud);

  res.json({
    message: 'Authentifié avec IAP - Zero config!',
    user: req.user,
  });
});

app.listen(3003, () => {
  console.log('\n🚀 IAP Zero-Config Server: http://localhost:3003');
  console.log('✨ No environment variables needed!');
  console.log('✨ Audience auto-detected from JWT token');
  console.log('\n📝 Test with IAP token:');
  console.log(
    '  Invoke-RestMethod http://localhost:3003/api/profile -Headers @{"Authorization"="Bearer YOUR_IAP_TOKEN"}\n'
  );
});
