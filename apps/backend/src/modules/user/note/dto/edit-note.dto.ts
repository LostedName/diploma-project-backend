import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EditNoteDto {
  @ApiProperty({
    example: 'My new casual note',
    description: 'New note title',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title: string;

  @ApiProperty({
    example: "Feed the cat, don't forget *(updated)",
    description: 'New note content',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  content: string;
}
