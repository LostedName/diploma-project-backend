import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateNoteDto {
  @ApiProperty({
    example: 'My casual note',
    description: 'Note title',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: "Feed the cat, don't forget",
    description: 'Note content',
    type: String,
  })
  @IsOptional()
  @IsString()
  content: string;
}
