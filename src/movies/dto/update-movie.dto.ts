import { PartialType } from '@nestjs/mapped-types';
import { CreateMovieDTO } from './create-movie.dto';

// UpdateMovieDTO는 CreateMovieDTO와 똑같은데 각 필드가 필수사항이 아니라는 것만 다름
export class UpdateMovieDTO extends PartialType(CreateMovieDTO) {}
