import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT', name: 'Authorization', in: 'header' }, 'access-token')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: '🚜 Smart Agro API Docs',
    swaggerOptions: { persistAuthorization: true },
  });

  app.enableCors();
  const port = process.env.PORT || 5002;
  await app.listen(port);
  console.log(`🚀 Smart Agro: http://localhost:${port}/api/docs`);
}
bootstrap();
