import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ConjugeDto } from './conjuge.dto';
import { FilhoDto } from './filho.dto';
import { IsEnum } from 'class-validator';
import situacao from 'src/model/enum/situação.enum';
import estadoCivil from 'src/model/enum/estado-civil.enum';

export class MembroDto {
  id: number;

  @ApiProperty()
  readonly nome: string;

  @ApiProperty()
  @IsEnum(situacao)
  readonly situacao: number;

  @ApiProperty()
  readonly email: string;

  @ApiProperty({ type: 'bigint' })
  readonly telefone: string;

  @ApiPropertyOptional()
  readonly endereco: {
    rua: string;
    bairro: string;
    cidade: string;
    estado: string;
    país: string;
  };

  @ApiProperty()
  readonly data_nascimento: string;

  @ApiProperty()
  readonly departamento: {
    titulo: string;
  }[];

  @ApiProperty()
  readonly cargo: {
    titulo: string;
    departamento: string;
  }[];

  @ApiProperty()
  @IsEnum(estadoCivil)
  readonly estado_civil: number;

  @ApiProperty()
  readonly conjuge: ConjugeDto;

  @ApiProperty()
  readonly data_casamento: string;

  @ApiProperty({ type: [Object] })
  readonly filhos: FilhoDto[];
}
