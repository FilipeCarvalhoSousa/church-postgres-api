import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Membro } from './../../entities/membro/membro.entity';
import { MembroService } from './../../service/membro/membro.service';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { MembroDto } from './../../dto/membro/membro.dto';
import { RespostaDeleteMembro } from './../../interface/resposta-delete-membro';

@ApiTags('Membros')
@Controller('membros')
export class MembroController {
  constructor(private readonly membroService: MembroService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os membros' })
  @ApiResponse({ status: 200, description: 'Lista de membros retornada com sucesso.' })
  async buscarTodosMembros(): Promise<Membro[]> {
    return await this.membroService.buscarTodosMembros();
  }

  @Get(':idMembro')
  @ApiOperation({ summary: 'Busca membro por Id' })
  @ApiParam({
    name: 'idMembro',
    type: 'number',
    description: 'número inteiro',
    example: '1',
  })
  @ApiResponse({ status: 200, description: 'Busca um membro por Id' })
  @ApiResponse({ status: 400, description: 'Requisição inválida' })
  @ApiResponse({
    status: 404,
    description: 'Membro não encontrado para o ID informado',
  })
  async buscarMembroPorId(@Param('idMembro') idMembro: number): Promise<Membro> {
    return await this.membroService.buscarMembroPorId(idMembro);
  }

  @Post()
  @ApiOperation({ summary: 'Inclusão de novo membro' })
  @ApiResponse({ status: 201, description: 'Inclusão realizada com sucesso' })
  @ApiResponse({ status: 400, description: 'Requisição inválida' })
  @ApiResponse({
    status: 422,
    description: 'Os dados informados estão inválidos',
  })
  async incluirMembro(@Body() novoMembro: MembroDto): Promise<Membro> {
    return await this.membroService.criarMembro(novoMembro);
  }

  @Put(':idMembro')
  @ApiOperation({ summary: 'Alterar um membro' })
  @ApiResponse({ status: 201, description: 'Inclusão realizada com sucesso' })
  @ApiResponse({ status: 400, description: 'Requisição inválida' })
  @ApiResponse({
    status: 422,
    description: 'Os dados informados estão inválidos',
  })
  async alterarMembro(@Param('idMembro') idMembro: number, @Body() dadosMembro: MembroDto): Promise<Membro> {
    return await this.membroService.atualizarMembro(idMembro, dadosMembro);
  }

  @Delete(':membroId')
  @ApiOperation({ summary: 'Deletar membro pelo Id' })
  @ApiParam({
    name: 'membroId',
    type: 'number',
    description: 'Deleta pelo ID do membro',
    example: '52',
  })
  @ApiResponse({ status: 200, description: 'Membro removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Membro não encontrado' })
  async deletarPorId(@Param('membroId') membroId: number): Promise<RespostaDeleteMembro> {
    return await this.membroService.deletarMembroPorId(membroId);
  }

  @Get('/estado-civil/:estadoCivil')
  @ApiOperation({ summary: 'Busca membros de um determinado estado civil' })
  @ApiParam({
    name: 'estadoCivil',
    type: 'number',
    description: 'number',
    example: '1',
  })
  @ApiResponse({ status: 200, description: 'Busca um membro por Id' })
  @ApiResponse({ status: 400, description: 'Requisição inválida' })
  @ApiResponse({
    status: 404,
    description: 'Nenhum membro encontrado para o estado civil encontrado',
  })
  async buscarMembrosPeloEstadoCivil(@Param('estadoCivil') estadoCivil: number): Promise<Membro[]> {
    return await this.membroService.buscarMembrosPeloEstadoCivil(estadoCivil);
  }

  @Get('/situacao/:situacao')
  @ApiOperation({ summary: 'Busca membros pela situacao - ativo, inativo, congregado' })
  @ApiParam({
    name: 'situacao',
    type: 'number',
    description: 'number',
    example: '1',
  })
  @ApiResponse({ status: 200, description: 'Busca um membro pela situacao' })
  @ApiResponse({ status: 400, description: 'Requisição inválida' })
  @ApiResponse({
    status: 404,
    description: 'Nenhum membro encontrado para esta situação',
  })
  async buscarPorSituacao(@Param('situacao') situacao: number): Promise<Membro[]> {
    return await this.membroService.buscarPorSituacao(situacao);
  }
}
