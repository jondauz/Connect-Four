var connectFour = (function(){

	var playerOne,
		playerTwo,
		playersArray,
		currentPlayerIndex;

	// Initialize the game.
	function initGame(){
	
		$('#restartBtn').unbind('click')
		$('#restartBtn').hide();

		playerOne =  new Person(prompt('Enter name of Player One')),
		playerTwo = new Person(prompt('Enter name of Player Two')),
		playersArray = [playerOne,playerTwo],
		currentPlayerIndex = Math.floor(Math.random() * 2); // Randomly choose a player to start 
		
		$('#gameFeedback').text(playersArray[currentPlayerIndex].playerName + " goes first!");
		changeTextColor();
		addListeners();

	}	

	// Add listeners for gameboard.
	function addListeners(){

		$('.gameBoard li').click(function(){
			
			var currentPlayer = playersArray[currentPlayerIndex];
			currentPlayer.numberOfMoves++;
			makeChoice($(this));	
		 	
	 		if(checkColumns() || checkRows() || checkAscDiagonals() || checkDescDiagonals()) {
				finishGame();
			} else {
				nextPlayer();
			}

		});

	}

	// Remove listeners when game is done.
	function removeListeners(){ 
		$('.gameBoard li').unbind('click');
	}
	
	// makeChoice() function marks the game board depending on where the player clicks on the gameboard.
	function makeChoice(el){

		var clickedId = el.attr('id'),
			column = clickedId.charAt(0);
		
		// Go through gameboard and place tile where it needs to.
		for(var i=1;i<=7;i++) {
			var currentSection = $('.gameBoard').find('#'+column+i);
			// If spot in game board is taken then move up the column.
			if(!currentSection.hasClass('selected')) {
				currentSection.addClass('selected');
				if(currentPlayerIndex == 0) {
					currentSection.addClass('blue');
				} else {
					currentSection.addClass('red');
				}
				// Add the player choices array an array with coordinates of player's move.	
				playersArray[currentPlayerIndex].playerChoices.push([column,i]); // [0] = column & [1] = row	
				return;
			}
		}

	}

	// Change the current player to the next player.
	function nextPlayer(){
	
		if(currentPlayerIndex == 0) {
			currentPlayerIndex++;
		} else {
			currentPlayerIndex--;
		}

		// Change feedback to depict current player.
		$('#gameFeedback').text(playersArray[currentPlayerIndex].playerName + "'s turn!");
		changeTextColor();
	
	}

	// Check for vertical winning sequence.
	function checkColumns(){
		
		var currentPlayer = playersArray[currentPlayerIndex],
			sequenceCounter = 0,
			currentColumn,
			prevRow,
			winningSet = [];
			
		// Sort the choices that player makes by the first item in the choice array. 
		var sortedArray = currentPlayer.playerChoices.sort(function (a,b) {
		    if (a[0] < b[0]) return -1;
		    if (a[0] > b[0]) return 1;
		    return 0;
		});

		// Go through each item in the array and find if there is a winning sequence.
		// Look for if rows go in sequence. Example: 1, 2, 3, 4 but all have the same column. Example: A
		for(var i=0;i<sortedArray.length;i++) {
			// If no longer looking in same column, reset counters and variables. 
			if(currentColumn!=sortedArray[i][0]) {
				currentColumn = sortedArray[i][0];
				sequenceCounter=0;
				prevRow="";
			}
			if(prevRow!="") {
				var neededRow = prevRow + 1,
					actualRow = sortedArray[i][1];
				// Check to see if row goes in a sequence. If current row is same as previous row plus 1.
				if(neededRow == actualRow) {
					sequenceCounter++;
				} 
			} 
			// Change for next item in array.
			prevRow = sortedArray[i][1];		
			if(sequenceCounter == 3) {
				// If sequence is 3 then winning sequence found. 
				console.log('checkColumns()');
				return true;
			}
		}
	
		return false;
	
	}
	
	function checkRows(){
		
		var currentPlayer = playersArray[currentPlayerIndex],
			sequenceCounter = 0,
			currentRow,
			prevColum3,
			winningSet = [];

		//  Sort array by row. 
		var sortedArray = currentPlayer.playerChoices.sort(function (a,b) {
		    if (a[1] < b[1]) return -1;
		    if (a[1] > b[1]) return 1;
		    return 0;
		});

		// Go through each item in the array and find if there is a winning sequence.
		// Winning sequence is if columns go in sequence, Example: A,B,C,D but have the same row such as row 1. 
		for(var i=0;i<sortedArray.length;i++) {
			// If no longer looking in same row, reset counters and variables. 
			if(currentRow!=sortedArray[i][1]) {
				currentRow = sortedArray[i][1];
				sequenceCounter=0;
				prevColumn="";
			}
			if(prevColumn!="") {
				// Check to see if column goes in a sequence. If current column is same as previous row plus 1.
				if(String.fromCharCode(prevColumn.charCodeAt(0) + 1).toLowerCase() == sortedArray[i][0].toLowerCase()) {
					sequenceCounter++;
				} 
			}
			prevColumn = sortedArray[i][0];
			if(sequenceCounter == 3) {
				// If sequence is 3 then winning sequence found. 
				console.log('checkRows()');
				return true;
			}
		}
		
		return false;

	}

	function checkAscDiagonals(){
		
		var currentPlayer = playersArray[currentPlayerIndex],
			sequenceCounter = 0;
		
		// Sort array by column. 
		var sortedArray = currentPlayer.playerChoices.sort(function (a,b) {
		    if (a[0] < b[0]) return -1;
		    if (a[0] > b[0]) return 1;
		    return 0;
		});
			
		for(var i=0;i<sortedArray.length;i++) {
		
			// Reset counter if winning sequence not found for current column.
			sequenceCounter = 0;
		
			var currentColumn = sortedArray[i][0],
				currentRow = sortedArray[i][1];
		
			for(var j=0;j<sortedArray.length;j++){
					
				var checkColumn = sortedArray[j][0];
				var checkRow = sortedArray[j][1];

				if((String.fromCharCode(currentColumn.charCodeAt(0) + 1) == checkColumn) && ((currentRow + 1) == checkRow)) {
					sequenceCounter++;
					// If sequence found then change current for next sequence
					currentColumn = checkColumn,
					currentRow = checkRow;
					if(sequenceCounter == 3) {
						console.log('checkAscDiagonals()');
						// Return true if a sequence of 3 found. Means that there are 4 in a row.
						return true;
					}
				
				}
				
		  	} 

  		}

  		// Return false if no sequence is found. 
		return false;

	}

	function checkDescDiagonals(){
		
		var currentPlayer = playersArray[currentPlayerIndex],
			sequenceCounter = 0;
		
		// Sort array first by the column then by row.
		var sortedArray = currentPlayer.playerChoices.sort(function (a,b) {
		    if (a[0] < b[0]) return -1;
		    if (a[0] > b[0]) return 1;
		    if (a[1] > b[1]) return -1;
		    if (a[1] < b[1]) return 1;
		    return 0;
		});
		
		for(var i=0;i<sortedArray.length;i++) {
			// Reset counter if winning sequence not found for current column.
			sequenceCounter = 0;
			var currentColumn = sortedArray[i][0];
			var currentRow = sortedArray[i][1];
			for(var j=0;j<sortedArray.length;j++){
					
				var checkColumn = sortedArray[j][0];
				var checkRow = sortedArray[j][1];

				if((String.fromCharCode(currentColumn.charCodeAt(0) + 1) == checkColumn) && ((currentRow - 1) == checkRow)) {
					sequenceCounter++;
					// If sequence found then change current for next sequence
					currentColumn = checkColumn,
					currentRow = checkRow;
					if(sequenceCounter == 3) {
						console.log('checkDescDiagonals()');
						// Return true if a sequence of 3 found. Means that there are 4 in a row.
						return true;
					}
				
				}
				
		  	} 

  		}

  		// Return false if no sequence is found. 
		return false;

	}

	// Runs when someone wins the game.
	function finishGame(){
		
		// Create feedback that player has won the game.
		$('#gameFeedback').text(playersArray[currentPlayerIndex].playerName+ ' wins!');
		changeTextColor();

	 	// Remove listeners so that players cannot makes anymore choices.
		removeListeners();

		// If restartBtn is clicked then restart the game and clear the gameboard.
		$('#restartBtn').show();
		$('#restartBtn').click(function(){
			$('.gameBoard li').removeAttr('class');
			initGame();	
		});
	}

	// Used to change feedback color, which depicts the current player. 
	function changeTextColor() {
		if(currentPlayerIndex == 0) {
			$('#gameFeedback').addClass('blue');
			$('#gameFeedback').removeClass('red');
		} else {
			$('#gameFeedback').addClass('red');
			$('#gameFeedback').removeClass('blue');
		}
	}

	// Person Object
	function Person(name){
		this.playerName = name;
		this.playerChoices = [];
		this.numberOfMoves = 0;
	}

	initGame();

})(jQuery);