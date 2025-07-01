import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, ValueTransformer } from "typeorm"

const brDateTransformer: ValueTransformer = {
  to: (value: any) => value, 
  from: (value: Date) => {
    const date = new Date(value);
    date.setHours(date.getHours() - 3);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
};

@Entity()
export class Item {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  imageUrl: string;

  @Column()
  location: string;

  @CreateDateColumn({ type: 'timestamp', transformer: brDateTransformer })
  date: string;

  @Column({ default: false })
  isFound: boolean = false;

  @ManyToOne(() => User, user => user.items, { eager: true, onDelete: 'CASCADE' })
  user: User;
}
