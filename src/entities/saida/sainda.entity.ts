import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Saida {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('jsonb', { nullable: false })
  membro: {
    id: number;
    nome: string;
  };

  @Column({ nullable: false })
  tipo: string;

  @Column({ nullable: false })
  forma: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  valor: number;

  @Column('jsonb')
  data_operacao: {
    dia: number;
    mes: number;
    ano: number;
  };

  @Column()
  data: Date;
}
