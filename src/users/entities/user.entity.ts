
import { Item } from 'src/items/entities/item.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['email'])
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', nullable: true })
    username: String | null;

    @Column({ type: 'varchar', nullable: true })
    fcmToken: string | null;
    
    @Column()
    email: String;

    @Column()
    password: String;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    phone: string | null;

    @Column({ type: 'varchar', nullable: true })
    imageUrl: string | null;

    @Column({ type: 'varchar', nullable: true })
    surname: string | null;

    @OneToMany(() => Item, item => item.user)
    items: Item[];
}
