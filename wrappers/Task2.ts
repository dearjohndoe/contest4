import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode, TupleItemInt } from 'ton-core';
import { Tuple, TupleItem, TupleItemSlice } from 'ton-core/dist/tuple/tuple';

export type Task2Config = {};

export function task2ConfigToCell(config: Task2Config): Cell {
    return beginCell().endCell();
}

export class Task2 implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Task2(address);
    }

    static createFromConfig(config: Task2Config, code: Cell, workchain = 0) {
        const data = task2ConfigToCell(config);
        const init = { code, data };
        return new Task2(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async getMatrixMultiplier(provider: ContractProvider, a: TupleItem[], b: TupleItem[]) {
        const ta: Tuple = {
            type: 'tuple',
            items: a,
        };
        const tb: Tuple = {
            type: 'tuple',
            items: b,
        };

        const { stack } = await provider.get("matrix_multiplier", [ta, tb]);
        return stack.readCell();
    }
}
