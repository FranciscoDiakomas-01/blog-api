import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdatePostDto {
  @ApiProperty({ example: 'Título atualizado', required: false })
  @IsOptional()
  @IsString({ message: 'O título deve ser uma string.' })
  title?: string;

  @ApiProperty({ example: 'Descrição atualizada', required: false })
  @IsOptional()
  @IsString({ message: 'A descrição deve ser uma string.' })
  description?: string;

  @ApiProperty({ example: 'https://site.com/cover-new.jpg', required: false })
  @IsOptional()
  @IsString({ message: 'A URL da capa deve ser uma string.' })
  coverUrl?: string;

  @ApiProperty({
    example: ['#nestjs', '#typescript'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray({ message: 'As hashtags devem ser um array de strings.' })
  hashtags?: string[];
}
