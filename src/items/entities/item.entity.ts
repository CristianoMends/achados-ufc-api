import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, ValueTransformer } from "typeorm"

const brDateTimeTransformer: ValueTransformer = {
  to: (value: any) => value,
  from: (value: Date) => {
    const date = new Date(value);
    // Ajusta para o fuso horário de Brasília (UTC-3)
    date.setHours(date.getHours() - 3);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
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

  @CreateDateColumn({ type: 'timestamp', transformer: brDateTimeTransformer })
  date: string;

  @Column({ default: false })
  isFound: boolean = false;

  @ManyToOne(() => User, user => user.items, { eager: true, onDelete: 'CASCADE' })
  user: User;
}
