const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

const DATA_FILE = path.join(__dirname, 'data.json');
const ODDS_API_KEY = '45597651';

// ============================================
// 2026 NCAA TOURNAMENT - ALL 68 TEAMS
// ============================================
const TOURNAMENT_TEAMS = {
  // EAST REGION
  "Duke": { seed: 1, region: "East", record: "32-2", net: 1, q1: "15-2", q2: "6-0", q3: "2-0", q4: "7-0", colors: ["#003087", "#fff"] },
  "UConn": { seed: 2, region: "East", record: "28-4", net: 9, q1: "7-2", q2: "10-1", q3: "6-1", q4: "5-0", colors: ["#0E1A3C", "#fff"] },
  "Michigan State": { seed: 3, region: "East", record: "25-6", net: 11, q1: "8-5", q2: "6-1", q3: "7-0", q4: "4-0", colors: ["#18453B", "#fff"] },
  "Kansas": { seed: 4, region: "East", record: "23-9", net: 18, q1: "9-8", q2: "7-1", q3: "4-0", q4: "3-0", colors: ["#0051BA", "#E8000D"] },
  "St. John's": { seed: 5, region: "East", record: "26-6", net: 21, q1: "3-5", q2: "11-0", q3: "9-1", q4: "3-0", colors: ["#D30C30", "#fff"] },
  "Louisville": { seed: 6, region: "East", record: "23-10", net: 16, q1: "7-10", q2: "5-0", q3: "4-0", q4: "7-0", colors: ["#AD0000", "#000"] },
  "UCLA": { seed: 7, region: "East", record: "22-10", net: 33, q1: "4-7", q2: "5-3", q3: "6-0", q4: "7-0", colors: ["#2D68C4", "#F2A900"] },
  "Ohio State": { seed: 8, region: "East", record: "21-11", net: 31, q1: "4-10", q2: "5-1", q3: "6-0", q4: "6-0", colors: ["#BB0000", "#666"] },
  "TCU": { seed: 9, region: "East", record: "22-11", net: 38, q1: "6-7", q2: "7-2", q3: "2-1", q4: "7-1", colors: ["#4D1979", "#fff"] },
  "UCF": { seed: 10, region: "East", record: "21-11", net: 52, q1: "5-8", q2: "6-3", q3: "4-0", q4: "6-0", colors: ["#000", "#BA9B37"] },
  "South Florida": { seed: 11, region: "East", record: "22-8", net: 48, q1: "2-3", q2: "5-2", q3: "6-3", q4: "9-0", colors: ["#006747", "#CFC493"] },
  "Northern Iowa": { seed: 12, region: "East", record: "22-12", net: 71, q1: "0-3", q2: "4-4", q3: "7-5", q4: "11-0", colors: ["#4B116F", "#FFC726"] },
  "Cal Baptist": { seed: 13, region: "East", record: "23-8", net: 101, q1: "0-1", q2: "1-4", q3: "5-3", q4: "17-0", colors: ["#002554", "#C8102E"] },
  "North Dakota State": { seed: 14, region: "East", record: "24-7", net: 115, q1: "0-0", q2: "0-1", q3: "6-4", q4: "18-2", colors: ["#005643", "#FFC82E"] },
  "Furman": { seed: 15, region: "East", record: "19-12", net: 187, q1: "0-1", q2: "0-2", q3: "5-5", q4: "14-4", colors: ["#582C83", "#fff"] },
  "Siena": { seed: 16, region: "East", record: "23-11", net: 184, q1: "0-1", q2: "0-0", q3: "2-5", q4: "21-5", colors: ["#006747", "#FDBB30"] },

  // SOUTH REGION
  "Florida": { seed: 1, region: "South", record: "26-7", net: 4, q1: "11-5", q2: "6-1", q3: "3-0", q4: "5-0", colors: ["#0021A5", "#FA4616"] },
  "Houston": { seed: 2, region: "South", record: "27-5", net: 8, q1: "9-5", q2: "9-0", q3: "3-0", q4: "6-0", colors: ["#C8102E", "#fff"] },
  "Illinois": { seed: 3, region: "South", record: "24-7", net: 5, q1: "7-7", q2: "5-0", q3: "7-0", q4: "5-0", colors: ["#E84A27", "#13294B"] },
  "Nebraska": { seed: 4, region: "South", record: "26-5", net: 12, q1: "9-5", q2: "6-0", q3: "5-0", q4: "6-0", colors: ["#E41C38", "#fff"] },
  "Vanderbilt": { seed: 5, region: "South", record: "24-7", net: 15, q1: "8-6", q2: "7-1", q3: "3-0", q4: "6-0", colors: ["#000", "#866D4B"] },
  "North Carolina": { seed: 6, region: "South", record: "24-8", net: 24, q1: "6-8", q2: "5-0", q3: "8-0", q4: "5-0", colors: ["#7BAFD4", "#13294B"] },
  "Saint Mary's": { seed: 7, region: "South", record: "26-5", net: 22, q1: "1-4", q2: "8-1", q3: "10-0", q4: "7-0", colors: ["#0038A8", "#D50032"] },
  "Clemson": { seed: 8, region: "South", record: "24-9", net: 34, q1: "7-5", q2: "6-4", q3: "4-0", q4: "7-0", colors: ["#F56600", "#522D80"] },
  "Iowa": { seed: 9, region: "South", record: "21-12", net: 25, q1: "3-9", q2: "6-1", q3: "6-2", q4: "6-0", colors: ["#FFCD00", "#000"] },
  "Texas A&M": { seed: 10, region: "South", record: "21-11", net: 43, q1: "5-8", q2: "4-3", q3: "4-0", q4: "8-0", colors: ["#500000", "#fff"] },
  "VCU": { seed: 11, region: "South", record: "24-7", net: 44, q1: "2-5", q2: "4-2", q3: "7-0", q4: "11-0", colors: ["#000", "#F8B800"] },
  "McNeese": { seed: 12, region: "South", record: "26-5", net: 56, q1: "0-2", q2: "2-2", q3: "8-0", q4: "16-1", colors: ["#005695", "#FFC423"] },
  "Troy": { seed: 13, region: "South", record: "20-11", net: 125, q1: "1-0", q2: "2-1", q3: "4-7", q4: "13-3", colors: ["#8B2332", "#000"] },
  "Penn": { seed: 14, region: "South", record: "15-11", net: 150, q1: "0-2", q2: "0-4", q3: "5-3", q4: "10-2", colors: ["#011F5B", "#990000"] },
  "Idaho": { seed: 15, region: "South", record: "18-14", net: 146, q1: "0-0", q2: "0-4", q3: "9-7", q4: "9-3", colors: ["#B3A369", "#000"] },
  "Lehigh": { seed: 16, region: "South", record: "16-16", net: 276, q1: "0-2", q2: "0-2", q3: "1-4", q4: "15-8", colors: ["#653819", "#fff"] },
  "Prairie View A&M": { seed: 16, region: "South", record: "12-17", net: 310, q1: "0-3", q2: "0-2", q3: "0-1", q4: "12-11", colors: ["#4F2D7F", "#FDAA2A"] },

  // WEST REGION
  "Arizona": { seed: 1, region: "West", record: "32-2", net: 3, q1: "14-2", q2: "8-0", q3: "1-0", q4: "7-0", colors: ["#003366", "#CC0033"] },
  "Purdue": { seed: 2, region: "West", record: "24-8", net: 10, q1: "8-8", q2: "6-0", q3: "7-0", q4: "3-0", colors: ["#000", "#CEB888"] },
  "Gonzaga": { seed: 3, region: "West", record: "30-3", net: 6, q1: "7-2", q2: "4-0", q3: "11-1", q4: "8-0", colors: ["#002868", "#C8102E"] },
  "Arkansas": { seed: 4, region: "West", record: "23-8", net: 17, q1: "6-8", q2: "7-0", q3: "4-0", q4: "6-0", colors: ["#9D2235", "#fff"] },
  "Wisconsin": { seed: 5, region: "West", record: "23-9", net: 27, q1: "6-7", q2: "6-1", q3: "5-1", q4: "6-0", colors: ["#C5050C", "#fff"] },
  "BYU": { seed: 6, region: "West", record: "23-11", net: 23, q1: "7-10", q2: "7-1", q3: "4-0", q4: "5-0", colors: ["#002E5D", "#fff"] },
  "Miami FL": { seed: 7, region: "West", record: "25-7", net: 30, q1: "6-5", q2: "6-2", q3: "3-0", q4: "10-0", colors: ["#F47321", "#005030"] },
  "Villanova": { seed: 8, region: "West", record: "24-8", net: 36, q1: "2-6", q2: "8-1", q3: "9-1", q4: "5-0", colors: ["#003366", "#fff"] },
  "Utah State": { seed: 9, region: "West", record: "25-6", net: 28, q1: "3-4", q2: "8-1", q3: "9-1", q4: "5-0", colors: ["#0F2439", "#fff"] },
  "Missouri": { seed: 10, region: "West", record: "20-12", net: 58, q1: "5-7", q2: "4-5", q3: "3-0", q4: "8-0", colors: ["#F1B82D", "#000"] },
  "Texas": { seed: 11, region: "West", record: "17-14", net: 42, q1: "6-9", q2: "1-4", q3: "3-1", q4: "7-0", colors: ["#BF5700", "#fff"] },
  "NC State": { seed: 11, region: "West", record: "20-13", net: 35, q1: "5-9", q2: "6-3", q3: "5-0", q4: "4-1", colors: ["#CC0000", "#fff"] },
  "High Point": { seed: 12, region: "West", record: "27-4", net: 74, q1: "0-0", q2: "0-2", q3: "5-2", q4: "22-0", colors: ["#330072", "#fff"] },
  "Hawaii": { seed: 13, region: "West", record: "20-8", net: 110, q1: "0-0", q2: "0-4", q3: "6-2", q4: "14-2", colors: ["#024731", "#fff"] },
  "Kennesaw State": { seed: 14, region: "West", record: "16-13", net: 166, q1: "0-1", q2: "0-3", q3: "5-5", q4: "11-4", colors: ["#FDBB30", "#000"] },
  "Queens": { seed: 15, region: "West", record: "20-13", net: 190, q1: "0-5", q2: "0-1", q3: "2-3", q4: "18-4", colors: ["#002D62", "#A89968"] },
  "LIU": { seed: 16, region: "West", record: "24-10", net: 198, q1: "0-2", q2: "0-2", q3: "1-3", q4: "23-3", colors: ["#00529B", "#FFD200"] },

  // MIDWEST REGION
  "Michigan": { seed: 1, region: "Midwest", record: "31-3", net: 2, q1: "13-2", q2: "7-0", q3: "6-0", q4: "3-0", colors: ["#00274C", "#FFCB05"] },
  "Iowa State": { seed: 2, region: "Midwest", record: "27-6", net: 7, q1: "8-6", q2: "10-0", q3: "2-0", q4: "7-0", colors: ["#C8102E", "#F1BE48"] },
  "Virginia": { seed: 3, region: "Midwest", record: "28-4", net: 13, q1: "8-3", q2: "8-1", q3: "5-0", q4: "7-0", colors: ["#232D4B", "#F84C1E"] },
  "Alabama": { seed: 4, region: "Midwest", record: "23-8", net: 14, q1: "7-7", q2: "9-1", q3: "5-0", q4: "2-0", colors: ["#9E1B32", "#fff"] },
  "Texas Tech": { seed: 5, region: "Midwest", record: "22-10", net: 20, q1: "7-9", q2: "5-1", q3: "7-0", q4: "3-0", colors: ["#CC0000", "#000"] },
  "Tennessee": { seed: 6, region: "Midwest", record: "22-10", net: 19, q1: "6-9", q2: "6-1", q3: "3-0", q4: "7-0", colors: ["#FF8200", "#fff"] },
  "Kentucky": { seed: 7, region: "Midwest", record: "21-12", net: 26, q1: "5-10", q2: "7-2", q3: "3-0", q4: "6-0", colors: ["#0033A0", "#fff"] },
  "Georgia": { seed: 8, region: "Midwest", record: "22-10", net: 32, q1: "6-7", q2: "6-2", q3: "1-1", q4: "9-0", colors: ["#BA0C2F", "#000"] },
  "Saint Louis": { seed: 9, region: "Midwest", record: "26-4", net: 29, q1: "2-1", q2: "5-2", q3: "6-1", q4: "13-0", colors: ["#003DA5", "#fff"] },
  "Santa Clara": { seed: 10, region: "Midwest", record: "25-8", net: 40, q1: "2-6", q2: "6-1", q3: "10-0", q4: "7-1", colors: ["#862633", "#fff"] },
  "Miami OH": { seed: 11, region: "Midwest", record: "28-1", net: 64, q1: "0-0", q2: "2-0", q3: "11-1", q4: "15-0", colors: ["#B61E2E", "#fff"] },
  "SMU": { seed: 11, region: "Midwest", record: "20-13", net: 37, q1: "4-10", q2: "5-3", q3: "5-0", q4: "6-0", colors: ["#0033A0", "#C8102E"] },
  "Akron": { seed: 12, region: "Midwest", record: "25-5", net: 54, q1: "0-2", q2: "0-2", q3: "9-1", q4: "16-0", colors: ["#041E42", "#A89968"] },
  "Hofstra": { seed: 13, region: "Midwest", record: "22-10", net: 88, q1: "0-1", q2: "2-2", q3: "10-4", q4: "10-3", colors: ["#002D62", "#FFD200"] },
  "Wright State": { seed: 14, region: "Midwest", record: "21-11", net: 127, q1: "0-1", q2: "0-2", q3: "5-6", q4: "16-2", colors: ["#007A33", "#FFCD00"] },
  "Tennessee State": { seed: 15, region: "Midwest", record: "20-9", net: 174, q1: "0-2", q2: "1-0", q3: "3-1", q4: "16-6", colors: ["#00539F", "#fff"] },
  "UMBC": { seed: 16, region: "Midwest", record: "21-8", net: 201, q1: "0-2", q2: "0-2", q3: "0-1", q4: "21-3", colors: ["#000", "#FDB515"] },
  "Howard": { seed: 16, region: "Midwest", record: "17-10", net: 202, q1: "0-2", q2: "1-2", q3: "1-0", q4: "15-6", colors: ["#003A63", "#E51937"] }
};

