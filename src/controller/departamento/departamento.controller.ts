import { Departamento } from 'src/entities/departamento/departamento.entity';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DepartamentoService } from 'src/service/departamento/departamento.service';
import { DepartamentoDto } from 'src/dto/departamento/departamento.dto';
import { RespostaDeleteDepartamento } from 'src/interface/resposta-delete-departamento.interface';
import { isNumber } from 'class-validator';
import { CargoDto } from 'src/dto/departamento/cargo.dto';

@ApiTags('Departamento')
@Controller('departamento')
export class DepartamentoController {
  constructor(private readonly departamentoService: DepartamentoService) {}

  @Get()
  @ApiOperation({ summary: 'Listar os departamentos cadastrados' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async buscarTodosDepartamentos(): Promise<Departamento[]> {
    return await this.departamentoService.buscarTodosDepartamentos();
  }

  @Get(':idDepartamento')
  @ApiOperation({ summary: 'Busca departamento pelo Id' })
  @ApiParam({
    name: 'idMembro',
    type: 'number',
    description: 'número inteiro',
    example: '1',
  })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Requisição inválida' })
  @ApiResponse({
    status: 404,
    description: 'Departamento não encontrado para o ID informado',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async buscarDepartamentoPorId(
    @Param('idDepartamento') idDepartamento: number,
  ): Promise<Departamento> {
    return await this.departamentoService.buscarDepartamentoPorId(idDepartamento);
  }

  @Get('cargo/:idDepartamento')
  @ApiOperation({ summary: 'Busca departamento pelo Id' })
  @ApiParam({
    name: 'idMembro',
    type: 'number',
    description: 'número inteiro',
    example: '1',
  })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Requisição inválida' })
  @ApiResponse({
    status: 404,
    description: 'Departamento não encontrado para o ID informado',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async buscarCargosDoDepartamento(
    @Param('idDepartamento') idDepartamento: number,
  ): Promise<CargoDto[]> {
    return await this.departamentoService.buscarCargosDoDepartamento(idDepartamento);
  }

  @Post()
  @ApiOperation({ summary: 'Inclusão de novo departamento' })
  @ApiResponse({ status: 201, description: 'Inclusão realizada com sucesso' })
  @ApiResponse({ status: 400, description: 'Requisição inválida' })
  @ApiResponse({
    status: 422,
    description: 'Os dados informados estão inválidos',
  })
  async incluirDepartamento(@Body() departamento: DepartamentoDto): Promise<Departamento> {
    return await this.departamentoService.incluirDepartamento(departamento);
  }

  @Put(':idDepartamento')
  @ApiOperation({ summary: 'Alteração de departamento' })
  @ApiResponse({ status: 201, description: 'Alteração realizada com sucesso' })
  @ApiResponse({ status: 400, description: 'Requisição inválida' })
  @ApiResponse({
    status: 422,
    description: 'Os dados informados estão inválidos',
  })
  async atualizarDepartamento(
    @Param('idDepartamento') idDepartamento: number,
    @Body() departamento: DepartamentoDto,
  ): Promise<Departamento> {
    return await this.departamentoService.atualizarDepartamento(idDepartamento, departamento);
  }

  @Delete(':idDepartamento')
  async deletarDepartamento(
    @Param('idDepartamento') idDepartamento: number,
  ): Promise<RespostaDeleteDepartamento> {
    if (isNumber(idDepartamento)) {
      throw new BadRequestException('Id do departamento precisa ser um número');
    }
    return await this.departamentoService.deletarDepartamento(idDepartamento);
  }
}
