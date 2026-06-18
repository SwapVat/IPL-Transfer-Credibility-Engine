"use client";

import React, { useState, useEffect } from "react";

interface TimelineEvent {
  time: string;
  title: string;
  description: string;
  status: "surface" | "verification" | "active" | "blocked";
  source: string;
  probability: number;
}

interface Explainer {
  pros: string[];
  cons: string[];
}

interface ContradictionConflict {
  rumor_a: string;
  rumor_b: string;
  journalist_a: string;
  journalist_b: string;
  content_a: string;
  content_b: string;
  reason: string;
}

interface Rumor {
  id: string;
  content: string;
  player: string;
  franchise: string;
  journalist: string;
  probability: number;
  purse_remaining_cr: number;
  has_enough_purse: boolean;
  additional_sources: number;
  hours_since_update: number;
  explainer: Explainer;
  timeline: TimelineEvent[];
  has_contradiction: boolean;
  contradiction_alert: string;
  contradiction_conflicts: ContradictionConflict[];
  community_yes_votes?: number;
  community_no_votes?: number;
  community_sentiment_pct?: number;
  is_completed?: boolean;
  status?: string;
  verified_outcome?: string;
  source?: string;
  source_franchise?: string;
}

export const franchiseStyles: Record<string, { gradient: string; border: string; text: string; badge: string; name: string }> = {
  CSK: {
    gradient: "from-yellow-400 via-amber-400 to-yellow-500",
    border: "border-yellow-300/60 shadow-yellow-500/10",
    text: "text-slate-900",
    badge: "bg-slate-900/10 border-slate-900/20 text-slate-900",
    name: "Chennai Super Kings"
  },
  MI: {
    gradient: "from-blue-600 to-indigo-800",
    border: "border-blue-400/40 shadow-blue-500/10",
    text: "text-white",
    badge: "bg-white/10 border-white/20 text-blue-100",
    name: "Mumbai Indians"
  },
  KKR: {
    gradient: "from-purple-700 via-indigo-950 to-purple-900",
    border: "border-purple-500/40 shadow-purple-500/10",
    text: "text-white",
    badge: "bg-white/10 border-white/20 text-purple-200",
    name: "Kolkata Knight Riders"
  },
  RCB: {
    gradient: "from-red-700 via-stone-900 to-red-800",
    border: "border-red-500/40 shadow-red-500/10",
    text: "text-white",
    badge: "bg-white/10 border-white/20 text-red-200",
    name: "Royal Challengers Bengaluru"
  },
  GT: {
    gradient: "from-slate-700 via-slate-800 to-cyan-900",
    border: "border-cyan-500/40 shadow-cyan-500/10",
    text: "text-white",
    badge: "bg-cyan-500/20 border-cyan-500/30 text-cyan-200",
    name: "Gujarat Titans"
  },
  LSG: {
    gradient: "from-sky-500 to-blue-700",
    border: "border-sky-400/40 shadow-sky-500/10",
    text: "text-white",
    badge: "bg-white/10 border-white/20 text-sky-100",
    name: "Lucknow Super Giants"
  },
  DC: {
    gradient: "from-blue-700 via-slate-800 to-red-700",
    border: "border-blue-500/30 shadow-blue-500/10",
    text: "text-white",
    badge: "bg-white/10 border-white/20 text-blue-100",
    name: "Delhi Capitals"
  },
  RR: {
    gradient: "from-pink-500 to-blue-700",
    border: "border-pink-400/40 shadow-pink-500/10",
    text: "text-white",
    badge: "bg-white/10 border-white/20 text-pink-100",
    name: "Rajasthan Royals"
  },
  PBKS: {
    gradient: "from-red-600 via-red-700 to-zinc-400",
    border: "border-red-400/40 shadow-red-500/10",
    text: "text-white",
    badge: "bg-white/10 border-white/20 text-red-100",
    name: "Punjab Kings"
  },
  SRH: {
    gradient: "from-orange-500 to-zinc-950",
    border: "border-orange-500/40 shadow-orange-500/10",
    text: "text-white",
    badge: "bg-orange-500/20 border-orange-500/30 text-orange-200",
    name: "Sunrisers Hyderabad"
  }
};

export interface PlayerTechnicalStats {
  peak: number;
  floor: number;
  velocity: string;
  rsi: number;
  bullRatio: number;
}

export const MULTI_PLAYER_DATABASE: Record<string, PlayerTechnicalStats> = {
  "RINKU_SINGH": {
    peak: 93.0,
    floor: 78.0,
    velocity: "14.5 Hz - HIGH",
    rsi: 68.2,
    bullRatio: 72
  },
  "RISHABH_PANT": {
    peak: 82.0,
    floor: 64.0,
    velocity: "19.8 Hz - EXTREME",
    rsi: 78.4,
    bullRatio: 80
  },
  "KL_RAHUL": {
    peak: 76.5,
    floor: 58.0,
    velocity: "11.2 Hz - MODERATE",
    rsi: 62.0,
    bullRatio: 64
  },
  "SURYAKUMAR_YADAV": {
    peak: 55.0,
    floor: 32.0,
    velocity: "8.5 Hz - MODERATE",
    rsi: 48.0,
    bullRatio: 45
  },
  "HARDIK_PANDYA": {
    peak: 15.0,
    floor: 2.0,
    velocity: "4.2 Hz - LOW",
    rsi: 18.5,
    bullRatio: 10
  }
};

export const getPlayerStats = (player: string, baseProb: number): PlayerTechnicalStats => {
  const key = player.toUpperCase().replace(/\s+/g, "_");
  if (MULTI_PLAYER_DATABASE[key]) {
    return MULTI_PLAYER_DATABASE[key];
  }
  // Safe default baseline fallback
  return {
    peak: Math.min(100.0, baseProb + 8.5),
    floor: Math.max(0.0, baseProb - 9.2),
    velocity: `${(baseProb / 5).toFixed(1)} Hz - MODERATE`,
    rsi: Math.round(Math.min(95, Math.max(5, baseProb))),
    bullRatio: Math.round(baseProb)
  };
};

interface Journalist {
  name: string;
  media_outlet: string;
  correct_rumours: number;
  total_rumours: number;
  accuracy: number;
  tier: string;
  favorite_target: string;
  avg_lifespan_days: number;
  last_active: string;
}

interface AgentDetails {
  name: string;
  company: string;
  clout: number;
  represented_players: string[];
}

interface FranchiseDetails {
  franchise: string;
  available_purse_cr: number;
  remaining_squad_slots: number;
  incoming_rumours_count: number;
  outgoing_rumours_count: number;
  most_linked_player: string;
  most_reliable_journalist: string;
  incoming_list: Array<{ player: string; journalist: string; accuracy: number }>;
  outgoing_list: Array<{ player: string; journalist: string; accuracy: number }>;
  agents_list: AgentDetails[];
}

interface BacktestMilestone {
  date: string;
  probability: number;
  milestone: string;
}

interface BacktestSaga {
  id: string;
  player: string;
  franchise: string;
  year: number;
  final_outcome: string;
  timeline?: BacktestMilestone[];
}

interface VolatilityCandle {
  hour: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

interface ChatMessage {
  sender: "user" | "bot";
  text: string;
}

export default function Home() {
  const [theme, setTheme] = useState<"dark" | "warm" | "light">("dark");
  const getDoodleColorClass = () => {
    if (theme === "dark") return "text-zinc-500/25";
    if (theme === "warm") return "text-amber-900/15";
    return "text-slate-300/60";
  };
  const [activeTab, setActiveTab] = useState<
    | "credibility"
    | "volatility"
    | "chronology"
    | "chatbot"
    | "heatmap"
    | "sandbox"
    | "leaderboard"
    | "franchises"
    | "backtesting"
  >("credibility");
  const [query, setQuery] = useState("");
  const [rumors, setRumors] = useState<Rumor[]>([]);
  const [selectedRumor, setSelectedRumor] = useState<Rumor | null>(null);
  const [journalists, setJournalists] = useState<Journalist[]>([]);

  // Progressive Disclosure States
  const [isContradictionExpanded, setIsContradictionExpanded] = useState(false);
  const [isTimelineExpanded, setIsTimelineExpanded] = useState(false);
  const [isLeaderboardExpanded, setIsLeaderboardExpanded] = useState(false);

  // Live alerts ticker state
  const [currentAlertIndex, setCurrentAlertIndex] = useState(0);
  const liveAlerts = [
    "🔥 Rinku Singh transfer probability increased +15% after Cricbuzz verification",
    "📉 Hardik Pandya transfer probability decreased -25% due to MI purse limitations",
    "⚡ KKR retains Rinku Singh with 91.5% AI credibility matching",
    "📰 CSK scanning incoming squad slots for foreign fast-bowler targets",
  ];
  
  // Franchise Hub State
  const [selectedTeam, setSelectedTeam] = useState<string>("CSK");
  const [franchiseData, setFranchiseData] = useState<FranchiseDetails | null>(null);
  const teamStyle = franchiseStyles[selectedTeam?.toUpperCase()] || {
    gradient: "from-emerald-500/10 to-teal-500/10",
    border: "border-emerald-500/20",
    text: "text-slate-100",
    badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    name: selectedTeam
  };

  // Chatbot State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  // Trade Sandbox Simulator States
  const [tradePlayer, setTradePlayer] = useState("");
  const [tradeSource, setTradeSource] = useState("");
  const [tradeTarget, setTradeTarget] = useState("");
  const [sandboxTrades, setSandboxTrades] = useState<{player: string, value: number, source: string, target: string}[]>([]);
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [showTradeDrawer, setShowTradeDrawer] = useState(false);

  // ML Backtesting States
  const [backtestSagas, setBacktestSagas] = useState<BacktestSaga[]>([]);
  const [selectedSagaId, setSelectedSagaId] = useState<string>("hardik_mi_2024");
  const [selectedSaga, setSelectedSaga] = useState<BacktestSaga | null>(null);
  const [loadingBacktest, setLoadingBacktest] = useState(false);
  
  // Volatility states
  const [volatilityData, setVolatilityData] = useState<VolatilityCandle[]>([]);
  const [loadingVolatility, setLoadingVolatility] = useState(false);
  const [hoveredCandle, setHoveredCandle] = useState<VolatilityCandle | null>(null);

  // Heatmap and Chronology switching states
  const [selectedHeatmapTeam, setSelectedHeatmapTeam] = useState<string | null>(null);
  const [heatmapTeamDetails, setHeatmapTeamDetails] = useState<any | null>(null);
  const [loadingHeatmapTeam, setLoadingHeatmapTeam] = useState(false);
  const [selectedChronologyPlayer, setSelectedChronologyPlayer] = useState<string | null>(null);

  const fetchHeatmapTeamDetails = async (team: string) => {
    setLoadingHeatmapTeam(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/v1/franchises/${team.toLowerCase()}`);
      if (!res.ok) throw new Error("Failed to fetch team details");
      const data = await res.json();
      setHeatmapTeamDetails(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHeatmapTeam(false);
    }
  };

  const fetchVolatility = async (playerName: string) => {
    setLoadingVolatility(true);
    try {
      const playerId = playerName.toLowerCase().replace(/\s+/g, "_");
      const res = await fetch(`http://127.0.0.1:8000/api/v1/analytics/volatility/${playerId}`);
      if (!res.ok) throw new Error("Failed to fetch volatility data");
      const data = await res.json();
      setVolatilityData(data);
    } catch (err) {
      console.error("Error fetching volatility:", err);
    } finally {
      setLoadingVolatility(false);
    }
  };
  
  const [loadingRumors, setLoadingRumors] = useState(true);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);
  const [loadingFranchise, setLoadingFranchise] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Vote processing state
  const [votingId, setVotingId] = useState<string | null>(null);

  // Fetch rumors from backend
  const fetchRumors = async (searchQuery = "") => {
    setLoadingRumors(true);
    setError(null);
    try {
      const url = searchQuery
        ? `http://127.0.0.1:8000/api/v1/rumors?query=${encodeURIComponent(searchQuery)}`
        : "http://127.0.0.1:8000/api/v1/rumors";
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Failed to connect to FastAPI backend");
      }
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setRumors(data);
      if (data.length > 0) {
        setSelectedRumor((prev) => {
          if (prev) {
            const found = data.find((r: Rumor) => r.id === prev.id);
            return found || data[0];
          }
          return data[0];
        });
      } else {
        setSelectedRumor(null);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoadingRumors(false);
    }
  };

