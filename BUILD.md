

## **📄 V1 – Simple Non-Standard Contract (Foundry)**

**Save as:** `spend-and-save-v1.txt`

---

You are an expert full-stack Web3 engineer and Celo developer.  
 Your task is to build a **simple spend-and-save dApp** as a **proof-of-concept** on the **Celo network** for a hackathon. The app does NOT need to be production-grade; it just needs to be clean, demo-ready, and easy to understand.

---

## **1\. High-Level Concept**

Build a **“Spend & Save” mini app** on **Celo** where:

* A user can:

  * Connect their wallet (Celo network)

  * “Spend” a mock amount (simulated spend; no real checkout integration needed)

  * Automatically send a configurable **percentage of that spend into savings** handled by a smart contract

  * View:

    * Total amount "spent" (on-chain tracked)

    * Total amount "saved"

  * Withdraw their saved funds back to their wallet

This is a **proof of concept**, so we simulate “spend” as a button that triggers a contract call that:

* Records the “spend amount”

* Calculates `savings = spendAmount * savingsRate`

* Transfers the savings portion into a savings balance for that user inside the contract

---

## **2\. Tech Stack & Constraints**

**Network:**

* Celo Testnet (e.g., Alfajores)

**Smart Contract:**

* Language: Solidity

* Framework: **Foundry** (`forge` for build/test, `cast` for interaction)

* Features:

  * Mapping of user address → balances:

    * `totalSpent`

    * `totalSaved`

  * A `savingsRate` (e.g., default 10%) that can be set per user or globally

  * Functions:

    * `setSavingsRate(uint256 newRate)` (rate as basis points, e.g., 1000 \= 10%)

    * `spendAndSave()` that:

      * Accepts value in CELO

      * Updates the sender’s `totalSpent`

      * Derives savings and tracks it in `totalSaved`

    * `getUserData(address user)` view returning:

      * `totalSpent`, `totalSaved`, `savingsRate`

    * `withdrawSavings()` to let user withdraw their accumulated savings

  * Use **simple arithmetic & checks** (no ERC standards or complex protocols)

**Frontend:**

* Framework: React or Next.js (choose whichever is fastest to scaffold)

* Connect wallet using a simple Celo-friendly connector (e.g., `@celo-tools/use-contractkit`, ethers.js \+ Celo RPC, or similar)

* Use basic UI:

  * Connect Wallet button

  * A form / input to specify “Spend amount”

  * A read-only display of:

    * Connected address

    * Total Spent

    * Total Saved

    * Current savings rate

  * Buttons:

    * “Set Savings Rate”

    * “Spend & Save”

    * “Withdraw Savings”

**Non-Goals:**

* No need for production-grade security hardening

* No need for fancy design; just simple, readable UI

* No need for backend server; this is a pure smart contract \+ frontend dApp

---

## **3\. Project Structure**

Use **Foundry** for the Solidity side.

Suggested layout:

* `src/`

  * `SpendAndSaveV1.sol`

* `script/`

  * `DeployV1.s.sol` (Foundry script for deployment)

* `test/`

  * `SpendAndSaveV1.t.sol` (basic unit tests)

* `foundry.toml`

* `frontend/`

  * React/Next.js app

* `package.json`

* `README.md`

Foundry responsibilities:

* `forge build` to compile

* `forge test` to run tests

* `forge script` (or `cast`) to deploy to Celo testnet.

---

## **4\. Smart Contract Details**

Implement `SpendAndSaveV1.sol` with:

* SPDX \+ pragma for Solidity 0.8.x

State:

struct UserInfo {  
    uint256 totalSpent;  
    uint256 totalSaved;  
    uint256 savingsRateBps; // e.g., 1000 \= 10%  
}

mapping(address \=\> UserInfo) public users;  
uint256 public defaultSavingsRateBps; // used if user hasn’t set their own

* Constructor:

  * Set a sensible default savings rate, e.g., 1000 (10%)

Functions (at minimum):

