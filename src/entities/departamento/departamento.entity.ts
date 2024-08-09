import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Departamento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nome: string;

  @Column({ nullable: false })
  descricao: string;

  @Column('jsonb', { nullable: false })
  membros: {
    id: number;
    nome: string;
  }[];

  @Column('jsonb', { nullable: false })
  cargos: {
    titulo: string;
    descricao: string;
  }[];
}
