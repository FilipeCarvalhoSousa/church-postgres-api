import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EntradaDto {
  id: number;

  @ApiPropertyOptional()
  readonly membro: {
    id: number;
    nome: string;
  };

  @ApiProperty()
  readonly descricao: string;

  @ApiPropertyOptional()
  readonly tipo: string;

  @ApiProperty()
  readonly forma_pagamento: string;

  @ApiProperty()
  readonly valor: number;

  @ApiProperty()
  readonly data_operacao: {
    dia: number;
    mes: number;
    ano: number;
  };

  readonly data: Date;
}
