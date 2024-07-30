import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Entrada } from '../entities/entrada/entrada.entity';
import { EntradaRepository } from '../repository/entrada/entrada.repository';
import { EntradaService } from '../service/entrada/entrada.service';
import { MembroRepository } from '../repository/membro/membro.repository';
import { SaidaService } from './../service/saida/saida.service';
import { SaidaRepository } from './../repository/saida/saida.repository';
import { Saida } from './../entities/saida/saida.entity';
import { FinanceiroController } from './../controller/financeiro/financeiro.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Entrada, Saida])],
  providers: [EntradaService, EntradaRepository, MembroRepository, SaidaService, SaidaRepository],
  controllers: [FinanceiroController],
})
export class FinanceiroModule {}
