import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDTO } from './dto/create-movie.dto';
import { UpdateMovieDTO } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';

@Injectable()
export class MoviesService {
  private movies: Movie[] = [];

  getAll(): Movie[] {
    return this.movies;
  }

  getOne(id: number): Movie {
    const movie = this.movies.find((movie) => movie.id === id);
    if (!movie) {
      throw new NotFoundException(`Movie with Id ${id} not found.`);
    }
    return movie;
  }

  deleteOne(id: number) {
    this.getOne(id); // 해당 movie가 있는지 확인 (없으면 에러 처리해줌)
    this.movies = this.movies.filter((movie) => movie.id !== id);
  }

  create(movieData: CreateMovieDTO) {
    this.movies.push({
      id: this.movies.length + 1,
      ...movieData,
    });
  }

  update(id: number, updateData: UpdateMovieDTO) {
    const movie = this.getOne(id); // 수정할 movie 가져옴
    this.deleteOne(id); // 해당 movie 지움
    this.movies.push({ ...movie, ...updateData }); // 수정한 후 다시 저장
  }
}
