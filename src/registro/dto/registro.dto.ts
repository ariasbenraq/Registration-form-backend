import { IsNotEmpty, IsString } from 'class-validator';

export class RegistroDto {
  @IsString()
  @IsNotEmpty()
  sede: string;

  @IsString()
  @IsNotEmpty()
  proyecto: string;

  @IsString()
  @IsNotEmpty()
  puerto: string;

  @IsString()
  @IsNotEmpty()
  etiqueta: string;
}
