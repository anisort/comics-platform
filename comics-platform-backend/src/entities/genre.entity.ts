import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Comic } from './comic.entity';

@Entity('genres')
export class Genre {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Comic, (comic) => comic.genres)
  comics: Comic[];
}
