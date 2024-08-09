import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { FilhoDto } from './../../dto/membro/filho.dto';
import { MembroDto } from './../../dto/membro/membro.dto';
import { Membro } from './../../entities/membro/membro.entity';
import { RespostaDeleteMembro } from '../../interface/resposta-delete-membro.interface';
import { MembroRepository } from './../../repository/membro/membro.repository';
import { DepartamentoService } from '../departamento/departamento.service';

@Injectable()
export class MembroService {
  constructor(
    private readonly membroRepository: MembroRepository,
    private readonly departamentoService: DepartamentoService,
  ) {}

  async buscarTodosMembros(): Promise<Membro[]> {
    return this.membroRepository.buscarTodosMembros();
  }

  async buscarMembroPorId(idMembro: number): Promise<Membro> {
    const membroEncontrado = await this.membroRepository.buscarMembroPorId(idMembro);
    if (!membroEncontrado) {
      throw new BadRequestException('Membro não encontrado para o ID informado');
    }
    return membroEncontrado;
  }

  async criarMembro(novoMembro: MembroDto): Promise<Membro> {
    const membro = await this.membroRepository.criarMembro(novoMembro);

    /**
     * Validação de campos data_casamento e conjuge,
     * Não permitir inclusão quando o membro tiver estado civil 1
     *
     * 
     if (novoMembro.estado_civil !== 2) {
      if (novoMembro.conjuge || novoMembro.data_casamento) {
        console.log('novoMembro', novoMembro);
        throw new BadRequestException(
          'Conjuge e/ou data de casamento deverá ser preenchido somente se o membro for casado',
        );
      }
    }
     */

    if (novoMembro.conjuge && novoMembro.conjuge.id) {
      const membroId = await this.membroRepository.buscarMembroPorId(novoMembro.conjuge.id);
      await this.atualizarConjuge(membroId.id, novoMembro);

      membro.conjuge.id = membroId.id;
      membro.conjuge.nome = membroId.nome;
      membro.conjuge.telefone = membroId.telefone;
      membro.conjuge.email = membroId.email;
    }

    const membroDepartamento = {
      id: membro.id,
      nome: membro.nome,
    };
    for (const departamento of membro.departamento) {
      await this.departamentoService.incluirMembrosNoDepartamento(
        departamento.id,
        membroDepartamento,
      );
    }

    const membroSalvo = await this.membroRepository.salvarMembro(membro);

    return membroSalvo;
  }

  async atualizarMembro(idMembro: number, membroAlterado: MembroDto): Promise<Membro> {
    const membroEncontrado = await this.membroRepository.buscarMembroPorId(idMembro);
    if (!membroEncontrado) {
      throw new NotFoundException('Membro não encontrado para o ID informado');
    }

    if (membroAlterado.conjuge && membroAlterado.conjuge.id) {
      const membroId = await this.membroRepository.buscarMembroPorId(membroAlterado.conjuge.id);
      await this.atualizarConjuge(membroId.id, membroAlterado);

      const conjugeEncontrado = await this.membroRepository.buscarMembroPorId(
        membroAlterado.conjuge.id,
      );
      membroEncontrado.conjuge = {
        id: conjugeEncontrado.id,
        nome: conjugeEncontrado.nome,
        email: conjugeEncontrado.email,
        telefone: conjugeEncontrado.telefone,
      };
    } else {
      membroEncontrado.conjuge = {
        id: membroAlterado.conjuge.id,
        nome: membroAlterado.conjuge.nome,
        email: membroAlterado.conjuge.email,
        telefone: membroAlterado.conjuge.telefone,
      };
    }

    membroEncontrado.cargo = membroAlterado.cargo;
    membroEncontrado.data_casamento = membroAlterado.data_casamento;
    membroEncontrado.data_nascimento = membroAlterado.data_nascimento;
    membroEncontrado.departamento = membroAlterado.departamento;
    membroEncontrado.email = membroAlterado.email;
    membroEncontrado.endereco = membroAlterado.endereco;
    membroEncontrado.estado_civil = membroAlterado.estado_civil;
    membroEncontrado.filhos = membroAlterado.filhos;
    membroEncontrado.nome = membroAlterado.nome;

    return await this.membroRepository.salvarMembro(membroEncontrado);
  }

  async deletarMembroPorId(idMembro: number): Promise<RespostaDeleteMembro> {
    const membroCadastrado = await this.membroRepository.buscarMembroPorId(idMembro);
    if (!membroCadastrado) {
      throw new NotFoundException('Membro não encontrado');
    }
    return await this.membroRepository.deletarMembroPorId(idMembro);
  }

  async buscarMembrosPeloEstadoCivil(estadoCivil: number): Promise<Membro[]> {
    const membrosEncontrados =
      await this.membroRepository.buscarMembrosPeloEstadoCivil(estadoCivil);
    if (!membrosEncontrados.length) {
      throw new NotFoundException('Nenhum membro encontrado para o estado civil informado');
    }

    return membrosEncontrados;
  }

  async buscarPorSituacao(situacao: number): Promise<Membro[]> {
    const valorSituacao = Number(situacao);
    if (isNaN(valorSituacao)) {
      throw new BadRequestException('Situação precisa ser um número');
    }
    const membrosEncontrados = await this.membroRepository.buscarPorSituacao(valorSituacao);
    if (!membrosEncontrados.length) {
      throw new NotFoundException('Nenhum membro encontrado para esta situacao');
    }

    return membrosEncontrados;
  }

  async atualizarConjuge(idConjuge: number, membro: MembroDto): Promise<void> {
    const conjugeFinded = await this.membroRepository.buscarMembroPorId(idConjuge);
    if (!conjugeFinded) {
      throw new NotFoundException(`Conjuge com o Id ${idConjuge} não encontrado`);
    }

    if (!conjugeFinded.conjuge) {
      conjugeFinded.conjuge = {
        id: null,
        nome: '',
        email: '',
        telefone: '',
      };
    }

    conjugeFinded.conjuge = {
      id: membro.id,
      nome: membro.nome,
      email: membro.email,
      telefone: membro.telefone,
    };

    await this.membroRepository.atulizarConjuge(conjugeFinded.id, conjugeFinded.conjuge);
  }

  async atualizarFilho(idFilho: number, novoFilho: FilhoDto): Promise<FilhoDto> {
    const filhoEncontrado = await this.membroRepository.buscarMembroPorId(idFilho);
    if (!filhoEncontrado) {
      throw new BadRequestException(`Filho com o Id ${idFilho} não encontrado`);
    }
    filhoEncontrado.nome = novoFilho.nome;
    filhoEncontrado.telefone = novoFilho.telefone;
    filhoEncontrado.email = novoFilho.email;

    return filhoEncontrado;
  }

  async buscarConjuge(memberId: number): Promise<Membro> {
    const conjuge = await this.membroRepository.buscarConjugePorId(memberId);

    if (!conjuge) {
      throw new BadRequestException(`Conjuge do membro com id ${memberId} não encontrado`);
    }
    return conjuge;
  }
}
