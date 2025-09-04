import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Comic } from './comic.entity';
import { Page } from './page.entity';

@Entity('episodes')
export class Episode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  order: number;

  @Column({ default: false })
  isAvailable: boolean;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Comic, (comic) => comic.episodes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'comicId' })
  comic: Comic;

  @OneToMany(() => Page, (page) => page.episode)
  pages: Page[];
}
