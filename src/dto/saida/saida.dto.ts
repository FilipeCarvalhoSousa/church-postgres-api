import { ApiPropertyOptional } from '@nestjs/swagger';

export class SaidaDto {
  id: number;

  @ApiPropertyOptional()
  readonly recebedor: string;

  @ApiPropertyOptional()
  readonly descricao: string;

  @ApiPropertyOptional()
  readonly forma_pagamento: string;

  @ApiPropertyOptional()
  readonly valor: number;

  @ApiPropertyOptional()
  readonly data_operacao: {
    dia: number;
    mes: number;
    ano: number;
  };

  readonly data: Date;
}
