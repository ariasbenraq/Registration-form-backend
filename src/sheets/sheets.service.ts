import { Injectable } from '@nestjs/common';
import axios from 'axios';

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwNDTdtQ4BCzDFACIhTyqMU7yCat1R2FilS7DpzpqdsY_a9Jd1tvcxHtP82cQ2jjfJzkA/exec';

@Injectable()
export class SheetsService {
    async getSedes(): Promise<string[]> {
        const res = await axios.get(`${SCRIPT_URL}?tipo=sedes`);
        return res.data;
    }

    async getProyectos(): Promise<string[]> {
        const res = await axios.get(`${SCRIPT_URL}?tipo=proyectos`);
        return res.data;
    }

    async addSede(sede: string): Promise<void> {
        await axios.post(SCRIPT_URL, {
            tipo: 'sede',
            valor: sede,
        });
    }

    async addProyecto(proyecto: string): Promise<void> {
        await axios.post(SCRIPT_URL, {
            tipo: 'proyecto',
            valor: proyecto,
        });
    }
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
