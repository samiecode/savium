// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract SpendAndSave is Ownable, ReentrancyGuard {
    
    struct UserInfo {
        uint256 totalSpent;
        uint256 totalSaved;
        uint256 savingsRateBps; // 0 => use default
    }

    struct Transaction {
        address sender;
        address recipient;
        uint256 amountSent;
        uint256 amountSaved;
        uint256 timestamp;
        uint256 savingsRateBps;
    }

    mapping(address => UserInfo) public users;
    mapping(address => Transaction[]) public userTransactions;
    uint256 public defaultSavingsRateBps; // e.g., 1000 = 10%

    event DefaultSavingsRateUpdated(uint256 newRateBps);
    event UserSavingsRateUpdated(address indexed user, uint256 newRateBps);
    event SpentAndSaved(
        address indexed sender,
        address indexed recipient,
        uint256 amountSent,
        uint256 amountSaved,
        uint256 effectiveRateBps,
        uint256 timestamp
    );
    event SavingsWithdrawn(address indexed user, uint256 amount);

    constructor(uint256 _defaultSavingsRateBps) Ownable(msg.sender) {
        require(_defaultSavingsRateBps <= 10_000, "Rate too high");
        defaultSavingsRateBps = _defaultSavingsRateBps;
        emit DefaultSavingsRateUpdated(_defaultSavingsRateBps);
    }

    function setDefaultSavingsRate(uint256 newRateBps) external onlyOwner {
        require(newRateBps <= 10_000, "Rate too high");
        defaultSavingsRateBps = newRateBps;
        emit DefaultSavingsRateUpdated(newRateBps);
    }

    function setSavingsRate(uint256 newRateBps) external {
        require(newRateBps <= 10_000, "Rate too high");
        users[msg.sender].savingsRateBps = newRateBps;
        emit UserSavingsRateUpdated(msg.sender, newRateBps);
    }

    function spendAndSave(address payable recipient) external payable nonReentrant {
        require(msg.value > 0, "No value sent");
        require(recipient != address(0), "Invalid recipient");
        require(recipient != msg.sender, "Cannot send to yourself");

        UserInfo storage user = users[msg.sender];

        uint256 rateBps = user.savingsRateBps == 0 ? defaultSavingsRateBps : user.savingsRateBps;

        uint256 savings = (msg.value * rateBps) / 10_000;
        uint256 amountToSend = msg.value - savings;

        require(amountToSend > 0, "Amount too small");

        user.totalSpent += msg.value;
        user.totalSaved += savings;

        // Record transaction
        userTransactions[msg.sender].push(
            Transaction({
                sender: msg.sender,
                recipient: recipient,
                amountSent: amountToSend,
                amountSaved: savings,
                timestamp: block.timestamp,
                savingsRateBps: rateBps
            })
        );

        // Transfer money to recipient (actual spend)
        (bool success,) = recipient.call{value: amountToSend}("");
        require(success, "Transfer to recipient failed");

        emit SpentAndSaved(msg.sender, recipient, amountToSend, savings, rateBps, block.timestamp);
        // Savings stay in the contract
    }

    function withdrawSavings() external nonReentrant {
        UserInfo storage user = users[msg.sender];
        uint256 amount = user.totalSaved;
        require(amount > 0, "Nothing to withdraw");

        user.totalSaved = 0;

        (bool ok,) = msg.sender.call{value: amount}("");
        require(ok, "Transfer failed");

        emit SavingsWithdrawn(msg.sender, amount);
    }

    function getUserData(address account)
        external
        view
        returns (uint256 totalSpent, uint256 totalSaved, uint256 effectiveRateBps)
    {
        UserInfo storage user = users[account];
        uint256 rateBps = user.savingsRateBps == 0 ? defaultSavingsRateBps : user.savingsRateBps;

        return (user.totalSpent, user.totalSaved, rateBps);
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function getUserTransactions(address user) external view returns (Transaction[] memory) {
        return userTransactions[user];
    }

    function getUserTransactionCount(address user) external view returns (uint256) {
        return userTransactions[user].length;
    }
}
