import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ example: 'Meu Primeiro Post', description: 'Título do post' })
  @IsNotEmpty({ message: 'O título é obrigatório.' })
  title: string;

  @ApiProperty({
    example: 'Descrição do post',
    description: 'Conteúdo do post',
  })
  @IsNotEmpty({ message: 'A descrição é obrigatória.' })
  description: string;

  @ApiProperty({
    example: 'https://site.com/cover.jpg',
    description: 'URL da imagem de capa',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'A URL da capa deve ser uma string.' })
  coverUrl?: string;

  @ApiProperty({
    example: ['#nestjs', '#prisma'],
    description: 'Hashtags do post',
    type: [String],
  })
  @IsArray({ message: 'As hashtags devem ser um array de strings.' })
  hashtags: string[];
}


