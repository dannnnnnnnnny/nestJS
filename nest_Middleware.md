## Middleware
- 미들웨어는 Controller 바로 전에 동작하는 함수
- 미들웨어 함수들은 애플리케이션의 'request-response' 사이클 중에 request와 response 오브젝트에 접근할 수 있고, 
next() 미들 웨어함수에 접근할 수 있음
![image](https://user-images.githubusercontent.com/23697868/102843126-e333f080-444b-11eb-9a63-9ccf15991c8b.png)

- NestJS의 미들웨어는 기본적으로 Express의 미들웨어와 동일함
-----------------------------------------------------------------------------------------------------------
#### Express 공식문서에서의 미들웨어 기능
- 어떠한 코드도 실행할 수 있음
- request-response 사이클을 종료할 수 있다.
- 다음 미들웨어 함수를 가져올 수 있다.
- 현재 미들웨어 함수가 request-response 사이클을 종료하는 기능을 하지 않는다면, 그 미들웨어는 반드시 next()함수를 다음 미들웨어에게 통제권을 넘기기 위해서 사용해야 한다. 그렇지 않으면 request는 계속 응답을 기다리는 상태가 된다.
-------------------------------------------------------------------------------------------------------------

- Custom Nest Middleware는 함수나 Injectable() 데코레이터와 함께 사용한 클래스로 사용 가능
- (클래스의 경우에는 NestMiddleware 인터페이스를 implements 해야 함)
``` JS
// logger.middleware.ts
import { Injectable, MestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    console.log("Request...");
    next();
  }
}
```

### 의존성 주입
- Nest Middleware는 의존성 주입을 지원함
- Provider나 Controller처럼 같은 모듈에서 사용할 수 있는 의존성을 주입하는 것이 가능
- constructor에 명시해주는 것으로 사용 가능

### 미들웨어 적용
- 위에서 생성한 logger.middleware 적용
- @Module 데코레이터에는 미들웨어를 넣을 부분이 존재하지 않음
- 모듈 클래스에 configure 메소드를 생성해서 setting 가능 (미들웨어를 사용하는 모듈은 NestModule을 implements)
``` JS
// app.module.ts
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [CatsModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('cats');
  }
}
```
- /cats 라우터 핸들러에 LoggerMiddleware를 부착함
- 미들웨어를 구성할 때 path, method가 포함된 객체를 forRoutes 메소드에 전달하여 특정 요청 메소드로 제한할 수 있음.
``` JS
// GET 요청과 cats 경로로 제한
// app.module.ts
import { Module, NestModule, RequestMethod, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [CatsModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {   // configure() 메소드는 비동기적으로 만들어질 수 있음.
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: 'cats', method: RequestMethod.GET });
  }
}
```
### 와일드 카드 라우팅
- 라우터에서 적용되던 패턴 베이스의 라우팅이 미들웨어에서도 적용됨.
``` JS
forRoutes({ path: "ab*cd", method: RequestMethod.ALL });
```

