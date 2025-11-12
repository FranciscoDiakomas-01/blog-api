import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    example: 'Novo Nome',
    description: 'Nome atualizado do usuário',
    required: false,
  })
  @IsString()
  name?: string;

  @ApiProperty({
    example: 'novo@email.com',
    description: 'Email atualizado do usuário',
    required: false,
  })
  @IsEmail({}, { message: 'O email deve ser válido.' })
  email?: string;

  @ApiProperty({
    example: 'novasenha',
    description: 'Senha atualizada do usuário',
    required: false,
  })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  password?: string;
}
