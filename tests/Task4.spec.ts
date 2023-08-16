import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { BitString, Cell, beginCell, toNano } from 'ton-core';
import { Task4 } from '../wrappers/Task4';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('Task4', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Task4');
    });

    let blockchain: Blockchain;
    let task4: SandboxContract<Task4>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        task4 = blockchain.openContract(Task4.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await task4.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: task4.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and task4 are ready to use
    });
    it('should encrypt', async () => {
        const originalString = "hello world"
        const original = beginCell()
            .storeUint(0, 32)
            .storeStringTail(originalString)
            .endCell();
        const encrypted = await task4.getEncrypt(4n, original);
        if (!encrypted) {
            throw new Error('Encryption failed');
        }
        const encryptedString = encrypted.beginParse().loadStringTail();
        const decrypted = await task4.getDecrypt(4n, beginCell()
            .storeUint(0, 32)
            .storeStringTail(encryptedString)
            .endCell());
        expect(decrypted.beginParse().loadStringTail()).toEqual(originalString);
    });
});
