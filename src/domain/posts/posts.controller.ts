import {
  Controller,
  Post as HttpPost,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CurrentUser } from '../../core/decorators/CurrentUser';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Posts')
@ApiBearerAuth()
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  @HttpPost()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar um novo post' })
  @ApiResponse({ status: 201, description: 'Post criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiBody({ type: CreatePostDto })
  create(@CurrentUser() userId: number, @Body() dto: CreatePostDto) {
    return this.postsService.create(userId, dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar posts com paginação' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
  })
  list(@Query('page') page: string, @Query('limit') limit: string) {
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;
    return this.postsService.list(pageNumber, limitNumber);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Buscar detalhes de um post (inclui likes)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Detalhes retornados com sucesso' })
  @ApiResponse({ status: 404, description: 'Post não encontrado' })
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Atualizar um post (somente o dono)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdatePostDto })
  @ApiResponse({ status: 200, description: 'Post atualizado' })
  @ApiResponse({ status: 403, description: 'Não autorizado' })
  update(
    @Param('id') id: string,
    @CurrentUser() userId: number,
    @Body() dto: UpdatePostDto,
  ) {
    return this.postsService.update(+id, userId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Deletar um post (somente o dono)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Post deletado' })
  @ApiResponse({ status: 403, description: 'Não autorizado' })
  remove(@Param('id') id: string, @CurrentUser() userId: number) {
    return this.postsService.remove(+id, userId);
  }

  @HttpPost(':id/like')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Dar like no post' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Like registrado' })
  like(@Param('id') id: string, @CurrentUser() userId: number) {
    return this.postsService.like(+id, userId);
  }
  @Delete(':id/like')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remover like do post' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Like removido' })
  unlike(@Param('id') id: string, @CurrentUser() userId: number) {
    return this.postsService.unlike(+id, userId);
  }
}
