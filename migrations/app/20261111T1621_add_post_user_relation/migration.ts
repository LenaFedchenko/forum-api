#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/2fe28adcfa537e393e3bd7344d731a18c93500021a6614abdd6b057f87e17cbf/contract';
import endContract from '../../snapshots/2fe28adcfa537e393e3bd7344d731a18c93500021a6614abdd6b057f87e17cbf/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/826be455c03951622a937f0638fa85cdaf03c0f05ccc6dee1475596d5ddcac8e/contract';
import startContract from '../../snapshots/826be455c03951622a937f0638fa85cdaf03c0f05ccc6dee1475596d5ddcac8e/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [this.dropColumn({ schema: 'public', table: 'Post', column: 'author' })];
  }
}

MigrationCLI.run(import.meta.url, M);
