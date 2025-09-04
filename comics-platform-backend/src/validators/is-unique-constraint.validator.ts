import {
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidatorConstraint,
} from 'class-validator';
import { IsUniqueConstraintInput } from './is-unique';
import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ name: 'IsUniqueConstraint', async: true })
@Injectable()
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private readonly entityManager: EntityManager) {}

  async validate(value: any, args?: ValidationArguments): Promise<boolean> {
    const constraint = args?.constraints?.[0] as IsUniqueConstraintInput;
    if (!constraint) return false;

    const { tableName, column } = constraint;

    const typedValue = value as string | number;

    const exists: boolean = await this.entityManager
      .getRepository(tableName)
      .createQueryBuilder(tableName)
      .where({ [column]: typedValue })
      .getExists();

    return !exists;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    const column = (
      validationArguments?.constraints?.[0] as IsUniqueConstraintInput
    )?.column;
    return column
      ? `The value for column '${column}' already exists. Please choose a different value.`
      : 'This value already exists. Please choose a different value.';
  }
}
