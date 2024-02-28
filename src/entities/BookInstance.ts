// src/entities/BookInstance.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Book } from './Book';
import { BookInstanceStatus } from '../untils/constants';

@Entity()
export class BookInstance {
  @PrimaryGeneratedColumn({ name: 'instance_id' })
  instanceId: number;

  @ManyToOne(() => Book, (book) => book.bookInstances)
  book: Book;

  @Column()
  imprint: string;

  @Column({
    type: 'enum',
    enum: Object.values(BookInstanceStatus),
  })
  status: string;

  @Column({ type: 'date' })
  dueBack: Date;

  // Phương thức getter cho URL
  get url(): string {
    return 'something';
  }
}
