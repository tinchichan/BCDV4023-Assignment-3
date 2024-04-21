import { ethers } from 'ethers';
import Escrow from './Escrow';

export default async function deploy(signer, broker, beneficiary, value) {
  const factory = new ethers.ContractFactory(
    Escrow.abi,
    Escrow.bytecode,
    signer
  );
  return factory.deploy(broker, beneficiary, { value });
}


