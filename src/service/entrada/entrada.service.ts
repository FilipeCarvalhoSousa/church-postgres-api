import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { EntradaDto } from './../../dto/entrada/entrada.dto';
import { Entrada } from './../../entities/entrada/entrada.entity';
import { EntradaRepository } from './../../repository/entrada/entrada.repository';
import { MembroRepository } from './../../repository/membro/membro.repository';
import { getCurrentDateInBrazil } from './../../helpers/functions/data.helper';
import { RespostaDeleteFinanceiro } from './../../interface/resposta-delete-financeiro.interface';

@Injectable()
export class EntradaService {
  constructor(
    private readonly entradaRepository: EntradaRepository,
    private readonly membroRepository: MembroRepository,
  ) {}

  async buscarTodasEntrada(): Promise<Entrada[]> {
    return this.entradaRepository.buscarTodasEntrada();
  }

  async incluirEntrada(novaEntrada: EntradaDto): Promise<Entrada> {
    const entradaDados = await this.entradaRepository.criarEntrada(novaEntrada);

    if (entradaDados.valor === 0 || isNaN(entradaDados.valor)) {
      throw new BadRequestException('Valor inválido');
    }

    if (!entradaDados.descricao) {
      throw new BadRequestException('Informe a descrição');
    }
    if (entradaDados.membro && entradaDados.membro.id) {
      const membroEntrada = await this.membroRepository.buscarMembroPorId(entradaDados.membro.id);

      entradaDados.membro.id = membroEntrada.id;
      entradaDados.membro.nome = membroEntrada.nome;
    }

    entradaDados.data = getCurrentDateInBrazil();

    return await this.entradaRepository.salvarEntrada(entradaDados);
  }

  async alterarEntrada(idEntrada: number, novaEntrada: EntradaDto): Promise<Entrada> {
    const entradaDados = await this.entradaRepository.buscarEntradaPorId(idEntrada);

    if (!entradaDados) {
      throw new NotFoundException('Nenhuma entrada encontrada para o ID informado');
    }
    if (novaEntrada.valor === 0 || isNaN(novaEntrada.valor)) {
      throw new BadRequestException('Valor inválido');
    }

    if (!novaEntrada.descricao) {
      throw new BadRequestException('Informe a descrição');
    }

    if (novaEntrada.membro && novaEntrada.membro.id) {
      const membroEntrada = await this.membroRepository.buscarMembroPorId(novaEntrada.membro.id);

      entradaDados.membro.id = membroEntrada.id;
      entradaDados.membro.nome = membroEntrada.nome;
    }

    entradaDados.forma_pagamento = novaEntrada.forma_pagamento;
    entradaDados.valor = novaEntrada.valor;
    entradaDados.descricao = novaEntrada.descricao;
    entradaDados.data_operacao = novaEntrada.data_operacao;
    entradaDados.tipo = novaEntrada.tipo;

    return await this.entradaRepository.salvarEntrada(entradaDados);
  }

  async buscarEntradaPorPeriodo(dataInicio: Date, dataFim: Date): Promise<Entrada[]> {
    return this.entradaRepository.buscarEntradaPorPeriodo(dataInicio, dataFim);
  }

  async deletarEntradaPorId(idEntrada: number): Promise<RespostaDeleteFinanceiro> {
    const entradaEncontrada = await this.entradaRepository.buscarEntradaPorId(idEntrada);
    if (!entradaEncontrada) {
      throw new NotFoundException('Entrada não encontrada');
    }
    return await this.entradaRepository.deletarEntradaPorId(idEntrada);
  }

  async getTotalEntrada(): Promise<number> {
    return await this.entradaRepository.getTotalEntrada();
  }
}
