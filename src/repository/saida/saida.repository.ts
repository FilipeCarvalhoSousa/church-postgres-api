import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { SaidaDto } from './../../dto/saida/saida.dto';
import { Saida } from './../../entities/saida/saida.entity';
import { RespostaDeleteFinanceiro } from './../../interface/resposta-delete-financeiro.interface';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class SaidaRepository extends Repository<Saida> {
  constructor(@InjectDataSource() dataSource: DataSource) {
    super(Saida, dataSource.createEntityManager());
  }

  async buscarTodasSaidas(): Promise<Saida[]> {
    return this.find();
  }

  async buscarSaidaPorId(idSaida: number): Promise<Saida> {
    return this.findOne({ where: { id: idSaida } });
  }

  async registrarSaida(novaSaida: SaidaDto): Promise<Saida> {
    return this.create(novaSaida);
  }

  async salvarSaida(novaSaida: SaidaDto): Promise<Saida> {
    return this.save(novaSaida);
  }

  async buscarSaidaPorPeriodo(dataInicio: Date, dataFim: Date): Promise<Saida[]> {
    return await this.createQueryBuilder('saida')
      .where('saida.data BETWEEN :dataInicio AND :dataFim', { dataInicio, dataFim })
      .orderBy('saida.data', 'ASC') // Ordena por data em ordem crescente
      .getMany();
  }

  async getTotalSaida(): Promise<number> {
    const { sum } = await this.createQueryBuilder('saida')
      .select('SUM(saida.valor)', 'sum')
      .getRawOne();
    return parseFloat(sum) || 0;
  }

  async getSaidaByDescricao(descricao: string): Promise<Saida[]> {
    return await this.createQueryBuilder('saida')
      .where('saida.descricao = :descricao', { descricao })
      .getMany();
  }

  async deletarEntradaPorId(idSaida: number): Promise<RespostaDeleteFinanceiro> {
    const respostaDelete = await this.delete(idSaida);
    const quantidadeRemovido = respostaDelete.affected > 0 ? 1 : 0;
    const message =
      respostaDelete.affected > 0 ? 'Saída removida com sucesso' : 'Saída não encontrada';

    return { quantidadeRemovido, message };
  }
}
