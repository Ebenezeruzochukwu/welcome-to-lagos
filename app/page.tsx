'use client';

import { useState, useEffect } from 'react';
import { supabase } from './supabase';

const PATHS = [
  { id: 'STREET', name: 'STREET', desc: 'Small hustle. Quick cash, high risk, raw survival.' },
  { id: 'TECH', name: 'TECH', desc: 'Freelancing, pitching startups, building systems.' },
  { id: 'TRADE', name: 'TRADE', desc: 'Buy and sell goods. Alaba and Balogun container moves.' },
  { id: 'ENTERTAINMENT', name: 'ENTERTAINMENT', desc: 'Events, nightlife, hype, and clout.' },
  { id: 'CORPORATE', name: 'CORPORATE', desc: 'Boardrooms, steady salaries, and strategic investing.' },
];

const SHOP_ITEMS = [
  {
    id: 'okada',
    name: 'TVS Boxer Motorcycle',
    category: 'Mobility',
    price: 320000,
    desc: 'Bypass gridlock entirely. Dispatch & errand runs cost 50% less energy.',
  },
  {
    id: 'macbook',
    name: 'MacBook Pro M2',
    category: 'Workstation',
    price: 850000,
    desc: 'Unlocks high-tier web agency gigs with ₦180k+ payouts.',
  },
  {
    id: 'generator',
    name: '3.5kVA I-Pass-My-Neighbor Gen',
    category: 'Power',
    price: 180000,
    desc: 'NEPA insurance. Protects against random blackouts and energy loss.',
  },
  {
    id: 'yaba_apartment',
    name: 'Self-Contain in Yaba',
    category: 'Shelter',
    price: 1200000,
    desc: 'Ditch the squatter life. Boosts daily energy recharge to 120 max.',
  },
];

// Universal basic hustles for everybody
const COMMON_HUSTLES = [
  {
    id: 'dispatch',
    title: 'Run Ikeja Dispatch Runs',
    baseEnergy: 15,
    payout: 8500,
    repGain: 1,
    minRep: 0,
    desc: 'Beat the traffic gridlock and deliver fast parcels around Computer Village.',
  },
  {
    id: 'market_arbitrage',
    title: 'Balogun Wholesale Flipping',
    baseEnergy: 20,
    payout: 22000,
    repGain: 2,
    minRep: 0,
    desc: 'Pick up fast-moving bulk accessories and flip them across local shops.',
  },
];

