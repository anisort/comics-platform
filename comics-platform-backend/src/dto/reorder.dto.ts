import { IsArray } from 'class-validator';

export class ReorderDto {
  @IsArray()
  idsInOrder: number[];
}