function setSavingsRate(uint256 newRateBps) external;  
function spendAndSave() external payable;  
function getUserData(address user) external view returns (  
    uint256 totalSpent,  
    uint256 totalSaved,  
    uint256 savingsRateBps  
);  
function withdrawSavings() external;

* Behaviour:

  * `setSavingsRate`:

    * Updates `users[msg.sender].savingsRateBps`

    * Add simple `require` to keep rate reasonable (e.g., \<= 10000 for 100%)

  * `spendAndSave`:

    * Require `msg.value > 0`

    * Compute effective rate:

      * `uint256 rate = users[msg.sender].savingsRateBps > 0 ? users[msg.sender].savingsRateBps : defaultSavingsRateBps;`

    * Compute savings:

      * `uint256 savings = (msg.value * rate) / 10000;`

    * `users[msg.sender].totalSpent += msg.value;`

    * `users[msg.sender].totalSaved += savings;`

    * The “spent” portion is effectively simulated; funds remain in the contract but this is acceptable for POC

  * `withdrawSavings`:

    * Get `amount = users[msg.sender].totalSaved`

    * Require `amount > 0`

    * Set `totalSaved = 0`

    * Transfer amount to `msg.sender`

  * `getUserData`:

    * Return the struct fields, defaulting the savings rate if zero

Add a couple of basic Foundry tests to verify:

* Setting savings rate

* `spendAndSave` updates totals correctly

* `withdrawSavings` transfers funds and resets `totalSaved`

---

## **5\. Frontend Requirements (Minimal but Demo-Ready)**

Implement a minimal UI with:

1. **Wallet Connection**

   * “Connect Wallet” button

   * After connecting, show:

     * Shortened address

     * Current network (ensure it’s Celo testnet)

2. **Dashboard**

   * Card showing:

     * `Total Spent` (from `getUserData`)

     * `Total Saved`

     * `Savings Rate` (%)

3. **Set Savings Rate**

   * Input: `Savings Rate (%)`

   * Button: “Update Rate”

   * On click:

     * Convert % to basis points

     * Call `setSavingsRate`

4. **Spend & Save Action**

   * Input: `Amount to spend` (in CELO)

   * Button: “Spend & Save”

   * On click:

     * Convert to wei

     * Call `spendAndSave` with `value` equal to the amount

   * After transaction:

     * Refresh user data from the contract

5. **Withdraw Savings**

   * Button: “Withdraw Savings”

   * On click:

     * Call `withdrawSavings`

   * After transaction:

     * Refresh user data

6. **Feedback**

   * Show simple loading and success/error messages for txs:

     * “Transaction pending…”

     * “Transaction confirmed\!”

     * Simple error text on failure

---

## **6\. Developer Experience**

Please also:

* Provide a **README.md** that explains:

  * How to install dependencies

  * How to run tests with Foundry (`forge test`)

  * How to deploy the contract to Celo testnet using a Foundry script (`forge script`)

  * How to run the frontend and configure the contract address

* Include **.env.example** if environment variables are needed (e.g., RPC URL, private key)

* Assume the developer will have:

  * Node.js

  * Yarn or npm

  * Foundry installed (`foundryup`)

  * A funded Celo testnet wallet for deployment

---

## **7\. Priorities**

1. A working, clear **Spend & Save** flow on Celo testnet.

2. Simple, understandable Solidity code (commented where helpful).

3. Clean, minimal UI that’s good enough for a demo.

4. Easy setup for a hackathon judge to:

   * Deploy contract (Foundry script)

   * Run frontend

   * Try the flow with a test wallet.

Focus on **clarity and hackathon-demoability** over perfection.

---

### **🔹 End of V1**

---

## **📄 V2 – ERC20 “SavingsToken” (Foundry)**

**Save as:** `spend-and-save-v2.txt`

---

You are an expert full-stack Web3 engineer and Celo developer.  
 Your task is to build a **tokenized spend-and-save dApp** as a **proof-of-concept** on the **Celo network** for a hackathon. This version wraps user savings into an **ERC20 “SavingsToken”** that represents a claim on saved CELO.

