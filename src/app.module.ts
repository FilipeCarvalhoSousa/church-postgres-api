import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { MembroModule } from './modules/membro.module';
import { EntradaModule } from './modules/entrada.module';

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
    EntradaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
