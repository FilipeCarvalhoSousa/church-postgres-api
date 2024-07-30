import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { EntradaRepository } from './../../repository/entrada/entrada.repository';
import { SaidaDto } from './../../dto/saida/saida.dto';
import { Saida } from './../../entities/saida/saida.entity';
import { SaidaRepository } from './../../repository/saida/saida.repository';
import { RespostaDeleteFinanceiro } from './../../interface/resposta-delete-financeiro.interface';
import { getCurrentDateInBrazil } from './../../helpers/functions/data.helper';

@Injectable()
export class SaidaService {
  constructor(
    private readonly saidaRepository: SaidaRepository,
    private readonly entradaRepository: EntradaRepository,
  ) {}

  async getTodasSaidas(): Promise<Saida[]> {
    return this.saidaRepository.buscarTodasSaidas();
  }

  async registrarSaida(dadosSaida: SaidaDto): Promise<Saida> {
    const totalEntrada = await this.entradaRepository.getTotalEntrada();
    const totalSaida = await this.saidaRepository.getTotalSaida();

    if (totalSaida + dadosSaida.valor > totalEntrada) {
      throw new BadRequestException('Saída excede o total de entradas disponíveis.');
    }

    const saida = this.saidaRepository.create(dadosSaida);
    saida.data = getCurrentDateInBrazil();
    return this.saidaRepository.save(saida);
  }

  async buscarSaidaPorPeriodo(dataInicio: Date, dataFim: Date): Promise<Saida[]> {
    return await this.saidaRepository.buscarSaidaPorPeriodo(dataInicio, dataFim);
  }

  async alterarSaida(idSaida: number, novaSaida: SaidaDto): Promise<Saida> {
    const saidaDados = await this.saidaRepository.buscarSaidaPorId(idSaida);

    if (!saidaDados) {
      throw new NotFoundException('Nenhuma entrada encontrada para o ID informado');
    }
    if (novaSaida.valor === 0 || isNaN(novaSaida.valor)) {
      throw new BadRequestException('Valor inválido');
    }

    saidaDados.forma_pagamento = novaSaida.forma_pagamento;
    saidaDados.valor = novaSaida.valor;
    saidaDados.data_operacao = novaSaida.data_operacao;

    return await this.saidaRepository.salvarSaida(saidaDados);
  }

  async deletarSaidaPorId(idEntrada: number): Promise<RespostaDeleteFinanceiro> {
    const entradaEncontrada = await this.entradaRepository.buscarEntradaPorId(idEntrada);
    if (!entradaEncontrada) {
      throw new NotFoundException('Entrada não encontrada');
    }
    return await this.entradaRepository.deletarEntradaPorId(idEntrada);
  }

  async getTotalSaida(): Promise<number> {
    return await this.saidaRepository.getTotalSaida();
  }
}
