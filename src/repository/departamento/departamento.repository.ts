import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { CargoDto } from 'src/dto/departamento/cargo.dto';
import { DepartamentoDto } from 'src/dto/departamento/departamento.dto';
//import { MembroDepartamentoDto } from 'src/dto/departamento/membros.dto';//
import { Departamento } from 'src/entities/departamento/departamento.entity';
import { RespostaDeleteDepartamento } from 'src/interface/resposta-delete-departamento.interface';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class DepartamentoRepository extends Repository<Departamento> {
  constructor(@InjectDataSource() dataSource: DataSource) {
    super(Departamento, dataSource.createEntityManager());
  }

  async buscarTodosDepartamentos(): Promise<Departamento[]> {
    return this.find();
  }

  async buscarDepartamentoPorId(idDepartamento: number): Promise<Departamento> {
    return this.findOne({ where: { id: idDepartamento } });
  }

  async buscarDepartamentoPorNome(nomeDepartamento: string): Promise<Departamento> {
    return this.findOne({ where: { nome: nomeDepartamento } });
  }

  async buscarCargosDoDepartamento(idDepartamento: number): Promise<CargoDto[]> {
    const departamento = await this.findOne({ where: { id: idDepartamento } });
    return departamento ? departamento.cargos : [];
  }

  async incluirDepartamento(departamento: DepartamentoDto): Promise<Departamento> {
    return this.create(departamento);
  }

  async salvarDepartamento(departamento: DepartamentoDto): Promise<Departamento> {
    return this.save(departamento);
  }

  async incluirMembrosNoDepartamento(departamento: DepartamentoDto): Promise<void> {
    await this.save(departamento);
  }

  /* async incluirMembrosNoDepartamento(
    idDepartamento: number,
    membro: MembroDepartamentoDto[],
  ): Promise<void> {
    await this.update(idDepartamento, { membros: membro });
  } */

  async deletarDepartamento(idDepartamento: number): Promise<RespostaDeleteDepartamento> {
    const respostaDelete = await this.delete(idDepartamento);
    const qntRemovido = respostaDelete.affected > 0 ? 1 : 0;
    const message =
      respostaDelete.affected > 0
        ? 'Departamento removido com sucesso'
        : 'Departamento não encontrado';
    return { qntRemovido, message };
  }
}
