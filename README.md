
# CLARITY: A Decentralized Protocol for Verifiable Human-Authored Content

**Engineering Manifesto & Technical Deep Dive**

---

![Build Status](https://img.shields.io/badge/build-passing-green) ![License](https://img.shields.io/badge/license-MIT-blue) ![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen) ![Project Status](https://img.shields.io/badge/status-functional%20prototype-orange)

This document provides a comprehensive technical overview of the CLARITY protocol. It is intended for software engineers, Web3 enthusiasts, and potential contributors who are interested in the architectural decisions, engineering challenges, and innovative solutions that make this platform possible.

## 1. Abstract: The Engineering Problem

The modern internet's content infrastructure is built on a centralized paradigm. This architecture, while simple to implement, has several critical flaws:

-   **Data Permanence:** Content is stored on servers that are single points of failure. A database outage, a corporate policy change, or a government takedown notice can result in the permanent loss of data.
-   **Identity & Sybil Resistance:** User identity is typically tied to a mutable, centralized database (e.g., an email address). This makes it difficult to build a system with strong Sybil resistance and portable, persistent reputation.
-   **Provenance & Authenticity:** It is difficult to cryptographically verify the author of a piece of content and to prove that it has not been tampered with.
-   **Governance & Control:** The rules of the platform are dictated by a central authority, leading to a lack of transparency and accountability.

CLARITY is an attempt to solve these problems through the application of decentralized technologies. It is a protocol for creating, storing, and managing human-authored content in a way that is permanent, verifiable, and community-owned.

## 2. The CLARITY Protocol: A Technical Overview

CLARITY is a set of smart contracts and data standards that, when used together, create a decentralized content registry and identity system. The protocol is designed to be modular, extensible, and permissionless.

### 2.1. Core Components

-   **Smart Contracts (Solidity):** The on-chain logic of the protocol. These contracts are responsible for managing identity, content registration, reputation, and governance.
-   **Decentralized Storage (IPFS):** All article content is stored on the InterPlanetary File System, a peer-to-peer network for storing and sharing data.
-   **Frontend Application (React/Vite):** A user-friendly interface for interacting with the protocol. This is just one of many possible interfaces; the protocol itself is UI-agnostic.

### 2.2. In-Depth Feature Analysis

#### Identity & Reputation
-   **`JournalistSBT` (ERC-721 Soul-Bound Token):** A non-transferable NFT that serves as a persistent, on-chain identity for content creators. This provides a strong foundation for Sybil resistance and reputation.
-   **`ReputationManager`:** A smart contract that implements a dynamic, on-chain reputation score. The scoring algorithm is transparent and can be updated by the DAO. It is designed to be a more robust and tamper-proof alternative to traditional, centralized reputation systems.

#### Publishing & Content
-   **`ArticleRegistry`:** A smart contract that serves as an on-chain registry of all content published to the protocol. It stores a mapping of article IDs to IPFS content hashes and author addresses.
-   **Content-Addressable Storage (IPFS):** By storing content on IPFS, we ensure that every article has a unique, immutable address (a CID, or Content Identifier). This makes it easy to verify the integrity of the content.
-   **Cryptographic Signatures:** Every article's metadata is hashed and signed by the author's wallet. This signature is stored on-chain and provides a verifiable, non-repudiable link between the author and their content.

#### Governance
-   **`DAOController`:** A smart contract that manages the CLARITY DAO. It allows for the creation of on-chain proposals and the execution of their outcomes.
-   **Future: Gasless Voting:** Integration with Snapshot will allow for off-chain, gasless voting, which will significantly reduce the friction of participating in governance.


## 3. CURRENT STATUS: A FULLY FUNCTIONAL PROTOTYPE (TESTNET)

As of this version, CLARITY is a complete end-to-end prototype. All core features
are implemented and functional on a blockchain testnet (a free, experimental
network).

**What is working right now:**
-   [x] **On-Chain Identity:** Minting Journalist SBTs.
-   [x] **Decentralized Publishing:** The full hash -> sign -> upload to IPFS ->
    register on-chain flow.
-   [x] **On-Chain Reputation:** Reputation scores are updated by the smart
    contract.
-   [x] **On-Chain Governance:** Proposals can be created via the DAO contract.
-   [x] **On-Chain Subscriptions:** Users can subscribe to authors on-chain.

**What is next on the roadmap for mainnet deployment:**
-   [ ] **Framework Migration:** Move from Vite to Next.js for performance and
    server-level controls.
-   [ ] **Subgraph Indexing:** Build a high-speed data retrieval layer with The Graph.
-   [ ] **ZK Integration:** Implement optional zk-KYC for enhanced verification and
    zk-donations for privacy.
-   [ ] **Security Audits:** Full, independent security audits of all smart contracts.

## 4. For Developers: A Contributor's Guide

### 4.1. Technology Stack
-   **Frontend:** React, Vite, TypeScript, Tailwind CSS
-   **Web3:** Ethers.js, SIWE
-   **Smart Contracts:** Solidity, Hardhat
-   **Storage:** IPFS

### 4.2. Local Development
1.  **Clone:** `git clone <repository-url>`
2.  **Install:** `npm install`
3.  **Configure:** Create `.env.local` and add `VITE_ETHEREUM_RPC=https://sepolia.infura.io/v3/YOUR_INFURA_KEY`
4.  **Run:** `npm run dev`

### 4.3. Smart Contracts
-   **Compile:** `npx hardhat compile`
-   **Test:** `npx hardhat test`
-   **Deploy:** `npx hardhat run scripts/deploy.js --network sepolia`

## 5. HOW TO SEE IT IN ACTION: A 15-MINUTE GUIDE

Follow these steps to experience the full power of CLARITY on a testnet. No real
money is required.

### 5.1. Prerequisites
-   **MetaMask:** Install the MetaMask browser extension.
-   **Sepolia Testnet ETH:** Inside MetaMask, switch the network from "Ethereum
    Mainnet" to "Sepolia". Get free test ETH from a faucet like
    [sepoliafaucet.com](https://sepoliafaucet.com/).

### 5.2. Running the Application
1.  **Clone the code:**
    ```bash
    git clone <repository-url>
    cd clarity-app
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up your environment:**
    -   Create a `.env.local` file in the project root.
    -   Add your Sepolia RPC URL from a service like Infura or Alchemy:
        `VITE_ETHEREUM_RPC=https://sepolia.infura.io/v3/YOUR_INFURA_KEY`
4.  **Start the app:**
    ```bash
    npm run dev
    ```
    The app will open at `http://localhost:5173`.

### 5.3. Testing the Core Features
1.  **Connect & Sign In:** Click "Connect Wallet" and sign the message. This proves
    you own your wallet, without revealing personal data.
2.  **Become a Journalist:** Go to Dashboard -> Identity. Click "Become a
    Journalist" and approve the transaction in MetaMask. You now have an on-chain
    identity!
3.  **Publish Your First Article:** Go to Dashboard -> Drafts -> "Start New
    Article". Write something and click "Publish". You will be asked to sign the
    content hash, then approve the on-chain transaction. Your article is now
    permanently on IPFS and the blockchain.
4.  **Govern the Platform:** Go to the Governance tab. Create a proposal for the
    community to vote on. Approve the transaction.

## 6. License

CLARITY is licensed under the MIT License. This is a permissive free software
license, meaning you can do almost anything with the code, with very few
restrictions.

```
MIT License

Copyright (c) 2025 The CLARITY Project Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 7. A Call for Contributions

We welcome contributions from developers, designers, translators, and security
researchers. CLARITY is a public good, and its development is a community effort.

### 7.1. Code Contributions
1.  **Find an Issue:** Look for open issues on our GitHub repository, especially
    those tagged `help-wanted` or `good-first-issue`.
2.  **Fork & Branch:** Fork the repository and create a new branch for your feature
    or bug fix. Use a descriptive name (e.g., `feat/add-dark-mode` or
    `fix/header-alignment`).
3.  **Develop:** Write clean, well-documented, and modular code. Follow the existing
    coding style.
4.  **Test:** Add unit tests for any new logic and ensure all existing tests pass.
5.  **Submit a Pull Request (PR):** Open a PR against the `main` branch. Provide a
    clear description of the changes and link to the relevant issue.

### 7.2. Other Contributions
-   **Translation:** Help us translate the platform into new languages.
-   **Design:** Suggest UI/UX improvements.
-   **Documentation:** Improve this guide or other documentation.