---

## **1\. High-Level Concept**

Build a **“Spend & Save” mini app** on **Celo** where:

* A user can:

  * Connect their wallet

  * Call `spendAndSave()` with CELO

  * Automatically save a configurable percentage of each spend

  * Receive **`SAVE` ERC20 tokens** representing their savings (1:1 with saved wei)

  * Burn `SAVE` tokens later to withdraw CELO

  * View:

    * Total amount "spent" (tracked in contract)

    * Total amount "saved"

    * Their `SAVE` balance

This is a **proof of concept** demonstrating **tokenized savings** via ERC20.

---

## **2\. Tech Stack & Constraints**

**Network:**

* Celo Testnet (e.g., Alfajores)

**Smart Contract:**

* Language: Solidity

* Framework: **Foundry**

* Features:

  * Contract inherits `ERC20` (OpenZeppelin) and acts as **“Savings Token” (symbol `SAVE`)**

  * Mapping of user address → balances:

    * `totalSpent`

    * `totalSaved`

    * `savingsRateBps`

  * `SAVE` token is **minted** 1:1 with saved CELO amount and **burned** on withdrawal

  * Functions:

    * `setSavingsRate(uint256 newRateBps)`

    * `spendAndSave()` (payable) – computes savings and mints `SAVE` to sender

    * `withdrawSavings(uint256 amount)` – burns `SAVE` and sends CELO

    * `withdrawAllSavings()` – helper to withdraw everything

    * `getUserData(address user)`

**Frontend:**

* React or Next.js

* Celo wallet connector (use-contractkit or ethers)

* UI to show:

  * `SAVE` token balance

  * Total spent / saved

  * Savings rate

**Non-Goals:**

* No integration with external DeFi protocols

* No handling of multiple tokens – just native CELO for POC

---

## **3\. Project Structure**

Use **Foundry** for contracts:

* `src/`

  * `SpendAndSaveV2.sol`

* `script/`

  * `DeployV2.s.sol`

* `test/`

  * `SpendAndSaveV2.t.sol`

* `foundry.toml`

For frontend:

* `frontend/`

  * React/Next.js dApp

* `package.json`

* `README.md`

Foundry:

* `forge build`, `forge test`, `forge script` for deployment.

---

## **4\. Smart Contract Details**

Implement `SpendAndSaveV2.sol` with:

* SPDX \+ pragma for Solidity 0.8.x

* Inherit:

  * `ERC20` (OpenZeppelin) for `SAVE` token

State:

struct UserInfo {  
    uint256 totalSpent;  
    uint256 totalSaved;      // in wei of CELO  
    uint256 savingsRateBps;  // 0 \=\> use default  
}

mapping(address \=\> UserInfo) public users;  
uint256 public defaultSavingsRateBps;

Constructor:

* Initialize ERC20:

  * `ERC20("Savings Token", "SAVE")`

* Set default savings rate (e.g., 1000 \= 10%), with `require(newRate <= 10000)`.

Functions (at minimum):

function setSavingsRate(uint256 newRateBps) external;  
function spendAndSave() external payable;  
function withdrawSavings(uint256 amount) external;  
function withdrawAllSavings() external;  
function getUserData(address user) external view returns (  
    uint256 totalSpent,  
    uint256 totalSaved,  
    uint256 savingsRateBps  
);

Behaviour:

* `spendAndSave`:

  * Require `msg.value > 0`

  * Compute effective rate (fallback to default)

  * Compute savings \= `(msg.value * rate) / 10000`

  * Update `totalSpent` and `totalSaved`

  * **Mint** `savings` amount of `SAVE` tokens to `msg.sender`

* `withdrawSavings(amount)`:

  * Require `amount > 0`

  * Ensure `balanceOf(msg.sender) >= amount` and `users[msg.sender].totalSaved >= amount`

  * Burn `amount` `SAVE` tokens from `msg.sender`

  * Decrease `totalSaved` accordingly

  * Transfer `amount` CELO to `msg.sender`

