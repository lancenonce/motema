// // SPDX-License-Identifier: UNLICENSED
// pragma solidity ^0.8.0;

// import "@openzeppelin/contracts/access/Ownable.sol";

// contract MotemaPool is Ownable {
//     uint256 public constant WITHDRAWAL_AMOUNT = 0.005 ether;

//     constructor() Ownable(msg.sender) {}

//     receive() external payable {}

//     function claim(address payable recipient) public onlyOwner {
//         recipient.transfer(WITHDRAWAL_AMOUNT);
//     }

//     function getContractBalance() public view returns (uint256) {
//         return address(this).balance;
//     }
// }