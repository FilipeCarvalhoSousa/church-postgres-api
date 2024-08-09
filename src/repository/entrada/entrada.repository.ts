import { Injectable } from '@nestjs/common';
import { Entrada } from './../../entities/entrada/entrada.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { EntradaDto } from './../../dto/entrada/entrada.dto';
import { RespostaDeleteFinanceiro } from './../../interface/resposta-delete-financeiro.interface';

@Injectable()
export class EntradaRepository extends Repository<Entrada> {
  constructor(@InjectDataSource() dataSource: DataSource) {
    super(Entrada, dataSource.createEntityManager());
  }

  async buscarTodasEntrada(): Promise<Entrada[]> {
    return this.find();
  }

  async criarEntrada(entrada: EntradaDto): Promise<Entrada> {
    return this.create(entrada);
  }

  async salvarEntrada(novaEntrada: EntradaDto): Promise<Entrada> {
    return this.save(novaEntrada);
  }

  async buscarEntradaPorId(idEntrada: number): Promise<Entrada> {
    return this.findOne({ where: { id: idEntrada } });
  }

  async deletarEntradaPorId(idEntrada: number): Promise<RespostaDeleteFinanceiro> {
    const respostaDelete = await this.delete(idEntrada);
    const quantidadeRemovido = respostaDelete.affected > 0 ? 1 : 0;
    const message =
      respostaDelete.affected > 0 ? 'Entrada removido com sucesso' : 'Entrada não encontrado';

    return { quantidadeRemovido, message };
  }

  async buscarEntradaPorPeriodo(dataInicio: Date, dataFim: Date): Promise<Entrada[]> {
    return this.createQueryBuilder('entrada')
      .where('entrada.data BETWEEN :dataInicio AND :dataFim', { dataInicio, dataFim })
      .orderBy('entrada.data', 'ASC') // Ordena por data em ordem crescente
      .getMany();
  }

  async buscarPorDescricao(descricao: string): Promise<Entrada[]> {
    return this.createQueryBuilder('entrada')
      .where('entrada.descricao = :descricao', { descricao })
      .getMany();
  }

  async getTotalEntrada(): Promise<number> {
    const { sum } = await this.createQueryBuilder('entrada')
      .select('SUM(entrada.valor)', 'sum')
      .getRawOne();
    return parseFloat(sum) || 0;
  }
}
