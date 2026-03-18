const API_BASE = "http://localhost:5000/api";

export interface LineWin {
  lineIndex: number;
  symbol: string;
  count: number;
  win: number;
  positions: Array<{ row: number; col: number }>;
}

export interface AuthResponse {
  user: {
    _id: string;
    account: string;
    wallet_balance: number;
  };
  accessToken: string;
}

export interface SpinResponse {
  grid: string[][];
  totalWin: number;
  baseGameWin: number;
  jackpotMeter: number;
  jackpotWin: number;
  jackpotTriggered: boolean;
  bonusTriggered: boolean;
  scatterCount: number;
  lineWins: LineWin[];
  maxWinCap: number;
  wasCapped: boolean;
}

export interface SimulationResponse {
  spins: number;
  bet: number;
  totalWagered: number;
  totalReturned: number;
  rtp: number;
  averageWin: number;
  winningSpins: number;
  hitFrequency: number;
  bonusSpins: number;
  bonusFrequency: number;
  jackpotTriggers: number;
  maxWinObserved: number;
  startingJackpot: number;
  endingJackpot: number;
  jackpotContributionGrowth: number;
  totalJackpotContributed: number;
  totalJackpotPaidOut: number;
}

export interface ApiErrorShape {
  message?: string;
  msg?: string | string[];
}

function errorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "An error occurred";
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = (await response.json()) as ApiErrorShape & T;
  if (!response.ok) {
    const message = Array.isArray(data.msg)
      ? data.msg.join(", ")
      : data.message || data.msg || "An error occurred";
    throw new Error(message);
  }
  return data;
}

export async function loginOrSignup(
  account: string,
  password: string,
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE}/login_or_signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ account, password }),
  });
  return handleResponse<AuthResponse>(response);
}

export async function getWallet(token: string): Promise<{ wallet: number }> {
  const response = await fetch(`${API_BASE}/wallet`, {
    method: "GET",
    headers: { Authorization: token },
  });
  return handleResponse<{ wallet: number }>(response);
}

export async function addToWallet(
  token: string,
  amount: number,
): Promise<{ wallet: number }> {
  const response = await fetch(`${API_BASE}/add_to_wallet`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ amount }),
  });
  return handleResponse<{ wallet: number }>(response);
}

export async function placeBet(
  token: string,
  bet: number,
): Promise<SpinResponse> {
  const response = await fetch(`${API_BASE}/spin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ bet }),
  });
  return handleResponse<SpinResponse>(response);
}

export async function runSimulation(
  token: string,
  bet: number,
  spins: number,
): Promise<SimulationResponse> {
  const response = await fetch(`${API_BASE}/simulate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ bet, spins }),
  });
  return handleResponse<SimulationResponse>(response);
}

export { errorMessage };