// Exclusive archetype progression trees
const PATH_SPECIFIC_HUSTLES: Record<string, any[]> = {
  STREET: [
    {
      id: 'street_loading',
      title: 'Oshodi Bus Park Loading',
      baseEnergy: 18,
      payout: 16000,
      repGain: 2,
      minRep: 0,
      desc: 'Fill Danfo buses during rush hour and collect ticket cut.',
    },
    {
      id: 'port_clearance',
      title: 'Apapa Port Clearance Fast-Track',
      baseEnergy: 30,
      payout: 85000,
      repGain: 5,
      minRep: 10,
      desc: 'Facilitate customs line bypass for stranded container trucks.',
    },
    {
      id: 'estate_security_syndicate',
      title: 'Island Vigilante Security Contract',
      baseEnergy: 40,
      payout: 240000,
      repGain: 10,
      minRep: 25,
      desc: 'Lock down physical asset access for private estates in Lekki.',
    },
  ],
  TECH: [
    {
      id: 'quick_landing_page',
      title: 'Deliver Quick Landing Page',
      baseEnergy: 25,
      payout: 35000,
      repGain: 3,
      minRep: 0,
      desc: 'Rush a Next.js setup for an agency client before close of business.',
    },
    {
      id: 'fintech_api_integration',
      title: 'Paystack/Monnify Gateway Integration',
      baseEnergy: 35,
      payout: 110000,
      repGain: 6,
      minRep: 8,
      desc: 'Architect seamless payment verification pipelines for an e-commerce brand.',
    },
    {
      id: 'pitch_preseed',
      title: 'Pitch Pre-Seed to Island Angels',
      baseEnergy: 50,
      payout: 450000,
      repGain: 15,
      minRep: 25,
      desc: 'Deliver a 10-slide deck to angel syndicates at an upscale Ikoyi lounge.',
    },
  ],
  TRADE: [
    {
      id: 'gadget_swap',
      title: 'Computer Village Phone Swapping',
      baseEnergy: 20,
      payout: 28000,
      repGain: 2,
      minRep: 0,
      desc: 'Refurbish, test, and swap clean UK-used phones with a margin.',
    },
    {
      id: 'alaba_container',
      title: 'Alaba Container Share Investment',
      baseEnergy: 35,
      payout: 140000,
      repGain: 7,
      minRep: 10,
      desc: 'Co-fund a high-demand consumer electronics consignment offload.',
    },
    {
      id: 'cross_border_import',
      title: 'Cotonou Heavy Equipment Consignment',
      baseEnergy: 45,
      payout: 380000,
      repGain: 12,
      minRep: 25,
      desc: 'Run a direct customs clearance for commercial diesel generators.',
    },
  ],
  ENTERTAINMENT: [
    {
      id: 'nightlife_hype',
      title: 'VI Club Table Host & Hype',
      baseEnergy: 25,
      payout: 30000,
      repGain: 3,
      minRep: 0,
      desc: 'Fill tables, order bottles, and coordinate high-roller nightlife energy.',
    },
    {
      id: 'concert_ticketing',
      title: 'Detty December VIP Scalping',
      baseEnergy: 35,
      payout: 125000,
      repGain: 6,
      minRep: 8,
      desc: 'Corner early-bird arena tickets and offload them to last-minute revelers.',
    },
    {
      id: 'brand_deal_sponsorship',
      title: 'Direct Beverage Brand Influencer Retainer',
      baseEnergy: 40,
      payout: 320000,
      repGain: 14,
      minRep: 25,
      desc: 'Sign a headline activation deal for a nationwide brand festival.',
    },
  ],
  CORPORATE: [
    {
      id: 'excel_audit',
      title: 'Financial Model Spreadsheet Audit',
      baseEnergy: 25,
      payout: 40000,
      repGain: 3,
      minRep: 0,
      desc: 'Clean up chaotic ledger books for an FMCG distributor.',
    },
    {
      id: 'board_strategy',
      title: 'Executive Advisory Memos',
      baseEnergy: 35,
      payout: 150000,
      repGain: 7,
      minRep: 10,
      desc: 'Deliver risk analyses and growth playbooks for a commercial firm.',
    },
    {
      id: 'merger_acquisition',
      title: 'Lead Commercial Due Diligence',
      baseEnergy: 50,
      payout: 500000,
      repGain: 18,
      minRep: 30,
      desc: 'Structure a private buyout for an indigenous logistics operator.',
    },
  ],
};

const RANDOM_EVENTS = [
  {
    title: 'Agbero Road Block',
    text: 'Area boys intercepted you near Oshodi demanding settlement ticket.',
    cashDelta: -5000,
    energyDelta: 0,
    type: 'danger',
  },
  {
    title: 'Third Mainland Gridlock',
    text: 'A broken-down tanker locked the expressway for 3 hours.',
    cashDelta: 0,
    energyDelta: -15,
    type: 'danger',
  },
  {
    title: 'Fuel Scarcity Surcharge',
    text: 'Filling station queues doubled transport fare for your trip.',
    cashDelta: -3000,
    energyDelta: 0,
    type: 'danger',
  },
  {
    title: 'Generous Client Bonus',
    text: 'Your client was impressed with the speed and added an appreciation tip!',
    cashDelta: 15000,
    energyDelta: 0,
    type: 'lucky',
  },
];

