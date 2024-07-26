import { EntradaDto } from './../../dto/entrada/entrada.dto';
import { Entrada } from './../../entities/entrada/entrada.entity';
import { EntradaRepository } from './../../repository/entrada/entrada.repository';

export class EntradaService {
  constructor(private readonly entradaRepository: EntradaRepository) {}

  async buscarTodasEntrada(): Promise<Entrada[]> {
    return this.entradaRepository.find();
    // return this.entradaRepository.buscarTodasEntrada();
  }

  async incluirEntrada(novaEntrada: EntradaDto): Promise<Entrada> {
    console.log('novaEntrada', novaEntrada);

    return await this.entradaRepository.incluirEntrada(novaEntrada);
  }
}
