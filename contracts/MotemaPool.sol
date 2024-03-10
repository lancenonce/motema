// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.0;

// import "@openzeppelin/contracts/security/ReentrancyGuard.sol";


// contract MotemaPool is ReentrancyGuard {
//     uint256 public constant WITHDRAWAL_AMOUNT = 0.005 ether;

//     error InsufficientBalance();
//     error TransferFailed();

//     event Received(address indexed sender, uint256 amount);
//     event Withdrawn(address indexed recipient, uint256 amount);

//     // Removing Ownable due to mysterious web3.py errror
//     // constructor() Ownable(msg.sender) {}

//     receive() external payable {
//         emit Received(msg.sender, msg.value);
//     }

//     fallback() external payable {
//         emit Received(msg.sender, msg.value);
//     }

//     function claim(address payable recipient) public nonReentrant {
//         if (address(this).balance < WITHDRAWAL_AMOUNT) {
//             revert InsufficientBalance();
//         }

//         (bool success, ) = recipient.call{value: WITHDRAWAL_AMOUNT}("");
//         if (!success) {
//             revert TransferFailed();
//         }

//         emit Withdrawn(recipient, WITHDRAWAL_AMOUNT);
//     }

//     function getContractBalance() public view returns (uint256) {
//         return address(this).balance;
//     }
// }