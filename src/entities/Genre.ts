// src/entities/Genre.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BookGenre } from './BookGenre';

@Entity()
export class Genre {
  @PrimaryGeneratedColumn({ name: 'genre_id' })
  genreId: number;

  @Column()
  name: string;

  @OneToMany(() => BookGenre, (bookGenre) => bookGenre.genre)
  bookGenres: BookGenre[];

  // Phương thức getter cho URL
  get url(): string {
    return 'something';
  }
}
