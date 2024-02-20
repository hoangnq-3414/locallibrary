// src/entities/BookInstance.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Book } from './Book';

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
    enum: ['Available', 'Maintenance', 'On Loan', 'Reserved'],
  })
  status: string;

  @Column({ type: 'date' })
  dueBack: Date;

  // Phương thức getter cho URL
  get url(): string {
    return 'something';
  }
}