* `withdrawAllSavings`:

  * Convenience: withdraw the minimum of token balance and `totalSaved`

Add basic Foundry tests to validate:

* Minting/burning SAVE mapping to CELO flow

* Withdraw behaviour

---

## **5\. Frontend Requirements (Minimal but Demo-Ready)**

Implement a minimal UI with:

1. **Wallet Connection**

2. **Dashboard**

   * Show:

     * `Total Spent`

     * `Total Saved`

     * `Savings Rate` (%)

     * `SAVE Balance` (`balanceOf`)

3. **Set Savings Rate**

   * Input: savings rate in %

   * Button: “Update Rate”

4. **Spend & Save Action**

   * Input: CELO amount

   * Button: “Spend & Save”

   * Call `spendAndSave` with `msg.value`

5. **Withdraw Savings**

   * Input: Amount to withdraw **or** “Withdraw All” button

   * Call `withdrawSavings(amount)` or `withdrawAllSavings()`

6. **Feedback**

   * Pending / success / error messages

---

## **6\. Developer Experience**

Provide:

* README:

  * How to run `forge build` / `forge test`

  * How to deploy `SpendAndSaveV2` with Foundry scripts to Celo testnet

  * How to configure Celo RPC and private key in `foundry.toml` / `.env`

  * How to run frontend and set the contract address and token address

* `.env.example` for:

  * `CELO_RPC_URL`

  * `PRIVATE_KEY`

---

## **7\. Priorities**

1. Demonstrate **tokenized savings** via ERC20.

2. Keep the contract simple and easy to reason about.

3. Provide a small, clear UI.

4. Make deployment and testing straightforward via Foundry.

---

### **🔹 End of V2**

---

## **📄 V3 – ERC4626 Vault (Foundry)**

**Save as:** `spend-and-save-v3.txt`

---

You are an expert full-stack Web3 engineer and Celo developer.  
 Your task is to build an **ERC4626 vault-based spend-and-save dApp** as a **proof-of-concept** on the **Celo network** for a hackathon. This version uses an **ERC20 underlying asset** (e.g., cUSD) and an **ERC4626 tokenized vault** for savings.

---

## **1\. High-Level Concept**

Build a **“Spend & Save” mini app** on **Celo** where:

* A user can:

  * Approve the vault to spend an ERC20 token (e.g., cUSD)

  * Call `spendAndSave(amount)` to simulate spending

  * Automatically save a percentage of `amount` into an **ERC4626 vault**

  * Receive **vault share tokens** representing their savings

  * Later, withdraw savings using standard ERC4626 functions (`withdraw`, `redeem`)

  * View:

    * Total “spent” (logical, tracked by contract)

    * Total “saved” (logical)

    * Share balance

    * Redeemable asset amount

This is a **proof of concept** focusing on **DeFi composability** via ERC4626.

---

## **2\. Tech Stack & Constraints**

**Network:**

* Celo Testnet (e.g., Alfajores)

**Smart Contract:**

* Solidity

* Framework: **Foundry**

* Standards:

  * ERC20 (share token)

  * ERC4626 (vault wrapper around underlying asset)

* Underlying asset:

  * Any ERC20 on Celo testnet (in practice, set via constructor argument)

* Features:

  * `spendAndSave(uint256 amount)`:

    * Uses `savingsRateBps`

    * Deposits only the saved portion into the vault on behalf of the user

    * Mints vault shares

  * `getUserData(address user)`:

    * Returns totals and share/redeemable information

**Frontend:**

* React or Next.js

* Celo wallet integration

* ERC20 approve flow (for underlying)

**Non-Goals:**

* No complex yield strategies

* No multiple underlying assets

---

## **3\. Project Structure**

Use **Foundry** for vault contract:

* `src/`

  * `SpendAndSaveV3Vault.sol`

* `script/`

  * `DeployV3Vault.s.sol`

