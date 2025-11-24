// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {SpendAndSave} from "../src/SpendAndSave.sol";

contract SpendAndSaveTest is Test {
    SpendAndSave public spendAndSave;
    address public user = address(1);
    address payable public recipient = payable(address(2));

    function setUp() public {
        spendAndSave = new SpendAndSave(1000); // 10% default
        vm.deal(user, 100 ether);
    }

    function testInitialState() public view {
        assertEq(spendAndSave.defaultSavingsRateBps(), 1000);
    }

    function testSetSavingsRate() public {
        vm.prank(user);
        spendAndSave.setSavingsRate(2000); // 20%

        (,, uint256 rate) = spendAndSave.getUserData(user);
        assertEq(rate, 2000);
    }

    function testSpendAndSaveDefaultRate() public {
        uint256 recipientBalanceBefore = recipient.balance;

        vm.prank(user);
        spendAndSave.spendAndSave{value: 10 ether}(recipient);

        (uint256 spent, uint256 saved,) = spendAndSave.getUserData(user);

        assertEq(spent, 10 ether);
        assertEq(saved, 1 ether); // 10% of 10 ether saved
        assertEq(recipient.balance, recipientBalanceBefore + 9 ether); // 90% sent to recipient
        assertEq(address(spendAndSave).balance, 1 ether); // Only savings remain
    }

    function testSpendAndSaveCustomRate() public {
        uint256 recipientBalanceBefore = recipient.balance;

        vm.startPrank(user);
        spendAndSave.setSavingsRate(5000); // 50%
        spendAndSave.spendAndSave{value: 10 ether}(recipient);
        vm.stopPrank();

        (uint256 spent, uint256 saved,) = spendAndSave.getUserData(user);

        assertEq(spent, 10 ether);
        assertEq(saved, 5 ether); // 50% of 10 ether saved
        assertEq(recipient.balance, recipientBalanceBefore + 5 ether); // 50% sent to recipient
    }

    function testWithdrawSavings() public {
        vm.startPrank(user);
        spendAndSave.spendAndSave{value: 10 ether}(recipient); // Saves 1 ether

        uint256 initialBalance = user.balance;
        spendAndSave.withdrawSavings();

        assertEq(user.balance, initialBalance + 1 ether);

        (, uint256 saved,) = spendAndSave.getUserData(user);
        assertEq(saved, 0);
        vm.stopPrank();
    }

    function testGetUserTransactions() public {
        vm.startPrank(user);
        spendAndSave.spendAndSave{value: 10 ether}(recipient);
        spendAndSave.spendAndSave{value: 5 ether}(recipient);
        vm.stopPrank();

        uint256 txCount = spendAndSave.getUserTransactionCount(user);
        assertEq(txCount, 2);
    }

    function testRevertWhenWithdrawNoSavings() public {
        vm.prank(user);
        vm.expectRevert("Nothing to withdraw");
        spendAndSave.withdrawSavings();
    }
}
