import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToMany, JoinTable, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Genre } from './genre.entity';
import { Episode } from './episode.entity';

export type ComicStatus = 'ongoing' | 'completed';
export type AgeRating = '13+' | '16+' | '18+';

@Entity('comics')
export class Comic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: ['ongoing', 'completed'], default: 'ongoing' })
  status: ComicStatus;

  @Column({ type: 'enum', enum: ['13+', '16+', '18+'] })
  ageRating: AgeRating;

  @Column({ nullable: true })
  coverUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.comics)
  @JoinColumn({name: "userId"})
  user: User | {id: number, username: string};

  @ManyToMany(() => Genre, (genre) => genre.comics)
  @JoinTable()
  genres: Genre[];

  @OneToMany(() => Episode, (episode) => episode.comic)
  episodes: Episode[];

  @ManyToMany(() => User, user => user.subscribedComics)
  subscribers: User[];
}
