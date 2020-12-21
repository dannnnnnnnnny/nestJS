## Modules
- Module은 @Module 데코레이터로 annotate된 클래스
- @Module 데코레이터는 nest가 앱의 구조를 조직할 수 있는 메타데이터를 제공함
![image](https://user-images.githubusercontent.com/23697868/102748996-94804b00-43a6-11eb-80d8-1d1fc87159cb.png)

- 각 App은 적어도 하나의 Root Module이 존재함.
- 이 Root Module은 nest가 Application Graph를 만들어낼 시작 포인트를 만들어줌
* Application Graph: nest가 Module과 Provider 관계와 의존성을 결정할 때 사용하는 내부적인 데이터 구조

- 아주 작은 앱들은 이론적으로 root module만 필요할 수 있지만, 대부분의 경우, 여러가지 모듈들을 사용하게 되고
각각은 연관된 capabilities들의 모음으로 캡슐화 됨

### @Module()이 인자에서 갖는 객체
- providers : nest의 injector에 의해 인스턴스화되고 인스턴스들은 이 모듈안에서 최소한으로 공유됨
- controllers: 해당 모듈에서 정의된, 인스턴스화되어야 하는 컨트롤러의 모음
- imports: 임포트된 모듈들의 리스트. 이 리스트의 모듈들은 데코레이터에 사용 중인 모듈에서 필요한
providers를 export하고 있어야 함.
- exports: providers의 하위 집합. 데코레이터를 사용 중인 모듈이 제공받은 Provider의 일부를 내보낼 수 있다.
이는 다른 모듈에서 import할 때 사용됨.

### 특징 단위 모듈 (Feature module)
- CatsController와 CatsService는 같은 Application 영역
- 서로 연관이 깊기 때문에 feature module로 묶을 수 있음
- feature module은 간단하게 특정한 특징들과 연관된 코드를 함께 조직화함
- 코드를 조직적이게 유지하고, 명확한 경계를 세울 수 있음 (SOLID 원칙과 함께 개발을 할 때 복잡성을 줄여줌)
``` JS
// cats/cats.module.ts
import { Module } from "@nestjs/common";
import { CatsController } from "./cats.controller";
import {CatsService} from "./cats.service";

@Module({
    controllers: [CatsController],
    providers: [CatsService]
})
export class CatsModule {}
```
(CLI를 사용해서 'nest g module cats'로 생성 가능)
- 위의 정의된 cats.module.ts와 연관된 모든 모듈을 cats 디렉토리 아래에 두고, 루트 모듈에 CatsModule을 임포트함.
``` JS
// app.module.ts
import {Module} from "@nestjs/common";
import {CatsModule} from "./cats/cats.module";

@Module({
    imports: [CatsModule]
})
export class AppModule{}
```

### 공유되는 모듈
- nest에서 module은 기본적으로 싱글톤 패턴
- 어떠한 Provider의 인스턴스든 여러 모듈에서 사용할 수 있음.
![image](https://user-images.githubusercontent.com/23697868/102749765-e9709100-43a7-11eb-9453-7066dd1f9953.png)

- 모든 모듈은 자동적으로 shared module이 됨
- 한번 생성되면 어떤 모듈에서든 사용할 수 있음
- 예를 들어서 CatsService의 인스턴스를 다른 모듈들에서 사용하고 싶다면 CatsService를 
먼저 module의 export 배열에 담아서 보내줌
``` JS
// cats.module.ts
import {Module} from "@nestjs/common";
import {CatsController} from "./cats.controller";
import {CatsService} from "./cats.service";

@Module({
    controllers: [CatsController],
    providers: [CatsService],
    exports: [CatsService]
})

export class CatsModule {}
```
- 이렇게 해두면 CatsModule을 임포트하고 있는 어떤 모듈에서든 CatsService 인스턴스를 사용 가능

### 모듈 다시 내보내기
- 위처럼 모듈들은 모듈 내부적인 Provider들을 export할 수 있음
- 게다가 모듈은 import 해온 것들을 export할 수도 있음
(CommonModule에서 CoreModule을 import한 후 export하면 CommonModule을 import한 모듈에서도 CoreModule을 사용가능)

### 의존성 주입
- 모듈에서 Providers를 넣어줄 때, Providers를 주입하는 방식으로도 가능
``` JS
// cats.module.ts
import {Module} from "@nestjs/common";
import {CatsController} from "./cats.controller";
import {CatsService} from "./cats.service";

@Module({
    controllers: [CatsController],
    providers: [CatsService]
})

export class CatsModule {
    constructor(private catsService: CatsService) {}
}
```
- But, 모듈 클래스 자체는 환 의존성 문제로 Provider로서 주입 불가

### 글로벌 모듈
- nest에서는 provider들을 모듈 범위 안에서 캡슐화 함. 따라서 앞서 캡슐화된 모듈들을 임포트 하지않는다면
모듈의 Provider를 사용할 수 없음
- 같은 모듈 세트를 모든 곳에서 임포트하고 싶을 때 사용
- 여러 Provider들 집합을 어디서든 제공해주고 싶다면, 모듈을 global로 만들어야 함
- @Global() 데코레이터를 사용하게 되면 가능함

``` JS
import {Module, Global} from "@nestjs/common";
import {CatsController} from "./cats.controller";
import {CatsService} from "./cats.service";

@Global()
@Module({
    controllers: [CatsController],
    providers: [CatsService],
    exports: [CatsService]
})
export class CatsModule {}
```
- @Global() 데코레이터는 모듈을 글로벌 범위로 만들어줌.
- 글로벌 모듈은 한번만 등록될 수 있고, 일반적으로 루트나 코어 모듈에 의해 등록됨.
- 위 코드예시에서 CatsService는 어디서나 사용 가능하고, CatsService를 사용하고 싶은 모듈들은
CatsModule을 import할 필요없이 의존성을 주입할 수 있음.
(모든 것을 글로벌화시키는 것은 좋은 디자인이 아님. 글로벌 모듈들은 불필요한 보일러플레이트를 줄여주는 역할,
일반적으로 모듈을 사용할 때는, export 배열에 담아주는 게 좋음)

### 동적 모듈
- nest의 모듈 시스템은 동적 모듈이라는 강력한 기능을 포함
- 이 기능은 커스텀 가능하나 모듈들을 만들 수 있게 해주는데, 커스텀 가능한 모듈은 providers를 동적으로 설정하고
등록할 수 있게 해줌
``` JS
// 예시코드
import {Module, DynamicModule} from "@nestjs/common";
import {createDatabaseProviders} from "./database.providers";
import {Connection} from "./connection.provider";

@Module({
    providers: [Connection]
})

export class DatabaseModule {
    static forRoot(entities = [], options?): DynamicModule {
        const providers = createDatabaseProviders(options, entities);
        return {
            module: DatabaseModule,
            providers,
            exports: providers
        }
    }
}
```
- [Connection] Provider를 기본으로 @Module 데코레이터 안에 메타데이터에서 정의하고 있음
- 하지만 forRoot에 넘어온 entities 인자와 options에 따라서 추가적으로 provider들을 export하고 있음
- 동적 모듈에 의해 반환된 프로퍼티들은 Override가 아닌, @Module 메타데이터에 extend 됨
(createDatabaseProviders에서 repositories가 생성된다고 가정했을 때, 선언된 Connection Provider와 동적으로
생성된 repository provider가 모듈에서 export 됨)
- 만약 동적 모듈을 글로벌하게 등록하고 싶다면, 반환값에 global 프로퍼티를 true 설정하면 됨.
``` JS
{
  global: true,
  ...,
  ...
}
```

- 위 예시코드의 DatabaseModule은
``` JS
import {Module} from "@nestjs/common"
import {DatabaseModule} from "./database/database.module";
import {User} from "./users/entities/user.entity";

@Module({
    imports: [DatabaseModule.forRoot([User])]
})

export class AppModule{}
```
- 이렇게 import 될 수 있음

- 만약 동적 모듈은 다시 내보내기하고 싶다면, forRoot 메서드 호출부분을 빼면 됨.
``` JS
import {Module} from "@nestjs/common";
import {DatabaseModule} from "./database/database.module";
import {User} from "./users/entities/user.entity";

@Module({
    imports: [DatabaseModule.forRoot([User])],
    exports: [DatabaseModule]
})
export class AppModule {}
```