* `test/`

  * `SpendAndSaveV3Vault.t.sol`

* `foundry.toml`

Frontend:

* `frontend/`

  * React/Next.js

* `package.json`

* `README.md`

---

## **4\. Smart Contract Details**

Implement `SpendAndSaveV3Vault.sol` with:

* SPDX \+ pragma for Solidity 0.8.x

* Inherit:

  * `ERC20` (vault share token)

  * `ERC4626` (vault logic)

  * `Ownable`

State:

struct UserInfo {  
    uint256 totalSpent;      // logical "spent"  
    uint256 totalSaved;      // logical "saved" in asset units  
    uint256 savingsRateBps;  // 0 \=\> use default  
}

mapping(address \=\> UserInfo) public users;  
uint256 public defaultSavingsRateBps;

Constructor:

* Accept `IERC20 asset_` and `uint256 _defaultSavingsRateBps`

* Initialize:

  * `ERC20("Spend & Save Vault Share", "SSV")`

  * `ERC4626(asset_)`

* Set default savings rate, `require(_defaultSavingsRateBps <= 10000)`.

Functions (at minimum):

function setSavingsRate(uint256 newRateBps) external;  
function spendAndSave(uint256 amount) external;  
function getUserData(address user) external view returns (  
    uint256 totalSpent,  
    uint256 totalSaved,  
    uint256 savingsRateBps,  
    uint256 shareBalance,  
    uint256 redeemableAssets  
);

Behaviour:

* `spendAndSave(uint256 amount)`:

  * Require `amount > 0`

  * Compute effective rate (fallback to default)

  * Compute `savings = (amount * rate) / 10000`

  * Update `totalSpent` and `totalSaved`

  * Call `deposit(savings, msg.sender)` (ERC4626):

    * Requires prior `approve` from user to vault

    * Mints vault shares (`SSV`) to user

  * The “spent” portion `amount - savings` is **only tracked logically**; underlying transfer is not enforced for POC.

* `getUserData`:

  * Returns:

    * `totalSpent`, `totalSaved`, `effectiveRateBps`

    * `shareBalance = balanceOf(user)`

    * `redeemableAssets = convertToAssets(shareBalance)`

Users withdraw by using standard ERC4626:

* `withdraw` or `redeem` (can be called directly from UI)

---

## **5\. Frontend Requirements (Minimal but Demo-Ready)**

Implement a minimal UI with:

1. **Wallet Connection**

2. **Underlying Token Approval**

   * Input: amount to approve

   * Button: “Approve”

3. **Dashboard**

   * Show:

     * `Total Spent`

     * `Total Saved`

     * `Savings Rate` (%)

     * Vault share balance (`SSV`)

     * Redeemable assets (via `convertToAssets`)

4. **Spend & Save Action**

   * Input: `Amount` in underlying (e.g., cUSD)

   * Button: “Spend & Save”

   * On click:

     * Call `spendAndSave(amount)`

   * After tx:

     * Refresh user data

5. **Withdraw Savings**

   * Button: “Withdraw All Savings”

   * Call ERC4626 `redeem` for full share balance

6. **Feedback**

   * Pending tx indicator

   * Success message with tx hash

   * Error messages on revert / failure

---

## **6\. Developer Experience**

Please also:

* Provide a **README.md** that explains:

  * How to configure underlying token address

  * How to deploy vault using Foundry script

  * How to run tests

  * How to run frontend and set the vault address

* Include `.env.example` for:

  * `CELO_RPC_URL`

  * `PRIVATE_KEY`

  * `UNDERLYING_TOKEN_ADDRESS`

* Document the ERC4626 flow in simple terms for judges.

---

## **7\. Priorities**

1. A working, clear **Spend & Save via ERC4626** flow on Celo testnet.

2. Simple, understandable contract built on OZ’s ERC4626.

3. Clean, minimal UI demonstrating:

   * Approve → Spend & Save → Shares → Withdraw

4. Easy setup for the hackathon judge.

