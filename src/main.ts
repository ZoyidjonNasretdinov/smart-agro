import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS sozlamalari
  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        /^http:\/\/localhost(:\d+)?$/,
        /^https:\/\/.*\.vercel\.app$/,
        /^https:\/\/.*\.railway\.app$/,
      ];
      if (!origin || allowedOrigins.some((regex) => regex.test(origin))) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Accept',
      'Authorization',
      'X-Requested-With',
      'X-HTTP-Method-Override',
      'x-auth-token',
    ],
    exposedHeaders: ['Set-Cookie', 'x-auth-token'],
    optionsSuccessStatus: 204,
  });

  // So'rovlarni kuzatish (Logging)
  app.use((req, res, next) => {
    if (req.method !== 'OPTIONS') {
      console.log(
        `[Request] Method: ${req.method}, Path: ${req.path}, Body: ${JSON.stringify(req.body)}`,
      );
    }
    next();
  });

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Swagger hujjatlari
  const config = new DocumentBuilder()
    .setTitle('🚜 Smart Agro API')
    .setDescription(
      `
## 🚜 Smart Agro — API Qo'llanma

Qishloq xo'jaligi mahsulotlari va texnikalari marketplace API.

---

### 🗺️ API bo'limlari:

| Bo'lim | Maqsad |
|--------|--------|
| 🔓 **Auth** | Kirish va Ro'yxatdan o'tish |
| 🚜 **Products** | Agro mahsulotlar |
| 🛡️ **Admin** | Foydalanuvchilarni boshqarish |
| 📊 **Dashboard** | Statistika va Kabinet |
      `,
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: '🚜 Smart Agro API Docs',
    swaggerOptions: { persistAuthorization: true },
  });

  const port = process.env.PORT || 5002;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Smart Agro: http://0.0.0.0:${port}/api/docs`);
}
bootstrap();
