import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { Module } from '@nestjs/common';
import { Membro } from './../entities/membro/membro.entity';
import { MembroRepository } from './../repository/membro/membro.repository';
import { MembroService } from './../service/membro/membro.service';
import { MembroController } from './../controller/membro/membro.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Membro])],
  providers: [MembroService, MembroRepository],
  controllers: [MembroController],
})
export class MembroModule {}
