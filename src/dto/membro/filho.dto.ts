import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilhoDto {
  @ApiPropertyOptional()
  readonly nome: string;

  @ApiPropertyOptional()
  readonly telefone: string;

  @ApiPropertyOptional()
  readonly email: string;
}
