import { Injectable, NotFoundException } from '@nestjs/common';
import { Movie } from './entities/movie.entity';

@Injectable()
export class MoviesService {
  private movies: Movie[] = [];

  getAll(): Movie[] {
    return this.movies;
  }

  getOne(id: string): Movie {
    const movie =  this.movies.find(movie => movie.id === parseInt(id));
    if(!movie) {
      throw new NotFoundException(`Movie with Id ${id} not found.`)
    }
    return movie;
  }

  deleteOne(id: string) {
    this.getOne(id);  // 해당 movie가 있는지 확인 (없으면 에러 처리해줌)
    this.movies = this.movies.filter(movie => movie.id !== +id);
  }

  create(movieData) {
    this.movies.push({
      id: this.movies.length + 1,
      ...movieData,
    })
  }

  update(id: string, updateData){
    const movie = this.getOne(id);  // 수정할 movie 가져옴
    this.deleteOne(id);             // 해당 movie 지움
    this.movies.push({ ...movie, ...updateData });  // 수정한 후 다시 저장
  }
}
