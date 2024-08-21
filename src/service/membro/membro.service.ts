import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
    const { conjugeId, ...restDto } = novoMembro;

    let conjuge = null;

    if (conjugeId) {
      if (conjugeId === restDto.id) {
        throw new BadRequestException('O cônjuge não pode ser o próprio membro.');
      }
      conjuge = await this.membroRepository.buscarMembroPorId(conjugeId);
      if (!conjuge) {
        throw new NotFoundException(`Cônjuge com ID ${novoMembro.conjugeId} não encontrado`);
      }
      const membro = await this.membroRepository.buscarConjugePorId(conjugeId);
      if (membro) {
        membro.conjuge = null;
        await this.membroRepository.save(membro);
      }
    }

    const membroCriado = await this.membroRepository.criarMembro({
      ...novoMembro,
      conjuge: conjuge ? { id: conjuge.id, nome: conjuge.nome } : null,
    });

    if (novoMembro.departamento.length) {
      const membroDepartamento = {
        id: membroCriado.id,
        nome: membroCriado.nome,
      };
      for (const departamento of membroCriado.departamento) {
        await this.departamentoService.incluirMembrosNoDepartamento(
          departamento.id,
          membroDepartamento,
        );
      }
    }

    const membroSalvo = await this.membroRepository.salvarMembro(membroCriado);

    if (conjuge) {
      conjuge.conjuge = {
        id: membroSalvo.id,
        nome: membroSalvo.nome,
      };

      await this.membroRepository.salvarMembro(conjuge);

      membroSalvo.conjuge = {
        id: conjuge.id,
        nome: conjuge.nome,
      };
      await this.membroRepository.salvarMembro(membroSalvo);
    }

    return membroSalvo;
  }

  async atualizarMembro(idMembro: number, membroAlterado: MembroDto): Promise<Membro> {
    const membroEncontrado = await this.membroRepository.buscarMembroPorId(idMembro);
    if (!membroEncontrado) {
      throw new NotFoundException('Membro não encontrado para o ID informado');
    }

    if (membroAlterado.conjugeId) {
      const conjugeEncontrado = await this.membroRepository.buscarMembroPorId(
        membroAlterado.conjugeId,
      );
      membroEncontrado.conjuge = {
        id: conjugeEncontrado.id,
        nome: conjugeEncontrado.nome,
      };
      this.atualizarConjuge(membroAlterado.conjugeId, membroAlterado);
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
    membroEncontrado.sexo = membroAlterado.sexo;

    return await this.membroRepository.salvarMembro(membroEncontrado);
  }

  async deletarMembroPorId(idMembro: number): Promise<RespostaDeleteMembro> {
    const membroCadastrado = await this.membroRepository.buscarMembroPorId(idMembro);
    if (!membroCadastrado) {
      throw new NotFoundException('Membro não encontrado');
    }

    const membro = await this.membroRepository.buscarConjugePorId(idMembro);
    if (membro) {
      membro.conjuge = null;
      await this.membroRepository.save(membro);
    }

    return this.membroRepository.deletarMembroPorId(idMembro);
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
    const membroRecebido = membro;

    let conjuge = null;
    if (idConjuge === membroRecebido.id) {
      throw new BadRequestException('O cônjuge não pode ser o próprio membro.');
    }

    conjuge = await this.membroRepository.buscarMembroPorId(membroRecebido.conjugeId);
    if (!conjuge) {
      throw new NotFoundException(`Cônjuge com ID ${membroRecebido.conjugeId} não encontrado`);
    }

    const membroConjuge = await this.membroRepository.buscarConjugePorId(membroRecebido.conjugeId);
    if (membroConjuge) {
      membroConjuge.conjuge = null;
      await this.membroRepository.save(membroConjuge);
    }

    conjuge.conjuge = {
      id: membro.id, // Agora o id do novo membro está disponível
      nome: membro.nome,
    };
    await this.membroRepository.salvarMembro(conjuge);
  }

  /* async atualizarFilho(idFilho: number, novoFilho: FilhoDto): Promise<FilhoDto> {
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
  } */
}
