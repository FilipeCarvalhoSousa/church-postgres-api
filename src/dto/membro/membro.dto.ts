import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FilhoDto } from './filho.dto';
import { IsEnum } from 'class-validator';
import situacao from 'src/model/enum/situação.enum';
import estadoCivil from 'src/model/enum/estado-civil.enum';
import sexo from 'src/model/enum/sexo.enum';

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

  @ApiProperty()
  @IsEnum(sexo)
  readonly sexo: number;

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
    id: number;
    nome: string;
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
  readonly conjugeId: number;

  @ApiProperty()
  readonly data_casamento: string;

  @ApiProperty({ type: [Object] })
  readonly filhos: FilhoDto[];
}
