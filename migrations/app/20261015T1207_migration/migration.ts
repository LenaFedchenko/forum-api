#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/8364b089f0489cff89be715a38eafe31f2769dc7036ce1072853b0c30b78f871/contract';
import startContract from '../../snapshots/8364b089f0489cff89be715a38eafe31f2769dc7036ce1072853b0c30b78f871/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/c4aebf0385c2a06c843dfcc5ade57348f94919d9edb1a7d7431ab93db9b81990/contract';
import endContract from '../../snapshots/c4aebf0385c2a06c843dfcc5ade57348f94919d9edb1a7d7431ab93db9b81990/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  col,
  placeholder,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropColumn({ schema: 'public', table: 'Post', column: 'category' }),
      this.createTable({
        schema: 'public',
        table: 'Category',
        columns: [
          col('description', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addColumn({
        schema: 'public',
        table: 'Post',
        column: col('categoryId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
      }),
      this.dataTransform(endContract, 'backfill-Post-categoryId', {
        check: () => placeholder('backfill-Post-categoryId:check'),
        run: () => placeholder('backfill-Post-categoryId:run'),
      }),
      this.setNotNull({ schema: 'public', table: 'Post', column: 'categoryId' }),
      this.addUnique({
        schema: 'public',
        table: 'Category',
        constraint: 'Category_name_key',
        columns: ['name'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Post',
        index: 'Post_categoryId_idx_15c304f2',
        columns: ['categoryId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Post',
        foreignKey: {
          name: 'Post_categoryId_fkey',
          columns: ['categoryId'],
          references: { schema: 'public', table: 'Category', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
