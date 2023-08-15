import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, beginCell, toNano } from 'ton-core';
import { Task1 } from '../wrappers/Task1';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('Task1', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Task1');
    });

    let blockchain: Blockchain;
    let task1: SandboxContract<Task1>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        task1 = blockchain.openContract(Task1.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await task1.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: task1.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and task1 are ready to use
    });
    it('should find', async () => {
        const value = await task1.getFindBranchByhash(beginCell()
            .storeUint(1,16)
            .storeRef(
                beginCell()
                    .storeCoins(123121)
                    .endCell()
            )
            .storeRef(
                beginCell()
                    .storeUint(1332, 32)
                    .storeRef(
                        beginCell()
                            .storeUint(13732, 32)
                            .storeRef(
                                beginCell()
                                    .storeUint(2131, 32)
                                    .endCell()
                            )
                            .endCell()
                    )
                    .endCell()
            )
            .storeRef(
                beginCell()
                    .storeUint(3732, 32)
                    .storeRef(
                        beginCell()
                            .storeUint(21431, 32)
                            .endCell()
                    )
                    .storeRef(
                        beginCell()
                            .storeUint(51431, 32)
                            .endCell()
                    )
                    .endCell()
            )
            .endCell(),
        BigInt(56932862165862476006670015050345591352206840495017288970053452049257516339857n))
        expect(value);//.toEqual(8814198675083173345382871683249497073254100634947804748757017447454730100585n);
    });
});
