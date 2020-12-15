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
- 모듈이란 어플리케이션의 일부분
  - 한가지 역할을 하는 앱, (e.g. 인증을 담당하는 어플리케이션 users 모듈))
  - 인스타그램이라면 photos, videos 모듈 등
- app.module.ts에서는 controller와 provider를 사용하는데

#### controller : url을 가져오고 함수를 실행하는 역할 (express의 router 같은 역할)

- controller에서 @Get() 데코레이터는 express.js의 app.get router 역할을 함.

```JS
@Get('/hello')
sayHello(): string {
  return 'Hello everyone';
}
```

- 이렇게 /hello get url의 router를 가지고 'Hello everyone'을 리턴하는 Get 데코레이터 함수를 쉽게 만들 수 있음
- 주의할 점은 데코레이터와 함수 사이에 빈칸이 있으면 안됨.

### service

- 위 코드처럼 controller에서 그대로 string을 리턴해도 문제가 없는데 왜 service가 필요할까?

* nestJS는 Controller를 비즈니스 로직과 구분지음
* controller는 url을 가져오는 역할만 함. (+ 함수를 실행하는 정도)
* 나머지 비즈니스 로직은 service에서 수행함.
* service는 일반적으로 실제 Function을 가지는 부분
* controller의 Appservice의 정의로 이동하면

```JS
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello Nest!';
  }
}
```

- 이런 class가 존재하는데, 이 class 안에 getHello() 함수가 들어있음.
- 그렇기 때문에 controller의 sayHello 함수는

```JS
// controller appService안의 함수 호출
@Get('/hello')
  sayHello(): string {
    return this.appService.getHi();
  }

// service 클래스 안에 추가
getHi(): string {
    return 'Hi Nest!';
  }
```

- 이렇게 사용하는 게 올바른 사용법임.
