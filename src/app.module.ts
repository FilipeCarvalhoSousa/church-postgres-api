import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { FinanceiroModule } from './modules/financeiro.module';
import { MembroModule } from './modules/membro.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'church',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Use isso apenas em desenvolvimento
    }),
    MembroModule,
    FinanceiroModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
