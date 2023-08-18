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
        var b = Buffer.from("helloo world", "ascii");
        var bs = new BitString(b, 0, b.length);

        const snikeBits = beginCell()
        .storeBits(bs)
        .endCell();
        const value = task3.getFindSubstring(3214n, 3333n, snikeBits);
        expect(value);
    });
});
