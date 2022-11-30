import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { SWAGGER_AUTH_TOKEN } from './lib/constants.lib'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const config = new DocumentBuilder()
    .setTitle('Parrot Wings API')
    .setDescription('A Demo API with CRUD functionality')
    .setVersion('1.0')
    .addTag('ParrotWings')
    .addBearerAuth(
      {
        description: `[just text field] Please enter token in following format: Bearer <JWT>`,
        name: 'Authorization',
        bearerFormat: 'Bearer', // I`ve tested not to use this field, but the result was the same
        scheme: 'Bearer',
        type: 'http',
        in: 'Header'
      },
      SWAGGER_AUTH_TOKEN
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.setGlobalPrefix('api')

  await app.listen(3000)
}

bootstrap()
