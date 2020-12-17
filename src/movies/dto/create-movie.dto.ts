import { IsNumber, IsOptional, IsString } from "class-validator";
// class-validator를 이용해서 각각 유효성을 검사
// each: true 옵션은 그 안에 각각 다 검사한다는 것

export class CreateMovieDTO {

  @IsString()
  readonly title: string;
  @IsNumber()
  readonly year: number;
  @IsString({ each: true })
  @IsOptional()
  readonly genres: string[];
}