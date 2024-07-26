import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Membro {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nome: string;

  @Column()
  situacao: number;

  @Column()
  email: string;

  @Column({ type: 'bigint' })
  telefone: string;

  @Column('jsonb')
  endereco: {
    rua: string;
    bairro: string;
    cidade: string;
    estado: string;
    país: string;
  };

  @Column()
  data_nascimento: string;

  @Column('jsonb')
  departamento: {
    titulo: string;
  }[];

  @Column('jsonb', { nullable: false })
  cargo: {
    titulo: string;
    departamento: string;
  }[];

  @Column()
  estado_civil: number;

  @Column('jsonb', { nullable: false })
  conjuge: {
    id: number;
    nome: string;
    email: string;
    telefone: string;
  };

  @Column()
  data_casamento: string;

  @Column('jsonb')
  filhos: {
    nome: string;
    telefone: string;
    email: string;
  }[];
}
