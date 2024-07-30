import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Saida {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  recebedor: string;

  @Column({ nullable: false })
  descricao: string;

  @Column({ nullable: false })
  forma_pagamento: string;

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
