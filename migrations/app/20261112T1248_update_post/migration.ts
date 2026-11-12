#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/129bc046c0df4a8871d8c4c3890bc9a0f833048fcfa44c7ef4b92a45725ef4de/contract';
import endContract from '../../snapshots/129bc046c0df4a8871d8c4c3890bc9a0f833048fcfa44c7ef4b92a45725ef4de/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/2fe28adcfa537e393e3bd7344d731a18c93500021a6614abdd6b057f87e17cbf/contract';
import startContract from '../../snapshots/2fe28adcfa537e393e3bd7344d731a18c93500021a6614abdd6b057f87e17cbf/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
    override readonly startContractJson = startContract;
    override readonly endContractJson = endContract;

    override get operations() {
        return [
            this.dropColumn({
                schema: 'public',
                table: 'Post',
                column: 'category'
            }),
            this.setNotNull({
                schema: 'public',
                table: 'Post',
                column: 'userId'
            })
        ];
    }
}

MigrationCLI.run(import.meta.url, M);
