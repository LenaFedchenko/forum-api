#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/129bc046c0df4a8871d8c4c3890bc9a0f833048fcfa44c7ef4b92a45725ef4de/contract';
import startContract from '../../snapshots/129bc046c0df4a8871d8c4c3890bc9a0f833048fcfa44c7ef4b92a45725ef4de/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/5f107d06dbcdb8e8b246e675deb70dbcaa3064e8d01af8495d8efd1fc29e9bfd/contract';
import endContract from '../../snapshots/5f107d06dbcdb8e8b246e675deb70dbcaa3064e8d01af8495d8efd1fc29e9bfd/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'RefreshSession',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('expiresAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('tokenHash', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('userId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'RefreshSession',
        constraint: 'RefreshSession_tokenHash_key',
        columns: ['tokenHash'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'RefreshSession',
        index: 'RefreshSession_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'RefreshSession',
        foreignKey: {
          name: 'RefreshSession_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