---

### **🔹 End of V3 TXT**

---

# **🧱 Solidity Contracts (V1, V2, V3)**

Below are the three contracts that match the above prompts.  
 You can drop them into `src/` in a Foundry project.

---

### **🧩 `SpendAndSaveV1.sol`**

// SPDX-License-Identifier: MIT  
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";  
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SpendAndSaveV1 is Ownable, ReentrancyGuard {  
    struct UserInfo {  
        uint256 totalSpent;  
        uint256 totalSaved;  
        uint256 savingsRateBps; // 0 \=\> use default  
    }

    mapping(address \=\> UserInfo) public users;  
    uint256 public defaultSavingsRateBps; // e.g., 1000 \= 10%

    event DefaultSavingsRateUpdated(uint256 newRateBps);  
    event UserSavingsRateUpdated(address indexed user, uint256 newRateBps);  
    event SpentAndSaved(  
        address indexed user,  
        uint256 amountIn,  
        uint256 savingsAmount,  
        uint256 effectiveRateBps  
    );  
    event SavingsWithdrawn(address indexed user, uint256 amount);

    constructor(uint256 \_defaultSavingsRateBps) {  
        require(\_defaultSavingsRateBps \<= 10\_000, "Rate too high");  
        defaultSavingsRateBps \= \_defaultSavingsRateBps;  
        emit DefaultSavingsRateUpdated(\_defaultSavingsRateBps);  
    }

    function setDefaultSavingsRate(uint256 newRateBps) external onlyOwner {  
        require(newRateBps \<= 10\_000, "Rate too high");  
        defaultSavingsRateBps \= newRateBps;  
        emit DefaultSavingsRateUpdated(newRateBps);  
    }

    function setSavingsRate(uint256 newRateBps) external {  
        require(newRateBps \<= 10\_000, "Rate too high");  
        users\[msg.sender\].savingsRateBps \= newRateBps;  
        emit UserSavingsRateUpdated(msg.sender, newRateBps);  
    }

    function spendAndSave() external payable nonReentrant {  
        require(msg.value \> 0, "No value sent");

        UserInfo storage user \= users\[msg.sender\];

        uint256 rateBps \= user.savingsRateBps \== 0  
            ? defaultSavingsRateBps  
            : user.savingsRateBps;

        uint256 savings \= (msg.value \* rateBps) / 10\_000;

        user.totalSpent \+= msg.value;  
        user.totalSaved \+= savings;

        emit SpentAndSaved(msg.sender, msg.value, savings, rateBps);  
        // For this POC, all CELO stays in the contract.  
    }

    function withdrawSavings() external nonReentrant {  
        UserInfo storage user \= users\[msg.sender\];  
        uint256 amount \= user.totalSaved;  
        require(amount \> 0, "Nothing to withdraw");

        user.totalSaved \= 0;

        (bool ok, ) \= msg.sender.call{value: amount}("");  
        require(ok, "Transfer failed");

        emit SavingsWithdrawn(msg.sender, amount);  
    }

    function getUserData(address account)  
        external  
        view  
        returns (  
            uint256 totalSpent,  
            uint256 totalSaved,  
            uint256 effectiveRateBps  
        )  
    {  
        UserInfo storage user \= users\[account\];  
        uint256 rateBps \= user.savingsRateBps \== 0  
            ? defaultSavingsRateBps  
            : user.savingsRateBps;

        return (user.totalSpent, user.totalSaved, rateBps);  
    }

    function getContractBalance() external view returns (uint256) {  
        return address(this).balance;  
    }  
}

---

### **🧩 `SpendAndSaveV2.sol` (ERC20 SavingsToken)**

