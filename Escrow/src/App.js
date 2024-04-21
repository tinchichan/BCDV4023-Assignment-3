const { ethers } = require("ethers");
import { useEffect, useState } from 'react';
import deploy from './deploy';
import Escrow from './Escrow';
import './index.css'

const provider = new ethers.providers.Web3Provider(window.ethereum);

export async function approve(escrowContract, signer) {
  const approveTxn = await escrowContract.connect(signer).approve();
  await approveTxn.wait();
}

async function setTimelock(address, signer) {
  const timelock = parseInt(prompt("Enter the timelock duration (in seconds):"));
  const escrowContract = new ethers.Contract(address, Escrow.abi, signer);
  const tx = await escrowContract.setTimelock(timelock);
  await tx.wait();
}

async function deleteContract(address, signer) {
  const escrowContract = new ethers.Contract(address, Escrow.abi, signer);
  const tx = await escrowContract.deleteContract();
  await tx.wait();
}

function App() {
  const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();
  
  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send('eth_requestAccounts', []);
      setAccount(accounts[0]);
      setSigner(provider.getSigner());
    }
    getAccounts();
  }, [account]);

  async function newContract() {
    const beneficiary = document.getElementById('beneficiary').value;
    const broker = document.getElementById('broker').value;
    const value = ethers.BigNumber.from(document.getElementById('wei').value);
    const escrowContract = await deploy(signer, broker, beneficiary, value);


    const escrow = {
      address: escrowContract.address,
      broker,
      beneficiary,
      value: value.toString(),
      handleApprove: async () => {
        escrowContract.on('Approved', () => {
          document.getElementById(escrowContract.address).className =
            'complete';
          document.getElementById(escrowContract.address).innerText =
            "✅ Fund transfer approved";
        });
        await approve(escrowContract, signer);
      },
      handleTimelock: async () => {
        await setTimelock(escrowContract.address, signer);
      },
      handleDelete: async () => {
        await deleteContract(escrowContract.address, signer);
      },
    };
    setEscrows([...escrows, escrow]);
  }
  
  return (
    <>
      <div className="contract">
        <h1> Create Escrow Contract </h1>
        <label>
          Broker
          <input type="text" id="broker" />
        </label>
        <label>
          Fund Beneficiary
          <input type="text" id="beneficiary" />
        </label>
        <label>
          Fund Amount
          <input type="text" id="wei" />
        </label>
        <div
          className="button"
          id="deploy"
          onClick={(event) => {
            event.preventDefault();
            newContract();
          }}
        >
          Deploy New Contract
        </div>
      </div>
      <div className="existing-contracts">
        <h1>Escrow Contracts</h1>
        <div id="container">
          {escrows.map((escrow) => {
            return <Escrow key={escrow.address} {...escrow} />;
          })}
        </div>
      </div>
    </>
  );
}
export default App;
