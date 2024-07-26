import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntradaController } from './../controller/entrada/entrada.controller';
import { Entrada } from './../entities/entrada/entrada.entity';
import { EntradaRepository } from './../repository/entrada/entrada.repository';
import { EntradaService } from './../service/entrada/entrada.service';

@Module({
  imports: [TypeOrmModule.forFeature([Entrada])],
  providers: [EntradaService, EntradaRepository],
  controllers: [EntradaController],
})
export class EntradaModule {}
