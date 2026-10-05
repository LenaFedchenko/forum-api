#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/8364b089f0489cff89be715a38eafe31f2769dc7036ce1072853b0c30b78f871/contract';
import endContract from '../../snapshots/8364b089f0489cff89be715a38eafe31f2769dc7036ce1072853b0c30b78f871/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'Post',
        columns: [
          col('author', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('category', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('content', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Post',
        constraint: 'Post_title_key',
        columns: ['title'],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
