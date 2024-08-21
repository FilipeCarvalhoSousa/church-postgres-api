import { ApiPropertyOptional } from '@nestjs/swagger';

export class ConjugeDto {
  @ApiPropertyOptional()
  id: number;

  @ApiPropertyOptional()
  readonly nome: string;
}
