"use client";

import * as React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import {
  DollarSign,
  LucideEqual,
  UserCircle2,
  CherryIcon,
  Accessibility,
  AlertOctagon,
  Monitor,
  Network,
  TrendingUp,
  BarChart3,
  LineChart,
  Coins,
  PiggyBank,
  ShieldCheck,
  Gift,
  Banknote,
  BadgeDollarSign,
  Layers,
  Building2,
  Info,
  Settings,
  HelpCircle,
  Contact,
  Star,
  Book,
  ArrowRight,
} from "lucide-react";

const navBarData = {
  trade: [
    {
      title: "Spot",
      description: "Buy and sell crypto with advanced tools",
      icon: <DollarSign />,
    },
    {
      title: "Margin",
      description: "Increase your profit with leverage",
      icon: <LucideEqual />,
    },
    {
      title: "P2P",
      description: "Buy and sell cryptocurrencies with 8000+ active users",
      icon: <UserCircle2 />,
    },
    {
      title: "Convert and Block Trade",
      description: "Easiest way to trade crypto in the market",
      icon: <CherryIcon />,
    },
    {
      title: "Alpha Trading",
      description: "Quick access to web3 via Alpha trading for free",
      icon: <Accessibility />,
    },
    {
      title: "Trading Bots",
      description:
        "Trade smarter with our automated bots and algorithmic strategies",
      icon: <AlertOctagon />,
    },
    {
      title: "Copy Trading",
      description: "Follow top-performing traders",
      icon: <Monitor />,
    },
    {
      title: "APIs",
      description: "Unlimited open API access",
      icon: <Network />,
    },
  ],

  futures: [
    {
      title: "USDT-M Futures",
      description: "Trade futures with USDT margin",
      icon: <TrendingUp />,
    },
    {
      title: "COIN-M Futures",
      description: "Trade futures using cryptocurrencies as margin",
      icon: <BarChart3 />,
    },
    {
      title: "Options",
      description: "Flexible and powerful crypto options trading",
      icon: <LineChart />,
    },
    {
      title: "Grid Trading",
      description: "Automated buy-low, sell-high strategy",
      icon: <AlertOctagon />,
    },
  ],

  earn: [
    {
      title: "Simple Earn",
      description: "Earn interest on your crypto easily",
      icon: <Coins />,
    },
    {
      title: "Staking",
      description: "Stake crypto and earn rewards",
      icon: <PiggyBank />,
    },
    {
      title: "Dual Investment",
      description: "Boost returns in volatile markets",
      icon: <ShieldCheck />,
    },
    {
      title: "Launchpool",
      description: "Farm new tokens with your crypto",
      icon: <Gift />,
    },
    {
      title: "ETH Staking",
      description: "Stake ETH and earn rewards post-merge",
      icon: <Banknote />,
    },
  ],

  square: [
    {
      title: "Academy",
      description: "Learn crypto with tutorials & courses",
      icon: <Book />,
    },
    {
      title: "Live Updates",
      description: "Track the latest crypto news & updates",
      icon: <Star />,
    },
    {
      title: "Research",
      description: "In-depth analysis of crypto trends",
      icon: <LineChart />,
    },
    {
      title: "Community",
      description: "Join a global community of crypto users",
      icon: <Building2 />,
    },
  ],

  more: [
    {
      title: "About Us",
      description: "Learn more about our mission and team",
      icon: <Info />,
    },
    {
      title: "Settings",
      description: "Customize your trading experience",
      icon: <Settings />,
    },
    {
      title: "Help Center",
      description: "Get support and FAQs",
      icon: <HelpCircle />,
    },
    {
      title: "Contact",
      description: "Reach out to us directly",
      icon: <Contact />,
    },
    {
      title: "Referral Program",
      description: "Invite friends and earn rewards",
      icon: <BadgeDollarSign />,
    },
    {
      title: "Partners",
      description: "Explore our partner ecosystem",
      icon: <Layers />,
    },
  ],
};

function NavigationBar() {
  return (
    <NavigationMenu className="hidden md:block">
      <NavigationMenuList className="-space-x-7 text-xs md:text-lg lg:space-x-0 lg:font-semibold">
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent sm:text-lg">
            Trade
          </NavigationMenuTrigger>
          <NavigationMenuContent className="dark:bg-[#1e2329] p-5 hover:dark:bg-[#1e2329]">
            <ul className="grid w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {navBarData.trade.map((component) => {
                return (
                  <NavItems
                    icon={component.icon}
                    title={component.title}
                    description={component.description}
                  />
                );
              })}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent sm:text-lg">
            Futures
          </NavigationMenuTrigger>
          <NavigationMenuContent className="dark:bg-[#1e2329] p-5 hover:dark:bg-[#1e2329]">
            <ul className="grid w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {navBarData.futures.map((component) => {
                return (
                  <NavItems
                    icon={component.icon}
                    title={component.title}
                    description={component.description}
                  />
                );
              })}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent sm:text-lg">
            Earn
          </NavigationMenuTrigger>
          <NavigationMenuContent className="dark:bg-[#1e2329] p-5 hover:dark:bg-[#1e2329]">
            <ul className="grid w-[400px]  md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {navBarData.earn.map((component) => {
                return (
                  <NavItems
                    icon={component.icon}
                    title={component.title}
                    description={component.description}
                  />
                );
              })}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent sm:text-lg">
            square
          </NavigationMenuTrigger>
          <NavigationMenuContent className="dark:bg-[#1e2329] p-5 hover:dark:bg-[#1e2329]">
            <ul className="grid w-[400px]  md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {navBarData.square.map((component) => {
                return (
                  <NavItems
                    icon={component.icon}
                    title={component.title}
                    description={component.description}
                  />
                );
              })}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent sm:text-lg">
            More
          </NavigationMenuTrigger>
          <NavigationMenuContent className="dark:bg-[#1e2329] p-5 hover:dark:bg-[#1e2329]">
            <ul className="grid w-[400px]  md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {navBarData.more.map((component) => {
                return (
                  <NavItems
                    icon={component.icon}
                    title={component.title}
                    description={component.description}
                  />
                );
              })}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
export default NavigationBar;

const NavItems = ({
  icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) => {
  return (
    <div className="flex gap-2 space-x-3 group space-y-3 hover:scale-105 transition-all cursor-pointer p-1 rounded-lg">
      <div className="pt-2">{icon}</div>
      <div>
        <div className="flex gap-2 items-center">
          <h2 className="capitalize font-semibold text-lg">{title}</h2>
          <div className="group:block">
            <ArrowRight
              color="#8B9002"
              className="opacity-0 ml-2 font-bold -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-100"
            />
          </div>
        </div>
        <p className="dark:text-slate-500 text-slate-700">{description}</p>
      </div>
    </div>
  );
};
