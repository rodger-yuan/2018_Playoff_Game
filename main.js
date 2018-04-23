function roundFromGameId(gameId) {
	// determine the round from the gameID.
	// assumes the round number is encoded in the third to last character in the gameID
	// e.g. 0041700151 -> round 1
	return parseInt(gameId.charAt(gameId.length - 3));
}
 

$( document ).ready(function() {
	var url = "https://stats.nba.com/stats/leaguegamelog?Counter=1000000&DateFrom=&DateTo=&Direction=ASC&LeagueID=00&PlayerOrTeam=P&Season=2017-18&SeasonType=Playoffs&Sorter=DATE&callback=?"
	var url2 = "https://stats.nba.com/stats/leaguedashplayerstats?College=&Conference=&Country=&DateFrom=&DateTo=&Division=&DraftPick=&DraftYear=&GameScope=&GameSegment=&Height=&LastNGames=0&LeagueID=00&Location=&MeasureType=Base&Month=0&OpponentTeamID=0&Outcome=&PORound=0&PaceAdjust=N&PerMode=Totals&Period=0&PlayerExperience=&PlayerPosition=&PlusMinus=N&Rank=N&Season=2017-18&SeasonSegment=&SeasonType=Playoffs&ShotClockRange=&StarterBench=&TeamID=0&VsConference=&VsDivision=&Weight=&callback=?"

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
			this._average = 0;
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
					this._round4points += points;
					break;
			}

			this._average = Number(this._totalpoints/this._totalgames).toFixed(1);
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
	        rodger_total = new Array(8).fill(0);
	        rodger_total[0] = "Rodger Totals"
	        jimmy_total = new Array(8).fill(0);
	        jimmy_total[0] = "Jimmy Totals"

	        for (var i = 0; i < rowSet.length; i++) { //input boxscores into players
						if (rodger_players.indexOf(rowSet[i][2]) > -1) {
							rodger_players_class[rowSet[i][2]].inputBoxScore(rowSet[i]);
					}

					if (jimmy_players.indexOf(rowSet[i][2]) > -1) {
						jimmy_players_class[rowSet[i][2]].inputBoxScore(rowSet[i]);
					}
			}
				
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
				row.insertCell(7).innerHTML = rodger_players_class[rodger_name]._average;

				row = document.getElementById("jimmy_total").insertRow(1); //jimmy
				row.insertCell(0).innerHTML = jimmy_players_class[jimmy_name]._name;
				row.insertCell(1).innerHTML = jimmy_players_class[jimmy_name]._totalgames;
				row.insertCell(2).innerHTML = jimmy_players_class[jimmy_name]._round1points;
				row.insertCell(3).innerHTML = jimmy_players_class[jimmy_name]._round2points;
				row.insertCell(4).innerHTML = jimmy_players_class[jimmy_name]._round3points;
				row.insertCell(5).innerHTML = jimmy_players_class[jimmy_name]._round4points;
				row.insertCell(6).innerHTML = jimmy_players_class[jimmy_name]._totalpoints;
				row.insertCell(7).innerHTML = jimmy_players_class[jimmy_name]._average;
			}

			rodger_total[7] = Number(rodger_total[6]/rodger_total[1]).toFixed(1);
			jimmy_total[7] = Number(jimmy_total[6]/jimmy_total[1]).toFixed(1);

			for (var i = 0; i < rodger_total.length; i++) {
				if (i != 0) {
					jrow = document.getElementById("jtl");
					rrow = document.getElementById("rtl");
					jrow.insertCell(i).innerHTML = jimmy_total[i];
					rrow.insertCell(i).innerHTML = rodger_total[i];
				}

				jcell = document.getElementById("jtt").insertCell(i);
				rcell = document.getElementById("rtt").insertCell(i);
				jcell.innerHTML = jimmy_total[i];
				rcell.innerHTML = rodger_total[i];

			}
	    });

	$.getJSON(url2,  // url2
	    function (data) {  // success callback
	    	rowSet = data.resultSets[0].rowSet;
	    	rowSet.sort(function(a,b) {return b[29] - a[29]})
	    	for (var i = 0; i < 20; i++) {
	    		row = document.getElementById("topplayers").insertRow(i+1);
	    		if (rodger_players.indexOf(rowSet[i][1]) > -1) {
	    			row.className = "rodger";
	    		}
	    		if (jimmy_players.indexOf(rowSet[i][1]) > -1) {
	    			row.className = "jimmy";
	    		}
	    		row.insertCell(0).innerHTML = rowSet[i][1];
	    		row.insertCell(1).innerHTML = rowSet[i][5];
	    		row.insertCell(2).innerHTML = rowSet[i][29];
	    		row.insertCell(3).innerHTML = Number(rowSet[i][29]/rowSet[i][5]).toFixed(1);
	    	}
	    }
	);
});

function scrolly(name) {
    var elmnt = document.getElementById(name);
    elmnt.scrollIntoView();
}
