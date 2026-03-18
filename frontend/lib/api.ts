const API_BASE = "http://localhost:5000/api";

async function handleResponse(response: Response) {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || data.msg || "An error occurred");
  }
  return data;
}

export async function loginOrSignup(
  account: string,
  password: string,
): Promise<any> {
  const response = await fetch(`${API_BASE}/login_or_signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ account, password }),
  });
  return handleResponse(response);
}

export async function getWallet(token: string): Promise<{ wallet: number }> {
  const response = await fetch(`${API_BASE}/wallet`, {
    method: "GET",
    headers: { Authorization: token },
  });
  return handleResponse(response);
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
  return handleResponse(response);
}

export async function placeBet(
  token: string,
  bet: number,
): Promise<{
  grid: string[][];
  totalWin: number;
  jackpotMeter: number;
  jackpotWin: number;
  jackpotTriggered: boolean;
  bonusTriggered: boolean;
  scatterCount: number;
}> {
  const response = await fetch(`${API_BASE}/spin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ bet }),
  });
  return handleResponse(response);
}

export async function runSimulation(
  token: string,
  bet: number,
  spins: number,
): Promise<any> {
  const response = await fetch(`${API_BASE}/simulate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ bet, spins }),
  });
  return handleResponse(response);
}
