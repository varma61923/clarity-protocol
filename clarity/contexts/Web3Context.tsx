
import React, { useState, useCallback, useMemo, createContext, useContext, useEffect } from 'react';
import { ethers } from 'ethers';
import { SiweMessage } from 'siwe';
import { SiweSession } from '../types';
import { apiClient } from '../services/apiClient';

const articleRegistryAbi = [
    "function registerArticle(uint256 id, string calldata contentCid, string calldata metadataCid, bytes calldata signature) external",
    "event ArticleRegistered(uint256 id, string contentCid, string metadataCid, address author)"
];

const journalistSbtAbi = [
    "function mint(address to, uint256 tokenId) external",
    "event SBTMinted(address indexed to, uint256 tokenId)"
];

const reputationManagerAbi = [
    "function updateReputation(address user, uint256 score) external",
    "event ReputationUpdated(address indexed user, uint256 score)"
];

const daoControllerAbi = [
    "function createProposal(string calldata title, string calldata description, uint256 duration) external",
    "event ProposalCreated(uint256 id, string title, address creator)"
];

const subscriptionManagerAbi = [
    "function subscribe(address author, uint256 amount, string calldata currency) external",
    "event Subscribed(uint256 id, address subscriber, address author)"
];

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface Web3ContextType {
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  session: SiweSession | null;
  error: string | null;
  signInWithEthereum: () => Promise<void>;
  signOut: () => void;
  articleRegistryContract: ethers.Contract | null;
  journalistSbtContract: ethers.Contract | null;
  reputationManagerContract: ethers.Contract | null;
  daoControllerContract: ethers.Contract | null;
  subscriptionManagerContract: ethers.Contract | null;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [session, setSession] = useState<SiweSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [articleRegistryContract, setArticleRegistryContract] = useState<ethers.Contract | null>(null);
  const [journalistSbtContract, setJournalistSbtContract] = useState<ethers.Contract | null>(null);
  const [reputationManagerContract, setReputationManagerContract] = useState<ethers.Contract | null>(null);
  const [daoControllerContract, setDaoControllerContract] = useState<ethers.Contract | null>(null);
  const [subscriptionManagerContract, setSubscriptionManagerContract] = useState<ethers.Contract | null>(null);

  const clearState = () => {
    setProvider(null);
    setSigner(null);
    setSession(null);
    setError(null);
    setArticleRegistryContract(null);
    setJournalistSbtContract(null);
    setReputationManagerContract(null);
    setDaoControllerContract(null);
    setSubscriptionManagerContract(null);
    localStorage.removeItem('clarity-siwe-session');
  };

  const signInWithEthereum = useCallback(async () => {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed.');
    }
    try {
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const web3Signer = await web3Provider.getSigner();
      const address = await web3Signer.getAddress();
      const network = await web3Provider.getNetwork();

      // Create SIWE message
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign in to CLARITY Protocol',
        uri: window.location.origin,
        version: '1',
        chainId: Number(network.chainId),
      });

      const signature = await web3Signer.signMessage(message.prepareMessage());

      // In a real app, you would send the message and signature to a backend for verification.
      // Here, we simulate successful verification.
      console.log('[SIWE] Signed in successfully:', { address, signature });

      const newSession = { address, chainId: Number(network.chainId), signer: web3Signer };
      setProvider(web3Provider);
      setSigner(web3Signer);
      setSession(newSession);
      setArticleRegistryContract(new ethers.Contract(apiClient.getConfig().contracts.ArticleRegistry, articleRegistryAbi, web3Signer));
      setJournalistSbtContract(new ethers.Contract(apiClient.getConfig().contracts.JournalistSBT, journalistSbtAbi, web3Signer));
      setReputationManagerContract(new ethers.Contract(apiClient.getConfig().contracts.ReputationManager, reputationManagerAbi, web3Signer));
      setDaoControllerContract(new ethers.Contract(apiClient.getConfig().contracts.DAOController, daoControllerAbi, web3Signer));
      setSubscriptionManagerContract(new ethers.Contract(apiClient.getConfig().contracts.SubscriptionManager, subscriptionManagerAbi, web3Signer));
      localStorage.setItem('clarity-siwe-session', JSON.stringify(newSession));
      
      const authorExists = await apiClient.authorExists(address);
      if(!authorExists) {
        await apiClient.createAuthor(address);
      }

    } catch (e: any) {
      clearState();
      console.error(e);
      throw new Error(e.message || 'An error occurred during sign-in.');
    }
  }, []);
  
  const signOut = useCallback(() => {
    clearState();
  }, []);

  useEffect(() => {
    const savedSession = localStorage.getItem('clarity-siwe-session');
    if (savedSession) {
      const parsedSession = JSON.parse(savedSession);
      if (parsedSession.address) {
          // Attempt to re-establish provider/signer silently
          if(window.ethereum) {
              const web3Provider = new ethers.BrowserProvider(window.ethereum);
              web3Provider.getSigner().then(web3Signer => {
                setProvider(web3Provider);
                setSigner(web3Signer);
                setSession(parsedSession);
              }).catch(err => {
                  console.log("Could not re-establish signer, user may need to connect.", err)
                  signOut();
              });
          }
      }
    }
  }, [signOut]);

  const value = useMemo(() => ({ provider, signer, session, error, signInWithEthereum, signOut, articleRegistryContract, journalistSbtContract, reputationManagerContract, daoControllerContract, subscriptionManagerContract }), [provider, signer, session, error, signInWithEthereum, signOut, articleRegistryContract, journalistSbtContract, reputationManagerContract, daoControllerContract, subscriptionManagerContract]);

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

export const useWeb3 = (): Web3ContextType => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};
