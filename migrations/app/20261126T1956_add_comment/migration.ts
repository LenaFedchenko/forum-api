#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/5f107d06dbcdb8e8b246e675deb70dbcaa3064e8d01af8495d8efd1fc29e9bfd/contract';
import startContract from '../../snapshots/5f107d06dbcdb8e8b246e675deb70dbcaa3064e8d01af8495d8efd1fc29e9bfd/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/cde6ac6dafc68d7032b9a6000b13f17b625db634d2a12103b0bffe3fb9d1bf06/contract';
import endContract from '../../snapshots/cde6ac6dafc68d7032b9a6000b13f17b625db634d2a12103b0bffe3fb9d1bf06/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'Comment',
        columns: [
          col('authorId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('content', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('postId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Comment',
        index: 'Comment_authorId_idx_e47547ed',
        columns: ['authorId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Comment',
        index: 'Comment_postId_idx_a7a72715',
        columns: ['postId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Comment',
        foreignKey: {
          name: 'Comment_postId_fkey',
          columns: ['postId'],
          references: { schema: 'public', table: 'Post', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Comment',
        foreignKey: {
          name: 'Comment_authorId_fkey',
          columns: ['authorId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
