// src/entities/BookGenre.ts
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Book } from './Book';
import { Genre } from './Genre';

@Entity()
export class BookGenre {
  @PrimaryGeneratedColumn({ name: 'book_gender_id' })
  bookGenderId: number;

  @ManyToOne(() => Book, (book) => book.bookGenres)
  book: Book;

  @ManyToOne(() => Genre, (genre) => genre.bookGenres)
  genre: Genre;
}
