#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/826be455c03951622a937f0638fa85cdaf03c0f05ccc6dee1475596d5ddcac8e/contract';
import endContract from '../../snapshots/826be455c03951622a937f0638fa85cdaf03c0f05ccc6dee1475596d5ddcac8e/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/c4aebf0385c2a06c843dfcc5ade57348f94919d9edb1a7d7431ab93db9b81990/contract';
import startContract from '../../snapshots/c4aebf0385c2a06c843dfcc5ade57348f94919d9edb1a7d7431ab93db9b81990/contract.json' with { type: 'json' };
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
      this.createTable({
        schema: 'public',
        table: 'User',
        columns: [
          col('email', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('hashPassword', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addColumn({
        schema: 'public',
        table: 'Post',
        column: col('userId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'Post',
        column: col('category', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.dataTransform(endContract, 'backfill-Post-category', {
        check: () => placeholder('backfill-Post-category:check'),
        run: () => placeholder('backfill-Post-category:run'),
      }),
      this.setNotNull({ schema: 'public', table: 'Post', column: 'category' }),
      this.dropNotNull({ schema: 'public', table: 'Post', column: 'categoryId' }),
      this.addUnique({
        schema: 'public',
        table: 'User',
        constraint: 'User_email_key',
        columns: ['email'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Post',
        index: 'Post_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Post',
        foreignKey: {
          name: 'Post_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
