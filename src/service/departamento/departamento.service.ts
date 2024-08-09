import { Departamento } from 'src/entities/departamento/departamento.entity';
import { DepartamentoRepository } from './../../repository/departamento/departamento.repository';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DepartamentoDto } from 'src/dto/departamento/departamento.dto';
import { RespostaDeleteDepartamento } from 'src/interface/resposta-delete-departamento.interface';
import { MembroDepartamentoDto } from 'src/dto/departamento/membros.dto';
import { CargoDto } from 'src/dto/departamento/cargo.dto';

@Injectable()
export class DepartamentoService {
  constructor(private readonly departamentoRepositoy: DepartamentoRepository) {}

  async buscarTodosDepartamentos(): Promise<Departamento[]> {
    return await this.departamentoRepositoy.buscarTodosDepartamentos();
  }

  async buscarDepartamentoPorId(idDepartamento: number): Promise<Departamento> {
    const departamentoEncontrado =
      await this.departamentoRepositoy.buscarDepartamentoPorId(idDepartamento);
    if (!departamentoEncontrado) {
      throw new NotFoundException('Departamento não encontrado');
    }

    return departamentoEncontrado;
  }

  async incluirDepartamento(departamento: DepartamentoDto): Promise<Departamento> {
    const departamentoCriado = await this.departamentoRepositoy.incluirDepartamento(departamento);

    if (!departamentoCriado.nome || !departamentoCriado.descricao) {
      throw new BadRequestException('Campos titulo e/ou descrição precisam ser preenchidos');
    }

    const departamentoNome = await this.departamentoRepositoy.buscarDepartamentoPorNome(
      departamentoCriado.nome,
    );
    if (departamentoNome) {
      throw new BadRequestException('Departamento com este nome já existe');
    }

    return await this.departamentoRepositoy.salvarDepartamento(departamentoCriado);
  }

  async buscarCargosDoDepartamento(idDepartamento: number): Promise<CargoDto[]> {
    const departamentoEncontrado =
      await this.departamentoRepositoy.buscarDepartamentoPorId(idDepartamento);

    if (!departamentoEncontrado) {
      throw new NotFoundException('Departamento não encontrado para o ID informado');
    }

    return await this.departamentoRepositoy.buscarCargosDoDepartamento(departamentoEncontrado.id);
  }

  async atualizarDepartamento(
    idDepartamento: number,
    departamento: DepartamentoDto,
  ): Promise<Departamento> {
    let departamentoEncontrado =
      await this.departamentoRepositoy.buscarDepartamentoPorId(idDepartamento);

    if (!departamentoEncontrado) {
      throw new NotFoundException('Departamento não encontrado para o ID informado');
    }

    departamentoEncontrado = departamento;

    return await this.departamentoRepositoy.salvarDepartamento(departamentoEncontrado);
  }

  async incluirMembrosNoDepartamento(
    idDepartamento: number,
    membro: MembroDepartamentoDto,
  ): Promise<void> {
    const departamentoEncontrado =
      await this.departamentoRepositoy.buscarDepartamentoPorId(idDepartamento);

    if (!departamentoEncontrado) {
      throw new NotFoundException('Departamento não encontrado para o ID informado');
    }

    departamentoEncontrado.membros.push(membro);

    return await this.departamentoRepositoy.incluirMembrosNoDepartamento(departamentoEncontrado);
  }

  async deletarDepartamento(idDepartamento: number): Promise<RespostaDeleteDepartamento> {
    const departamentoEncontrado =
      await this.departamentoRepositoy.buscarDepartamentoPorId(idDepartamento);
    if (!departamentoEncontrado) {
      throw new NotFoundException('Departamento não encontrado');
    }
    return await this.departamentoRepositoy.deletarDepartamento(idDepartamento);
  }
}
