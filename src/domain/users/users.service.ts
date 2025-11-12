import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import PrismaService from 'src/infra/prisma/prisma.service';
import BcryptService from 'src/infra/bcrypt/bcrypt.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  private readonly jwtService = new JwtService({
    secret: process.env.JWT_SECRET,
  });
  constructor(
    private readonly database: PrismaService,
    private readonly bcrypt: BcryptService,
  ) {}

  public async create(data: CreateUserDto) {
    console.log(data);
    const existingUser = await this.database.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException('Este email já foi usado');
    }

    const hashedPassword = await this.bcrypt.hash(data.password);

    const newUser = await this.database.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      success: true,
      message: 'Usuário criado com sucesso',
      user: newUser,
    };
  }

  public async login(email: string, password: string) {
    const user = await this.database.user.findUnique({
      where: { email },
    });

    if (!user) throw new NotFoundException('Usuário não encontrado');

    const isPasswordValid = await this.bcrypt.verify(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Senha incorreta');

    const accessToken = this.jwtService.sign({ sub: user.id });
    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      { expiresIn: '7d' },
    );

    return {
      success: true,
      message: 'Login realizado com sucesso',
      accessToken,
      refreshToken,
    };
  }

  public async update(id: number, data: UpdateUserDto) {
    const user = await this.database.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    if (data.password) data.password = await this.bcrypt.hash(data.password);

    const updatedUser = await this.database.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        updatedAt: true,
      },
    });

    return {
      success: true,
      message: 'Usuário atualizado com sucesso',
      user: updatedUser,
    };
  }

  public async deleteMyAccount(id: number) {
    const user = await this.database.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    await this.database.user.delete({ where: { id } });

    return {
      success: true,
      message: 'Conta deletada com sucesso',
    };
  }

  public async refreshToken(oldRefreshToken: string) {
    try {
      const payload = this.jwtService.verify(oldRefreshToken);
      const user = await this.database.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) throw new NotFoundException('Usuário não encontrado');

      const newAccessToken = this.jwtService.sign({ sub: user.id });
      const newRefreshToken = this.jwtService.sign(
        { sub: user.id },
        { expiresIn: '7d' },
      );

      return {
        success: true,
        message: 'Token renovado com sucesso',
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch {
      throw new UnauthorizedException('Refresh token inválido');
    }
  }

  public async list(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.database.user.findMany({
        skip,
        take: limit,
        omit: {
          password: true,
        },
        include: {
          _count: {
            select: {
              Likes: true,
              Posts: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.database.user.count(),
    ]);

    return {
      success: true,
      data: users,
      pagination: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  public async findOne(id: number) {
    const user = await this.database.user.findFirst({
      where: { id },
      omit: {
        password: true,
      },
      include: {
        Posts: {
          include: {
            Likes: true,
          },
        },
      },
    });

    if (!user) throw new NotFoundException('Usuário não encontrado');

    return { success: true, user };
  }

  public async findMe(id: number) {
    return this.findOne(id);
  }
}
