import { ApiPropertyOptional } from '@nestjs/swagger';

export class SaidaDto {
  id: number;

  @ApiPropertyOptional()
  readonly membro: {
    id: number;
    nome: string;
  };

  @ApiPropertyOptional()
  readonly tipo: string;

  @ApiPropertyOptional()
  readonly forma: string;

  @ApiPropertyOptional()
  readonly valor: number;

  @ApiPropertyOptional()
  readonly data_operacao: {
    dia: number;
    mes: number;
    ano: number;
  };

  @ApiPropertyOptional()
  readonly data: Date;
}
