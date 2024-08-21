export class MembroResponseDto {
  id: number;
  nome: string;
  sexo: number;
  data_nascimento: string;
  departamento: {
    id: number;
    nome: string;
  }[];
  cargo: {
    titulo: string;
    departamento: string;
  }[];
  estado_civil: number;
  conjugeId: number; // ID do cônjuge para evitar circularidade
  conjugeNome: string;
  data_casamento: string;
  filhos: {
    nome: string;
    telefone: string;
    email: string;
  }[];
}
