import { Injectable } from '@nestjs/common';
import { Entrada } from './../../entities/entrada/entrada.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { EntradaDto } from './../../dto/entrada/entrada.dto';

@Injectable()
export class EntradaRepository extends Repository<Entrada> {
  constructor(@InjectDataSource() dataSource: DataSource) {
    super(Entrada, dataSource.createEntityManager());
  }

  async buscarTodasEntrada(): Promise<Entrada[]> {
    console.log('rep');

    return this.find();
  }

  async incluirEntrada(novaEntrada: EntradaDto): Promise<Entrada> {
    return this.create(novaEntrada);
  }
}
