import { ethers } from "ethers";

// Free Testnets Configuration
export const TESTNET_NETWORKS = {
  sepolia: {
    chainId: "0xaa36a7", // 11155111
    chainName: "Sepolia Test Network",
    nativeCurrency: { name: "Sepolia ETH", symbol: "ETH", decimals: 18 },
    rpcUrls: ["https://rpc.sepolia.org"],
    blockExplorerUrls: ["https://sepolia.etherscan.io"],
    faucets: [
      { name: "Google Cloud Sepolia Faucet", url: "https://cloud.google.com/application/web3/faucet/ethereum/sepolia" },
      { name: "QuickNode Sepolia Faucet", url: "https://faucet.quicknode.com/ethereum/sepolia" },
      { name: "Chainlink Faucet", url: "https://faucets.chain.link/sepolia" }
    ]
  },
  amoy: {
    chainId: "0x13882", // 80002
    chainName: "Polygon Amoy Testnet",
    nativeCurrency: { name: "Amoy MATIC", symbol: "MATIC", decimals: 18 },
    rpcUrls: ["https://rpc-amoy.polygon.technology"],
    blockExplorerUrls: ["https://amoy.polygonscan.com"],
    faucets: [
      { name: "Polygon Official Amoy Faucet", url: "https://faucet.polygon.technology" },
      { name: "Chainlink Amoy Faucet", url: "https://faucets.chain.link/polygon-amoy" }
    ]
  }
};

// Simulated AgriSetu Contract Address on Testnet
export const CONTRACT_ADDRESS = "0x8921B723049F892cE881729A321A4B022b78a9C1";

// Resilient Provider Resolver for MetaMask / EIP-1193 / EIP-6963
export function getEthereumProvider() {
  if (typeof window === "undefined") return null;
  
  if (window.ethereum) {
    if (window.ethereum.providers?.length) {
      const mmProvider = window.ethereum.providers.find((p) => p.isMetaMask);
      if (mmProvider) return mmProvider;
    }
    return window.ethereum;
  }
  if (window.web3 && window.web3.currentProvider) {
    return window.web3.currentProvider;
  }
  return null;
}

// Helper: Check if MetaMask is installed
export function hasMetaMask() {
  return getEthereumProvider() !== null;
}

// Connect MetaMask Wallet with Provider Resolution & Auto Network Switch
export async function connectMetaMask(targetNetworkKey = "amoy") {
  let ethProvider = getEthereumProvider();
  
  if (!ethProvider) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    ethProvider = getEthereumProvider();
  }

  if (!ethProvider) {
    throw new Error("MetaMask wallet extension is not installed in your browser.");
  }

  try {
    const provider = new ethers.BrowserProvider(ethProvider);
    const accounts = await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    
    // Auto-switch to target testnet (Polygon Amoy / Ethereum Sepolia)
    await switchToTestnet(targetNetworkKey);

    const network = await provider.getNetwork();
    const balanceWei = await provider.getBalance(address);
    const balanceEth = ethers.formatEther(balanceWei);

    const targetConfig = TESTNET_NETWORKS[targetNetworkKey] || TESTNET_NETWORKS["amoy"];

    return {
      address,
      chainName: targetConfig.chainName,
      chainSymbol: targetConfig.nativeCurrency.symbol,
      networkName: `${targetConfig.chainName} (${targetConfig.nativeCurrency.symbol})`,
      chainId: network.chainId.toString(),
      balance: Number(balanceEth).toFixed(4),
      explorerUrl: targetConfig.blockExplorerUrls[0],
      isMetaMask: true
    };
  } catch (err) {
    console.error("MetaMask connection failed:", err);
    throw err;
  }
}

// Switch or Add Polygon Amoy / Sepolia Testnet automatically in MetaMask
export async function switchToTestnet(networkKey = "amoy") {
  const ethProvider = getEthereumProvider();
  if (!ethProvider) return false;
  const config = TESTNET_NETWORKS[networkKey] || TESTNET_NETWORKS["amoy"];

  try {
    await ethProvider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: config.chainId }],
    });
    return true;
  } catch (switchError) {
    if (switchError.code === 4902) {
      try {
        await ethProvider.request({
          method: "wallet_addEthereumChain",
          params: [{
            chainId: config.chainId,
            chainName: config.chainName,
            nativeCurrency: config.nativeCurrency,
            rpcUrls: config.rpcUrls,
            blockExplorerUrls: config.blockExplorerUrls
          }],
        });
        return true;
      } catch (addError) {
        console.error("Failed to add testnet chain:", addError);
        return false;
      }
    }
    console.error("Failed to switch network chain:", switchError);
    return false;
  }
}

// Send Testnet Payment Transaction via MetaMask on specified chain
export async function sendTestnetEscrowPayment({ recipientAddress, amountEth, networkKey = "amoy" }) {
  const ethProvider = getEthereumProvider();
  if (!ethProvider) {
    throw new Error("MetaMask is required for real testnet transaction signing.");
  }

  const provider = new ethers.BrowserProvider(ethProvider);
  const signer = await provider.getSigner();
  const config = TESTNET_NETWORKS[networkKey] || TESTNET_NETWORKS["amoy"];

  // Convert INR amount equivalent to Testnet token ratio
  const tokenValue = (amountEth / 250000).toFixed(6);
  const valueWei = ethers.parseEther(tokenValue > 0.0001 ? tokenValue : "0.001");

  const tx = await signer.sendTransaction({
    to: recipientAddress || CONTRACT_ADDRESS,
    value: valueWei,
  });

  const explorerBase = config.blockExplorerUrls[0] || "https://amoy.polygonscan.com";

  return {
    hash: tx.hash,
    tokenAmount: tokenValue,
    symbol: config.nativeCurrency.symbol,
    chainName: config.chainName,
    blockExplorerUrl: `${explorerBase}/tx/${tx.hash}`
  };
}

// Generate IPFS Hash Simulator
export function generateIPFSHash(cropName, farmerName) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomHash = "Qm";
  for (let i = 0; i < 44; i++) {
    randomHash += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return {
    ipfsHash: randomHash,
    ipfsUrl: `https://gateway.pinata.cloud/ipfs/${randomHash}`
  };
}
