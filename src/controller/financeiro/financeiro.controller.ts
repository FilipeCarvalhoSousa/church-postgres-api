import { RespostaDeleteFinanceiro } from './../../interface/resposta-delete-financeiro.interface';
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EntradaDto } from './../../dto/entrada/entrada.dto';
import { SaidaDto } from './../../dto/saida/saida.dto';
import { Entrada } from './../../entities/entrada/entrada.entity';
import { Saida } from './../../entities/saida/saida.entity';
import { EntradaService } from './../../service/entrada/entrada.service';
import { SaidaService } from './../../service/saida/saida.service';

@ApiTags('Financeiro')
@Controller('financeiro')
export class FinanceiroController {
  constructor(
    private readonly entradaService: EntradaService,
    private readonly saidaService: SaidaService,
  ) {}

  @Get('/entradas')
  @ApiOperation({ summary: 'Listar todas as entradas' })
  @ApiResponse({ status: 200, description: 'Lista de entradas retornada com sucesso.' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async buscarTodasEntrada(): Promise<Entrada[]> {
    return await this.entradaService.buscarTodasEntrada();
  }

  @Get('/saidas')
  @ApiOperation({ summary: 'Listar todas as saidas' })
  @ApiResponse({ status: 200, description: 'Lista de entradas retornada com sucesso.' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async buscarTodasSaidas(): Promise<Saida[]> {
    return await this.saidaService.getTodasSaidas();
  }

  @Post('entrada')
  @ApiOperation({ summary: 'Registrar uma entrada financeira' })
  @ApiResponse({ status: 201, description: 'Entrada registrada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Erro de validação.' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async incluirEntrada(@Body() entradaDto: EntradaDto) {
    return this.entradaService.incluirEntrada(entradaDto);
  }

  @Post('saida')
  @ApiOperation({ summary: 'Registrar uma entrada financeira' })
  @ApiResponse({ status: 201, description: 'Entrada registrada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Erro de validação.' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async registrarSaida(@Body() saidaRegistro: SaidaDto) {
    return this.saidaService.registrarSaida(saidaRegistro);
  }

  @Put('entrada/:idEntrada')
  @ApiOperation({ summary: 'Inclusão de nova entrada' })
  @ApiResponse({ status: 201, description: 'Inclusão realizada com sucesso' })
  @ApiResponse({ status: 400, description: 'Requisição inválida' })
  @ApiResponse({
    status: 422,
    description: 'Os dados informados estão inválidos',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async alterarEntrada(
    @Param('idEntrada') idEntrada: number,
    @Body() novaEntrada: EntradaDto,
  ): Promise<Entrada> {
    return await this.entradaService.alterarEntrada(idEntrada, novaEntrada);
  }

  @Put('saida/:idSaida')
  @ApiOperation({ summary: 'Inclusão de nova entrada' })
  @ApiResponse({ status: 201, description: 'Inclusão realizada com sucesso' })
  @ApiResponse({ status: 400, description: 'Requisição inválida' })
  @ApiResponse({
    status: 422,
    description: 'Os dados informados estão inválidos',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async alterarSaida(
    @Param('idSaida') idSaida: number,
    @Body() novaSaida: SaidaDto,
  ): Promise<Saida> {
    return await this.saidaService.alterarSaida(idSaida, novaSaida);
  }

  @Get('entrada/range-data')
  @ApiOperation({ summary: 'Listar todas as entradas' })
  @ApiResponse({ status: 200, description: 'Lista de entradas retornada com sucesso.' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async buscarEntradaPorPeriodo(
    @Query('dataInicio') dataInicio: string,
    @Query('dataFim') dataFim: string,
  ): Promise<Entrada[]> {
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
    return await this.entradaService.buscarEntradaPorPeriodo(inicio, fim);
  }

  @Get('saida/range-data')
  @ApiOperation({ summary: 'Listar todas as entradas' })
  @ApiResponse({ status: 200, description: 'Lista de entradas retornada com sucesso.' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async buscarSaidaPorPeriodo(
    @Query('dataInicio') dataInicio: string,
    @Query('dataFim') dataFim: string,
  ): Promise<Saida[]> {
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
    return await this.saidaService.buscarSaidaPorPeriodo(inicio, fim);
  }

  @Get('saldo')
  @ApiOperation({ summary: 'Retorna o saldo' })
  @ApiResponse({ status: 200, description: 'Retorna o saldo com sucesso' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async buscarSaldo(): Promise<number> {
    const totalEntrada = await this.entradaService.getTotalEntrada();
    const totalSaida = await this.saidaService.getTotalSaida();
    return totalEntrada - totalSaida;
  }

  @Delete('entrada/:idEntrada')
  @ApiOperation({ summary: 'Deletar entrada pelo Id' })
  @ApiParam({
    name: 'entradaId',
    type: 'number',
    description: 'Deleta uma entrada pelo ID',
    example: '52',
  })
  @ApiResponse({ status: 200, description: 'Exclusão efetuada com sucesso' })
  @ApiResponse({ status: 404, description: 'Entrada não encontrada' })
  async deletarEntradaPorId(
    @Param('idEntrada') idEntrada: number,
  ): Promise<RespostaDeleteFinanceiro> {
    return await this.entradaService.deletarEntradaPorId(idEntrada);
  }

  @Delete('saida/:idSaida')
  @ApiOperation({ summary: 'Deletar saída pelo Id' })
  @ApiParam({
    name: 'idSaida',
    type: 'number',
    description: 'Deleta uma saída pelo ID',
    example: '52',
  })
  @ApiResponse({ status: 200, description: 'Exclusão efetuada com sucesso' })
  @ApiResponse({ status: 404, description: 'Saída não encontrada' })
  async deletarSaidaPorId(@Param('idSaida') idSaida: number): Promise<RespostaDeleteFinanceiro> {
    return await this.saidaService.deletarSaidaPorId(idSaida);
  }
}
