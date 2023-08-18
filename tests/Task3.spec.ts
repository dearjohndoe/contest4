import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { BitString, Cell, beginCell, toNano } from 'ton-core';
import { Task3 } from '../wrappers/Task3';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('Task3', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Task3');
    });

    let blockchain: Blockchain;
    let task3: SandboxContract<Task3>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        task3 = blockchain.openContract(Task3.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await task3.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: task3.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and task3 are ready to use
    });
    it('should find', async () => {
        const snikeBits = beginCell()
            .storeUint(1n, 250)
            .storeUint(1n, 250)
            .storeUint(1n, 250)
            .storeUint(1n, 250)
            .storeUint(1n, 23)
            .storeRef(
                beginCell()
                .storeUint(1n, 250)
                .storeUint(1n, 250)
            )
            .endCell();
        const expected = beginCell()
            .storeUint(2n, 250)
            .storeUint(2n, 250)
            .storeUint(2n, 250)
            .storeUint(2n, 250)
            .storeUint(2n, 23)
            .storeRef(
                beginCell()
                .storeUint(2n, 250)
                .storeUint(2n, 250)
            )
            .endCell();
        const value = await task3.getFindSubstring(1024n, 1023n, snikeBits);
        console.log("got:");
        console.log(printCellBinary(value, 0));
        console.log("expected:");
        console.log(printCellBinary(expected, 0));
    });
});

function printCellBinary(cell: Cell, level: number): string {
    var sc = cell.beginParse();

    var output = `cell: ${level}\n`;
    while (sc.remainingBits > 0) {
        const bits = sc.loadUint(1);
        output += bits.toString(2);
    }
    output += "\n";

    if (sc.remainingRefs) {
        const ref = sc.loadRef();
        output += printCellBinary(ref, level + 1);
    }

    return output;
}
