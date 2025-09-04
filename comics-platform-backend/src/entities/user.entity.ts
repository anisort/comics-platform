import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Comic } from './comic.entity';
import { Notification } from './notification.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Comic, (comic) => comic.user)
  comics: Comic[];

  @ManyToMany(() => Comic, (comic) => comic.subscribers)
  @JoinTable()
  subscribedComics: Comic[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];
}
