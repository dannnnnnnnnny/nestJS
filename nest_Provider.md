## Provider
- 핵심적인 역할
- nest의 기본 클래스들은 Provider로서 취급됨 (services, repositories, factories, helpers ...)
- Provider의 기본적인 아이디어는 의존성을 주입하는 것
- 즉 객체들이 다른 것들과 다양한 관계를 만들 수 있다는 것
- 하나의 Provider는 @Injectable() 데코레이터로 간단하게 클래스에 annotated된 형태
![image](https://user-images.githubusercontent.com/23697868/102743005-c3dc8b00-4399-11eb-82ad-c02562097931.png)

### Services
- 예시로 CatsService는 데이터 저장과 검색에 대한 일을 함 (nest g s cats)
- 그리고 CatsService는 CatController에서 동작하도록 설계됨
- 이러한 경우, Provider로서 정의되기 좋음.
``` JS
// cats.service.ts
import { Injectable } from '@nestjs/common';
import { Cat } from './interfaces/cat.interface';

@Injectable()
export class CatService {
  private readonly cats: Cat[] = [];
  
  create(cat: Cat) {
    this.cats.push(cat);
  }
  
  findAll(): Cat[] {
    return this.cats;
  }
}

// interfaces/cat.interface.ts
export interface Cat {
  name: string;
  age: number;
  bread: string;
}
```
- CatService는 2개의 메소드와 하나의 프로퍼티를 가지고 있는 클래스
- @Injectable() 데코레이터를 사용했다는 점이 새로운 특징
- @Injectable() 데코레이터는 메타데이터를 붙여주는데, 그 메타데이터는 nest에게 이 클래스가 Provider라는 점을 알려줌.

위의 CatsService와 연결할 CatsController
``` JS
import { Controller, Get, Post, Body } from "@nestjs/common";
import { CreateCatDto } from "./dto/create-cat.dto";
import { CatsService } from "./cats/service";
import { Cat } from "./interfaces/cat.interface";

@Controller("cats")
export class CatsController {
  constructor(private catsService: CatService) {} // 주입
  
  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    this.catService.create(createCatDto);
  }
  
  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }
}
```
- CatsService는 class의 생성자를 통해서 주입됨.
- @Injectable()를 사용하면 별도의 작업없이 클래스 내부에서 this로 접근해서 사용할 수 있게 됨.


### Scopes
- Provider는 일반적으로 애플리케이션의 lifetime과 동일한 lifetime을 가짐
- 애플리케이션이 시작되면, 모든 의존성들이 주입되고, 그리고 모든 Provider가 인스턴스화됨
- 마찬가지로 애플리케이션이 종료되면 각 Provider들은 파괴됨
- 하지만 Provider의 라이프타임을 request-scope으로 만들 수도 있음.

### Custom providers
- nest는 provider 사이의 관계를 정리해주는 내장된 제어 역전 (IoC) 컨테이너가 존재
- @Injectable() 데코레이터는 Provider를 정의하는 유일한 방법은 아님. 
일반적인 값, 클래스들, 비동기 또는 동기 factories를 사용할 수도 있음

### Optional Providers
- 의존성 중에서 필요없는 의존성이 존재할 수 있음
- @Optional() 데코레이터를 생성자에 사용할 수 있음
``` jS
import { Injectable, Optional, Inject } from "@nestjs/common";

@Injectable()
export class HttpService<T> {
  constructor(@Optional() private httpClient: T) {}
}
```

### Property-based Injection
- 위의 기술들은 생성자 기반의 주입 (class-based injection)
- 특별한 경우에는 프로퍼티 기반의 주입을 사용할 수 있음
- 예를 들어 최상위 클래스가 하나 또는 다수의 Providers에게 의존성을 가지고 있다면,
이러한 경우에 하위 클래스에서 super를 통해 넘겨주는 것은 좋은 방법이 아님.
이러한 경우를 피하기 위해서 @Inject() 데코레이터를 프로퍼티에게도 사용할 수 있음.
``` JS
import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class HttpService<T> {
  @Inject("HTTP_OPTIONS")
  private readonly httpClient: T;
}
```

### Provider 등록
- CatsController에서 사용될 CatsService라는 Provider를 만들어냈는데, 이 서비스를 nest에 등록하고 주입하려면
app.modules.ts에서 providers 배열에 서비스를 더해주면 됨.
``` JS
import { Module } from "@nests/common";
import { CatsController } from "./cats/cats.controller";
import { CatsService } from "./cats/cats/.service";

@Module({
  controllers: [CatsController],
  providers: [CatsService]
})
export class AppModule {}
```
