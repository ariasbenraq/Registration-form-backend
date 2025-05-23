import { Injectable, ConflictException } from '@nestjs/common';
import axios from 'axios';
// import { randomUUID } from 'crypto';

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzUywQQ8uN51aCmiLvPw3GsMFBwPP-ppPGa0oQXXBjDmIiOAbeWt4fzCaMyVjsJ7pNjrQ/exec';

@Injectable()
export class SheetsService {
    // Normalizador
    private normalizarTexto(texto: string): string {
        return texto
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-zA-Z0-9]/g, '')
            .toLowerCase();
    }

    // Distancia de Levenshtein
    private distanciaLevenshtein(a: string, b: string): number {
        const matrix = Array.from({ length: b.length + 1 }, (_, i) =>
            Array.from({ length: a.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
        );

        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                const costo = b[i - 1] === a[j - 1] ? 0 : 1;
                matrix[i][j] = Math.min(
                    matrix[i - 1][j] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j - 1] + costo
                );
            }
        }
        return matrix[b.length][a.length];
    }

    // 💡 Nueva validación de coincidencia
    private contieneCoincidencia(lista: string[], valor: string, tolerancia = 2): boolean {
        const normalizadoValor = this.normalizarTexto(valor);
        return lista.some(item => {
            const normalizadoItem = this.normalizarTexto(item);
            const distancia = this.distanciaLevenshtein(normalizadoItem, normalizadoValor);
            const maxLength = Math.max(normalizadoItem.length, normalizadoValor.length);

            // Ajusta tolerancia si la palabra es muy corta:
            const ajusteTolerancia = maxLength < 6 ? 1 : tolerancia;

            return distancia <= ajusteTolerancia;
        });
    }

    async getRegistros(): Promise<any[]> {
        const res = await axios.get(`${SCRIPT_URL}?tipo=registros`);
        return res.data;
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

    async addSede(sede: string, forzar = false): Promise<void> {
        const sedes = await this.getSedes();
        const existe = this.contieneCoincidencia(sedes, sede);

        if (existe && !forzar) {
            console.log(`❌ La sede "${sede}" ya coincide con una existente.`);
            throw new ConflictException(`La sede "${sede}" ya existe o es muy similar a una registrada.`);
        }

        // ✅ Si no existe, o si existe pero el usuario forzó, sí la registra:
        await axios.post(SCRIPT_URL, {
            tipo: 'sede',
            valor: sede,
        });
    }

    // 🟢 Valida y registra Proyecto si no existe (con coincidencia parcial)
    async addProyecto(proyecto: string, forzar = false): Promise<void> {
        const proyectos = await this.getProyectos();
        const existe = this.contieneCoincidencia(proyectos, proyecto);

        if (existe && !forzar) {
            console.log(`❌ El proyecto "${proyecto}" ya coincide con uno existente.`);
            throw new ConflictException(`El proyecto "${proyecto}" ya existe o es muy similar a uno registrado.`);
        }

        console.log(`✅ Registrando proyecto: "${proyecto}"`);
        await axios.post(SCRIPT_URL, {
            tipo: 'proyecto',
            valor: proyecto,
        });
    }

    async obtenerSiguienteId(): Promise<string> {
        const res = await axios.get(`${SCRIPT_URL}?tipo=ultimos-ids`);
        const ids: string[] = res.data;

        const numeros = ids
            .map(id => {
                const match = id.match(/REG-(\d+)/);
                return match ? parseInt(match[1]) : null;
            })
            .filter(n => n !== null) as number[];

        console.log('🧪 IDs recibidos:', ids);
        console.log('🔢 Números extraídos:', numeros);

        const ultimoNumero = numeros.length > 0 ? Math.max(...numeros) : 0;
        const siguienteNumero = ultimoNumero + 1;

        return `REG-${String(siguienteNumero).padStart(5, '0')}`;
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
        const id = await this.obtenerSiguienteId();
        console.log("se envio el id correctamente");
        await axios.post(SCRIPT_URL, {
            tipo: 'registro',
            datos: {
                id,    // 🔵 Nuevo campo
                fecha,
                sede: data.sede,
                proyecto: data.proyecto,
                puerto: data.puerto,
                etiqueta: data.etiqueta,
            }
        });
    }

}
