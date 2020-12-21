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