  // Vote handler
  const handleVote = async (rumorId: string, voteType: "YES" | "NO") => {
    setVotingId(rumorId);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/v1/rumors/${rumorId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vote: voteType }),
      });
      if (!res.ok) {
        throw new Error("Failed to register vote");
      }
      const data = await res.json();
      
      // Update local rumors state
      setRumors((prevRumors) =>
        prevRumors.map((r) =>
          r.id === rumorId
            ? {
                ...r,
                community_yes_votes: data.community_yes_votes,
                community_no_votes: data.community_no_votes,
                community_sentiment_pct: data.community_sentiment_pct,
              }
            : r
        )
      );

      // Update selected rumor if it's the one being voted on
      setSelectedRumor((prev) => {
        if (prev?.id === rumorId) {
          return {
            ...prev,
            community_yes_votes: data.community_yes_votes,
            community_no_votes: data.community_no_votes,
            community_sentiment_pct: data.community_sentiment_pct,
          };
        }
        return prev;
      });
    } catch (err: any) {
      console.error("Error voting:", err);
    } finally {
      setVotingId(null);
    }
  };

  // Fetch journalists for leaderboard
  const fetchLeaderboard = async () => {
    setLoadingLeaderboard(true);
    setError(null);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/journalists/leaderboard");
      if (!res.ok) {
        throw new Error("Failed to fetch leaderboard from backend");
      }
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setJournalists(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong fetching leaderboard");
    } finally {
      setLoadingLeaderboard(false);
    }
  };

  // Fetch Franchise details
  const fetchFranchiseDetails = async (team: string) => {
    setLoadingFranchise(true);
    setError(null);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/v1/franchises/${team.toLowerCase()}`);
      if (!res.ok) {
        throw new Error("Failed to fetch franchise details");
      }
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setFranchiseData(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong fetching franchise details");
    } finally {
      setLoadingFranchise(false);
    }
  };

  const fetchBacktests = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/backtest");
      if (!res.ok) throw new Error("Failed to fetch backtest list");
      const data = await res.json();
      setBacktestSagas(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBacktestSagaDetails = async (sagaId: string) => {
    setLoadingBacktest(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/v1/backtest/${sagaId}`);
      if (!res.ok) throw new Error("Failed to fetch saga details");
      const data = await res.json();
      setSelectedSaga(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBacktest(false);
    }
  };

  useEffect(() => {
    fetchRumors();
    fetchBacktests();
  }, []);

  useEffect(() => {
    fetchBacktestSagaDetails(selectedSagaId);
  }, [selectedSagaId]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAlertIndex((prev) => (prev + 1) % liveAlerts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeTab === "leaderboard") {
      fetchLeaderboard();
    } else if (activeTab === "franchises") {
      fetchFranchiseDetails(selectedTeam);
    }
  }, [activeTab, selectedTeam]);

  // Reset chatbot messages when rumor changes
  useEffect(() => {
    if (selectedRumor) {
      setChatMessages([
        {
          sender: "bot",
          text: `Ask me anything about ${selectedRumor.player}'s rumored move to ${selectedRumor.franchise}! I'll analyze Neo4j contexts and historical accuracy data.`
        }
      ]);
      fetchVolatility(selectedRumor.player);
    }
  }, [selectedRumor]);

  // Submit custom trade simulation to backend
  const runTradeSimulation = async (customTradesList?: any[]) => {
    const listToSimulate = customTradesList || sandboxTrades;
    if (listToSimulate.length === 0) return;
    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/simulator/trade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trades: listToSimulate.map(t => ({
            player_name: t.player,
            source_franchise: t.source,
            target_franchise: t.target
          }))
        })
      });
      if (!res.ok) {
        throw new Error("Simulation request failed");
      }
      const data = await res.json();
      setSimulationResult(data);
      setShowTradeDrawer(true);
    } catch (err: any) {
      console.error("Simulation error:", err);
    }
  };

  const handleSolveRosterConstraint = async () => {
    if (!simulationResult?.suggested_cascade) return;
    try {
      const cascadeItem = {
        player: simulationResult.suggested_cascade.player_name,
        value: 10.0,
        source: simulationResult.suggested_cascade.source_franchise.toUpperCase(),
        target: simulationResult.suggested_cascade.target_franchise.toUpperCase()
      };
      
      const matched = [
        { name: "Rinku Singh", value: 11.0 },
        { name: "Suryakumar Yadav", value: 15.0 },
        { name: "KL Rahul", value: 14.0 },
        { name: "Rishabh Pant", value: 16.0 },
        { name: "Shreyas Iyer", value: 12.0 },
        { name: "Ishan Kishan", value: 10.0 },
        { name: "Jos Buttler", value: 13.0 },
        { name: "Hardik Pandya", value: 15.0 },
        { name: "Cameron Green", value: 17.5 },
        { name: "Devdutt Padikkal", value: 7.5 }
      ].find(p => p.name.toLowerCase() === cascadeItem.player.toLowerCase());
      if (matched) {
        cascadeItem.value = matched.value;
      }
      
      const newTradesList = [...sandboxTrades, cascadeItem];
      setSandboxTrades(newTradesList);
      await runTradeSimulation(newTradesList);
    } catch (err) {
      console.error("Error solving trade:", err);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRumors(query);
  };

  // Chatbot submission
  const handleChatSubmit = async (textToSend: string) => {
    if (!textToSend.trim() || !selectedRumor) return;
    
    // Append user message
    const updatedMessages = [...chatMessages, { sender: "user" as const, text: textToSend }];
    setChatMessages(updatedMessages);
    setChatInput("");
    setChatLoading(true);
    
    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          player: selectedRumor.player,
          query: textToSend
        })
      });
      if (!res.ok) {
        throw new Error("Failed to contact chatbot backend");
      }
      const data = await res.json();
      setChatMessages((prev) => [...prev, { sender: "bot", text: data.response }]);
    } catch (err: any) {
      setChatMessages((prev) => [...prev, { sender: "bot", text: `Error: ${err.message || "Could not generate explanation."}` }]);
    } finally {
      setChatLoading(false);
    }
  };

  // Helper styles based on metrics
  const getProbabilityColor = (prob: number) => {
    if (prob >= 75) return "text-emerald-500 stroke-emerald-500";
    if (prob >= 40) return "text-amber-500 stroke-amber-500";
    return "text-rose-500 stroke-rose-500";
  };

  const getProbabilityBg = (prob: number) => {
    if (prob >= 75) return "bg-emerald-500/10 border-emerald-500/30 text-emerald-600";
    if (prob >= 40) return "bg-amber-500/10 border-amber-500/30 text-amber-600";
    return "bg-rose-500/10 border-rose-500/30 text-rose-600";
  };

  const getTierBadgeClass = (tier: string) => {
    switch (tier) {
      case "Tier 1":
        return "bg-emerald-500/15 border-emerald-500/30 text-emerald-600";
      case "Tier 2":
        return "bg-cyan-500/15 border-cyan-500/30 text-cyan-600";
      case "Tier 3":
        return "bg-amber-500/15 border-amber-500/30 text-amber-600";
      default:
        return "bg-rose-500/15 border-rose-500/30 text-rose-600";
    }
  };

  const getProgressBarColor = (acc: number) => {
    if (acc >= 80) return "bg-gradient-to-r from-emerald-500 to-teal-400";
    if (acc >= 60) return "bg-gradient-to-r from-cyan-500 to-blue-400";
    if (acc >= 40) return "bg-gradient-to-r from-amber-500 to-yellow-400";
    return "bg-gradient-to-r from-rose-600 to-orange-500";
  };

  // Chat Suggestion Chips generator
  const getSuggestions = () => {
    if (!selectedRumor) return [];
    return [
      `Why is ${selectedRumor.player}'s ${selectedRumor.franchise} link at ${selectedRumor.probability}%?`,
      `Is ${selectedRumor.franchise}'s purse enough to buy ${selectedRumor.player}?`,
      `Explain the credibility details for ${selectedRumor.player}`,
      `Who is the source journalist for the ${selectedRumor.player} rumor?`
    ];
  };

  // Determine Fan-AI alignment status
  const getAlignmentStatus = (aiProb: number, communitySentiment: number) => {
    const diff = communitySentiment - aiProb;
    if (Math.abs(diff) < 15) {
      return { tag: "Fans Align", color: "bg-emerald-500/10 border-emerald-500/20 text-emerald-600" };
    } else if (diff <= -15) {
      return { tag: "Fans Skeptical", color: "bg-rose-500/10 border-rose-500/20 text-rose-600" };
    } else {
      return { tag: "Fans Optimistic", color: "bg-cyan-500/10 border-cyan-500/20 text-cyan-600" };
    }
  };

  // Theme helper values
  const themeClasses = {
    dark: {
      body: "bg-[#09090b] text-zinc-100",
      header: "bg-[#18181b]/60 border-zinc-800/80 text-zinc-100",
      card: "bg-[#18181b] border border-zinc-800/80 text-zinc-200",
      cardActive: "bg-[#27272a] border-emerald-500/40 shadow-lg text-zinc-100",
      cardHover: "hover:bg-[#27272a] hover:border-zinc-700",
      textMuted: "text-zinc-400",
      textBold: "text-zinc-200 font-semibold",
      input: "bg-[#09090b]/80 border-zinc-800 text-zinc-100 focus:border-emerald-500/50",
      tabBg: "bg-[#18181b] border-zinc-800/80",
      footer: "border-zinc-800/80 bg-[#09090b] text-zinc-500",
      divider: "border-zinc-800/80"
    },
    warm: {
      body: "bg-[#FAF7F0] text-amber-950",
      header: "bg-[#F4EAD4]/80 border-[#e6d5c3] text-[#4a3621]",
      card: "bg-white border border-amber-200/50 text-[#5c4831]",
      cardActive: "bg-[#F4EAD4] border-amber-600/50 shadow-md text-[#3d2712]",
      cardHover: "hover:bg-[#faf4e8] hover:border-amber-300/50",
      textMuted: "text-[#806c58]",
      textBold: "text-[#3d2712] font-semibold",
      input: "bg-white border-[#e6d5c3] text-[#4a3621] focus:border-amber-600",
      tabBg: "bg-[#F4EAD4] border-amber-200/50",
      footer: "border-amber-200/50 bg-[#FAF7F0] text-[#9c8b77]",
      divider: "border-amber-200/50"
    },
    light: {
      body: "bg-[#F3F4F6] text-slate-900",
      header: "bg-white border-slate-200 shadow-sm text-slate-900",
      card: "bg-white border border-slate-200 shadow-sm text-slate-700",
      cardActive: "bg-slate-100 border-slate-400 shadow-md text-slate-950",
      cardHover: "hover:bg-slate-50 hover:border-slate-300",
      textMuted: "text-slate-500",
      textBold: "text-slate-950 font-semibold",
      input: "bg-slate-50 border-slate-200 text-slate-900 focus:border-slate-500",
      tabBg: "bg-slate-100 border-slate-200",
      footer: "border-slate-200 bg-slate-100 text-slate-500",
      divider: "border-slate-200"
    }
  }[theme];

  const renderNoPlayerFallback = (tabId: string, featureName: string) => (
    <div className={`${themeClasses.card} rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-4 border border-dashed ${themeClasses.divider} max-w-4xl mx-auto w-full`}>
      <div className="w-16 h-16 rounded-full bg-purple-500/10 text-purple-500 border border-purple-500/20 flex items-center justify-center shrink-0">
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="text-xl font-bold">No Player Selected</h3>
      <p className={`text-sm ${themeClasses.textMuted} max-w-md`}>
        Please select a rumor in the Credibility Hub first, or pick one of the active rumors below to activate {featureName}.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 w-full max-w-2xl mt-4">
        {rumors.map((r) => (
          <button
            key={r.id}
            onClick={() => setSelectedRumor(r)}
            className={`p-4 rounded-xl border text-sm font-extrabold transition-all hover:scale-[1.03] text-left flex justify-between items-center ${themeClasses.card} ${themeClasses.cardHover}`}
          >
            <span>{r.player}</span>
            <span className="text-purple-500 text-xs">{r.franchise}</span>
          </button>
        ))}
      </div>
    </div>
  );

  // Database Error Guard - Mock historic sagas fallback
  const mockSagas: BacktestSaga[] = [
    {
      id: "hardik_mi_2024",
      player: "Hardik Pandya",
      franchise: "MI",
      year: 2024,
      final_outcome: "Confirmed",
      timeline: [
        { date: "Nov 15", probability: 10.0, milestone: "Social Media Rumors" },
        { date: "Nov 20", probability: 35.0, milestone: "Cricbuzz mentions interest" },
        { date: "Nov 24", probability: 55.0, milestone: "GT owner statements" },
        { date: "Nov 26", probability: 95.0, milestone: "Official trade submission" }
      ]
    },
    {
      id: "cameron_green_rcb_2024",
      player: "Cameron Green",
      franchise: "RCB",
      year: 2024,
      final_outcome: "Confirmed",
      timeline: [
        { date: "Nov 20", probability: 15.0, milestone: "Trade rumors leak" },
        { date: "Nov 22", probability: 40.0, milestone: "RCB budget allocation adjustments" },
        { date: "Nov 25", probability: 85.0, milestone: "Mumbai Indians accept all-cash proposal" },
        { date: "Nov 27", probability: 100.0, milestone: "Official IPL board approval" }
      ]
    },
    {
      id: "rashid_khan_gt_2022",
      player: "Rashid Khan",
      franchise: "GT",
      year: 2022,
      final_outcome: "Confirmed",
      timeline: [
        { date: "Dec 01", probability: 20.0, milestone: "SRH retention release list" },
        { date: "Dec 15", probability: 50.0, milestone: "New franchise draft picks discussions" },
        { date: "Jan 10", probability: 90.0, milestone: "GT draft contract terms finalized" },
        { date: "Jan 22", probability: 100.0, milestone: "Official signing validation" }
      ]
    },
    {
      id: "padikkal_lsg_2024",
      player: "Devdutt Padikkal",
      franchise: "LSG",
      year: 2024,
      final_outcome: "Confirmed",
      timeline: [
        { date: "Nov 18", probability: 25.0, milestone: "Swap deal discussions initiated" },
        { date: "Nov 20", probability: 50.0, milestone: "LSG and RR agree to terms" },
        { date: "Nov 22", probability: 80.0, milestone: "Player consent and paperwork completed" },
        { date: "Nov 24", probability: 100.0, milestone: "Officially announced by LSG" }
      ]
    }
  ];

  // Helper renderers for segmented workspaces to prevent bloating return statement
  const renderCredibilityHub = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Search & Rumor list */}
      <section className="lg:col-span-4 flex flex-col gap-6">
        {/* Real-Time Alerts Ticker */}
        <div className={`${themeClasses.card} rounded-3xl px-4 py-3.5 min-h-[4rem] h-auto border-l-4 border-l-amber-500 bg-amber-500/5 backdrop-blur-sm shadow-xl flex items-center justify-between gap-3 transition-all duration-300 hover:scale-[1.01]`}>
          <div className="flex items-center gap-3 w-full">
            <div className="relative flex h-3 w-3 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest block mb-0.5">Live Trade Alert</span>
              <p className="text-xs font-bold text-amber-700 dark:text-amber-300 transition-all duration-500 whitespace-normal break-words">
                {liveAlerts[currentAlertIndex]}
              </p>
            </div>
          </div>
        </div>

        {/* Search Transfer Intelligence */}
        <div className={`${themeClasses.card} rounded-3xl p-6 border-l-4 border-l-emerald-500 backdrop-blur-sm shadow-xl flex flex-col gap-4 transition-all duration-300 hover:scale-[1.01] hover:shadow-emerald-500/5`}>
          <h2 className="text-lg font-bold tracking-tight uppercase">
            Search Transfer Intelligence
          </h2>
          <form onSubmit={handleSearchSubmit} className="relative flex gap-2">
            <input
              type="text"
              placeholder="Search player, journalist, team..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={`w-full ${themeClasses.input} rounded-xl py-3 px-4 text-base focus:outline-none transition-colors placeholder-slate-400`}
            />
            <button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-600 transition-colors text-slate-950 font-bold px-5 py-3 rounded-xl text-sm"
            >
              Search
            </button>
          </form>
        </div>

        {/* Rumors List */}
        <div className={`${themeClasses.card} rounded-3xl p-6 border-l-4 border-l-emerald-500 backdrop-blur-sm shadow-xl flex flex-col gap-4 transition-all duration-300 hover:scale-[1.01] hover:shadow-emerald-500/5`}>
          <div className="flex justify-between items-center pb-2 border-b border-slate-500/10">
            <h3 className="text-base font-bold tracking-tight uppercase">
              Active Rumors ({rumors.filter((r) => !r.is_completed).length})
            </h3>
            <button 
              onClick={() => { setQuery(""); fetchRumors(); }}
              className="text-xs font-bold text-emerald-500 hover:underline"
            >
              Clear Filter
            </button>
          </div>

          {loadingRumors ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin"></div>
              <span className={`text-sm ${themeClasses.textMuted}`}>Querying database...</span>
            </div>
          ) : rumors.filter((r) => !r.is_completed).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className={`text-base ${themeClasses.textBold}`}>No Active Rumors Found</span>
              <span className={`text-sm ${themeClasses.textMuted} mt-1`}>Try another keyword</span>
            </div>
          ) : (
            <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto pr-1">
              {rumors.filter((r) => !r.is_completed).map((rumor) => {
                const isSelected = selectedRumor?.id === rumor.id;
                // High contrast labels depending on active theme
                const nameColor = isSelected 
                  ? "text-emerald-400" 
                  : (theme === "dark" ? "text-emerald-400" : theme === "warm" ? "text-amber-950 font-black" : "text-emerald-800 font-extrabold");
                const contentColor = isSelected 
                  ? "text-slate-100" 
                  : (theme === "dark" ? "text-slate-100 font-bold" : theme === "warm" ? "text-[#3d2712] font-extrabold" : "text-slate-900 font-bold");
                const mutedLabelColor = isSelected 
                  ? "text-slate-300" 
                  : (theme === "dark" ? "text-slate-300" : theme === "warm" ? "text-[#5c4831]" : "text-slate-700");
                
                const targetStyle = franchiseStyles[rumor.franchise.toUpperCase()];
                
                return (
                  <button
                    key={rumor.id}
                    onClick={() => setSelectedRumor(rumor)}
                    className={`w-full p-4 rounded-2xl border text-left flex flex-col gap-2 transition-all duration-300 ${
                      isSelected
                        ? themeClasses.cardActive + " border-l-4 border-l-emerald-500"
                        : `${themeClasses.card} ${themeClasses.cardHover} border-l-2 border-l-slate-400`
                    }`}
                  >
                    <div className="flex justify-between items-start w-full">
                      <span className={`text-sm uppercase tracking-wider ${nameColor}`}>
                        {rumor.player}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${
                        rumor.probability >= 75
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                          : rumor.probability >= 45
                          ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                          : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                      }`}>
                        {rumor.probability}% AI Match
                      </span>
                    </div>
                    <p className={`text-base leading-relaxed ${contentColor}`}>
                      {rumor.content}
                    </p>
                    <div className={`mt-3 flex justify-between items-center text-xs w-full`}>
                      <span className={mutedLabelColor}>Publisher: {rumor.journalist}</span>
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold border ${
                        targetStyle 
                          ? `bg-gradient-to-r ${targetStyle.gradient} ${targetStyle.border} ${targetStyle.text}`
                          : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                      }`}>
                        Target: {rumor.franchise}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Official Trade Announcements Feed */}
        <div className={`${themeClasses.card} rounded-3xl p-6 border-l-4 border-l-emerald-500 backdrop-blur-sm shadow-xl flex flex-col gap-4 transition-all duration-300 hover:scale-[1.01] hover:shadow-emerald-500/5`}>
          <div className="flex justify-between items-center pb-2 border-b border-slate-500/10">
            <h3 className="text-base font-bold tracking-tight uppercase flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Official Trade Announcements ({rumors.filter((r) => r.is_completed).length})
            </h3>
          </div>

          {loadingRumors ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin"></div>
            </div>
          ) : rumors.filter((r) => r.is_completed).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <span className={`text-sm ${themeClasses.textMuted}`}>No Verified Trades Found</span>
            </div>
          ) : (
            <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1">
              {rumors.filter((r) => r.is_completed).map((trade) => {
                const isSelected = selectedRumor?.id === trade.id;
                const nameColor = isSelected 
                  ? "text-emerald-400" 
                  : (theme === "dark" ? "text-emerald-400 font-extrabold" : theme === "warm" ? "text-amber-950 font-black" : "text-emerald-800 font-extrabold");
                const contentColor = isSelected 
                  ? "text-slate-100" 
                  : (theme === "dark" ? "text-slate-100 font-bold" : theme === "warm" ? "text-[#3d2712] font-extrabold" : "text-slate-900 font-bold");
                const mutedLabelColor = isSelected 
                  ? "text-slate-300" 
                  : (theme === "dark" ? "text-slate-300" : theme === "warm" ? "text-[#5c4831]" : "text-slate-700");
                
                const targetStyle = franchiseStyles[trade.franchise.toUpperCase()];

                return (
                  <button
                    key={trade.id}
                    onClick={() => setSelectedRumor(trade)}
                    className={`w-full p-4 rounded-2xl border text-left flex flex-col gap-2.5 transition-all duration-300 ${
                      isSelected
                        ? themeClasses.cardActive + " border-l-4 border-l-emerald-500"
                        : `${themeClasses.card} ${themeClasses.cardHover} border-l-2 border-l-emerald-500`
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className={`text-sm uppercase tracking-wider ${nameColor}`}>
                        {trade.player}
                      </span>
                      <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[9px] font-extrabold uppercase tracking-wide shrink-0">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        OFFICIALLY CONFIRMED
                      </div>
                    </div>
                    <p className={`text-sm leading-relaxed ${contentColor}`}>
                      {trade.content}
                    </p>
                    <div className={`mt-2 flex justify-between items-center text-[10px] w-full`}>
                      <span className={mutedLabelColor}>Source: {trade.source || "Official Franchise Statement"}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${
                        targetStyle 
                          ? `bg-gradient-to-r ${targetStyle.gradient} ${targetStyle.border} ${targetStyle.text}`
                          : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                      }`}>
                        Target: {trade.franchise}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Right Column: Dial, Explainer, Contradiction box */}
      <section className="lg:col-span-8 flex flex-col gap-8">
        {/* Large High-Contrast Live Trade Alerts Notice Board */}
        {(() => {
          const alertText = liveAlerts[currentAlertIndex];
          let statusLabel = "[MARKET MOVEMENT]";
          let alertColorClass = "from-amber-600/30 to-amber-900/30 border-amber-500/40 text-amber-100";
          let badgeColorClass = "bg-amber-500/20 text-amber-300 border-amber-500/30";
          
          if (alertText.includes("increased") || alertText.includes("probability increased")) {
            statusLabel = "[URGENT PROBABILITY SPIKE]";
            alertColorClass = "from-emerald-600/30 to-emerald-950/40 border-emerald-500/40 text-emerald-100";
            badgeColorClass = "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
          } else if (alertText.includes("decreased") || alertText.includes("purse limitations")) {
            statusLabel = "[CRITICAL PURSE CONSTRAINT]";
            alertColorClass = "from-rose-600/30 to-rose-950/40 border-rose-500/40 text-rose-100";
            badgeColorClass = "bg-rose-500/20 text-rose-300 border-rose-500/30";
          } else if (alertText.includes("retains")) {
            statusLabel = "[RETENTION VERIFIED]";
            alertColorClass = "from-purple-600/30 to-purple-950/40 border-purple-500/40 text-purple-100";
            badgeColorClass = "bg-purple-500/20 text-purple-300 border-purple-500/30";
          } else if (alertText.includes("scanning incoming")) {
            statusLabel = "[SQUAD SCOUTING RADAR]";
            alertColorClass = "from-blue-600/30 to-blue-950/40 border-blue-500/40 text-blue-100";
            badgeColorClass = "bg-blue-500/20 text-blue-300 border-blue-500/30";
          }
          
          return (
            <div className={`bg-gradient-to-r ${alertColorClass} border rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all duration-500 hover:scale-[1.01] overflow-hidden`}>
              <div className="flex items-center gap-4 w-full">
                {/* Broadcast indicator */}
                <div className="relative flex h-4 w-4 shrink-0 mt-1 md:mt-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600"></span>
                </div>
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-black tracking-widest text-red-500 uppercase flex items-center gap-1.5 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                      LIVE BROADCAST
                    </span>
                    <span className={`text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded border ${badgeColorClass}`}>
                      {statusLabel}
                    </span>
                  </div>
                  <p className="text-base md:text-lg font-black leading-relaxed mt-1 tracking-wide">
                    {alertText}
                  </p>
                </div>
              </div>
            </div>
          );
        })()}

        {selectedRumor ? (
          <>
            {/* Contradiction Alert Card */}
            {selectedRumor.has_contradiction && (
              <div className="bg-amber-500/10 border border-amber-500/30 border-l-4 border-l-amber-500 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-xl flex flex-col gap-4 transition-all duration-300 hover:scale-[1.01] hover:shadow-amber-500/5">
                <div className="flex justify-between items-center w-full">
                  <div className="flex gap-4 items-center">
                    <div className="p-3 rounded-xl bg-amber-500/15 text-amber-600 border border-amber-500/25 shrink-0">
                      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-amber-700 uppercase tracking-wide">
                        Conflicting Reports Detected
                      </h3>
                      <p className="text-sm text-amber-800/80">
                        Conflicting targets: {selectedRumor.player} linked to multiple clubs.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsContradictionExpanded(!isContradictionExpanded)}
                    className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs font-bold text-amber-800 hover:bg-amber-500/20 transition-all"
                  >
                    {isContradictionExpanded ? "Hide Details ➔" : "Show Deep Metrics ➔"}
                  </button>
                </div>

                {isContradictionExpanded && (
                  <div className="mt-2.5 pl-4 border-l-2 border-amber-500/30 flex flex-col gap-4">
                    <p className="text-sm leading-relaxed">
                      Our contradiction engine identified opposing narratives regarding {selectedRumor?.player}'s transfer situation:
                    </p>
                    {selectedRumor?.contradiction_conflicts?.map((conflict, idx) => (
                      <div key={idx} className="flex flex-col gap-1 text-sm">
                        <span className="text-amber-600 font-extrabold uppercase tracking-wider text-xs">
                          Conflict Reason: {conflict.reason}
                        </span>
                        <div className="flex flex-col gap-2 mt-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5">
                            <strong className="font-bold shrink-0">{conflict.journalist_a}:</strong>
                            <span className="italic">"{conflict.content_a}"</span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5">
                            <strong className="font-bold shrink-0">{conflict.journalist_b}:</strong>
                            <span className="italic">"{conflict.content_b}"</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Rumor Summary Header Card */}
            <div className={`bg-gradient-to-r ${theme === 'dark' ? 'from-slate-900/60 to-slate-950/60' : theme === 'warm' ? 'from-[#fcf8f2] to-[#f4ebe1]' : 'from-white to-slate-100'} border ${themeClasses.divider} border-l-4 border-l-emerald-500 rounded-3xl p-8 backdrop-blur-sm shadow-xl relative overflow-hidden transition-all duration-300 hover:scale-[1.01]`}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
              <div className="relative z-10 flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  {(() => {
                    const srcTeam = selectedRumor.source_franchise;
                    const srcStyle = srcTeam ? franchiseStyles[srcTeam.toUpperCase()] : null;
                    return srcStyle ? (
                      <span className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest border bg-gradient-to-r ${srcStyle.gradient} ${srcStyle.border} ${srcStyle.text}`}>
                        {srcTeam}
                      </span>
                    ) : (
                      <span className="px-3.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold uppercase tracking-widest">
                        {selectedRumor.player}
                      </span>
                    );
                  })()}
                  <span className={`${themeClasses.textMuted} text-xl`}>➔</span>
                  {(() => {
                    const tgtTeam = selectedRumor.franchise;
                    const tgtStyle = franchiseStyles[tgtTeam.toUpperCase()];
                    return tgtStyle ? (
                      <span className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest border bg-gradient-to-r ${tgtStyle.gradient} ${tgtStyle.border} ${tgtStyle.text}`}>
                        {tgtTeam}
                      </span>
                    ) : (
                      <span className="px-3.5 py-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-600 text-xs font-bold uppercase tracking-widest">
                        {tgtTeam}
                      </span>
                    );
                  })()}
                </div>
                <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight leading-tight">
                  "{selectedRumor.content}"
                </h1>
                <div className={`flex flex-wrap gap-x-6 gap-y-2 text-sm ${themeClasses.textMuted} border-t ${themeClasses.divider} pt-5 mt-3`}>
                  <div>
                    Source Journalist: <strong className={themeClasses.textBold}>{selectedRumor.journalist}</strong>
                  </div>
                  <div>
                    Last Update: <strong className={themeClasses.textBold}>{selectedRumor.hours_since_update}h ago</strong>
                  </div>
                  <div>
                    Other Outlets: <strong className={themeClasses.textBold}>{selectedRumor.additional_sources} confirming</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Dial and Explainer Section */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Radial Dial Wheel & Voting Card */}
              <div className={`${themeClasses.card} md:col-span-6 rounded-3xl p-6 border-l-4 border-l-emerald-500 backdrop-blur-sm shadow-xl flex flex-col gap-6 justify-between transition-all duration-300 hover:scale-[1.01] hover:shadow-emerald-500/5`}>
                <div className="flex justify-between items-center pb-2 border-b border-slate-500/10">
                  <h3 className="text-base font-bold tracking-tight uppercase">
                    Credibility & Sentiment
                  </h3>
                  {selectedRumor.community_sentiment_pct !== undefined && (
                    <span className={`px-2.5 py-1 rounded text-xs font-bold border ${getAlignmentStatus(selectedRumor.probability, selectedRumor.community_sentiment_pct).color}`}>
                      {getAlignmentStatus(selectedRumor.probability, selectedRumor.community_sentiment_pct).tag}
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
                  <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        className={`${theme === "dark" ? "stroke-slate-800" : "stroke-slate-200"}`}
                        strokeWidth="8"
                        fill="transparent"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        className={`transition-all duration-1000 ease-out ${getProbabilityColor(selectedRumor.probability)}`}
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={251.2}
                        strokeDashoffset={251.2 - (251.2 * selectedRumor.probability) / 100}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-3xl font-extrabold tracking-tighter">
                        {selectedRumor.probability}%
                      </span>
                      <span className={`text-[9px] ${themeClasses.textMuted} font-semibold uppercase tracking-wider mt-0.5`}>
                        AI Credibility
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col gap-3 w-full">
                    <div className={`text-sm ${themeClasses.textBold} uppercase tracking-wider text-center sm:text-left`}>
                      Will This Transfer Happen?
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        disabled={votingId !== null}
                        onClick={() => handleVote(selectedRumor.id, "YES")}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-600 active:scale-95 transition-all text-slate-950 font-bold text-sm py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 disabled:opacity-50"
                      >
                        👍 YES
                        <span className="text-xs opacity-75">({selectedRumor.community_yes_votes ?? 0})</span>
                      </button>
                      <button
                        disabled={votingId !== null}
                        onClick={() => handleVote(selectedRumor.id, "NO")}
                        className="flex-1 bg-rose-500 hover:bg-rose-600 active:scale-95 transition-all text-white font-bold text-sm py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 disabled:opacity-50"
                      >
                        👎 NO
                        <span className="text-xs opacity-75">({selectedRumor.community_no_votes ?? 0})</span>
                      </button>
                    </div>

                    <div className={`text-xs ${themeClasses.textMuted} text-center sm:text-left leading-relaxed`}>
                      Total responses: <strong className={themeClasses.textBold}>{(selectedRumor.community_yes_votes ?? 0) + (selectedRumor.community_no_votes ?? 0)}</strong>
                    </div>
                    
                    <a
                      href={`http://127.0.0.1:8000/api/v1/reports/export/${selectedRumor.player.toLowerCase().replace(/\s+/g, "_")}`}
                      download
                      className="mt-2.5 bg-slate-900/10 dark:bg-white/10 hover:bg-slate-900/20 dark:hover:bg-white/20 border border-slate-500/10 active:scale-95 transition-all text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 uppercase tracking-wide cursor-pointer w-full text-center hover:no-underline"
                    >
                      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Export Audit Report (PDF)
                    </a>
                  </div>
                </div>

                <div className={`border-t ${themeClasses.divider} pt-5 flex flex-col gap-4`}>
                  <div className="flex flex-col gap-1.5">
                    <div className={`flex justify-between text-xs font-bold ${themeClasses.textMuted}`}>
                      <span>AI PROBABILITY ENGINE</span>
                      <span className={themeClasses.textBold}>{selectedRumor.probability}%</span>
                    </div>
                    <div className={`w-full h-2.5 rounded-full ${theme === "dark" ? "bg-slate-950" : "bg-slate-200"} overflow-hidden`}>
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                        style={{ width: `${selectedRumor.probability}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className={`flex justify-between text-xs font-bold ${themeClasses.textMuted}`}>
                      <span>COMMUNITY YES SENTIMENT</span>
                      <span className={themeClasses.textBold}>{selectedRumor.community_sentiment_pct ?? 50.0}%</span>
                    </div>
                    <div className={`w-full h-2.5 rounded-full ${theme === "dark" ? "bg-slate-950" : "bg-slate-200"} overflow-hidden`}>
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                        style={{ width: `${selectedRumor.community_sentiment_pct ?? 50}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Explainer Pros/Cons */}
              <div className={`${themeClasses.card} md:col-span-6 rounded-3xl p-6 border-l-4 border-l-emerald-500 backdrop-blur-sm shadow-xl flex flex-col gap-5 justify-between transition-all duration-300 hover:scale-[1.01] hover:shadow-emerald-500/5`}>
                <div className="pb-2 border-b border-slate-500/10">
                  <h3 className="text-base font-bold tracking-tight uppercase">
                    AI Transfer Explainer
                  </h3>
                </div>
                
                <div className="flex flex-col gap-5 flex-1 justify-center">
                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-bold text-emerald-600 flex items-center gap-1.5 uppercase">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      Supporting Evidence
                    </span>
                    <ul className={`flex flex-col gap-1.5 pl-4 list-disc text-sm ${themeClasses.textMuted} leading-relaxed`}>
                      {selectedRumor?.explainer?.pros?.map((pro, idx) => (
                        <li key={idx}>{pro}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-bold text-rose-600 flex items-center gap-1.5 uppercase">
                      <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                      Conflicting Factors
                    </span>
                    <ul className={`flex flex-col gap-1.5 pl-4 list-disc text-sm ${themeClasses.textMuted} leading-relaxed`}>
                      {selectedRumor?.explainer?.cons?.map((con, idx) => (
                        <li key={idx}>{con}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className={`border-t ${themeClasses.divider} pt-5 flex items-center justify-between text-xs`}>
                  <span className={`${themeClasses.textMuted} flex items-center gap-1`}>
                    Target Purse Remaining:
                    <strong className={themeClasses.textBold}>{selectedRumor.purse_remaining_cr} Cr</strong>
                  </span>
                  <span className={`px-2.5 py-1 rounded-md font-bold uppercase ${
                    selectedRumor.has_enough_purse
                      ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                  }`}>
                    {selectedRumor.has_enough_purse ? "Purse OK" : "Purse Shortage"}
                  </span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className={`flex-1 flex flex-col items-center justify-center text-center py-32 border ${themeClasses.divider} border-dashed rounded-3xl`}>
            <svg className="w-16 h-16 text-slate-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-xl font-bold text-slate-400">No Intelligence Loaded</h2>
            <p className={`text-sm ${themeClasses.textMuted} mt-2 max-w-sm`}>Select an active rumor from the sidebar to inspect its detailed AI match probability, community sentiment indices, and audit reports.</p>
          </div>
        )}
      </section>
    </div>
  );

  const renderVolatilityIndex = () => (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      {selectedRumor ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <div className={`${themeClasses.card} rounded-3xl p-6 border-l-4 border-l-purple-500 backdrop-blur-sm shadow-xl flex flex-col gap-4 transition-all duration-300 hover:scale-[1.01] hover:shadow-purple-500/5`}>
              <div className="flex justify-between items-center pb-2 border-b border-slate-500/10">
                <div>
                  <h3 className="text-lg font-bold tracking-tight uppercase">
                    Transfer Volatility Index: {selectedRumor.player}
                  </h3>
                  <p className={`text-xs ${themeClasses.textMuted} mt-0.5`}>
                    24-hour financial candlestick analysis of trading rumors velocity and sentiment momentum.
                  </p>
                </div>
                <span className="text-[10px] uppercase font-bold text-purple-600 bg-purple-500/15 border border-purple-500/30 px-2.5 py-0.5 rounded-full shrink-0">
                  Live Market Index
                </span>
              </div>

              {loadingVolatility ? (
                <div className="h-72 flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-8 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin"></div>
                  <span className={`text-sm ${themeClasses.textMuted}`}>Querying volatility telemetry...</span>
                </div>
              ) : volatilityData.length > 0 ? (
                (() => {
                  const maxHigh = Math.max(...volatilityData.map(c => c.high));
                  const maxVolume = Math.max(...volatilityData.map(c => c.volume || 500));
                  
                  // Helper function to scale Y coordinates to fit candlestick body
                  const transformY = (val: number) => 140 - (val / 100) * 110;
                  const transformVolY = (vol: number) => 190 - ((vol || 500) / maxVolume) * 25;
                  
                  const yPeak = transformY(maxHigh);
                  const firstCandle = volatilityData[0];
                  const lastCandle = volatilityData[volatilityData.length - 1];
                  
                  const xStart = 40;
                  const xEnd = 40 + 520;
                  const yStart = transformY(firstCandle.close);
                  const yEnd = transformY(lastCandle.close);
                  
                  return (
                    <div className="flex flex-col gap-4">
                      <div className={`relative w-full h-72 rounded-2xl p-4 ${theme === "dark" ? "bg-slate-950/60" : "bg-slate-200/40"} border ${themeClasses.divider} flex flex-col justify-between`}>
                        <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                          {/* Grid Lines */}
                          <line x1="40" y1="20" x2="580" y2="20" stroke="rgba(156,163,175,0.12)" strokeWidth="1" />
                          <line x1="40" y1="65" x2="580" y2="65" stroke="rgba(156,163,175,0.12)" strokeWidth="1" />
                          <line x1="40" y1="110" x2="580" y2="110" stroke="rgba(156,163,175,0.12)" strokeWidth="1" />
                          <line x1="40" y1="155" x2="580" y2="155" stroke="rgba(156,163,175,0.12)" strokeWidth="1" />
                          
                          <text x="15" y="24" className="text-[9px] font-bold opacity-50" fill="currentColor">100%</text>
                          <text x="15" y="69" className="text-[9px] font-bold opacity-50" fill="currentColor">70%</text>
                          <text x="15" y="114" className="text-[9px] font-bold opacity-50" fill="currentColor">40%</text>
                          <text x="15" y="159" className="text-[9px] font-bold opacity-50" fill="currentColor">10%</text>

                          {/* Technical: 24h Peak Cap Line */}
                          <line x1="40" y1={yPeak} x2="580" y2={yPeak} stroke="#ef4444" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.85" />
                          <text x="490" y={yPeak > 15 ? yPeak - 4 : yPeak + 10} className="text-[8px] font-black fill-rose-500" opacity="0.9">24h Peak ({maxHigh}%)</text>

                          {/* Technical: Trend Line */}
                          <line x1={xStart} y1={yStart} x2={xEnd} y2={yEnd} stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.9" />
                          <text x="45" y={yStart - 5} className="text-[8px] font-black fill-blue-500" opacity="0.8">Sentiment Trend</text>

                          {volatilityData.map((candle, idx, arr) => {
                            const x = 40 + (idx / (arr.length - 1)) * 520;
                            const isGreen = candle.close >= candle.open;
                            
                            const yOpen = transformY(candle.open);
                            const yClose = transformY(candle.close);
                            const yHigh = transformY(candle.high);
                            const yLow = transformY(candle.low);
                            const bodyTop = Math.min(yOpen, yClose);
                            const bodyHeight = Math.max(1.5, Math.abs(yOpen - yClose));
                            const bodyWidth = 10;

                            const candleColor = isGreen ? "rgb(16, 185, 129)" : "rgb(239, 68, 68)";
                            const candleColorHover = isGreen ? "rgb(52, 211, 153)" : "rgb(248, 113, 113)";

                            const volY = transformVolY(candle.volume || 500);

                            return (
                              <g
                                key={idx}
                                className="cursor-pointer transition-all"
                                onMouseEnter={() => setHoveredCandle(candle)}
                                onMouseLeave={() => setHoveredCandle(null)}
                              >
                                {/* Volume bar chart (Bottom 25px scale) */}
                                <rect
                                  x={x - 4}
                                  y={volY}
                                  width="8"
                                  height={190 - volY}
                                  fill={isGreen ? "rgba(16, 185, 129, 0.22)" : "rgba(239, 68, 68, 0.22)"}
                                  rx="1"
                                />

                                {/* Candlestick wicks */}
                                <line
                                  x1={x}
                                  y1={yHigh}
                                  x2={x}
                                  y2={yLow}
                                  stroke={hoveredCandle?.hour === candle.hour ? candleColorHover : candleColor}
                                  strokeWidth="2"
                                />
                                {/* Candlestick body */}
                                <rect
                                  x={x - bodyWidth / 2}
                                  y={bodyTop}
                                  width={bodyWidth}
                                  height={bodyHeight}
                                  fill={hoveredCandle?.hour === candle.hour ? candleColorHover : candleColor}
                                  rx="1.5"
                                  className="transition-colors shadow-sm"
                                />
                              </g>
                            );
                          })}
                        </svg>

                        {hoveredCandle && (
                          <div className="absolute top-4 right-4 bg-slate-950/95 text-white rounded-xl p-4 text-xs font-mono shadow-2xl border border-slate-800 flex flex-col gap-1.5 z-20">
                            <span className="text-purple-400 font-extrabold border-b border-slate-800 pb-1 uppercase">{hoveredCandle.hour} Sentiment Index</span>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                              <span className="text-slate-400">OPEN:</span>
                              <span className="font-extrabold text-right">{hoveredCandle.open}%</span>
                              <span className="text-emerald-400">HIGH:</span>
                              <span className="font-extrabold text-right">{hoveredCandle.high}%</span>
                              <span className="text-rose-400">LOW:</span>
                              <span className="font-extrabold text-right">{hoveredCandle.low}%</span>
                              <span className="text-slate-400">CLOSE:</span>
                              <span className="font-extrabold text-right">{hoveredCandle.close}%</span>
                              <span className="text-purple-400">VOLUME:</span>
                              <span className="font-extrabold text-right text-purple-400">{hoveredCandle.volume || 750} vts</span>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center px-9 text-[10px] font-bold opacity-60">
                          <span>24h ago</span>
                          <span>12h ago</span>
                          <span>Now</span>
                        </div>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="h-72 flex items-center justify-center text-sm italic opacity-50">
                  Volatility timeline metrics not available.
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className={`${themeClasses.card} rounded-3xl p-6 border-l-4 border-l-purple-500 backdrop-blur-sm shadow-xl flex flex-col gap-4`}>
              <h3 className="text-base font-bold uppercase tracking-wider border-b border-slate-500/10 pb-3">
                Volatility Analysis
              </h3>
              <div className="flex flex-col gap-4 text-sm">
                <div className="flex justify-between pb-2 border-b border-slate-500/10">
                  <span className={themeClasses.textMuted}>Player Status:</span>
                  <span className="font-bold text-emerald-500">{selectedRumor.player}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-500/10">
                  <span className={themeClasses.textMuted}>Linked Franchise:</span>
                  <span className="font-bold text-teal-500">{selectedRumor.franchise}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-500/10">
                  <span className={themeClasses.textMuted}>Journalist Tier:</span>
                  <span className="font-bold">{selectedRumor.journalist}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-500/10">
                  <span className={themeClasses.textMuted}>Current Match Probability:</span>
                  <span className="font-extrabold text-purple-500">{selectedRumor.probability}%</span>
                </div>
                <p className={`text-xs ${themeClasses.textMuted} leading-relaxed mt-2`}>
                  This index monitors price proxy metrics based on cumulative news sentiment velocity, tier weightings of supporting journalists, and public voting momentum.
                </p>
              </div>
            </div>

            {/* Technical Indicators Sheet */}
            <div className={`${themeClasses.card} rounded-3xl p-6 border-l-4 border-l-emerald-500 backdrop-blur-sm shadow-xl flex flex-col gap-4 hover:shadow-lg transition-all`}>
              <h3 className="text-base font-bold uppercase tracking-wider border-b border-slate-500/10 pb-3">
                Technical Indicators
              </h3>
              {(() => {
                const stats = getPlayerStats(selectedRumor.player, selectedRumor.probability);
                
                // Bullish/Bearish sentiment ratio
                const bullishRatio = stats.bullRatio;
                const bearishRatio = 100 - bullishRatio;
                
                // Support & Resistance levels
                const support = (stats.floor * 0.97).toFixed(1);
                const resistance = (stats.peak * 1.025).toFixed(1);

                return (
                  <div className="flex flex-col gap-4 text-sm">
                    <div className={`flex justify-between pb-2 border-b ${themeClasses.divider}`}>
                      <span className={themeClasses.textMuted}>24h High/Low Limits:</span>
                      <span className="font-bold">Peak: <span className="text-emerald-500">{stats.peak.toFixed(1)}%</span> | Floor: <span className="text-rose-500">{stats.floor.toFixed(1)}%</span></span>
                    </div>
                    <div className={`flex justify-between pb-2 border-b ${themeClasses.divider}`}>
                      <span className={themeClasses.textMuted}>Rumor Velocity Rate:</span>
                      <span className="font-bold text-amber-500">{stats.velocity}</span>
                    </div>
                    <div className={`flex justify-between pb-2 border-b ${themeClasses.divider} items-center`}>
                      <span className={themeClasses.textMuted}>Relative Sentiment Index (RSI):</span>
                      <div className="flex items-center gap-2">
                        <span className={`font-extrabold px-2 py-0.5 rounded text-xs ${stats.rsi > 70 ? "bg-amber-500/20 text-amber-500" : stats.rsi < 30 ? "bg-rose-500/20 text-rose-500" : "bg-emerald-500/20 text-emerald-500"}`}>{stats.rsi}</span>
                        <span className="text-[10px] opacity-75 font-semibold uppercase">{stats.rsi > 70 ? "Overbought" : stats.rsi < 30 ? "Oversold" : "Balanced"}</span>
                      </div>
                    </div>
                    <div className={`flex flex-col gap-1.5 pb-2 border-b ${themeClasses.divider}`}>
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-emerald-500">Bullish: {bullishRatio}%</span>
                        <span className="text-rose-500">Bearish: {bearishRatio}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-950/20 overflow-hidden flex">
                        <div className="h-full bg-emerald-500 transition-all" style={{ width: `${bullishRatio}%` }}></div>
                        <div className="h-full bg-rose-500 transition-all" style={{ width: `${bearishRatio}%` }}></div>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className={themeClasses.textMuted}>Support & Resistance:</span>
                      <span className="font-mono text-xs">S: <span className="text-emerald-400 font-bold">{support}%</span> | R: <span className="text-rose-400 font-bold">{resistance}%</span></span>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      ) : (
        renderNoPlayerFallback("volatility", "candlestick market tracking")
      )}
    </div>
  );

  const renderChronologyTimeline = () => {
    const currentRumor = rumors.find(r => r.player === selectedChronologyPlayer) || selectedRumor;

    return (
      <div className="flex flex-col gap-6 w-full animate-fade-in">
        {/* Render horizontal scrolling button bar at the top of the Chronology tab */}
        <div className={`${themeClasses.card} rounded-3xl p-4 border border-slate-500/10 flex flex-col gap-3 backdrop-blur-sm shadow-xl`}>
          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-500">
            Select Active Transfer Rumour
          </span>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
            {rumors.map((r) => {
              const isActive = currentRumor?.id === r.id;
              const style = franchiseStyles[r.franchise.toUpperCase()];
              return (
                <button
                  key={r.id}
                  onClick={() => setSelectedChronologyPlayer(r.player)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                    isActive
                      ? style 
                        ? `bg-gradient-to-r ${style.gradient} ${style.border} ${style.text} font-extrabold shadow-md`
                        : "bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold shadow-md shadow-emerald-500/10"
                      : "bg-slate-500/5 hover:bg-slate-500/10 border-slate-500/10 text-slate-300"
                  }`}
                >
                  {r.player} ({r.franchise})
                </button>
              );
            })}
          </div>
        </div>

        {currentRumor ? (
          <div className={`${themeClasses.card} rounded-3xl p-8 border-l-4 border-l-emerald-500 backdrop-blur-sm shadow-xl flex flex-col gap-6 transition-all duration-300 hover:scale-[1.005] hover:shadow-emerald-500/5`}>
            <div className="flex justify-between items-center pb-4 border-b border-slate-500/10">
              <div className="flex gap-4 items-center">
                <div className="p-3 rounded-xl bg-emerald-500/15 text-emerald-600 border border-emerald-500/25 shrink-0">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-extrabold tracking-tight uppercase">
                    Smoke-to-Fire Chronology: {currentRumor.player}
                  </h2>
                  <p className={`text-sm ${themeClasses.textMuted} mt-0.5`}>
                    Chronological progression timeline of rumor verification steps.
                  </p>
                </div>
              </div>
              {(() => {
                const style = franchiseStyles[currentRumor.franchise.toUpperCase()];
                return style ? (
                  <span className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border bg-gradient-to-r ${style.gradient} ${style.border} ${style.text}`}>
                    {currentRumor.franchise}
                  </span>
                ) : (
                  <span className="px-3.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold uppercase tracking-wider">
                    {currentRumor.franchise}
                  </span>
                );
              })()}
            </div>

            <div className={`relative pl-8 border-l ${theme === "dark" ? "border-slate-800" : "border-slate-200"} flex flex-col gap-8 my-4`}>
              {currentRumor.timeline && currentRumor.timeline.length > 0 ? (
                currentRumor.timeline.map((event, idx) => {
                  let trend: "up" | "down" | "flat" = "flat";
                  if (idx > 0) {
                    const prevProb = currentRumor.timeline[idx - 1].probability;
                    if (event.probability > prevProb) trend = "up";
                    if (event.probability < prevProb) trend = "down";
                  }
                  
                  return (
                    <div key={idx} className="relative">
                      <span className={`absolute -left-[39px] top-1.5 w-5.5 h-5.5 rounded-full border-4 ${
                        event.status === "blocked" 
                          ? "bg-rose-500 border-slate-950" 
                          : event.status === "active" 
                          ? "bg-emerald-500 border-slate-950" 
                          : "bg-slate-500/10 border-slate-950"
                      } flex items-center justify-center text-[8px] font-bold text-white`}>
                      </span>
                      
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 bg-slate-500/5 p-5 rounded-2xl border border-slate-500/10 hover:border-emerald-500/30 transition-all hover:scale-[1.005]">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className={`text-xs font-extrabold ${themeClasses.textMuted} uppercase tracking-wider bg-slate-950/20 px-2.5 py-0.5 rounded border ${themeClasses.divider}`}>
                              {event.time}
                            </span>
                            <h4 className="text-base font-extrabold">
                              {event.title}
                            </h4>
                          </div>
                          <p className={`text-sm ${themeClasses.textMuted} max-w-2xl leading-relaxed mt-1`}>
                            {event.description}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-4 shrink-0">
                          <span className={`px-3 py-1 rounded text-xs font-bold ${theme === "dark" ? "bg-slate-950 border-slate-800 text-slate-300" : "bg-slate-200 border-slate-300 text-slate-800"} border`}>
                            Source: {event.source}
                          </span>
                          
                          <span className={`inline-flex items-center gap-1.5 text-base font-black ${
                            event.probability >= 75
                              ? "text-emerald-500"
                              : event.probability >= 40
                              ? "text-amber-500"
                              : "text-rose-500"
                          }`}>
                            {event.probability}%
                            {trend === "up" && (
                              <svg className="w-5 h-5 text-emerald-500 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                              </svg>
                            )}
                            {trend === "down" && (
                              <svg className="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                              </svg>
                            )}
                            {trend === "flat" && (
                              <span className="text-slate-500 text-base font-bold">-</span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className={`text-sm ${themeClasses.textMuted} py-6`}>No timeline milestones registered for this rumor yet.</div>
              )}
            </div>
          </div>
        ) : (
          renderNoPlayerFallback("chronology", "milestone tracking logs")
        )}
      </div>
    );
  };

  const renderChatbot = () => (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      {selectedRumor ? (
        <div className={`${themeClasses.card} rounded-3xl p-8 border-l-4 border-l-emerald-500 backdrop-blur-sm shadow-xl flex flex-col gap-6 transition-all duration-300 hover:scale-[1.005] hover:shadow-emerald-500/5`}>
          <div className={`flex items-center gap-3 border-b ${themeClasses.divider} pb-4 justify-between`}>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-emerald-500 animate-pulse"></div>
              <h2 className="text-xl md:text-2xl font-extrabold tracking-tight uppercase">
                Ask AI Intelligence Chatbot
              </h2>
            </div>
            <span className="text-xs uppercase font-extrabold text-slate-500 bg-slate-500/10 px-2.5 py-1 rounded-md">
              Session target: {selectedRumor.player}
            </span>
          </div>

          <div className={`flex flex-col gap-4 min-h-[400px] max-h-[600px] overflow-y-auto pr-1 ${theme === "dark" ? "bg-slate-950/60" : "bg-slate-200/40"} rounded-2xl p-6 border ${themeClasses.divider} transition-colors duration-300`}>
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col gap-1.5 text-base max-w-[80%] rounded-2xl p-4 leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 self-end font-medium"
                    : `${theme === "dark" ? "bg-slate-900 border-slate-800 text-slate-200" : "bg-white border-slate-200 text-slate-800"} border self-start shadow-sm`
                }`}
              >
                {msg.text}
              </div>
            ))}
            {chatLoading && (
              <div className={`bg-slate-900/10 border ${themeClasses.divider} ${themeClasses.textMuted} text-base self-start rounded-2xl p-4 flex items-center gap-3.5`}>
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-ping"></span>
                Generating Transfer Analysis...
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 border-t border-slate-500/10 pt-4">
            <div className="flex flex-wrap gap-2">
              {getSuggestions().map((sug, idx) => (
                <button
                  key={idx}
                  disabled={chatLoading}
                  onClick={() => handleChatSubmit(sug)}
                  className={`px-4.5 py-2.5 rounded-xl border ${themeClasses.divider} ${theme === "dark" ? "bg-slate-950" : "bg-white"} text-xs font-bold ${themeClasses.textMuted} hover:text-slate-800 hover:border-slate-400 transition-all disabled:opacity-50 hover:scale-[1.02]`}
                >
                  {sug}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleChatSubmit(chatInput);
              }}
              className="flex gap-3"
            >
              <input
                type="text"
                placeholder={`Ask about ${selectedRumor.player}'s transfer feasibility...`}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                disabled={chatLoading}
                className={`w-full ${themeClasses.input} rounded-xl py-4.5 px-5 text-base focus:outline-none disabled:opacity-50 placeholder-slate-400`}
              />
              <button
                type="submit"
                disabled={chatLoading || !chatInput.trim()}
                className="bg-emerald-500 hover:bg-emerald-600 transition-colors text-slate-950 rounded-xl px-7 py-4.5 font-extrabold text-base disabled:opacity-50 uppercase tracking-wide"
              >
                Ask
              </button>
            </form>
          </div>
        </div>
      ) : (
        renderNoPlayerFallback("chatbot", "AI conversational insights")
      )}
    </div>
  );

  const renderHeatMap = () => {
    const teams = ["CSK", "MI", "KKR", "RCB", "GT", "LSG", "DC", "RR", "PBKS", "SRH"];

    const heatData = teams.map((team) => {
      // Find rumors linked to this franchise
      const teamRumors = rumors.filter(
        (r) => r.franchise.toUpperCase() === team.toUpperCase()
      );
      const count = teamRumors.length;
      
      // Hot target: active player linked to this franchise with highest probability
      let hotTarget = "None";
      let maxProb = -1;
      teamRumors.forEach((r) => {
        if (r.probability > maxProb) {
          maxProb = r.probability;
          hotTarget = r.player;
        }
      });
      
      // Set customized styles/badges depending on the rumor volume
      let heat = "Low";
      if (count >= 3) {
        heat = "Extreme";
      } else if (count === 2) {
        heat = "High";
      } else if (count === 1) {
        heat = "Medium";
      }
      
      const style = franchiseStyles[team];
      return { team, count, hotTarget, heat, style };
    });

    return (
      <div className="flex flex-col gap-6 w-full animate-fade-in">
        <div className={`${themeClasses.card} rounded-3xl p-8 border-l-4 border-l-emerald-500 backdrop-blur-sm shadow-xl flex flex-col gap-6 transition-all duration-300 hover:scale-[1.005] hover:shadow-emerald-500/5`}>
          <div className="pb-4 border-b border-slate-500/10">
            <h2 className="text-xl md:text-2xl font-extrabold tracking-tight uppercase">
              Transfer Rumor Heat Map (All 10 Teams)
            </h2>
            <p className={`text-sm ${themeClasses.textMuted} mt-1`}>
              Interactive grid showing rumor volumes and key targets across all 10 franchises. Click a card for details.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {heatData.map((item) => {
              const isSelected = selectedHeatmapTeam === item.team;
              return (
                <div
                  key={item.team}
                  onClick={() => {
                    setSelectedHeatmapTeam(item.team);
                    fetchHeatmapTeamDetails(item.team);
                  }}
                  className={`bg-gradient-to-br ${item.style.gradient} ${item.style.border} ${item.style.text} border rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all duration-300 hover:scale-[1.03] hover:shadow-lg cursor-pointer ${
                    isSelected ? "ring-4 ring-emerald-500 scale-[1.03]" : ""
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-extrabold text-lg tracking-wider">{item.team}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${item.style.badge}`}>
                      {item.heat}
                    </span>
                  </div>
                  <div>
                    <div className="text-2xl font-black mb-1">{item.count} Rumors</div>
                    <div className="text-xs opacity-90 truncate">
                      Hot Target: <strong className="font-extrabold">{item.hotTarget}</strong>
                    </div>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-950/20 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-current transition-all duration-500"
                      style={{ width: `${item.count > 0 ? Math.min(100, item.count * 30 + 10) : 10}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          {selectedHeatmapTeam && (
            <div className={`mt-6 ${themeClasses.card} rounded-3xl p-6 border border-slate-500/10 transition-all duration-300 shadow-md`}>
              {loadingHeatmapTeam ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <div className="w-8 h-8 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin"></div>
                  <span className={`text-sm ${themeClasses.textMuted}`}>Scanning franchise intelligence for {selectedHeatmapTeam}...</span>
                </div>
              ) : heatmapTeamDetails ? (
                <div className="flex flex-col gap-6">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-500/10">
                    <div>
                      <h3 className="text-lg font-black tracking-wider uppercase">
                        {franchiseStyles[selectedHeatmapTeam]?.name || selectedHeatmapTeam} Intelligence
                      </h3>
                      <p className={`text-xs ${themeClasses.textMuted}`}>
                        Real-time Neo4j schema relationships & financial status.
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${franchiseStyles[selectedHeatmapTeam]?.gradient || "from-slate-700 to-slate-800"} ${franchiseStyles[selectedHeatmapTeam]?.text || "text-white"}`}>
                      {selectedHeatmapTeam}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center text-sm font-bold">
                      <span className={themeClasses.textMuted}>Purse Remaining:</span>
                      <span className={themeClasses.textBold}>
                        {heatmapTeamDetails.available_purse_cr} Cr / 120.0 Cr Left
                      </span>
                    </div>
                    <div className={`w-full h-3 rounded-full ${theme === "dark" ? "bg-slate-900" : "bg-slate-200"} overflow-hidden border border-slate-500/5`}>
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                        style={{ width: `${(heatmapTeamDetails.available_purse_cr / 120.0) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-3">
                      <h4 className="text-sm font-extrabold uppercase tracking-wider text-teal-500">
                        Linked Target Players
                      </h4>
                      <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-2">
                        {heatmapTeamDetails.incoming_list && heatmapTeamDetails.incoming_list.length > 0 ? (
                          heatmapTeamDetails.incoming_list.map((item: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-slate-500/5 border border-slate-500/5">
                              <span className="font-bold text-sm">{item.player}</span>
                              <div className="flex flex-col items-end">
                                <span className="text-xs text-slate-400">via {item.journalist}</span>
                                <span className="text-[10px] text-emerald-500">{(item.accuracy * 100).toFixed(1)}% acc</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <span className={`text-xs ${themeClasses.textMuted} italic py-2`}>
                            No incoming target rumors currently registered.
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <h4 className="text-sm font-extrabold uppercase tracking-wider text-purple-500">
                        Deals Agency & Representation
                      </h4>
                      <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-2">
                        {heatmapTeamDetails.agents_list && heatmapTeamDetails.agents_list.length > 0 ? (
                          heatmapTeamDetails.agents_list.map((agent: any, idx: number) => (
                            <div key={idx} className="flex flex-col gap-1 p-3 rounded-xl bg-slate-500/5 border border-slate-500/5">
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-sm">{agent.name}</span>
                                <span className="text-[10px] px-2 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded font-black">
                                  Clout: {agent.clout}/10
                                </span>
                              </div>
                              <span className="text-xs text-slate-400">{agent.company}</span>
                              {agent.represented_players && agent.represented_players.length > 0 && (
                                <div className="text-[10px] text-slate-500 mt-1 truncate">
                                  Representing: {agent.represented_players.join(", ")}
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <span className={`text-xs ${themeClasses.textMuted} italic py-2`}>
                            No linked player representation agencies.
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-center text-rose-500">Failed to load team details.</div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderTradeSandbox = () => {
    const SANDBOX_PLAYERS = [
      { name: "Rinku Singh", value: 11.0, source: "KKR" },
      { name: "Suryakumar Yadav", value: 15.0, source: "MI" },
      { name: "KL Rahul", value: 14.0, source: "LSG" },
      { name: "Rishabh Pant", value: 16.0, source: "DC" },
      { name: "Shreyas Iyer", value: 12.0, source: "KKR" },
      { name: "Ishan Kishan", value: 10.0, source: "MI" },
      { name: "Jos Buttler", value: 13.0, source: "RR" },
      { name: "Hardik Pandya", value: 15.0, source: "MI" },
      { name: "Cameron Green", value: 17.5, source: "RCB" },
      { name: "Devdutt Padikkal", value: 7.5, source: "LSG" }
    ];

    const TEAMS_LIST = ["CSK", "MI", "KKR", "RCB", "GT", "LSG", "DC", "RR", "PBKS", "SRH"];

    const handleAddTrade = () => {
      if (!tradePlayer || !tradeTarget || !tradeSource) return;
      const matched = SANDBOX_PLAYERS.find(p => p.name === tradePlayer);
      if (!matched) return;
      
      // Prevent duplicating same player in trade list
      if (sandboxTrades.some(t => t.player === tradePlayer)) return;

      setSandboxTrades([
        ...sandboxTrades,
        {
          player: tradePlayer,
          value: matched.value,
          source: tradeSource,
          target: tradeTarget
        }
      ]);
      setTradePlayer("");
      setTradeSource("");
      setTradeTarget("");
    };

    const handleRemoveTrade = (idx: number) => {
      setSandboxTrades(sandboxTrades.filter((_, i) => i !== idx));
    };

    const totalTradeValue = sandboxTrades.reduce((acc, t) => acc + t.value, 0);
    const agencyCommission = Number((totalTradeValue * 0.05).toFixed(2));

    return (
      <div className="flex flex-col gap-6 w-full animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Panel: Selector & Trades List */}
          <div className={`${themeClasses.card} lg:col-span-5 rounded-3xl p-6 border-l-4 border-l-purple-500 backdrop-blur-sm shadow-xl flex flex-col gap-5 transition-all duration-300 hover:scale-[1.01] hover:shadow-purple-500/5`}>
            <div>
              <h3 className="text-xl font-extrabold tracking-tight uppercase">
                Multi-Player Trade Sandbox
              </h3>
              <p className={`text-sm ${themeClasses.textMuted} mt-1`}>
                Build a package trade to run real-time purse adjustments, squad slots verification, and commission logs.
              </p>
            </div>
            
            <div className="flex flex-col gap-4 border-b border-slate-500/10 pb-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`text-xs font-bold ${themeClasses.textMuted} uppercase tracking-wider`}>Select Player</label>
                  <select
                    value={tradePlayer}
                    onChange={(e) => {
                      const val = e.target.value;
                      setTradePlayer(val);
                      const matched = SANDBOX_PLAYERS.find(p => p.name === val);
                      if (matched) {
                        setTradeSource(matched.source);
                      } else {
                        setTradeSource("");
                      }
                    }}
                    className={`w-full ${themeClasses.input} rounded-xl py-2.5 px-3 text-sm focus:outline-none mt-1.5`}
                  >
                    <option value="">-- Choose Player --</option>
                    {SANDBOX_PLAYERS.filter(p => !sandboxTrades.some(t => t.player === p.name)).map(p => (
                      <option key={p.name} value={p.name}>{p.name} ({p.value} Cr)</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`text-xs font-bold ${themeClasses.textMuted} uppercase tracking-wider`}>Target Franchise</label>
                  <select
                    value={tradeTarget}
                    onChange={(e) => setTradeTarget(e.target.value)}
                    className={`w-full ${themeClasses.input} rounded-xl py-2.5 px-3 text-sm focus:outline-none mt-1.5`}
                  >
                    <option value="">-- Choose Target --</option>
                    {TEAMS_LIST.filter(t => t !== tradeSource).map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {tradeSource && (
                <div className="text-xs text-purple-500 font-extrabold flex justify-between px-1">
                  <span>Current Team: {tradeSource}</span>
                  <span>Value: {SANDBOX_PLAYERS.find(p => p.name === tradePlayer)?.value} Cr</span>
                </div>
              )}

              <button
                disabled={!tradePlayer || !tradeTarget || !tradeSource}
                onClick={handleAddTrade}
                className="w-full bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/35 text-purple-600 dark:text-purple-400 font-extrabold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 disabled:opacity-50 tracking-wider"
              >
                ➕ Add Player to Trade Package
              </button>
            </div>

            {/* Configured Trades Package List */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Configured Package ({sandboxTrades.length} Players)
              </h4>
              {sandboxTrades.length === 0 ? (
                <div className="text-center py-6 border border-dashed rounded-xl opacity-60 text-xs">
                  No players added to trade package yet.
                </div>
              ) : (
                <div className="flex flex-col gap-2.5 max-h-48 overflow-y-auto pr-1">
                  {sandboxTrades.map((t, index) => (
                    <div key={index} className="flex justify-between items-center p-3 rounded-xl border border-slate-500/10 bg-slate-500/5 text-xs">
                      <div>
                        <strong className="font-bold">{t.player}</strong>
                        <span className="opacity-75 block mt-0.5">{t.source} ➔ {t.target} ({t.value} Cr)</span>
                      </div>
                      <button
                        onClick={() => handleRemoveTrade(index)}
                        className="text-red-500 hover:text-red-700 font-bold px-2 py-1"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Package Analytics Summary */}
            {sandboxTrades.length > 0 && (
              <div className="border-t border-slate-500/10 pt-4 flex flex-col gap-2.5 text-xs">
                <div className="flex justify-between">
                  <span className={themeClasses.textMuted}>Total Package Value:</span>
                  <span className="font-extrabold text-sm">{totalTradeValue} Cr</span>
                </div>
                <div className="flex justify-between">
                  <span className={themeClasses.textMuted}>Agency Commission (5%):</span>
                  <span className="font-extrabold text-sm text-purple-500">{agencyCommission} Cr</span>
                </div>
              </div>
            )}

            <button
              disabled={sandboxTrades.length === 0}
              onClick={() => runTradeSimulation()}
              className="w-full bg-purple-600 hover:bg-purple-700 active:scale-95 transition-all text-white font-extrabold text-sm py-3 px-5 rounded-xl flex items-center justify-center gap-1.5 disabled:opacity-50 mt-2 uppercase tracking-wider"
            >
              🔄 Simulate Multi-Player Trade
            </button>
          </div>

          {/* Right Panel: Simulation Results */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {simulationResult ? (
              <div className={`${themeClasses.card} rounded-3xl p-6 border-l-4 border-l-purple-500 backdrop-blur-sm shadow-xl flex flex-col gap-5`}>
                <div className="flex justify-between items-center pb-2 border-b border-slate-500/10">
                  <h3 className="text-base font-bold tracking-tight uppercase">
                    Simulation Results
                  </h3>
                  <span className={`px-2.5 py-1 rounded text-xs font-bold border ${
                    simulationResult.feasible
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                  }`}>
                    {simulationResult.feasible ? "FEASIBLE" : "INFEASIBLE / BLOCKED"}
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  <p className="text-sm leading-relaxed opacity-95">
                    {simulationResult.reason}
                  </p>

                  {simulationResult.suggested_cascade && (
                    <div className="bg-purple-500/5 border border-purple-500/20 rounded-2xl p-4 mt-2 flex flex-col gap-3 items-start animate-pulse">
                      <p className="text-sm text-purple-400 font-semibold italic">
                        💡 Cascade Recommendation: {simulationResult.suggested_cascade.message}
                      </p>
                      <button
                        onClick={handleSolveRosterConstraint}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-lg transition-all border border-purple-500/30 uppercase tracking-wider cursor-pointer"
                      >
                        ⚡ Solve Roster Constraint
                      </button>
                    </div>
                  )}
                </div>

                {simulationResult.adjustments && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                    {simulationResult.adjustments
                      .filter((adj: any) => adj.purse_change !== 0 || adj.slots_change !== 0)
                      .map((adj: any) => {
                        const lowPurse = adj.projected_purse < 5.0 && adj.projected_purse >= 0;
                        const exceedPurse = adj.projected_purse < 0;
                        const exceedSlots = adj.projected_slots < 0;
                        
                        return (
                          <div
                            key={adj.franchise}
                            className={`p-4 rounded-2xl border ${
                              theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-slate-100 border-slate-200"
                            } flex flex-col gap-2.5`}
                          >
                            <div className="flex justify-between items-center pb-1.5 border-b border-slate-500/10">
                              <strong className="font-extrabold text-sm">{adj.franchise}</strong>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                adj.purse_change > 0 ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"
                              }`}>
                                {adj.purse_change > 0 ? `+${adj.purse_change.toFixed(1)} Cr` : `${adj.purse_change.toFixed(1)} Cr`}
                              </span>
                            </div>
                            <div className="text-xs flex flex-col gap-1.5 mt-1">
                              <div className="flex justify-between items-center">
                                <span className={themeClasses.textMuted}>Purse Margin:</span>
                                <span className={`font-bold ${exceedPurse ? "text-rose-500" : lowPurse ? "text-amber-500" : ""}`}>
                                  {adj.projected_purse.toFixed(1)} Cr
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className={themeClasses.textMuted}>Squad Slots:</span>
                                <span className={`font-bold ${exceedSlots ? "text-rose-500" : ""}`}>
                                  {adj.projected_slots} Left
                                </span>
                              </div>
                            </div>
                            
                            {/* Salary Cap Safety Warnings / Slot Errors */}
                            {(exceedPurse || lowPurse || exceedSlots) && (
                              <div className="border-t border-slate-500/5 pt-2 mt-1 flex flex-col gap-1 text-[9px] uppercase font-black">
                                {exceedPurse && <span className="text-rose-500">🚨 Cap Exceeded (Insufficient Purse)</span>}
                                {lowPurse && <span className="text-amber-500">⚠️ Low Purse Margin (&lt; 5.0 Cr)</span>}
                                {exceedSlots && <span className="text-rose-500">🚨 Roster Cap Exceeded (Over Slots)</span>}
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            ) : (
              <div className={`${themeClasses.card} rounded-3xl p-12 text-center text-sm ${themeClasses.textMuted} border border-dashed ${themeClasses.divider} flex flex-col items-center justify-center gap-3`}>
                <svg className="w-12 h-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                <span>Simulation result will load here when you click run.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const sagasToRender = backtestSagas && backtestSagas.length > 0 ? backtestSagas : mockSagas;
  const sagaDetailsToRender = selectedSaga || mockSagas.find(s => s.id === selectedSagaId) || mockSagas[0];

  return (
    <div className={`relative min-h-screen overflow-hidden ${themeClasses.body} flex flex-col font-sans selection:bg-emerald-500 selection:text-black transition-colors duration-300`}>
      {/* Inline styles for custom floating background animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) rotate(-12deg); }
          50% { transform: translateY(-16px) rotate(-15deg); }
        }
        @keyframes floatMedium {
          0%, 100% { transform: translateY(0px) rotate(12deg); }
          50% { transform: translateY(-12px) rotate(10deg); }
        }
        @keyframes floatDrift {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          50% { transform: translateY(-14px) translateX(6px) rotate(3deg); }
        }
      `}} />

      {/* Dynamic Background Doodles Layer */}
      <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
        {/* Bat and Ball - Top Left Floating */}
        <div className="absolute top-[10%] left-[5%] animate-[floatSlow_8s_infinite_ease-in-out]">
          <svg className={`w-28 h-28 ${getDoodleColorClass()} transition-colors`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 0L6.263 17.737a2.5 2.5 0 11-3.536-3.536L11.293 5.636m3.535 3.536l3.536-3.536" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 18.364L18.364 5.636" />
            <circle cx="18" cy="18" r="3" stroke="currentColor" strokeWidth={1.2} />
          </svg>
        </div>
        
        {/* Stumps with Bails - Top Right */}
        <div className="absolute top-[12%] right-[8%] animate-[floatMedium_9s_infinite_ease-in-out]">
          <svg className={`w-24 h-32 ${getDoodleColorClass()} transition-colors`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
            <line x1="2" y1="3" x2="11" y2="3" stroke="currentColor" strokeWidth={1.5} />
            <line x1="13" y1="3" x2="22" y2="3" stroke="currentColor" strokeWidth={1.5} />
            <rect x="4" y="5" width="2" height="18" rx="0.5" fill="none" />
            <rect x="11" y="5" width="2" height="18" rx="0.5" fill="none" />
            <rect x="18" y="5" width="2" height="18" rx="0.5" fill="none" />
          </svg>
        </div>
        
        {/* IPL Trophy - Middle Left */}
        <div className="absolute top-[45%] left-[6%] animate-[floatDrift_11s_infinite_ease-in-out]">
          <svg className={`w-32 h-32 ${getDoodleColorClass()} transition-colors`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a6 6 0 100-12 6 6 0 000 12zm0 0v6M9 21h6M4 9a3 3 0 013-3h1v6H7a3 3 0 01-3-3zm16 0a3 3 0 00-3-3h-1v6h1a3 3 0 003-3z" />
          </svg>
        </div>

        {/* Helmet - Middle Right */}
        <div className="absolute top-[40%] right-[7%] animate-[floatSlow_7s_infinite_ease-in-out]">
          <svg className={`w-28 h-28 ${getDoodleColorClass()} transition-colors`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
            <path d="M12 2C6.48 2 2 6.48 2 12c0 3.31 1.61 6.24 4.09 8.08L6 22h12l-.09-1.92C20.39 18.24 22 15.31 22 12c0-5.52-4.48-10-10-10z" />
            <line x1="6" y1="12" x2="18" y2="12" stroke="currentColor" strokeWidth={1.5} />
            <line x1="7" y1="15" x2="17" y2="15" stroke="currentColor" strokeWidth={1.5} />
            <line x1="8" y1="18" x2="16" y2="18" stroke="currentColor" strokeWidth={1.5} />
            <line x1="12" y1="12" x2="12" y2="20" stroke="currentColor" strokeWidth={1.2} />
          </svg>
        </div>
        
        {/* Stadium Floodlights - Bottom Left */}
        <div className="absolute bottom-[10%] left-[10%] animate-[floatMedium_13s_infinite_ease-in-out]">
          <svg className={`w-24 h-32 ${getDoodleColorClass()} transition-colors`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
            <rect x="5" y="2" width="14" height="8" rx="1" stroke="currentColor" strokeWidth={1.2} />
            <circle cx="8" cy="4" r="1" fill="currentColor" />
            <circle cx="12" cy="4" r="1" fill="currentColor" />
            <circle cx="16" cy="4" r="1" fill="currentColor" />
            <circle cx="8" cy="8" r="1" fill="currentColor" />
            <circle cx="12" cy="8" r="1" fill="currentColor" />
            <circle cx="16" cy="8" r="1" fill="currentColor" />
            <line x1="8" y1="10" x2="10" y2="22" stroke="currentColor" strokeWidth={1.5} />
            <line x1="16" y1="10" x2="14" y2="22" stroke="currentColor" strokeWidth={1.5} />
            <line x1="12" y1="10" x2="12" y2="22" stroke="currentColor" strokeWidth={1.0} />
            <line x1="9" y1="14" x2="15" y2="14" stroke="currentColor" strokeWidth={1.0} />
            <line x1="9.5" y1="18" x2="14.5" y2="18" stroke="currentColor" strokeWidth={1.0} />
          </svg>
        </div>
        
        {/* Boundary 6 Badge - Bottom Right */}
        <div className="absolute bottom-[15%] right-[10%] animate-[floatDrift_10s_infinite_ease-in-out]">
          <svg className={`w-28 h-28 ${getDoodleColorClass()} transition-colors`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
            <polygon points="12,2 22,8.5 22,17 12,22 2,17 2,8.5" stroke="currentColor" strokeWidth={1.2} />
            <text x="12" y="16.5" textAnchor="middle" className="text-[12px] font-black fill-current" stroke="none">6</text>
          </svg>
        </div>
      </div>
      {/* Header */}
      <header className={`border-b ${themeClasses.header} backdrop-blur-md sticky top-0 z-50 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <svg className="w-6 h-6 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <span className="font-extrabold text-xl md:text-2xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600 uppercase">
                IPL Transfer Credibility Engine
              </span>
            </div>
          </div>
          
          {/* Theme Selector */}
          <div className="flex items-center gap-4">
            <div className={`flex gap-1 p-1 rounded-xl border ${themeClasses.tabBg} items-center transition-colors duration-300`}>
              <button
                onClick={() => setTheme("light")}
                className={`p-1.5 rounded-lg transition-all ${theme === "light" ? "bg-amber-400 text-slate-950 shadow-sm" : `${themeClasses.textMuted} hover:text-amber-500`}`}
                title="Light Theme"
              >
                {/* Sun icon */}
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 7a5 5 0 100 10 5 5 0 000-10z" />
                </svg>
              </button>
              <button
                onClick={() => setTheme("warm")}
                className={`p-1.5 rounded-lg transition-all ${theme === "warm" ? "bg-amber-700 text-white shadow-sm" : `${themeClasses.textMuted} hover:text-amber-700`}`}
                title="Warm Theme"
              >
                {/* Coffee/Cup Icon */}
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.72 13.78L15 12a10 10 0 010-14.14M9 21h6M12 17v4m-5-8h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`p-1.5 rounded-lg transition-all ${theme === "dark" ? "bg-slate-700 text-emerald-400 shadow-sm" : `${themeClasses.textMuted} hover:text-emerald-400`}`}
                title="Dark Theme"
              >
                {/* Moon icon */}
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto p-4 md:p-6 w-full">
        {/* Segmented Workspaces Toolbar */}
        <div className="mb-8">
          <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2 p-2 rounded-2xl border ${themeClasses.tabBg} backdrop-blur-md transition-all duration-300 shadow-xl`}>
            {[
              { id: "credibility", label: "Credibility Hub", icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              ), badge: "Core", color: "hover:border-emerald-500/50 hover:bg-emerald-500/10 text-emerald-500", activeClass: "bg-emerald-500 text-slate-950 border-emerald-400/30" },
              { id: "volatility", label: "Volatility Index", icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              ), badge: "Live", color: "hover:border-purple-500/50 hover:bg-purple-500/10 text-purple-500", activeClass: "bg-purple-500 text-slate-950 border-purple-400/30" },
              { id: "chronology", label: "Timeline", icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ), badge: "Sagas", color: "hover:border-amber-500/50 hover:bg-amber-500/10 text-amber-500", activeClass: "bg-amber-500 text-slate-950 border-amber-400/30" },
              { id: "chatbot", label: "Ask AI Chat", icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              ), badge: "AI", color: "hover:border-teal-500/50 hover:bg-teal-500/10 text-teal-500", activeClass: "bg-teal-500 text-slate-950 border-teal-400/30" },
              { id: "heatmap", label: "Heat Map", icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>
              ), badge: "Hot", color: "hover:border-orange-500/50 hover:bg-orange-500/10 text-orange-500", activeClass: "bg-orange-500 text-slate-950 border-orange-400/30" },
              { id: "sandbox", label: "Trade Sandbox", icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              ), badge: "Solve", color: "hover:border-purple-500/50 hover:bg-purple-500/10 text-purple-500", activeClass: "bg-purple-500 text-slate-950 border-purple-400/30" },
              { id: "leaderboard", label: "Leaderboard", icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              ), badge: "Trust", color: "hover:border-blue-500/50 hover:bg-blue-500/10 text-blue-500", activeClass: "bg-blue-500 text-slate-950 border-blue-400/30" },
              { id: "franchises", label: "Franchise Hub", icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              ), badge: "Teams", color: "hover:border-indigo-500/50 hover:bg-indigo-500/10 text-indigo-500", activeClass: "bg-indigo-500 text-slate-950 border-indigo-400/30" },
              { id: "backtesting", label: "ML Sandbox", icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              ), badge: "ML", color: "hover:border-pink-500/50 hover:bg-pink-500/10 text-pink-500", activeClass: "bg-pink-500 text-slate-950 border-pink-400/30" }
            ].map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-xl border text-center transition-all duration-300 gap-1.5 shadow-sm group hover:scale-[1.03] ${
                    isActive
                      ? item.activeClass
                      : `${themeClasses.textMuted} bg-transparent border-transparent ${item.color}`
                  }`}
                >
                  <div className="shrink-0">{item.icon}</div>
                  <span className="text-[11px] font-extrabold tracking-tight truncate max-w-full">
                    {item.label}
                  </span>
                  <span className={`absolute top-1 right-1 text-[8px] font-extrabold px-1 rounded-full uppercase tracking-wider ${
                    isActive ? "bg-slate-950/20 text-slate-950" : "bg-slate-500/10 text-slate-500"
                  }`}>
                    {item.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-500/5 border border-rose-500/10 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
              <span className="text-base text-rose-800 font-medium">{error}</span>
            </div>
            <button
              onClick={() => {
                if (activeTab === "credibility") fetchRumors(query);
                else if (activeTab === "leaderboard") fetchLeaderboard();
                else fetchFranchiseDetails(selectedTeam);
              }}
              className="text-sm bg-rose-500/10 border border-rose-500/20 text-rose-800 px-3 py-1.5 rounded-lg hover:bg-rose-500/20"
            >
              Retry
            </button>
          </div>
        )}

        {activeTab === "credibility" ? (
          renderCredibilityHub()
        ) : activeTab === "volatility" ? (
          renderVolatilityIndex()
        ) : activeTab === "chronology" ? (
          renderChronologyTimeline()
        ) : activeTab === "chatbot" ? (
          renderChatbot()
        ) : activeTab === "heatmap" ? (
          renderHeatMap()
        ) : activeTab === "sandbox" ? (
          renderTradeSandbox()
        ) : activeTab === "leaderboard" ? (
          /* Leaderboard Tab Layout */
          /* Leaderboard Tab Layout */
          <section className={`${themeClasses.card} rounded-3xl p-8 border-l-4 border-l-emerald-500 backdrop-blur-sm shadow-xl flex flex-col gap-6 transition-all duration-300 hover:scale-[1.005] hover:shadow-emerald-500/5`}>
            <div className="flex justify-between items-center w-full">
              <div className="flex gap-4 items-center">
                <div className="p-3 rounded-xl bg-emerald-500/15 text-emerald-600 border border-emerald-500/25 shrink-0">
                  {/* Trophy Icon */}
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-extrabold tracking-tight uppercase">
                    Journalist Trust Leaderboard
                  </h2>
                  <div className="flex flex-col md:flex-row md:items-center gap-3 mt-1">
                    <p className={`text-sm ${themeClasses.textMuted}`}>
                      Leaderboard: {journalists.length} journalists tracked
                    </p>
                    <div className="flex items-center gap-1.5 font-serif text-[11px] italic text-emerald-500 bg-emerald-500/5 px-2.5 py-1 rounded-lg border border-emerald-500/10 w-fit">
                      <span>A<sub>dynamic</sub> = ( </span>
                      <div className="flex flex-col items-center inline-flex mx-0.5">
                        <span className="border-b border-current px-0.5 text-[9px] leading-tight">Correct</span>
                        <span className="text-[9px] leading-tight">Total</span>
                      </div>
                      <span>) &times; 100</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3 Summary Cards */}
            {(() => {
              const goldTierInsiders = journalists.filter(j => j.accuracy >= 80).length;
              let peakAccuracyName = "N/A";
              let peakAccuracyVal = -1;
              journalists.forEach(j => {
                if (j.accuracy > peakAccuracyVal) {
                  peakAccuracyVal = j.accuracy;
                  peakAccuracyName = j.name;
                }
              });
              const peakAccuracySource = peakAccuracyVal >= 0 ? `${peakAccuracyName} (${peakAccuracyVal}%)` : "N/A";
              const speculativeSources = journalists.filter(j => j.accuracy < 50).length;
              return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2 animate-fade-in">
                  <div className="p-5 rounded-2xl bg-slate-500/5 border border-slate-500/10 flex flex-col gap-1.5 hover:border-amber-500/30 transition-all">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-500">Gold Tier Insiders</span>
                    <span className="text-3xl font-black">{goldTierInsiders}</span>
                    <span className="text-[10px] text-slate-400">Accuracy &ge; 80%</span>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-500/5 border border-slate-500/10 flex flex-col gap-1.5 hover:border-emerald-500/30 transition-all">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">Peak Accuracy Source</span>
                    <span className="text-xl font-black truncate">{peakAccuracySource}</span>
                    <span className="text-[10px] text-slate-400">Top ranked contributor</span>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-500/5 border border-slate-500/10 flex flex-col gap-1.5 hover:border-rose-500/30 transition-all">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-500">Speculative Sources</span>
                    <span className="text-3xl font-black">{speculativeSources}</span>
                    <span className="text-[10px] text-slate-400">Accuracy &lt; 50%</span>
                  </div>
                </div>
              );
            })()}

            <div className={`border-t ${themeClasses.divider} pt-6 flex flex-col gap-6`}>
              <p className={`text-sm ${themeClasses.textMuted} max-w-2xl leading-relaxed`}>
                Dynamic accuracy scores compiled from historical rumor verification checks. Accuracy represents the percentage of claims that successfully materialized into official player transfers.
              </p>

              {loadingLeaderboard ? (
                <div className="flex flex-col items-center justify-center py-24 gap-3">
                  <div className="w-8 h-8 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin"></div>
                  <span className={`text-sm ${themeClasses.textMuted}`}>Calculating trust tiers...</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className={`border-b ${themeClasses.divider} ${themeClasses.textMuted} font-bold uppercase tracking-wider text-[10px]`}>
                        <th className="pb-4 pl-4 w-16">Rank</th>
                        <th className="pb-4">Journalist</th>
                        <th className="pb-4">Outlet</th>
                        <th className="pb-4">Total Rumors</th>
                        <th className="pb-4">Correct</th>
                        <th className="pb-4">Incorrect</th>
                        <th className="pb-4">Favorite Target</th>
                        <th className="pb-4">Avg Lifespan</th>
                        <th className="pb-4">Last Active</th>
                        <th className="pb-4">Trust Level</th>
                        <th className="pb-4 pr-4">Live Accuracy</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${theme === "dark" ? "divide-slate-800/60" : "divide-slate-200"}`}>
                      {journalists.map((reporter, index) => {
                        const incorrectCount = reporter.total_rumours - reporter.correct_rumours;
                        return (
                          <tr key={reporter.name} className={`${theme === "dark" ? "hover:bg-slate-800/15" : "hover:bg-slate-100/40"} transition-colors`}>
                            <td className={`py-5 pl-4 font-extrabold ${themeClasses.textMuted}`}>
                              #{index + 1}
                            </td>
                            <td className={`py-5 font-bold ${themeClasses.textBold}`}>
                              {reporter.name}
                            </td>
                            <td className={`py-5 ${themeClasses.textMuted}`}>
                              {reporter.media_outlet}
                            </td>
                            <td className={`py-5 font-bold ${themeClasses.textBold}`}>
                              {reporter.total_rumours}
                            </td>
                            <td className="py-5 font-bold text-emerald-500">
                              {reporter.correct_rumours}
                            </td>
                            <td className="py-5 font-bold text-rose-500">
                              {incorrectCount}
                            </td>
                            <td className="py-5 font-semibold text-teal-500">
                              {reporter.favorite_target || "N/A"}
                            </td>
                            <td className={`py-5 font-semibold ${themeClasses.textMuted}`}>
                              {reporter.avg_lifespan_days ? `${reporter.avg_lifespan_days}d` : "N/A"}
                            </td>
                            <td className="py-5">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                reporter.last_active?.includes("Active")
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                  : "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20"
                              }`}>
                                {reporter.last_active || "Inactive"}
                              </span>
                            </td>
                            <td className="py-5">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getTierBadgeClass(reporter.tier)}`}>
                                {reporter.tier}
                              </span>
                            </td>
                            <td className="py-5 pr-4">
                              <div className="flex items-center gap-3 w-48 sm:w-64">
                                <span className="font-extrabold w-10">
                                  {reporter.accuracy}%
                                </span>
                                <div className={`flex-1 h-2 rounded-full ${theme === "dark" ? "bg-slate-800" : "bg-slate-200"} overflow-hidden`}>
                                  <div 
                                    className={`h-full rounded-full ${getProgressBarColor(reporter.accuracy)}`}
                                    style={{ width: `${reporter.accuracy}%` }}
                                  ></div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        ) : activeTab === "franchises" ? (
          /* Franchise Hub Tab Layout */
          <div className="flex flex-col gap-8">
            {/* Selection Selector */}
            <div className={`${themeClasses.card} rounded-3xl p-6 border-l-4 border-l-emerald-500 backdrop-blur-sm shadow-xl flex flex-col xl:flex-row xl:items-center justify-between gap-6 transition-all duration-300 hover:scale-[1.005] hover:shadow-emerald-500/5`}>
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight mb-1">Franchise Intelligence Hub</h2>
                <p className={`text-sm ${themeClasses.textMuted}`}>Select an IPL franchise to scan their purse data, squad limits, and target rumor flows.</p>
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 shrink-0">
                {["CSK", "MI", "KKR", "RCB", "GT", "LSG", "DC", "RR", "PBKS", "SRH"].map((team) => (
                  <button
                    key={team}
                    onClick={() => setSelectedTeam(team)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold text-center transition-all border shrink-0 ${
                      selectedTeam === team
                        ? `bg-gradient-to-r ${franchiseStyles[team].gradient} ${franchiseStyles[team].border} ${franchiseStyles[team].text} font-extrabold shadow-lg`
                        : `${theme === "dark" ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"} ${themeClasses.textMuted} hover:text-slate-800 dark:hover:text-slate-200`
                    }`}
                  >
                    {team}
                  </button>
                ))}
              </div>
            </div>

            {loadingFranchise ? (
              <div className={`${themeClasses.card} rounded-3xl p-24 text-center flex flex-col items-center justify-center gap-3 transition-all duration-300`}>
                <div className="w-8 h-8 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin"></div>
                <span className={`text-sm ${themeClasses.textMuted}`}>Retrieving intel...</span>
              </div>
            ) : franchiseData ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Left Panel: Gauges */}
                    <div className="lg:col-span-5 flex flex-col gap-8">
                      {/* Purse remaining card */}
                      <div className={`bg-gradient-to-br ${teamStyle.gradient} ${teamStyle.border} ${teamStyle.text} rounded-3xl p-6 border backdrop-blur-sm shadow-xl flex flex-col justify-between gap-6 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg`}>
                        <h3 className="text-sm font-bold uppercase tracking-widest opacity-80">
                          Purse Allocation
                        </h3>
                        <div className="flex justify-between items-end">
                          <div className="flex flex-col">
                            <span className="text-3xl md:text-4xl font-extrabold tracking-tight">
                              {franchiseData.available_purse_cr} Cr
                            </span>
                            <span className="text-[10px] opacity-75 font-semibold uppercase tracking-wider mt-1.5">
                              Available Purse Space
                            </span>
                          </div>
                          
                          <span className={`px-2.5 py-1 rounded text-xs font-bold border ${teamStyle.badge}`}>
                            {franchiseData.available_purse_cr >= 10.0 ? "Healthy Budget" : "Low Budget"}
                          </span>
                        </div>
                        {/* Linear meter (cap at 120Cr) */}
                        <div className="w-full h-3 rounded-full bg-slate-950/20 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-current transition-all duration-500"
                            style={{ width: `${(franchiseData.available_purse_cr / 120.0) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Squad slots card */}
                      <div className={`bg-gradient-to-br ${teamStyle.gradient} ${teamStyle.border} ${teamStyle.text} rounded-3xl p-6 border backdrop-blur-sm shadow-xl flex flex-col justify-between gap-6 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg`}>
                        <h3 className="text-sm font-bold uppercase tracking-widest opacity-80">
                          Squad Slot Allocation
                        </h3>
                        <div className="flex justify-between items-end">
                          <div className="flex flex-col">
                            <span className="text-3xl md:text-4xl font-extrabold tracking-tight">
                              {franchiseData.remaining_squad_slots} Open
                            </span>
                            <span className="text-[10px] opacity-75 font-semibold uppercase tracking-wider mt-1.5">
                              Remaining Player Slots
                            </span>
                          </div>
                          <span className="text-xs opacity-75 font-semibold">Max 25 Slots</span>
                        </div>
                        {/* Linear meter (cap at 25 slots) */}
                        <div className="w-full h-3 rounded-full bg-slate-950/20 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-current transition-all duration-500"
                            style={{ width: `${(franchiseData.remaining_squad_slots / 25.0) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Agency Network Card */}
                      <div className={`bg-gradient-to-br ${teamStyle.gradient} ${teamStyle.border} ${teamStyle.text} rounded-3xl p-6 border backdrop-blur-sm shadow-xl flex flex-col gap-4 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg`}>
                        <div className="pb-1 border-b border-slate-950/10 flex items-center justify-between">
                          <h3 className="text-sm font-bold uppercase tracking-widest">
                            Agency Network
                          </h3>
                          <span className={`text-[10px] uppercase font-bold border px-2.5 py-0.5 rounded-full ${teamStyle.badge}`}>
                            Pipeline Nexus
                          </span>
                        </div>
                        {franchiseData.agents_list.length === 0 ? (
                          <span className="text-sm opacity-75 italic">No representing agency connections</span>
                        ) : (
                          <div className="flex flex-col gap-3.5">
                            {franchiseData.agents_list.map((agent) => (
                              <div
                                key={agent.name}
                                className="flex flex-col gap-2 p-4 rounded-xl border bg-slate-950/10 border-slate-950/10 transition-all hover:bg-slate-950/20"
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-bold text-sm">{agent.name}</h4>
                                    <span className="text-[10px] opacity-75">{agent.company}</span>
                                  </div>
                                  <div className="flex flex-col items-end shrink-0">
                                    <span className="text-xs font-black">{agent.clout} Clout</span>
                                    <span className="text-[9px] opacity-75 uppercase tracking-wider">Rating</span>
                                  </div>
                                </div>
                                
                                {agent.represented_players.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {agent.represented_players.map((player) => (
                                      <span
                                        key={player}
                                        className="text-[9px] px-2 py-0.5 rounded bg-slate-950/10 border border-slate-950/20 font-semibold"
                                      >
                                        {player}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Panel: Heatmap and Insights */}
                    <div className="lg:col-span-7 flex flex-col gap-8">
                  {/* Quick stats grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`${themeClasses.card} border ${themeClasses.divider} border-l-4 border-l-emerald-500 rounded-2xl p-5 text-center flex flex-col gap-1.5 transition-all duration-300 hover:scale-[1.01]`}>
                      <span className="text-3xl font-extrabold text-emerald-600">{franchiseData.incoming_rumours_count}</span>
                      <span className={`text-[10px] ${themeClasses.textMuted} uppercase font-semibold tracking-wider`}>Incoming Linkages</span>
                    </div>
                    <div className={`${themeClasses.card} border ${themeClasses.divider} border-l-4 border-l-teal-500 rounded-2xl p-5 text-center flex flex-col gap-1.5 transition-all duration-300 hover:scale-[1.01]`}>
                      <span className="text-3xl font-extrabold text-teal-600">{franchiseData.outgoing_rumours_count}</span>
                      <span className={`text-[10px] ${themeClasses.textMuted} uppercase font-semibold tracking-wider`}>Outgoing Rumors</span>
                    </div>
                  </div>

                  {/* Intel Insights Card */}
                  <div className={`${themeClasses.card} rounded-3xl p-6 border-l-4 border-l-emerald-500 backdrop-blur-sm shadow-xl flex flex-col gap-4 transition-all duration-300 hover:scale-[1.01] hover:shadow-emerald-500/5`}>
                    <h3 className={`text-sm font-semibold ${themeClasses.textMuted} uppercase tracking-widest border-b ${themeClasses.divider} pb-3`}>
                      Transfer Heat Map Insights
                    </h3>
                    
                    <div className="flex flex-col gap-4">
                      {/* Insight item 1 */}
                      <div className={`flex justify-between items-center ${theme === "dark" ? "bg-slate-950/40 border-slate-800/50" : "bg-white border-slate-200"} rounded-xl p-4 text-sm border transition-all hover:bg-slate-500/5`}>
                        <span className={themeClasses.textMuted}>Most Linked Target Player</span>
                        <strong className="uppercase tracking-wider">{franchiseData.most_linked_player}</strong>
                      </div>

                      {/* Insight item 2 */}
                      <div className={`flex justify-between items-center ${theme === "dark" ? "bg-slate-950/40 border-slate-800/50" : "bg-white border-slate-200"} rounded-xl p-4 text-sm border transition-all hover:bg-slate-500/5`}>
                        <span className={themeClasses.textMuted}>Top-Tier Source Analyst</span>
                        <strong>{franchiseData.most_reliable_journalist}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Linked Player Feed Lists */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Incoming links */}
                    <div className={`${themeClasses.card} rounded-2xl p-5 border-l-4 border-l-emerald-500 flex flex-col gap-2 transition-all duration-300 hover:scale-[1.01]`}>
                      <h4 className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Incoming Rumors</h4>
                      {franchiseData.incoming_list.length === 0 ? (
                        <span className={`text-sm ${themeClasses.textMuted} italic`}>No incoming reports</span>
                      ) : (
                        <div className="flex flex-col gap-2 mt-1.5">
                          {franchiseData.incoming_list.map((item, idx) => (
                            <div key={idx} className={`flex justify-between items-center text-sm ${theme === "dark" ? "bg-slate-900/50 border-slate-800/60" : "bg-slate-50 border-slate-200"} p-3 rounded-lg border transition-all hover:scale-[1.02]`}>
                              <span className="font-bold">{item.player}</span>
                              <span className={`text-xs ${themeClasses.textMuted}`}>via {item.journalist}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Outgoing links */}
                    <div className={`${themeClasses.card} rounded-2xl p-5 border-l-4 border-l-teal-500 flex flex-col gap-2 transition-all duration-300 hover:scale-[1.01]`}>
                      <h4 className="text-[10px] font-bold text-teal-600 uppercase tracking-wider">Outgoing Rumors</h4>
                      {franchiseData.outgoing_list.length === 0 ? (
                        <span className={`text-sm ${themeClasses.textMuted} italic`}>No outgoing reports</span>
                      ) : (
                        <div className="flex flex-col gap-2 mt-1.5">
                          {franchiseData.outgoing_list.map((item, idx) => (
                            <div key={idx} className={`flex justify-between items-center text-sm ${theme === "dark" ? "bg-slate-900/50 border-slate-800/60" : "bg-slate-50 border-slate-200"} p-3 rounded-lg border transition-all hover:scale-[1.02]`}>
                              <span className="font-bold">{item.player}</span>
                              <span className={`text-xs ${themeClasses.textMuted}`}>via {item.journalist}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            ) : (
              <div className={`${themeClasses.card} rounded-3xl p-24 text-center ${themeClasses.textMuted} transition-all duration-300`}>
                Franchise Hub details unavailable.
              </div>
            )}
          </div>
        ) : activeTab === "backtesting" ? (
          /* ML Backtesting Tab Layout */
          <div className="flex flex-col gap-8">
            <div className={`${themeClasses.card} rounded-3xl p-6 border-l-4 border-l-purple-500 backdrop-blur-sm shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 hover:scale-[1.005] hover:shadow-purple-500/5`}>
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight mb-1">ML Backtesting Sandbox</h2>
                <p className={`text-sm ${themeClasses.textMuted}`}>Select a historical transfer rumor cycle to backtest our AI engine's chronological accuracy tracking.</p>
              </div>
              <div className="flex gap-2">
                {sagasToRender.map((saga) => (
                  <button
                    key={saga.id}
                    onClick={() => setSelectedSagaId(saga.id)}
                    className={`px-4.5 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                      selectedSagaId === saga.id
                        ? "bg-purple-600 text-white border-purple-500/30 font-extrabold"
                        : `${theme === "dark" ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"} ${themeClasses.textMuted} hover:text-slate-800`
                    }`}
                  >
                    {saga.player} ({saga.year})
                  </button>
                ))}
              </div>
            </div>

            {loadingBacktest ? (
              <div className={`${themeClasses.card} rounded-3xl p-24 text-center flex flex-col items-center justify-center gap-3 transition-all duration-300`}>
                <div className="w-8 h-8 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin"></div>
                <span className={`text-sm ${themeClasses.textMuted}`}>Loading historic track logs...</span>
              </div>
            ) : sagaDetailsToRender ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* SVG Chart Panel */}
                <div className={`${themeClasses.card} lg:col-span-8 rounded-3xl p-6 md:p-8 border-l-4 border-l-purple-500 backdrop-blur-sm shadow-xl flex flex-col gap-6`}>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-500/10">
                    <h3 className="text-lg font-bold tracking-tight uppercase">
                      Chronological Probability Tracking
                    </h3>
                    <span className="text-xs bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-bold uppercase">
                      Outcome: {sagaDetailsToRender.final_outcome}
                    </span>
                  </div>

                  {/* SVG Custom Responsive Line Graph */}
                  <div className={`relative w-full h-80 rounded-2xl p-4 ${theme === "dark" ? "bg-slate-950/60" : "bg-slate-200/40"} border ${themeClasses.divider}`}>
                    <svg className="w-full h-full" viewBox="0 0 600 240" preserveAspectRatio="none">
                      {/* Grid lines */}
                      <line x1="50" y1="20" x2="550" y2="20" stroke="rgba(156,163,175,0.15)" strokeWidth="1" />
                      <line x1="50" y1="75" x2="550" y2="75" stroke="rgba(156,163,175,0.15)" strokeWidth="1" />
                      <line x1="50" y1="130" x2="550" y2="130" stroke="rgba(156,163,175,0.15)" strokeWidth="1" />
                      <line x1="50" y1="185" x2="550" y2="185" stroke="rgba(156,163,175,0.15)" strokeWidth="1" />
                      
                      {/* X and Y axes */}
                      <line x1="50" y1="20" x2="50" y2="185" stroke="currentColor" className="opacity-20" strokeWidth="1.5" />
                      <line x1="50" y1="185" x2="550" y2="185" stroke="currentColor" className="opacity-20" strokeWidth="1.5" />

                      {/* Legend scale labels */}
                      <text x="20" y="24" className="text-[10px] font-bold opacity-60" fill="currentColor">100%</text>
                      <text x="20" y="79" className="text-[10px] font-bold opacity-60" fill="currentColor">70%</text>
                      <text x="20" y="134" className="text-[10px] font-bold opacity-60" fill="currentColor">40%</text>
                      <text x="20" y="189" className="text-[10px] font-bold opacity-60" fill="currentColor">10%</text>

                      {/* X Axis dates */}
                      {sagaDetailsToRender.timeline?.map((pt, idx, arr) => {
                        const x = 50 + (idx / (arr.length - 1)) * 500;
                        return (
                          <text key={idx} x={x} y="210" textAnchor="middle" className="text-[10px] font-bold opacity-75" fill="currentColor">
                            {pt.date}
                          </text>
                        );
                      })}

                      {/* Line connecting points */}
                      <path
                        d={sagaDetailsToRender.timeline?.map((pt, idx, arr) => {
                          const x = 50 + (idx / (arr.length - 1)) * 500;
                          const y = 185 - (pt.probability / 100) * 165;
                          return `${idx === 0 ? "M" : "L"} ${x} ${y}`;
                        }).join(" ")}
                        fill="none"
                        stroke="rgb(147, 51, 234)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Circles for points */}
                      {sagaDetailsToRender.timeline?.map((pt, idx, arr) => {
                        const x = 50 + (idx / (arr.length - 1)) * 500;
                        const y = 185 - (pt.probability / 100) * 165;
                        return (
                          <g key={idx} className="cursor-pointer group">
                            <circle
                              cx={x}
                              cy={y}
                              r="7"
                              className="fill-purple-600 stroke-slate-950 group-hover:scale-125 transition-transform"
                              strokeWidth="2"
                            />
                            <text
                              x={x}
                              y={y - 12}
                              textAnchor="middle"
                              className="text-[10px] font-black fill-purple-700 dark:fill-purple-400 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              {pt.probability}%
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                </div>

                {/* Milestones log list */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                  <div className={`${themeClasses.card} rounded-3xl p-6 border-l-4 border-l-purple-500 backdrop-blur-sm shadow-xl flex flex-col gap-4`}>
                    <h3 className="text-base font-bold uppercase tracking-widest border-b border-slate-500/10 pb-3">
                      Milestone Event Log
                    </h3>
                    <div className="flex flex-col gap-4">
                      {sagaDetailsToRender.timeline?.map((pt, idx) => (
                        <div
                          key={idx}
                          className={`flex items-start gap-3.5 p-4 rounded-2xl border ${
                            theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                          } transition-all hover:scale-[1.02]`}
                        >
                          <span className="w-6 h-6 rounded-full bg-purple-500/10 text-purple-600 border border-purple-500/20 text-xs font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs font-extrabold text-purple-600 uppercase tracking-wide">{pt.date}</span>
                              <span className="text-xs font-black">{pt.probability}% AI Match</span>
                            </div>
                            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">
                              {pt.milestone}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`${themeClasses.card} rounded-3xl p-24 text-center ${themeClasses.textMuted} transition-all duration-300`}>
                Backtesting data unavailable.
              </div>
            )}
          </div>
        ) : null}
      </main>

      {/* Footer */}
      <footer className={`border-t ${themeClasses.footer} py-6 text-center text-sm transition-colors duration-300`}>
        &copy; 2026 IPL Transfer Credibility Engine. Premium multi-theme transfer simulator.
      </footer>

      {/* Sliding Trade Analysis Drawer */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-[100] border-t-4 border-t-purple-600 ${
          theme === "dark" ? "bg-slate-950/95 text-slate-100" : theme === "warm" ? "bg-[#fcf8f2]/95 text-amber-950" : "bg-white/95 text-slate-900"
        } backdrop-blur-lg shadow-2xl p-6 md:p-8 transition-transform duration-500 ease-out transform ${
          showTradeDrawer ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          <div className="flex justify-between items-center pb-3 border-b border-slate-500/10">
            <div>
              <span className="text-[10px] uppercase font-bold text-purple-600 bg-purple-500/15 border border-purple-500/30 px-2.5 py-0.5 rounded-full">
                Live Trade Simulation Analysis
              </span>
              <h3 className="text-xl md:text-2xl font-black mt-1">
                {tradePlayer} Trade Sandbox Results
              </h3>
            </div>
            <button
              onClick={() => setShowTradeDrawer(false)}
              className="p-2.5 rounded-full hover:bg-slate-500/10 transition-colors text-slate-400 hover:text-slate-200"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {simulationResult && (
            <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <span className={`w-3.5 h-3.5 rounded-full shrink-0 ${simulationResult.feasible ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`}></span>
                  <strong className={`text-lg uppercase tracking-wide ${simulationResult.feasible ? "text-emerald-600" : "text-rose-600"}`}>
                    {simulationResult.feasible ? "FEASIBLE" : "INFEASIBLE / BLOCKED"}
                  </strong>
                </div>
                <p className="text-sm leading-relaxed opacity-90">
                  {simulationResult.reason}
                </p>
                {simulationResult.suggested_cascade && (
                  <div className="mt-2.5 flex flex-col gap-2.5 items-start">
                    <p className="text-xs italic text-purple-400">
                      💡 Cascade Advice: {simulationResult.suggested_cascade.message}
                    </p>
                    <button
                      onClick={handleSolveRosterConstraint}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold py-2 px-4 rounded-xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 animate-pulse transition-all border border-purple-500/30 uppercase tracking-wider cursor-pointer"
                    >
                      ⚡ Solve Roster Constraint
                    </button>
                  </div>
                )}
              </div>

              <div className="w-full lg:w-auto overflow-x-auto">
                <div className="flex gap-4">
                  {simulationResult.adjustments
                    .filter((adj: any) => adj.purse_change !== 0 || adj.slots_change !== 0)
                    .map((adj: any) => (
                      <div
                        key={adj.franchise}
                        className={`p-4 rounded-2xl border ${
                          theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-slate-100 border-slate-200"
                        } flex flex-col gap-2 min-w-56`}
                      >
                        <div className="flex justify-between items-center pb-1 border-b border-slate-500/10">
                          <strong className="font-extrabold text-sm">{adj.franchise} Adjustment</strong>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            adj.purse_change > 0 ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"
                          }`}>
                            {adj.purse_change > 0 ? `+${adj.purse_change} Cr` : `${adj.purse_change} Cr`}
                          </span>
                        </div>
                        <div className="text-xs flex flex-col gap-1">
                          <div className="flex justify-between">
                            <span>Purse Space:</span>
                            <span className="font-bold">{adj.original_purse} Cr ➔ {adj.projected_purse} Cr</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Squad Slots:</span>
                            <span className="font-bold">{adj.original_slots} ➔ {adj.projected_slots} ({adj.slots_change > 0 ? `+${adj.slots_change}` : adj.slots_change})</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
