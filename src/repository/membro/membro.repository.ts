import { InjectDataSource } from '@nestjs/typeorm';
import { Membro } from './../../entities/membro/membro.entity';
import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { MembroDto } from './../../dto/membro/membro.dto';
import { RespostaDeleteMembro } from './../../interface/resposta-delete-membro.interface';

@Injectable()
export class MembroRepository extends Repository<Membro> {
  constructor(@InjectDataSource() dataSource: DataSource) {
    super(Membro, dataSource.createEntityManager());
  }

  async buscarTodosMembros(): Promise<Membro[]> {
    return this.find();
  }

  async criarMembro(membro: Membro): Promise<Membro> {
    return this.create(membro);
  }

  async salvarMembro(membro: Membro): Promise<Membro> {
    return this.save(membro);
  }

  async buscarMembroPorId(idMembro: number): Promise<Membro> {
    return this.findOne({ where: { id: idMembro } });
  }

  async deletarMembroPorId(idMembro: number): Promise<RespostaDeleteMembro> {
    const respostaDelete = await this.delete(idMembro);
    const qntMembroRemovido = respostaDelete.affected > 0 ? 1 : 0;
    const message =
      respostaDelete.affected > 0 ? 'Membro removido com sucesso' : 'Membro não encontrado';
    const membros = await this.buscarTodosMembros();

    return { qntMembroRemovido, message, membros };
  }

  async buscarMembrosPeloEstadoCivil(estadoCivil: number): Promise<Membro[]> {
    return this.find({ where: { estado_civil: estadoCivil } });
  }

  async buscarPorSituacao(situacao: number): Promise<Membro[]> {
    return this.find({ where: { situacao: situacao } });
  }

  async buscarConjugePorId(conjugeId: number): Promise<Partial<Membro>> {
    return this.createQueryBuilder('membro')
      .where("membro.conjuge ->> 'id' = :conjugeId", { conjugeId: conjugeId.toString() })
      .getOne();
  }

  async buscarMembrosComConjuge(idConjuge: number): Promise<Membro[] | []> {
    return this.createQueryBuilder('membro')
      .where("membro.conjuge ->> 'id' = conjuge.id", {
        idConjuge,
      })
      .getMany();
  }

  async atualizaConjuge(conjugeId: number, newConjugeData: MembroDto): Promise<Membro> {
    const conjuge = await this.findOne({ where: { id: conjugeId } });
    if (conjuge) {
      conjuge.conjuge = newConjugeData;
      return this.save(conjuge);
    }
    throw new Error('Cônjuge não encontrado');
  }

  async atulizarConjuge(idMembro: number, membro: Partial<MembroDto>): Promise<void> {
    await this.update(idMembro, { conjuge: membro });
  }

  async atulizarFilho(idMembro: number, membro: Partial<MembroDto>[]): Promise<void> {
    await this.update(idMembro, { filhos: membro });
  }
}
