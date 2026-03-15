const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(express.json());

const DEFAULT_DATA = {
  players: [],
  bracket: {
    East: Array.from({ length: 16 }, (_, i) => ({ seed: i + 1, name: "East " + (i + 1), eliminated: false, wins: 0 })),
    West: Array.from({ length: 16 }, (_, i) => ({ seed: i + 1, name: "West " + (i + 1), eliminated: false, wins: 0 })),
    South: Array.from({ length: 16 }, (_, i) => ({ seed: i + 1, name: "South " + (i + 1), eliminated: false, wins: 0 })),
    Midwest: Array.from({ length: 16 }, (_, i) => ({ seed: i + 1, name: "Midwest " + (i + 1), eliminated: false, wins: 0 }))
  },
  lastUpdate: null,
  autoUpdate: true
};

function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }
  } catch (err) {
    console.error('Error loading data:', err);
  }
  return JSON.parse(JSON.stringify(DEFAULT_DATA));
}

function saveData(data) {
  data.lastUpdate = new Date().toISOString();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

if (!fs.existsSync(DATA_FILE)) {
  saveData(JSON.parse(JSON.stringify(DEFAULT_DATA)));
}

// API ROUTES - these must come BEFORE static files
app.get('/api/data', function(req, res) {
  try {
    var data = loadData();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load data' });
  }
});

app.post('/api/data', function(req, res) {
  try {
    saveData(req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save data' });
  }
});

app.get('/api/live-scores', async function(req, res) {
  try {
    var response = await fetch('https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard?groups=100');
    var json = await response.json();
    var games = [];
    if (json.events) {
      for (var i = 0; i < json.events.length; i++) {
        var event = json.events[i];
        var competition = event.competitions && event.competitions[0];
        if (!competition) continue;
        var statusType = competition.status && competition.status.type;
        var homeTeam = competition.competitors && competition.competitors.find(function(c) { return c.homeAway === 'home'; });
        var awayTeam = competition.competitors && competition.competitors.find(function(c) { return c.homeAway === 'away'; });
        if (homeTeam && awayTeam) {
          games.push({
            id: event.id,
            completed: statusType && statusType.completed || false,
            status: statusType && statusType.description || 'Unknown',
            home: { name: homeTeam.team && homeTeam.team.displayName, shortName: homeTeam.team && homeTeam.team.abbreviation, score: parseInt(homeTeam.score) || 0, winner: homeTeam.winner || false },
            away: { name: awayTeam.team && awayTeam.team.displayName, shortName: awayTeam.team && awayTeam.team.abbreviation, score: parseInt(awayTeam.score) || 0, winner: awayTeam.winner || false }
          });
        }
      }
    }
    res.json({ games: games });
  } catch (err) {
    res.json({ games: [] });
  }
});

app.post('/api/update-scores', async function(req, res) {
  res.json({ updated: false, message: 'Manual update' });
});

// STATIC FILES - must come AFTER API routes
app.use(express.static(path.join(__dirname, 'public')));

// ADMIN PAGE - must come BEFORE catch-all
app.get('/admin', function(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// CATCH-ALL - must be LAST
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, function() {
  console.log('March Madness Bracket Challenge is running on port ' + PORT);
});
