import { ApiProperty } from '@nestjs/swagger';

export class CargoDto {
  @ApiProperty()
  readonly titulo: string;

  @ApiProperty()
  readonly descricao: string;
}