// SPDX-License-Identifier: MIT  
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";  
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";  
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SpendAndSaveV2 is ERC20, Ownable, ReentrancyGuard {  
    struct UserInfo {  
        uint256 totalSpent;  
        uint256 totalSaved;      // in wei of CELO  
        uint256 savingsRateBps;  // 0 \=\> use default  
    }

    mapping(address \=\> UserInfo) public users;  
    uint256 public defaultSavingsRateBps;

    event DefaultSavingsRateUpdated(uint256 newRateBps);  
    event UserSavingsRateUpdated(address indexed user, uint256 newRateBps);  
    event SpentAndSaved(  
        address indexed user,  
        uint256 amountIn,  
        uint256 savingsAmount,  
        uint256 effectiveRateBps  
    );  
    event SavingsWithdrawn(address indexed user, uint256 amount);

    constructor(uint256 \_defaultSavingsRateBps)  
        ERC20("Savings Token", "SAVE")  
    {  
        require(\_defaultSavingsRateBps \<= 10\_000, "Rate too high");  
        defaultSavingsRateBps \= \_defaultSavingsRateBps;  
        emit DefaultSavingsRateUpdated(\_defaultSavingsRateBps);  
    }

    function setDefaultSavingsRate(uint256 newRateBps) external onlyOwner {  
        require(newRateBps \<= 10\_000, "Rate too high");  
        defaultSavingsRateBps \= newRateBps;  
        emit DefaultSavingsRateUpdated(newRateBps);  
    }

    function setSavingsRate(uint256 newRateBps) external {  
        require(newRateBps \<= 10\_000, "Rate too high");  
        users\[msg.sender\].savingsRateBps \= newRateBps;  
        emit UserSavingsRateUpdated(msg.sender, newRateBps);  
    }

    function spendAndSave() external payable nonReentrant {  
        require(msg.value \> 0, "No value sent");

        UserInfo storage user \= users\[msg.sender\];

        uint256 rateBps \= user.savingsRateBps \== 0  
            ? defaultSavingsRateBps  
            : user.savingsRateBps;

        uint256 savings \= (msg.value \* rateBps) / 10\_000;

        user.totalSpent \+= msg.value;  
        user.totalSaved \+= savings;

        // Mint 1:1 savings tokens for saved CELO  
        \_mint(msg.sender, savings);

        emit SpentAndSaved(msg.sender, msg.value, savings, rateBps);  
        // All CELO stays in the contract for this POC.  
    }

    function withdrawSavings(uint256 amount) public nonReentrant {  
        require(amount \> 0, "Zero amount");

        UserInfo storage user \= users\[msg.sender\];

        uint256 tokenBalance \= balanceOf(msg.sender);  
        require(tokenBalance \>= amount, "Insufficient SAVE balance");  
        require(user.totalSaved \>= amount, "Insufficient saved balance");

        user.totalSaved \-= amount;  
        \_burn(msg.sender, amount);

        (bool ok, ) \= msg.sender.call{value: amount}("");  
        require(ok, "Transfer failed");

        emit SavingsWithdrawn(msg.sender, amount);  
    }

    function withdrawAllSavings() external {  
        uint256 tokenBalance \= balanceOf(msg.sender);  
        uint256 saved \= users\[msg.sender\].totalSaved;  
        uint256 amount \= tokenBalance \< saved ? tokenBalance : saved;  
        require(amount \> 0, "Nothing to withdraw");  
        withdrawSavings(amount);  
    }

    function getUserData(address account)  
        external  
        view  
        returns (  
            uint256 totalSpent,  
            uint256 totalSaved,  
            uint256 effectiveRateBps  
        )  
    {  
        UserInfo storage user \= users\[account\];  
        uint256 rateBps \= user.savingsRateBps \== 0  
            ? defaultSavingsRateBps  
            : user.savingsRateBps;

        return (user.totalSpent, user.totalSaved, rateBps);  
    }

    function getContractBalance() external view returns (uint256) {  
        return address(this).balance;  
    }  
}

---

### **🧩 `SpendAndSaveV3Vault.sol` (ERC4626 Vault)**

