import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EntradaDto } from './../../dto/entrada/entrada.dto';
import { Entrada } from './../../entities/entrada/entrada.entity';
import { EntradaService } from './../../service/entrada/entrada.service';

@ApiTags('Entrada')
@Controller('entrada')
export class EntradaController {
  constructor(private readonly entradaService: EntradaService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas as entradas' })
  @ApiResponse({ status: 200, description: 'Lista de entradas retornada com sucesso.' })
  async buscarTodasEntrada(): Promise<Entrada[]> {
    console.log('oi');

    return await this.entradaService.buscarTodasEntrada();
  }

  @Post()
  @ApiOperation({ summary: 'Inclusão de nova entrada' })
  @ApiResponse({ status: 201, description: 'Inclusão realizada com sucesso' })
  @ApiResponse({ status: 400, description: 'Requisição inválida' })
  @ApiResponse({
    status: 422,
    description: 'Os dados informados estão inválidos',
  })
  async incluirEntrada(@Body() novaEntrada: EntradaDto): Promise<Entrada> {
    return await this.entradaService.incluirEntrada(novaEntrada);
  }
}
