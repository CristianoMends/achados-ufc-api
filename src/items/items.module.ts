import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemsController } from './items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { User } from 'src/users/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { UploadModule } from 'src/upload/upload.module';

@Module({
  imports: [TypeOrmModule.forFeature([Item, User]),
    UploadModule,
    ConfigModule,
  ],
  controllers: [ItemsController],
  providers: [ItemService],
})
export class ItemsModule { }
