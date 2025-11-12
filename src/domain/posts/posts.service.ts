import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import PrismaService from 'src/infra/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);

  constructor(private readonly database: PrismaService) {}

  public async create(authorId: number, dto: CreatePostDto) {
    const post = await this.database.posts.create({
      data: {
        title: dto.title,
        description: dto.description,
        coverUrl: dto.coverUrl ?? null,
        hashtags: dto.hashtags ?? [],
        authoId: authorId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        coverUrl: true,
        hashtags: true,
        totaLikes: true,
        createdAt: true,
        updatedAt: true,
        authoId: true,
      },
    });

    return {
      success: true,
      message: 'Post criado com sucesso',
      post,
    };
  }
  public async list(page = 1, limit = 10) {
    if (page < 1 || limit < 1)
      throw new BadRequestException('Página ou limite inválido');

    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      this.database.posts.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          description: true,
          coverUrl: true,
          hashtags: true,
          totaLikes: true,
          createdAt: true,
          updatedAt: true,
          authoId: true,
        },
      }),
      this.database.posts.count(),
    ]);

    return {
      success: true,
      data: posts,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }
  public async findOne(postId: number) {
    const post = await this.database.posts.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
        Likes: {
          select: {
            id: true,
            authoId: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!post) throw new NotFoundException('Post não encontrado');

    return {
      success: true,
      post,
    };
  }
  public async update(postId: number, userId: number, dto: UpdatePostDto) {
    const post = await this.database.posts.findUnique({
      where: { id: postId },
    });
    if (!post) throw new NotFoundException('Post não encontrado');

    if (post.authoId !== userId) {
      throw new ForbiddenException('Apenas o autor do post pode atualizá-lo');
    }

    const updated = await this.database.posts.update({
      where: { id: postId },
      data: {
        title: dto.title ?? undefined,
        description: dto.description ?? undefined,
        coverUrl: dto.coverUrl === undefined ? undefined : dto.coverUrl,
        hashtags: dto.hashtags ?? undefined,
      },
      select: {
        id: true,
        title: true,
        description: true,
        coverUrl: true,
        hashtags: true,
        totaLikes: true,
        updatedAt: true,
      },
    });

    return {
      success: true,
      message: 'Post atualizado com sucesso',
      post: updated,
    };
  }
  public async remove(postId: number, userId: number) {
    const post = await this.database.posts.findUnique({
      where: { id: postId },
    });
    if (!post) throw new NotFoundException('Post não encontrado');

    if (post.authoId !== userId) {
      throw new ForbiddenException('Apenas o autor do post pode deletá-lo');
    }

    await this.database.posts.delete({ where: { id: postId } });

    return {
      success: true,
      message: 'Post deletado com sucesso',
    };
  }
  public async like(postId: number, userId: number) {
    const post = await this.database.posts.findUnique({
      where: { id: postId },
    });
    if (!post) throw new NotFoundException('Post não encontrado');

    const existing = await this.database.likes.findFirst({
      where: {
        postId,
        authoId: userId,
      },
    });

    if (existing) throw new ConflictException('Você já deu like neste post');

    await this.database.$transaction([
      this.database.likes.create({
        data: {
          postId,
          authoId: userId,
        },
      }),
      this.database.posts.update({
        where: { id: postId },
        data: {
          totaLikes: { increment: 1 },
        },
      }),
    ]);

    return {
      success: true,
      message: 'Like adicionado com sucesso',
    };
  }
  public async unlike(postId: number, userId: number) {
    const post = await this.database.posts.findUnique({
      where: { id: postId },
    });
    if (!post) throw new NotFoundException('Post não encontrado');

    const existing = await this.database.likes.findFirst({
      where: {
        postId,
        authoId: userId,
      },
    });

    if (!existing) throw new NotFoundException('Like não encontrado');

    await this.database.$transaction([
      this.database.likes.delete({ where: { id: existing.id } }),
      this.database.posts.update({
        where: { id: postId },
        data: {
          totaLikes: { decrement: 1 },
        },
      }),
    ]);

    return {
      success: true,
      message: 'Like removido com sucesso',
    };
  }
}
