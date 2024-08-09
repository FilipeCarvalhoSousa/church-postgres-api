import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MembroDepartamentoDto } from './membros.dto';
import { CargoDto } from './cargo.dto';

export class DepartamentoDto {
  id: number;

  @ApiProperty()
  readonly nome: string;

  @ApiProperty()
  readonly descricao: string;

  readonly membros: MembroDepartamentoDto[];

  @ApiPropertyOptional()
  readonly cargos: CargoDto[];
}
