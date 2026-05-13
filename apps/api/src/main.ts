import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'
import { mkdirSync } from 'fs'
import { AppModule } from './app.module'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'
import { TransformInterceptor } from './common/interceptors/transform.interceptor'

async function bootstrap() {
  mkdirSync(join(process.cwd(), 'uploads'), { recursive: true })
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads' })

  app.setGlobalPrefix('api/v1')
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') ?? 'http://localhost:3000',
    credentials: true,
  })
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  )
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalInterceptors(new TransformInterceptor())

  const port = process.env.PORT ?? 3001
  await app.listen(port)
  console.log(`API running on http://localhost:${port}/api/v1`)
}

bootstrap()
