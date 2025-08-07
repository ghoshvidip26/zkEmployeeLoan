<img width="512" height="512" alt="ChatGPT Image Aug 7, 2025, 03_30_28 PM" src="https://github.com/user-attachments/assets/38d21bf5-e085-418e-8468-4560f2fb6981" />
# 🛡️ zkEmployeeLoan

**zkEmployeeLoan** is a privacy-preserving employee loan system built using zero-knowledge proofs and blockchain smart contracts. It allows verified employees to apply for loans based on their employment and salary data, without revealing sensitive information on-chain.

---

## 🚀 Features

- ✅ Employment verification via email
- 🧾 Salary-based loan eligibility
- 🤝 Lending & Borrowing between verified users
- 💸 On-chain loan creation and repayment via smart contracts
- ⚡ Beautiful frontend with animated UX and real-time wallet interaction

---

## 🏗️ Tech Stack

| Layer            | Technology                              |
|------------------|------------------------------------------|
| Frontend         | Next.js, TypeScript, TailwindCSS         |
| Smart Contracts  | Solidity, Hardhat, Ethers.js             |
| ZK Proofs        | SnarkJS / Semaphore / custom circuits    |
| Authentication   | Privy.io (OAuth for employment verification) |
| Wallets          | Wagmi, RainbowKit, MetaMask              |
| Deployment       | Vercel (frontend), Base / Sepolia (chain)|

---

## ✨ Demo

[🔗 Live Demo (if deployed)](https://your-demo-url.com)

![zkEmployeeLoan Screenshot](./screenshots/zkemployee-loan.png)

---

## 📦 Installation

```bash
git clone https://github.com/yourusername/zkEmployeeLoan.git
cd zkEmployeeLoan

# Install dependencies
npm install

# Run locally
npm run dev
