import { Injectable, ConflictException } from '@nestjs/common';
import axios from 'axios';

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwNDTdtQ4BCzDFACIhTyqMU7yCat1R2FilS7DpzpqdsY_a9Jd1tvcxHtP82cQ2jjfJzkA/exec';

@Injectable()
export class SheetsService {
    // 🔥 Normalización básica
    private normalizarTexto(texto: string): string {
        return texto
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')          // Elimina tildes
            .replace(/[^a-zA-Z0-9]/g, '')             // Elimina espacios y caracteres especiales
            .toLowerCase();                          // Todo a minúsculas
    }

    // 🟢 Coincidencia parcial (bidireccional)
    private contieneCoincidencia(lista: string[], valor: string): boolean {
        const normalizadoValor = this.normalizarTexto(valor);
        return lista.some(item => {
            const normalizadoItem = this.normalizarTexto(item);
            return (
                normalizadoItem.includes(normalizadoValor) ||
                normalizadoValor.includes(normalizadoItem)
            );
        });
    }

    // ✅ Obtener las sedes
    async getSedes(): Promise<string[]> {
        const res = await axios.get(`${SCRIPT_URL}?tipo=sedes`);
        return res.data;
    }

    // ✅ Obtener los proyectos
    async getProyectos(): Promise<string[]> {
        const res = await axios.get(`${SCRIPT_URL}?tipo=proyectos`);
        return res.data;
    }

    // 🟢 Valida y registra Sede si no existe (con coincidencia parcial)
    async addSede(sede: string): Promise<void> {
        const sedes = await this.getSedes();
        const existe = this.contieneCoincidencia(sedes, sede);

        if (existe) {
            console.log(`❌ La sede "${sede}" ya coincide con una existente.`);
            throw new ConflictException(`La sede "${sede}" ya existe o es muy similar a una registrada.`);
        }

        await axios.post(SCRIPT_URL, {
            tipo: 'sede',
            valor: sede,
        });
    }

    // 🟢 Valida y registra Proyecto si no existe (con coincidencia parcial)
    async addProyecto(proyecto: string): Promise<void> {
        const proyectos = await this.getProyectos();
        const existe = this.contieneCoincidencia(proyectos, proyecto);

        if (!existe) {
            console.log(`Registrando nuevo proyecto: "${proyecto}"`);
            await axios.post(SCRIPT_URL, {
                tipo: 'proyecto',
                valor: proyecto,
            });
        } else {
            console.log(`❌ El proyecto "${proyecto}" ya coincide con uno existente.`);
        }
    }

    // ✅ Registro de datos del formulario
    async registrarDatos(data: {
        sede: string;
        proyecto: string;
        puerto: string;
        etiqueta: string;
        fecha?: string;
    }): Promise<void> {
        const fecha = data.fecha || new Date().toISOString().split('T')[0];

        await axios.post(SCRIPT_URL, {
            tipo: 'registro',
            datos: {
                fecha,
                sede: data.sede,
                proyecto: data.proyecto,
                puerto: data.puerto,
                etiqueta: data.etiqueta
            }
        });
    }
}
