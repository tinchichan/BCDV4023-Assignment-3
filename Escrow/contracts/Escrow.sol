// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract Escrow {
    address public broker;
    address public beneficiary;
    address public depositor;
    uint public value;

    bool public isApproved;

    constructor(address _broker, address _beneficiary) payable {
        broker = _broker;
        beneficiary = _beneficiary;
        depositor = msg.sender;
        value = msg.value;
    }

    event Approved(uint);

    function approve() external {
        require(
            msg.sender == broker,
            "Only the broker is able to approve the transaction."
        );
        uint balance = value;
        (bool sent, ) = payable(beneficiary).call{value: balance}("");
        require(sent, "Failed to send Ether");
        emit Approved(balance);
        isApproved = true;
    }

    //
    //new functionalities
    //

    //delete the particular contract
    function deleteContract() external {
        require(
            msg.sender == broker || msg.sender == beneficiary,
            "Only the broker or beneficiary can delete the contract."
        );
        selfdestruct(payable(address(0)));
    }

    uint public timelock;

    // timelock function
    function setTimelock(uint _timelock) external {
        require(msg.sender == broker, "Only the broker can set the timelock.");
        timelock = _timelock;
    }

    function withdraw() external {
        require(
            msg.sender == beneficiary,
            "Only the beneficiary can withdraw funds."
        );
        require(
            block.timestamp >= timelock,
            "Timelock period has not elapsed yet."
        );
        uint balance = address(this).balance;
        (bool sent, ) = payable(beneficiary).call{value: balance}("");
        require(sent, "Failed to send Ether");
    }
}
