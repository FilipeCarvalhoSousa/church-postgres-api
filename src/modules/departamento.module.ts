import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartamentoController } from 'src/controller/departamento/departamento.controller';
import { Departamento } from 'src/entities/departamento/departamento.entity';
import { DepartamentoRepository } from 'src/repository/departamento/departamento.repository';
import { MembroRepository } from 'src/repository/membro/membro.repository';
import { DepartamentoService } from 'src/service/departamento/departamento.service';

@Module({
  imports: [TypeOrmModule.forFeature([Departamento])],
  providers: [DepartamentoService, DepartamentoRepository, MembroRepository],
  controllers: [DepartamentoController],
})
export class DepartamentoModule {}
