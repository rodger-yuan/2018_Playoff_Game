function roundFromGameId(gameId) {
	// determine the round from the gameID.
	// assumes the round number is encoded in the third to last character in the gameID
	// e.g. 0041700151 -> round 1
	return parseInt(gameId.charAt(gameId.length - 3));
}
 

$( document ).ready(function() {
	var url = "https://stats.nba.com/stats/leaguegamelog?Counter=1000000&DateFrom=&DateTo=&Direction=ASC&LeagueID=00&PlayerOrTeam=P&Season=2017-18&SeasonType=Playoffs&Sorter=DATE&callback=?"

	var rodger_players = ["LeBron James", "Kevin Durant", "Joel Embiid", "Kevin Love", "DeMar DeRozan", "Donovan Mitchell", "CJ McCollum", "Jaylen Brown", "Paul George", "Giannis Antetokounmpo"]
	var jimmy_players = ["James Harden", "Chris Paul", "Klay Thompson", "Stephen Curry", "Damian Lillard", "Eric Gordon", "Russell Westbrook", "Ben Simmons", "Kyle Lowry", "JJ Redick"]
	class Player {
		constructor(name) {
			this._name = name;
			this._totalgames = 0;
			this._round1points = 0;
			this._round2points = 0;
			this._round3points = 0;
			this._round4points = 0;
			this._totalpoints = 0;
		}

		inputBoxScore(boxline) {
			var points = boxline[28];
			this._totalgames += 1;
			this._totalpoints += points;

			var round = roundFromGameId(boxline[6]);
			switch(round) {
				case 1:
					this._round1points += points;
					break;
				case 2:
					this._round2points += points;
					break;
				case 3:
					this._round3points += points;
					break;
				case 4:
					this._round3points += points;
					break;
			}
		}
	}

	var rodger_players_class = {};
	var jimmy_players_class = {};

	for (var i = 0; i < rodger_players.length; i++) { //create lists with player class
		rodger_players_class[rodger_players[i]] = new Player(rodger_players[i]);
		jimmy_players_class[jimmy_players[i]] = new Player(jimmy_players[i]);
	}

	$.getJSON(url,  // url
	    function (data) {  // success callback
	        rowSet = data.resultSets[0].rowSet;
	        console.log(rowSet);
	        rodger_total = new Array(7).fill(0);
	        rodger_total[0] = "Rodger Totals"
	        jimmy_total = new Array(7).fill(0);
	        jimmy_total[0] = "Jimmy Totals"

	        for (var i = 0; i < rowSet.length; i++) { //input boxscores into players
						if (rodger_players.indexOf(rowSet[i][2]) > -1) {
							rodger_players_class[rowSet[i][2]].inputBoxScore(rowSet[i]);
					}

					if (jimmy_players.indexOf(rowSet[i][2]) > -1) {
						jimmy_players_class[rowSet[i][2]].inputBoxScore(rowSet[i]);
					}
			}

			console.log(jimmy_players_class)
				
			for (var i = 0; i < rodger_players.length; i++) {
				rodger_name = rodger_players[i];
				jimmy_name = jimmy_players[i];

				rodger_total[1] += rodger_players_class[rodger_name]._totalgames;
				jimmy_total[1] += jimmy_players_class[jimmy_name]._totalgames;

				rodger_total[2] += rodger_players_class[rodger_name]._round1points;
				jimmy_total[2] += jimmy_players_class[jimmy_name]._round1points;

				rodger_total[3] += rodger_players_class[rodger_name]._round2points;
				jimmy_total[3] += jimmy_players_class[jimmy_name]._round2points;

				rodger_total[4] += rodger_players_class[rodger_name]._round3points;
				jimmy_total[4] += jimmy_players_class[jimmy_name]._round3points;

				rodger_total[5] += rodger_players_class[rodger_name]._round4points;
				jimmy_total[5] += jimmy_players_class[jimmy_name]._round4points;

				rodger_total[6] += rodger_players_class[rodger_name]._totalpoints;
				jimmy_total[6] += jimmy_players_class[jimmy_name]._totalpoints;

				row = document.getElementById("rodger_total").insertRow(1); //rodger
				row.insertCell(0).innerHTML = rodger_players_class[rodger_name]._name;
				row.insertCell(1).innerHTML = rodger_players_class[rodger_name]._totalgames;
				row.insertCell(2).innerHTML = rodger_players_class[rodger_name]._round1points;
				row.insertCell(3).innerHTML = rodger_players_class[rodger_name]._round2points;
				row.insertCell(4).innerHTML = rodger_players_class[rodger_name]._round3points;
				row.insertCell(5).innerHTML = rodger_players_class[rodger_name]._round4points;
				row.insertCell(6).innerHTML = rodger_players_class[rodger_name]._totalpoints;

				row = document.getElementById("jimmy_total").insertRow(1); //jimmy
				row.insertCell(0).innerHTML = jimmy_players_class[jimmy_name]._name;
				row.insertCell(1).innerHTML = jimmy_players_class[jimmy_name]._totalgames;
				row.insertCell(2).innerHTML = jimmy_players_class[jimmy_name]._round1points;
				row.insertCell(3).innerHTML = jimmy_players_class[jimmy_name]._round2points;
				row.insertCell(4).innerHTML = jimmy_players_class[jimmy_name]._round3points;
				row.insertCell(5).innerHTML = jimmy_players_class[jimmy_name]._round4points;
				row.insertCell(6).innerHTML = jimmy_players_class[jimmy_name]._totalpoints;
			}

			console.log(rodger_total)

			for (var i = 0; i < rodger_total.length; i++) {
				jrow = document.getElementById("jt");
				rrow = document.getElementById("rt");
				jrow.insertCell(i).innerHTML = jimmy_total[i];
				rrow.insertCell(i).innerHTML = rodger_total[i];

				jcell = document.getElementById("jtt").insertCell(i);
				rcell = document.getElementById("rtt").insertCell(i);
				jcell.innerHTML = jimmy_total[i];
				rcell.innerHTML = rodger_total[i];

			console.log(rodger_total);
			console.log(jimmy_total);

			}
	    });
});

function scrolly(name) {
	console.log(name)
    var elmnt = document.getElementById(name);
    elmnt.scrollIntoView();
}