export default function Home() {
  const [username, setUsername] = useState('');
  const [selectedPath, setSelectedPath] = useState('STREET');
  const [player, setPlayer] = useState<any>(null);
  const [assets, setAssets] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [activeEvent, setActiveEvent] = useState<any>(null);

  // Bank Form State
  const [bankAmount, setBankAmount] = useState('');
  const [repayAmount, setRepayAmount] = useState('');

  const fetchLeaderboard = async () => {
    const { data } = await supabase
      .from('players')
      .select('id, username, path, cash, bank, debt, reputation, day_count')
      .limit(10);

    if (data) {
      const sorted = [...data].sort((a, b) => {
        const netA = Number(a.cash) + Number(a.bank ?? 0) - Number(a.debt ?? 0);
        const netB = Number(b.cash) + Number(b.bank ?? 0) - Number(b.debt ?? 0);
        return netB - netA;
      });
      setLeaderboard(sorted);
    }
  };

  useEffect(() => {
    async function loadCurrentPlayer() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: playerData } = await supabase
          .from('players')
          .select('*')
          .eq('id', user.id)
          .single();
        if (playerData) {
          setPlayer(playerData);
          setLogs([`Welcome back, @${playerData.username}. Lagos is active.`]);

          const { data: assetData } = await supabase
            .from('player_assets')
            .select('*')
            .eq('player_id', user.id);
          if (assetData) setAssets(assetData);
        }
      }
      await fetchLeaderboard();
      setInitLoading(false);
    }
    loadCurrentPlayer();
  }, []);

  const hasItem = (itemId: string) => assets.some((a) => a.item_id === itemId);

  const handleStartLife = async () => {
    if (!username.trim()) {
      setErrorMsg('Enter an alias first.');
      return;
    }
    setLoading(true);
    setErrorMsg('');

    const { data: authData, error: authError } = await supabase.auth.signInAnonymously();
    if (authError) {
      setErrorMsg(authError.message);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('players')
      .insert({
        id: authData.user?.id,
        username: username.trim(),
        path: selectedPath,
        cash: 50000,
        bank: 0,
        debt: 0,
        energy: 100,
        reputation: 0,
        day_count: 1,
      })
      .select()
      .single();

    if (error) {
      setErrorMsg(error.message);
    } else {
      setPlayer(data);
      setLogs([`Arrived in Lagos with ₦50,000 cash.`]);
      fetchLeaderboard();
    }
    setLoading(false);
  };

  const handleExecuteHustle = async (hustle: any) => {
    if (!player) return;

    let effectiveCost = hustle.baseEnergy;
    let effectivePayout = hustle.payout;

    if (hustle.id === 'dispatch' && hasItem('okada')) {
      effectiveCost = Math.round(effectiveCost * 0.5);
    }
    if (hustle.id === 'quick_landing_page' && hasItem('macbook')) {
      effectivePayout = 180000;
    }

    if (player.energy < effectiveCost) {
      setLogs((prev) => [`⚠️ Out of energy! Take a rest or end Day ${player.day_count ?? 1}.`, ...prev]);
      return;
    }

    setActionLoading(true);
    setActiveEvent(null);

    let updatedCash = Number(player.cash) + effectivePayout;
    let updatedEnergy = Math.max(0, player.energy - effectiveCost);
    let updatedRep = player.reputation + hustle.repGain;

    const eventRoll = Math.random();
    let triggeredEvent: any = null;

    if (eventRoll < 0.35) {
      const eventIndex = Math.floor(Math.random() * RANDOM_EVENTS.length);
      triggeredEvent = RANDOM_EVENTS[eventIndex];
      updatedCash = Math.max(0, updatedCash + triggeredEvent.cashDelta);
      updatedEnergy = Math.max(0, updatedEnergy + triggeredEvent.energyDelta);
    }

    const { data, error } = await supabase
      .from('players')
      .update({
        cash: updatedCash,
        energy: updatedEnergy,
        reputation: updatedRep,
      })
      .eq('id', player.id)
      .select()
      .single();

    if (error) {
      setLogs((prev) => [`❌ Error: ${error.message}`, ...prev]);
    } else {
      setPlayer(data);
      let newLog = `✅ Completed "${hustle.title}": +₦${effectivePayout.toLocaleString()} | -${effectiveCost} Energy | +${hustle.repGain} Rep`;
      
      if (triggeredEvent) {
        setActiveEvent(triggeredEvent);
        const effectStr = triggeredEvent.cashDelta !== 0 
          ? `${triggeredEvent.cashDelta > 0 ? '+₦' : '-₦'}${Math.abs(triggeredEvent.cashDelta).toLocaleString()}` 
          : `${triggeredEvent.energyDelta} Energy`;
        newLog = `🚨 [LAGOS FACTOR] ${triggeredEvent.title} (${effectStr}) | ` + newLog;
      }

      setLogs((prev) => [newLog, ...prev]);
      fetchLeaderboard();
    }
    setActionLoading(false);
  };

  const handleBuyAsset = async (item: typeof SHOP_ITEMS[0]) => {
    if (!player) return;
    const totalLiquid = Number(player.cash);

    if (totalLiquid < item.price) {
      setLogs((prev) => [`❌ Insufficient liquid cash for ${item.name}. (Need ₦${item.price.toLocaleString()})`, ...prev]);
      return;
    }

    setActionLoading(true);

    const { data: updatedPlayerData, error: playerErr } = await supabase
      .from('players')
      .update({ cash: totalLiquid - item.price })
      .eq('id', player.id)
      .select()
      .single();

    if (playerErr) {
      setLogs((prev) => [`❌ Transaction failed: ${playerErr.message}`, ...prev]);
      setActionLoading(false);
      return;
    }

    const { data: newAsset, error: assetErr } = await supabase
      .from('player_assets')
      .insert({
        player_id: player.id,
        item_id: item.id,
        item_name: item.name,
        category: item.category,
      })
      .select()
      .single();

    if (assetErr) {
      setLogs((prev) => [`❌ Asset register error: ${assetErr.message}`, ...prev]);
    } else {
      setPlayer(updatedPlayerData);
      setAssets((prev) => [...prev, newAsset]);
      setLogs((prev) => [`🎉 ASSET ACQUIRED: ${item.name}! Perk active.`, ...prev]);
      fetchLeaderboard();
    }

    setActionLoading(false);
  };

  const handleRest = async () => {
    if (!player) return;
    const maxEnergy = hasItem('yaba_apartment') ? 120 : 100;
    if (player.energy >= maxEnergy) {
      setLogs((prev) => [`Battery full! Energy is at maximum (${maxEnergy}).`, ...prev]);
      return;
    }

    setActionLoading(true);
    const recoveredEnergy = Math.min(maxEnergy, player.energy + 30);

    const { data, error } = await supabase
      .from('players')
      .update({ energy: recoveredEnergy })
      .eq('id', player.id)
      .select()
      .single();

    if (error) {
      setLogs((prev) => [`❌ Error: ${error.message}`, ...prev]);
    } else {
      setPlayer(data);
      setLogs((prev) => [`💤 Rested up. Recovered +30 Energy.`, ...prev]);
    }
    setActionLoading(false);
  };

  const handleBankDeposit = async () => {
    const amt = Number(bankAmount);
    if (!amt || amt <= 0 || amt > Number(player.cash)) {
      setLogs((prev) => [`⚠️ Invalid deposit amount.`, ...prev]);
      return;
    }

    setActionLoading(true);
    const { data, error } = await supabase
      .from('players')
      .update({
        cash: Number(player.cash) - amt,
        bank: Number(player.bank ?? 0) + amt,
      })
      .eq('id', player.id)
      .select()
      .single();

    if (error) {
      setLogs((prev) => [`❌ Bank Error: ${error.message}`, ...prev]);
    } else {
      setPlayer(data);
      setBankAmount('');
      setLogs((prev) => [`🏦 Saved ₦${amt.toLocaleString()} safely in the vault.`, ...prev]);
      fetchLeaderboard();
    }
    setActionLoading(false);
  };

  const handleBankWithdraw = async () => {
    const amt = Number(bankAmount);
    if (!amt || amt <= 0 || amt > Number(player.bank ?? 0)) {
      setLogs((prev) => [`⚠️ Invalid withdrawal amount.`, ...prev]);
      return;
    }

    setActionLoading(true);
    const { data, error } = await supabase
      .from('players')
      .update({
        cash: Number(player.cash) + amt,
        bank: Number(player.bank ?? 0) - amt,
      })
      .eq('id', player.id)
      .select()
      .single();

    if (error) {
      setLogs((prev) => [`❌ Bank Error: ${error.message}`, ...prev]);
    } else {
      setPlayer(data);
      setBankAmount('');
      setLogs((prev) => [`🏧 Withdrew ₦${amt.toLocaleString()} liquid cash.`, ...prev]);
      fetchLeaderboard();
    }
    setActionLoading(false);
  };

  const handleRepayDebt = async () => {
    const amt = Number(repayAmount);
    const currentDebt = Number(player.debt ?? 0);
    const currentCash = Number(player.cash);

    if (!amt || amt <= 0 || amt > currentCash) {
      setLogs((prev) => [`⚠️ Invalid repayment amount.`, ...prev]);
      return;
    }

    const payOff = Math.min(amt, currentDebt);
    setActionLoading(true);

    const { data, error } = await supabase
      .from('players')
      .update({
        cash: currentCash - payOff,
        debt: currentDebt - payOff,
      })
      .eq('id', player.id)
      .select()
      .single();

    if (error) {
      setLogs((prev) => [`❌ Repayment Error: ${error.message}`, ...prev]);
    } else {
      setPlayer(data);
      setRepayAmount('');
      setLogs((prev) => [`💳 Cleared ₦${payOff.toLocaleString()} debt! Remaining: ₦${Number(data.debt).toLocaleString()}`, ...prev]);
      fetchLeaderboard();
    }
    setActionLoading(false);
  };

  const handleTakeLoan = async (loanAmt: number) => {
    if (!player) return;
    setActionLoading(true);

    const { data, error } = await supabase
      .from('players')
      .update({
        cash: Number(player.cash) + loanAmt,
        debt: Number(player.debt ?? 0) + Math.round(loanAmt * 1.25),
      })
      .eq('id', player.id)
      .select()
      .single();

    if (error) {
      setLogs((prev) => [`❌ Loan Error: ${error.message}`, ...prev]);
    } else {
      setPlayer(data);
      setLogs((prev) => [
        `⚠️ Borrowed ₦${loanAmt.toLocaleString()}. Debt increased to ₦${Number(data.debt).toLocaleString()} (25% fee).`,
        ...prev,
      ]);
      fetchLeaderboard();
    }
    setActionLoading(false);
  };

  const handleEndDay = async () => {
    if (!player) return;
    setActionLoading(true);

    const DAILY_BURN = 4500;
    const currentCash = Number(player.cash);
    const currentDebt = Number(player.debt ?? 0);
    const nextDay = (player.day_count ?? 1) + 1;
    const maxEnergy = hasItem('yaba_apartment') ? 120 : 100;

    let updatedCash = currentCash - DAILY_BURN;
    let debtPenaltyLog = '';

    let updatedDebt = 0;
    if (currentDebt > 0) {
      const interest = Math.round(currentDebt * 0.10);
      debtPenaltyLog = ` Loan shark charged 10% daily interest (+₦${interest.toLocaleString()}).`;
      updatedDebt = currentDebt + interest;
    }

    const { data, error } = await supabase
      .from('players')
      .update({
        day_count: nextDay,
        energy: maxEnergy,
        cash: updatedCash,
        debt: updatedDebt,
      })
      .eq('id', player.id)
      .select()
      .single();

    if (error) {
      setLogs((prev) => [`❌ Error: ${error.message}`, ...prev]);
    } else {
      setPlayer(data);
      setLogs((prev) => [
        `🌅 Day ${nextDay} reached! Daily sustenance burn: -₦${DAILY_BURN.toLocaleString()} | Energy restored to ${maxEnergy}.${debtPenaltyLog}`,
        ...prev,
      ]);
      fetchLeaderboard();
    }
    setActionLoading(false);
  };

  // Compile active hustles: common + current path
  const activePathHustles = player && PATH_SPECIFIC_HUSTLES[player.path] 
    ? PATH_SPECIFIC_HUSTLES[player.path] 
    : [];
  const fullHustleDeck = [...COMMON_HUSTLES, ...activePathHustles];

  if (initLoading) {
    return (
      <main className="min-h-screen bg-neutral-950 text-neutral-400 flex items-center justify-center font-mono text-sm">
        Loading Lagos state...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="flex justify-between items-center text-xs text-neutral-400 font-semibold px-1">
            <span className="text-emerald-400 uppercase tracking-widest">The Hustle Engine</span>
            {player && (
              <span className="bg-neutral-800 border border-neutral-700 px-2.5 py-0.5 rounded-full text-amber-300">
                Day {player.day_count ?? 1}
              </span>
            )}
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Welcome to Lagos</h1>
          <p className="text-sm text-neutral-400">Street smarts, raw execution, compound capital.</p>
        </div>

        {player ? (
          <div className="space-y-6">
            {/* Player Status Card */}
            <div className="bg-neutral-800/80 p-5 rounded-xl border border-neutral-700 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-xl text-emerald-400">@{player.username}</span>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full uppercase tracking-wider font-semibold">
                  {player.path}
                </span>
              </div>
              
              <div className="grid grid-cols-4 gap-2 pt-3 border-t border-neutral-700/60 text-center">
                <div className="bg-neutral-900/60 p-2 rounded-lg border border-neutral-800">
                  <p className="text-neutral-400 text-[10px] uppercase font-bold">Liquid Cash</p>
                  <p className="font-bold text-sm text-emerald-400 mt-0.5">₦{Number(player.cash).toLocaleString()}</p>
                </div>
                <div className="bg-neutral-900/60 p-2 rounded-lg border border-neutral-800">
                  <p className="text-neutral-400 text-[10px] uppercase font-bold">Bank Vault</p>
                  <p className="font-bold text-sm text-sky-400 mt-0.5">₦{Number(player.bank ?? 0).toLocaleString()}</p>
                </div>
                <div className="bg-neutral-900/60 p-2 rounded-lg border border-neutral-800">
                  <p className="text-neutral-400 text-[10px] uppercase font-bold">Active Debt</p>
                  <p className="font-bold text-sm text-rose-400 mt-0.5">₦{Number(player.debt ?? 0).toLocaleString()}</p>
                </div>
                <div className="bg-neutral-900/60 p-2 rounded-lg border border-neutral-800">
                  <p className="text-neutral-400 text-[10px] uppercase font-bold">Energy</p>
                  <p className="font-bold text-sm text-amber-400 mt-0.5">{player.energy}/{hasItem('yaba_apartment') ? 120 : 100}</p>
                </div>
              </div>

              {/* Energy bar visual */}
              <div className="w-full bg-neutral-950 rounded-full h-2 overflow-hidden border border-neutral-800">
                <div
                  className="bg-amber-400 h-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(0, (player.energy / (hasItem('yaba_apartment') ? 120 : 100)) * 100))}%` }}
                />
              </div>

              {/* Owned Assets Badges */}
              {assets.length > 0 && (
                <div className="pt-2 border-t border-neutral-700/60 flex flex-wrap gap-1.5 items-center">
                  <span className="text-[10px] uppercase text-neutral-400 font-bold tracking-wider mr-1">Assets:</span>
                  {assets.map((a) => (
                    <span key={a.id} className="text-[11px] bg-neutral-900 border border-neutral-700 text-neutral-300 px-2 py-0.5 rounded-md">
                      📦 {a.item_name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Random Event Banner */}
            {activeEvent && (
              <div className={`p-4 rounded-xl border ${
                activeEvent.type === 'lucky' 
                  ? 'bg-emerald-950/40 border-emerald-500/80 text-emerald-200' 
                  : 'bg-rose-950/40 border-rose-600/80 text-rose-200'
              } space-y-1`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs uppercase tracking-wider">
                    {activeEvent.type === 'lucky' ? '✨ Opportune Moment' : '🚨 Lagos Factor Event'}
                  </span>
                  <span className="text-xs font-semibold">
                    {activeEvent.cashDelta !== 0 && (
                      activeEvent.cashDelta > 0 ? `+₦${activeEvent.cashDelta.toLocaleString()}` : `-₦${Math.abs(activeEvent.cashDelta).toLocaleString()}`
                    )}
                    {activeEvent.energyDelta !== 0 && ` ${activeEvent.energyDelta} Energy`}
                  </span>
                </div>
                <p className="text-sm font-semibold">{activeEvent.title}</p>
                <p className="text-xs opacity-90">{activeEvent.text}</p>
              </div>
            )}

            {/* Daily Actions & Hustles */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Available Hustles</h3>
                  <p className="text-[11px] text-neutral-500">Tier unlocks based on Reputation (⭐)</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleRest}
                    disabled={actionLoading || player.energy >= (hasItem('yaba_apartment') ? 120 : 100)}
                    className="text-xs bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 px-2.5 py-1 rounded-lg text-amber-300 font-medium transition disabled:opacity-40"
                  >
                    💤 Rest (+30)
                  </button>
                  <button
                    onClick={handleEndDay}
                    disabled={actionLoading}
                    className="text-xs bg-emerald-600 hover:bg-emerald-500 border border-emerald-500 px-3 py-1 rounded-lg text-neutral-950 font-bold transition"
                  >
                    🌅 End Day
                  </button>
                </div>
              </div>

              <div className="space-y-2.5">
                {fullHustleDeck.map((hustle) => {
                  let cost = hustle.baseEnergy;
                  let payout = hustle.payout;
                  if (hustle.id === 'dispatch' && hasItem('okada')) cost = Math.round(cost * 0.5);
                  if (hustle.id === 'quick_landing_page' && hasItem('macbook')) payout = 180000;

                  const locked = (player.reputation ?? 0) < (hustle.minRep ?? 0);

                  return (
                    <div
                      key={hustle.id}
                      className={`p-3.5 border rounded-xl flex items-center justify-between gap-3 transition ${
                        locked
                          ? 'bg-neutral-950/40 border-neutral-800/40 opacity-60'
                          : 'bg-neutral-950/70 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-sm text-neutral-200">{hustle.title}</p>
                          {locked && (
                            <span className="text-[10px] bg-neutral-800 text-amber-400 px-1.5 py-0.5 rounded font-mono">
                              🔒 Req: {hustle.minRep}⭐
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-400 line-clamp-1">{hustle.desc}</p>
                        <div className="flex gap-2 text-[11px] text-neutral-500 font-medium">
                          <span className="text-amber-400">⚡ -{cost} Energy</span>
                          <span>•</span>
                          <span className="text-emerald-400">💰 +₦{payout.toLocaleString()}</span>
                          <span>•</span>
                          <span className="text-blue-400">⭐ +{hustle.repGain} Rep</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleExecuteHustle(hustle)}
                        disabled={locked || actionLoading || player.energy < cost}
                        className={`px-3.5 py-2 text-xs font-bold rounded-lg transition whitespace-nowrap ${
                          locked
                            ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                            : 'bg-emerald-500 hover:bg-emerald-400 text-neutral-950 disabled:opacity-40'
                        }`}
                      >
                        {locked ? 'Locked' : 'Hustle'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Asset Market Deck */}
            <div className="bg-neutral-950/70 border border-neutral-800 rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Asset & Gear Market</h3>
              <div className="grid grid-cols-1 gap-2.5">
                {SHOP_ITEMS.map((item) => {
                  const owned = hasItem(item.id);
                  return (
                    <div
                      key={item.id}
                      className="p-3 bg-neutral-900 border border-neutral-800 rounded-lg flex items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-white">{item.name}</span>
                          <span className="text-[10px] bg-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400">{item.desc}</p>
                        <p className="text-xs font-bold text-emerald-400">₦{item.price.toLocaleString()}</p>
                      </div>

                      <button
                        onClick={() => handleBuyAsset(item)}
                        disabled={owned || actionLoading || Number(player.cash) < item.price}
                        className={`text-xs px-3 py-1.5 font-bold rounded-lg transition whitespace-nowrap ${
                          owned
                            ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                            : 'bg-emerald-500 hover:bg-emerald-400 text-neutral-950 disabled:opacity-40'
                        }`}
                      >
                        {owned ? 'Owned' : 'Buy'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Financial Desk */}
            <div className="bg-neutral-950/70 border border-neutral-800 rounded-xl p-4 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Vault & Debt Desk</h3>
              
              <div className="space-y-1.5">
                <span className="text-[11px] text-neutral-400">Vault Operations (Liquid vs Stash)</span>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Amount (₦)"
                    value={bankAmount}
                    onChange={(e) => setBankAmount(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={handleBankDeposit}
                    disabled={actionLoading || !bankAmount}
                    className="px-3 py-2 bg-sky-600 hover:bg-sky-500 text-xs font-bold rounded-lg transition disabled:opacity-40 whitespace-nowrap"
                  >
                    Deposit
                  </button>
                  <button
                    onClick={handleBankWithdraw}
                    disabled={actionLoading || !bankAmount}
                    className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs font-bold rounded-lg border border-neutral-700 transition disabled:opacity-40 whitespace-nowrap"
                  >
                    Withdraw
                  </button>
                </div>
              </div>

              {Number(player.debt ?? 0) > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-neutral-800/80">
                  <span className="text-[11px] text-rose-300 font-semibold">Pay Off Loan Shark Debt</span>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Repay Amount (₦)"
                      value={repayAmount}
                      onChange={(e) => setRepayAmount(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                    />
                    <button
                      onClick={handleRepayDebt}
                      disabled={actionLoading || !repayAmount}
                      className="px-3 py-2 bg-rose-600 hover:bg-rose-500 text-xs font-bold rounded-lg transition disabled:opacity-40 whitespace-nowrap text-white"
                    >
                      Repay
                    </button>
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-neutral-800 flex justify-between items-center text-xs">
                <span className="text-neutral-500">Lapô Street Loan (+25% fee):</span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleTakeLoan(20000)}
                    disabled={actionLoading}
                    className="px-2 py-1 bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 text-rose-300 rounded text-[11px] font-semibold transition"
                  >
                    +₦20k
                  </button>
                  <button
                    onClick={() => handleTakeLoan(50000)}
                    disabled={actionLoading}
                    className="px-2 py-1 bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 text-rose-300 rounded text-[11px] font-semibold transition"
                  >
                    +₦50k
                  </button>
                </div>
              </div>
            </div>

            {/* Forbes of Lagos: Leaderboard */}
            <div className="bg-neutral-950/70 border border-neutral-800 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">Forbes of Lagos (Leaderboard)</h3>
                <span className="text-[10px] text-neutral-500">Ranked by Net Worth</span>
              </div>

              <div className="space-y-1.5">
                {leaderboard.map((item, idx) => {
                  const netWorth = Number(item.cash) + Number(item.bank ?? 0) - Number(item.debt ?? 0);
                  const isCurrent = item.id === player.id;
                  return (
                    <div
                      key={item.id}
                      className={`p-2.5 rounded-lg border text-xs flex justify-between items-center transition ${
                        isCurrent
                          ? 'bg-emerald-950/30 border-emerald-500/60 text-emerald-300 font-medium'
                          : 'bg-neutral-900/60 border-neutral-800/80 text-neutral-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-5 font-mono text-[11px] ${idx === 0 ? 'text-amber-400 font-bold' : 'text-neutral-500'}`}>
                          #{idx + 1}
                        </span>
                        <div>
                          <p className="font-bold text-white">@{item.username} {isCurrent && '(You)'}</p>
                          <p className="text-[10px] text-neutral-400">{item.path} • Day {item.day_count ?? 1}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-emerald-400">₦{netWorth.toLocaleString()}</p>
                        <p className="text-[10px] text-neutral-500">⭐ {item.reputation} Rep</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Street Log Feed */}
            {logs.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Street Activity Log</p>
                <div className="bg-neutral-950/80 border border-neutral-800 rounded-xl p-3 max-h-36 overflow-y-auto space-y-1 font-mono text-xs text-neutral-400">
                  {logs.map((log, idx) => (
                    <p key={idx}>{log}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Step 1: Create Identity Form */
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                Your Alias / Tag
              </label>
              <input
                type="text"
                placeholder="e.g. Big Tunde, JayTech..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Choose Your Starting Path
              </label>
              <div className="space-y-2">
                {PATHS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPath(p.id)}
                    className={`w-full text-left p-3 rounded-lg border text-sm transition-all ${
                      selectedPath === p.id
                        ? 'bg-emerald-950/40 border-emerald-500 text-white'
                        : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <p className="font-bold text-neutral-200">{p.name}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">{p.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-400 bg-rose-950/30 border border-rose-900/50 p-2.5 rounded-lg">
                {errorMsg}
              </p>
            )}

            <button
              type="button"
              onClick={handleStartLife}
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold py-3 rounded-xl transition duration-150 disabled:opacity-50"
            >
              {loading ? 'Entering the City...' : 'Enter Lagos (₦50,000)'}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}