import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty()
  @IsNumber()
  @Min(1)
  page: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Min(1)
  step: number;
}