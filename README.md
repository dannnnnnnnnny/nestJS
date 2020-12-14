# nestJS

- nestJS는 이미 만들어진 기능을 제공하는 프레임워크
- nestJS의 src에는 controller.spec, controller, module, service, main이 존재함(main의 이름은 고정)
- main의 bootstrap() 함수는

```JS
const app = await NestFactory.create(AppModule);
await app.listen(3000);
```

- AppModule을 통해서 서버를 구동시킴.
- AppModule은 app.module.ts이고, app.module.ts에는 데코레이터라는 함수가 존재함.

```JS
@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
```

- nestJS에서는 데코레이터 함수를 많이 사용함. (익숙해져야 함)
- 데코레이터 함수는 클래스 위의 함수이고, 클래스를 위해 움직인다고 생각하면 됨.

#### 'Hello, Nest!' 출력 과정

- app.module.ts -> app.controller.ts -> app.service.ts =>

### app.module.ts

- 모든 것의 루트 모듈
- 모듈이란 어플리케이션의 일부분 (한가지 역할을 하는 앱, (e.g. 인증을 담당하는 어플리케이션 users 모듈))
-
