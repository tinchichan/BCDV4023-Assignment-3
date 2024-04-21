import { ethers } from 'ethers';
const provider = new ethers.providers.Web3Provider(ethereum);
export default async function addContract(
  id,
  contract,
  arbiter,
  beneficiary,
  value
) {
  const buttonId = `approve-${id}`;
  const container = document.getElementById('container');
  container.innerHTML += createHTML(buttonId, arbiter, beneficiary, value);
  contract.on('Approved', () => {
    document.getElementById(buttonId).className = 'complete';
    document.getElementById(buttonId).innerText = "✅ Fund transfer approved";
  });

  document.getElementById(buttonId).addEventListener('click', async () => {
    const signer = provider.getSigner();
    await contract.connect(signer).approve();
  });
}

function createHTML(buttonId, broker, beneficiary, value) {
  return `
    <div class="existing-contract">
      <ul className="fields">
        <li>
          <div> Broker </div>
          <div> ${broker} </div>
        </li>
        <li>
          <div> Fund Beneficiary </div>
          <div> ${beneficiary} </div>
        </li>
        <li>
          <div> Fund Value </div>
          <div> ${value} </div>
        </li>
        <div class="button" id="${buttonId}">
          Approve
        </div>
      </ul>
    </div>
  `;
}


