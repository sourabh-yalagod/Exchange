import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const cryptos = [
  {
    image: "/btc.png",
    title: "BTC",
    name: "btcusd",
    price: 922,
    status: "2%",
  },
  {
    image: "/btc.png",
    title: "BTC",
    name: "btcusd",
    price: 922,
    status: "2%",
  },
  {
    image: "/btc.png",
    title: "BTC",
    name: "btcusd",
    price: 922,
    status: "2%",
  },
  {
    image: "/btc.png",
    title: "BTC",
    name: "btcusd",
    price: 922,
    status: "2%",
  },
  {
    image: "/btc.png",
    title: "BTC",
    name: "btcusd",
    price: 922,
    status: "2%",
  },
];

export const exchangeItems = [
  "BTC/USDT",
  "ETH/USDT",
  "SOL/USDT",
  "XRP/USDT",
  "DOGE/USDT",
  "ADA/USDT",
];

export const qna = [
  {
    id: 1,
    question: "What is a cryptocurrency exchange?",
    answer:
      "Cryptocurrency exchanges are digital marketplaces that enable users to buy and sell cryptocurrencies like Bitcoin, Ethereum, and Tether. The Binance exchange is the largest crypto exchange by trade volume.",
  },
  {
    id: 2,
    question: "What are the types of cryptocurrency exchanges?",
    answer:
      "There are mainly two types of cryptocurrency exchanges: centralized exchanges (CEX) like Binance and Coinbase, and decentralized exchanges (DEX) like Uniswap and PancakeSwap.",
  },
  {
    id: 3,
    question: "How do centralized exchanges (CEX) work?",
    answer:
      "Centralized exchanges act as intermediaries between buyers and sellers. Users deposit funds into the exchange, and the platform facilitates the trading process, often offering features like order books and trading pairs.",
  },
  {
    id: 4,
    question: "What are the advantages of decentralized exchanges (DEX)?",
    answer:
      "Decentralized exchanges offer greater privacy, reduced reliance on intermediaries, and improved security since users retain control of their funds. However, they may have lower liquidity and slower transaction speeds.",
  },
  {
    id: 5,
    question: "Is KYC required on all crypto exchanges?",
    answer:
      "Most centralized exchanges require users to complete Know Your Customer (KYC) verification to comply with regulations. However, many decentralized exchanges allow trading without KYC.",
  },
  {
    id: 6,
    question: "What should I consider when choosing a crypto exchange?",
    answer:
      "Key factors include security features, supported cryptocurrencies, trading fees, user interface, liquidity, customer support, and whether the exchange is centralized or decentralized.",
  },
  {
    id: 7,
    question: "Are cryptocurrency exchanges safe?",
    answer:
      "While many exchanges have robust security measures, no platform is immune to risks. It's important to use exchanges with strong reputations, enable two-factor authentication, and consider storing assets in a private wallet.",
  },
];