// SPDX-License-Identifier: MIT  
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";  
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";  
import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";  
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SpendAndSaveV3Vault is ERC20, ERC4626, Ownable, ReentrancyGuard {  
    struct UserInfo {  
        uint256 totalSpent;      // logical amount user "spent"  
        uint256 totalSaved;      // logical amount saved (in asset units)  
        uint256 savingsRateBps;  // 0 \=\> use default  
    }

    mapping(address \=\> UserInfo) public users;  
    uint256 public defaultSavingsRateBps;

    event DefaultSavingsRateUpdated(uint256 newRateBps);  
    event UserSavingsRateUpdated(address indexed user, uint256 newRateBps);  
    event SpentAndSaved(  
        address indexed user,  
        uint256 amountIn,  
        uint256 savingsAmount,  
        uint256 effectiveRateBps,  
        uint256 sharesMinted  
    );

    constructor(IERC20 asset\_, uint256 \_defaultSavingsRateBps)  
        ERC20("Spend & Save Vault Share", "SSV")  
        ERC4626(asset\_)  
    {  
        require(\_defaultSavingsRateBps \<= 10\_000, "Rate too high");  
        defaultSavingsRateBps \= \_defaultSavingsRateBps;  
        emit DefaultSavingsRateUpdated(\_defaultSavingsRateBps);  
    }

    // \----- Admin \-----

    function setDefaultSavingsRate(uint256 newRateBps) external onlyOwner {  
        require(newRateBps \<= 10\_000, "Rate too high");  
        defaultSavingsRateBps \= newRateBps;  
        emit DefaultSavingsRateUpdated(newRateBps);  
    }

    // \----- User configuration \-----

    function setSavingsRate(uint256 newRateBps) external {  
        require(newRateBps \<= 10\_000, "Rate too high");  
        users\[msg.sender\].savingsRateBps \= newRateBps;  
        emit UserSavingsRateUpdated(msg.sender, newRateBps);  
    }

    // \----- Core spend & save \-----

    /// @notice amount is in units of the underlying ERC20 asset.  
    /// The user must approve this contract to spend at least \`amount\`  
    /// before calling.  
    function spendAndSave(uint256 amount) external nonReentrant {  
        require(amount \> 0, "Zero amount");

        UserInfo storage user \= users\[msg.sender\];

        uint256 rateBps \= user.savingsRateBps \== 0  
            ? defaultSavingsRateBps  
            : user.savingsRateBps;

        uint256 savings \= (amount \* rateBps) / 10\_000;  
        require(savings \> 0, "Savings too small");

        user.totalSpent \+= amount;  
        user.totalSaved \+= savings;

        // Deposit only the savings portion into the ERC4626 vault  
        // on behalf of the user, minting SSV shares.  
        uint256 sharesMinted \= deposit(savings, msg.sender);

        emit SpentAndSaved(  
            msg.sender,  
            amount,  
            savings,  
            rateBps,  
            sharesMinted  
        );

        // NOTE: For simplicity, the "spent" portion (amount \- savings)  
        // is not transferred anywhere. It remains in the user's wallet,  
        // and we only track it logically in totalSpent.  
    }

    // \----- Views \-----

    function getUserData(address account)  
        external  
        view  
        returns (  
            uint256 totalSpent,  
            uint256 totalSaved,  
            uint256 effectiveRateBps,  
            uint256 shareBalance,  
            uint256 redeemableAssets  
        )  
    {  
        UserInfo storage user \= users\[account\];  
        uint256 rateBps \= user.savingsRateBps \== 0  
            ? defaultSavingsRateBps  
            : user.savingsRateBps;

        uint256 shares \= balanceOf(account);  
        uint256 assets \= convertToAssets(shares);

        return (user.totalSpent, user.totalSaved, rateBps, shares, assets);  
    }

    // If your OZ version requires any extra overrides (like decimals),  
    // add them here accordingly.  
}

---

If you’d like, next I can:

* Sketch **Foundry deploy scripts** for each version (`DeployV1.s.sol`, `DeployV2.s.sol`, `DeployV3Vault.s.sol`), or

* Help you design **simple Foundry tests** for one of the versions.

