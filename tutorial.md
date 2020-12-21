# NestJS Tutorial
-----------------------------------------------------------------------------------------------
## start
``` html
src
ㄴ main.ts // 앱 시작점
ㄴ app.module.ts // 앱 루트 모듈
ㄴ app,controller.ts // 앱 컨트롤러
```
### Controller
- 컨트롤러는 Request, Response를 처리하는 로직
- 특정 라우터에 붙여서 구체적인 요청을 받아 처리함
- Nest에서 기본 Controller를 만들려면 class와 decorators를 사용함.

![image](https://user-images.githubusercontent.com/23697868/102737149-f9797800-4389-11eb-9a60-15d7276d7063.png)


### Routing
@Controller를 사용해서 route를 지정할 수 있는데, 데코레이터를 통해서 연관된 라우터를 그룹핑할 수 있음.
@Controller 데코레이터는 prefix를 지정할 수 있음

``` JS
// cats.controller.ts;
// GET /cats
import { Controller, Get } from '@nestjs/common';

@Controller("cats")
export class CatsContoller {
  @Get()
  findAll(): string {
    // 유저 정의 부분
    return "This action returns all cats";
  }
}
```
- @Get() 은 NestJS에서 HTTP Request 들의 EndPoint를 구체적으로 지정하는 역할
- @Controller 에서 정해진 prefix와 합쳐져서 Endpoint가 정해짐
- 예를 들어 GET /cats/munchkin 은 @Get('munchkin') 으로 작성하면 됨

- 위 코드는 Http status code 200 응답을 줌 (default 값이며 Post는 201이 default)
- 위 상태코드를 커스텀하고 싶다면 @HttpCode() 를 통해서 가능
- Nest는 JS Object나 Array로 값을 return 하면 자동적으로 JSON 형식으로 시리얼라이징 해줌. (나머지 JS 리터럴값은 X)

### Request Object
- Request 객체에 접근하는 방식 또한 데코레이터로 제공됨
- Express의 객체를 따르며 @Req() 를 통해서 접근할 수 있음

``` JS
@Controller("cats")
export class CatsController {
  @Get()
  findAll(@Req() request: Request): string {
    return "This action returns all cats";
  }
}
```

- Express의 Request 객체를 사용하지만 직접 query나 body에 접근해서 사용하지 않고 이 또한 데코레이터를 통해서 가져올 수 있음
- @Body, @Query()

``` JS
@Request(), @Req()  // req
@Response(), @Res() // res
@Next() // next
@Session()  // req.session
@Param(key?: string)  // req.params / req.params[key]
@Body(key?: string) // req.body / req.body[key]
@Query(key?: string)  // req.query / req.query[key]
@Headers(name?: string) // req.headers / req.headers[key]
```

### Resource
- 일반적인 Http Request Endpoint 데코레이터를 @Get과 동일하게 제공
- @Post(), @Put(), @Delete(), @Patch(), @Options(), @Head(), @All()

``` JS
// cats.controller.ts
import { Controller, Get, Post } from '@nestjs/common';

@Controller("cats')
export class CatsController {
  @Post()
  create(): string {
    return "This action adds a new cat";
  }
  
  @Get()
  findAll(): string {
    return "This action returns all cats";
  }
}
```

### wildcard routing
- 패턴 기반 라우터 제공
- ?, +, *, ()
- ab*cd => abcd, ab_cd, abecd 모두 매칭 됨
``` JS
 @Get('ab*cd')
 findAll() {
  return 'This route uses a wildcard';
 }
```

### Status Code
- @HttpCode()
- 상황별로 다르게 상태코드를 보내줘야할 경우에는 @Res나 에러를 Throw 해야 함
``` JS
 @Post()
 @HttpCode(204)
 create(): string {
  return 'This acdds a new cat';
 }
```

### Custom Headers
- @Headers
``` JS
 import { Header } from '@nest/common';
 
 @Post()
 @Header('Caches-Control', 'none')
 create() {
  return '~~@~@~@';
 }
```

### Redirection
- @Redirect or library-specific 리스폰스 오브젝트 사용
- @Redirect는 url를 인자값으로 넘겨줘야 함
- 선택적으로 statusCode를 넘겨줄 수 있으며 default는 302
``` JS
@Get()
@Redirect('https://github.com', 301)
```

- 만약 redirect할 url을 동적으로 설정해주고싶다면
- 메서드안에서 리턴해주면 @Redirect() 데코레이터 인자 값을 덮어씀
``` jS
@Get()
@Redirect('https://github.com', 301)
getDocs() {
  return { url: "https://www.naver.com", statusCode: 302 }
}
```

### Parameter Routing
- Express와 동일
``` JS
@Get(':id')
findOne(@Param() params): string {
  console.log(params.id);
  return `This action returns a #${params.id} cat`;
}
```

### SubDomain Routing
- @Controller 데코레이터는 host 옵션을 가져올 수 있음
- host 옵션으로 들어오는 요청의 HTTP host를 구체적으로 맞춰 줄 수 있음
``` JS
@Controller({ host: "examples.com" })
export class ExamController {
  @Get()
  index(): string {
    return 'exam page';
  }
}
```
- route와 마찬가지로 host 옵션은 동적인 값을 호스트 이름에 위치시키기 위해서 토큰처럼 사용도 가능
- host parameter 토큰은 @Controller에서 @HostParam() 데코레이터를 통해 접근 가능
``` JS
@Controller({ host: "example.com" })
export class AccountController {
  @Get()
   getInfo(@HostParam("account") account: string) {
    return account;
   }
}
```

### 비동기성
- JS에서 데이터 추출은 대부분 비동기로 작동함
- Nest에서는 async 함수를 지원
- 모든 비동기 함수는 Promise를 리턴함
- nest가 스스로 resolce할 수 있는 연기된 값을 전달할 수 있음.
``` JS
@Get()
async fildAll(): Promise<any[]> {
  return []
}
```
- nest route handler에서는 RxJS의 Observable streams를 리턴함으로써 더 강력하게 해낼 수도 있음.
- nest는 자동적으로 해당 소스를 subscribe하고 값이 나오면 가져감
``` JS
@Get()
findAll(): Observable<any[]> {
  return of([])
}
```

### Request Payloads
- Post route handler가 Client의 payload를 사용하려면 DTO(Data Transfer Object)를 정의해야 함
- DTO는 어떻게 데이터가 보내지게 될 지 정의하는 객체
- DTO 스키마는 Typescript의 interface나 class를 사용해서 정의 가능 (class 추천, interface는 컴파일 과정에서 삭제되기 떄문에 런타임에서 nest가 참조할 수 없음)
- 런타임에 이러한 메타데이터에 접근해야 하는 Pipe와 같은 추가적인 가능성들을 더해주는 기능ㄴ들이 있기 때문에 중요함.
``` JS
export class CreateCatDto {
  readonly name: string;
  readonly age: number;
  readonly breed: string;
}

@Post()
async create(@Body createCatDto: CreateCatDto) {
  return 'This action adds a new cat';
}
```


### 예시 Controller Code
``` JS
import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Put,
  Param,
  Delete
} from "@nestjs/common";
import { CreateCatDto, UpdateCatDto, ListAllEntities } from "./dto";

@Controller("cats")
export class CatsController {
  @Post()
  create(@Body() createCatDto: CreateCatDto) {
    return "This action adds a new cat";
  }

  @Get()
  findAll(@Query() query: ListAllEntities) {
    return `This action returns all cats (limit: ${query.limit} items)`;
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return `This action returns a #${id} cat`;
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() updateCatDto: UpdateCatDto) {
    return `This action updates a #${id} cat`;
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return `This action removes a #${id} cat`;
  }
}
```
- 위와 같이 Controller를 설정한 후에는 nest에 Controller가 있다는 것을 알려줘야 함.
- 컨트롤러는 항상 module에 속함
- @Module() 데코레이터 안에 controllers Array가 존재함
``` JS
 import { Module } from '@nestjs/common';
 import { CatsController } from './cats/cats.controller';
 
 @Module({
  controllers: [CatsController]
 })
 
 export class AppModule {}
```
