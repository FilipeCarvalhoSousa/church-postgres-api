import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { Module } from '@nestjs/common';
import { Membro } from './../entities/membro/membro.entity';
import { MembroRepository } from './../repository/membro/membro.repository';
import { MembroService } from './../service/membro/membro.service';
import { MembroController } from './../controller/membro/membro.controller';
import { DepartamentoService } from 'src/service/departamento/departamento.service';
import { DepartamentoRepository } from 'src/repository/departamento/departamento.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Membro])],
  providers: [MembroService, MembroRepository, DepartamentoService, DepartamentoRepository],
  controllers: [MembroController],
})
export class MembroModule {}
