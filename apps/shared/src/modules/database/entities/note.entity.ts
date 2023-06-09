import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, DeleteDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { AppEntity } from './app.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'notes', schema: 'public' })
export class NoteEntity extends AppEntity {
  @ApiProperty({
    example: 654,
    description: 'Note unique identifier',
    required: true,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'Note title',
    description: 'Note title',
    required: true,
  })
  @Column()
  title: string;

  @ApiProperty({
    example: 'Note content',
    description: 'Note content',
    required: true,
  })
  @Column({ default: '' })
  content: string;

  @ApiProperty({
    example: null,
    description: 'Note deletion date',
    required: true,
  })
  @DeleteDateColumn()
  deleted_at: Date;

  @ManyToOne(() => UserEntity, (user) => user.notes, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: UserEntity;
}
