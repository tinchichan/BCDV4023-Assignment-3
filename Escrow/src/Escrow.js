const { ethers } = require("ethers");

export default function Escrow({
  address,
  broker,
  beneficiary,
  value,
  handleApprove,
  handleTimelock,
  handleDelete,
}) {
  return (
    <div className="existing-contract">
      <ul className="fields">
        <li>
          <div> Broker </div>
          <div> {broker} </div>
        </li>
        <li>
          <div> Beneficiary </div>
          <div> {beneficiary} </div>
        </li>
        <li>
          <div> Value </div>
          <div> {value} </div>
        </li>
        <div
          className="button"
          onClick={(event) => {
            event.preventDefault();
            handleApprove();
          }}
        >
          Approve Transfer of Funds
        </div>
        <div
          className="button"
          onClick={(event) => {
            event.preventDefault();
            handleTimelock();
          }}
        >
          Set Timelock
        </div>
        <div
          className="button"
          onClick={(event) => {
            event.preventDefault();
            handleDelete();
          }}
        >
          Delete Contract
        </div>
      </ul>
    </div>
  );
}