// Championship odds (DraftKings post-Selection Sunday)
const CHAMPIONSHIP_ODDS = {
  "Michigan": "+325", "Duke": "+333", "Arizona": "+425", "Florida": "+600",
  "Houston": "+1000", "Iowa State": "+1900", "UConn": "+3000", "Illinois": "+4000",
  "Purdue": "+4000", "Kansas": "+4000", "Michigan State": "+5000", "Gonzaga": "+5500",
  "St. John's": "+6000", "Virginia": "+6500", "Alabama": "+7000", "Nebraska": "+8000",
  "North Carolina": "+10000", "Kentucky": "+12000", "Tennessee": "+12000", "BYU": "+15000"
};

// Final Four odds
const FINAL_FOUR_ODDS = {
  "Duke": "-135", "Michigan": "-130", "Arizona": "-120", "Florida": "+165", "Houston": "+245"
};

// Default data
const DEFAULT_DATA = {
  players: [
    { name: "Luke", letter: "L", colorPrimary: "#bf0a30", colorSecondary: "#8b0000", teams: [] },
    { name: "Nick", letter: "N", colorPrimary: "#002868", colorSecondary: "#001845", teams: [] },
    { name: "Brooks", letter: "B", colorPrimary: "#2d5a27", colorSecondary: "#1a3518", teams: [] },
    { name: "James", letter: "J", colorPrimary: "#7c3aed", colorSecondary: "#5b21b6", teams: [] }
  ],
  bracket: {},
  eliminations: [],
  draftState: {
    active: false, testMode: false, currentPick: 0,
    order: [], picks: [], timerSeconds: 120, startTime: null
  },
  settings: {
    roundPoints: { "1": 1, "2": 2, "3": 8, "4": 16, "5": 32, "6": 32 },
    seedMultipliers: { "1-4": 1, "5-8": 1.5, "9-12": 2, "13-16": 3 }
  },
  lastUpdate: new Date().toISOString()
};

