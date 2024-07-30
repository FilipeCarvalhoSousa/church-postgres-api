import { Membro } from './../entities/membro/membro.entity';

export interface RespostaDeleteMembro {
  qntMembroRemovido: number;
  message: string;
  membros: Membro[];
}