function initData() {
  if (!fs.existsSync(DATA_FILE)) {
    const bracket = { East: [], West: [], South: [], Midwest: [] };
    for (const [name, team] of Object.entries(TOURNAMENT_TEAMS)) {
      bracket[team.region].push({ seed: team.seed, name, eliminated: false, wins: 0 });
    }
    for (const region of Object.keys(bracket)) {
      bracket[region].sort((a, b) => a.seed - b.seed);
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify({ ...DEFAULT_DATA, bracket }, null, 2));
  }
}

function getData() {
  try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); }
  catch { initData(); return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); }
}

function saveData(data) {
  data.lastUpdate = new Date().toISOString();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// ============================================
// API ROUTES
// ============================================
app.get('/api/data', (req, res) => res.json(getData()));
app.get('/api/teams', (req, res) => res.json(TOURNAMENT_TEAMS));
app.get('/api/teams/:name', (req, res) => {
  const team = TOURNAMENT_TEAMS[req.params.name];
  if (team) res.json({ name: req.params.name, ...team, 
    championshipOdds: CHAMPIONSHIP_ODDS[req.params.name] || null,
    finalFourOdds: FINAL_FOUR_ODDS[req.params.name] || null
  });
  else res.status(404).json({ error: 'Team not found' });
});
app.get('/api/odds/all', (req, res) => res.json({ championship: CHAMPIONSHIP_ODDS, finalFour: FINAL_FOUR_ODDS }));

app.post('/api/players', (req, res) => {
  const data = getData();
  data.players = req.body.players;
  saveData(data);
  res.json({ success: true });
});

app.put('/api/players/:index', (req, res) => {
  const data = getData();
  const index = parseInt(req.params.index);
  if (index >= 0 && index < data.players.length) {
    data.players[index] = { ...data.players[index], ...req.body };
    saveData(data);
    res.json({ success: true });
  } else res.status(400).json({ error: 'Invalid player index' });
});

app.post('/api/bracket', (req, res) => {
  const data = getData();
  data.bracket = req.body.bracket;
  saveData(data);
  res.json({ success: true });
});

app.post('/api/eliminate', (req, res) => {
  const data = getData();
  const { teamName, round } = req.body;
  for (const region of Object.keys(data.bracket)) {
    const team = data.bracket[region].find(t => t.name === teamName);
    if (team) { team.eliminated = true; break; }
  }
  data.eliminations = data.eliminations || [];
  data.eliminations.push({ team: teamName, round, timestamp: new Date().toISOString() });
  saveData(data);
  res.json({ success: true });
});

app.post('/api/win', (req, res) => {
  const data = getData();
  const { teamName } = req.body;
  for (const region of Object.keys(data.bracket)) {
    const team = data.bracket[region].find(t => t.name === teamName);
    if (team) { team.wins = (team.wins || 0) + 1; break; }
  }
  saveData(data);
  res.json({ success: true });
});

// Draft routes
app.get('/api/draft', (req, res) => res.json(getData().draftState));

app.post('/api/draft/start', (req, res) => {
  const data = getData();
  const { order, timerSeconds, testMode } = req.body;
  data.draftState = {
    active: true, testMode: testMode || false, currentPick: 0,
    order, picks: [], timerSeconds: timerSeconds || 120, startTime: Date.now()
  };
  saveData(data);
  res.json({ success: true, draftState: data.draftState });
});

app.post('/api/draft/pick', (req, res) => {
  const data = getData();
  const { teamName, playerIndex } = req.body;
  if (!data.draftState.active) return res.status(400).json({ error: 'Draft not active' });
  
  data.draftState.picks.push({ pick: data.draftState.currentPick + 1, team: teamName, player: playerIndex, timestamp: Date.now() });
  if (!data.draftState.testMode) data.players[playerIndex].teams.push(teamName);
  data.draftState.currentPick++;
  data.draftState.startTime = Date.now();
  if (data.draftState.currentPick >= 64) data.draftState.active = false;
  
  saveData(data);
  res.json({ success: true, draftState: data.draftState });
});

app.post('/api/draft/end', (req, res) => {
  const data = getData();
  data.draftState.active = false;
  saveData(data);
  res.json({ success: true });
});

app.post('/api/draft/reset', (req, res) => {
  const data = getData();
  data.draftState = { active: false, testMode: false, currentPick: 0, order: [], picks: [], timerSeconds: 120, startTime: null };
  if (req.body.clearTeams) data.players.forEach(p => p.teams = []);
  saveData(data);
  res.json({ success: true });
});

// Live scores from ESPN
app.get('/api/scores', async (req, res) => {
  try {
    const response = await fetch('https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard?groups=100');
    const data = await response.json();
    res.json(data);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch scores' }); }
});

// Standings calculation
app.get('/api/standings', (req, res) => {
  const data = getData();
  const settings = data.settings;
  
  const standings = data.players.map((player, index) => {
    let totalPoints = 0, potentialPoints = 0, teamsAlive = 0;
    
    player.teams.forEach(teamName => {
      const teamInfo = TOURNAMENT_TEAMS[teamName];
      if (!teamInfo) return;
      
      let teamBracket = null;
      for (const region of Object.keys(data.bracket)) {
        teamBracket = data.bracket[region].find(t => t.name === teamName);
        if (teamBracket) break;
      }
      if (!teamBracket) return;
      
      let multiplier = 1;
      if (teamInfo.seed >= 13) multiplier = 3;
      else if (teamInfo.seed >= 9) multiplier = 2;
      else if (teamInfo.seed >= 5) multiplier = 1.5;
      
      const wins = teamBracket.wins || 0;
      for (let round = 1; round <= wins; round++) {
        totalPoints += (settings.roundPoints[round.toString()] || 1) * multiplier;
      }
      
      if (!teamBracket.eliminated) {
        teamsAlive++;
        for (let round = wins + 1; round <= 6; round++) {
          potentialPoints += (settings.roundPoints[round.toString()] || 1) * multiplier;
        }
      }
    });
    
    return {
      index, name: player.name, letter: player.letter,
      colorPrimary: player.colorPrimary, colorSecondary: player.colorSecondary,
      teams: player.teams, totalPoints, potentialPoints,
      maxPoints: totalPoints + potentialPoints, teamsAlive
    };
  });
  
  standings.sort((a, b) => b.totalPoints - a.totalPoints);
  res.json(standings);
});

initData();
app.listen(PORT, () => console.log(`🏀 Jack Hughes Jersey Bet running on port ${PORT}`));
