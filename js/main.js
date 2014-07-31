var connectFour = (function(){

	var playerOne,
		playerTwo,
		playersArray,
		currentPlayerIndex;

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

	function removeListeners(){ 
		$('.gameBoard li').unbind('click');
	}
	
	function makeChoice(el){

		var clickedId = el.attr('id'),
			column = clickedId.charAt(0);
		
		for(var i=1;i<=7;i++) {
			console.log(i);
			var currentSection = $('.gameBoard').find('#'+column+i);
			if(!currentSection.hasClass('selected')) {
				currentSection.addClass('selected');
				if(currentPlayerIndex == 0) {
					currentSection.addClass('blue');
				} else {
					currentSection.addClass('red');
				}
				playersArray[currentPlayerIndex].playerChoices.push([column,i]);	
				return;
			}
		}

	}

	function nextPlayer(){
	
		if(currentPlayerIndex == 0) {
			currentPlayerIndex++;
		} else {
			currentPlayerIndex--;
		}

		$('#gameFeedback').text(playersArray[currentPlayerIndex].playerName + "'s turn!");
		changeTextColor();
	
	}

	function checkColumns(){
		
		var currentPlayer = playersArray[currentPlayerIndex],
			sequenceCounter = 0,
			currentColumn,
			prevRow,
			winningSet = [];
			
		var sortedArray = currentPlayer.playerChoices.sort(function (a,b) {
		    if (a[0] < b[0]) return -1;
		    if (a[0] > b[0]) return 1;
		    return 0;
		});

		//console.log(sortedArray.toString());

		for(var i=0;i<sortedArray.length;i++) {
			//debugger;
			if(currentColumn!=sortedArray[i][0]) {
				currentColumn = sortedArray[i][0];
				sequenceCounter=0;
				prevRow="";
				winningSet=[];
			}
			if(prevRow!="") {
				var neededRow = prevRow + 1,
					actualRow = sortedArray[i][1];
				if(neededRow == actualRow) {
					winningSet.push(sortedArray[i]);
					sequenceCounter++;
				} 
			} 
			prevRow = sortedArray[i][1];		
			if(sequenceCounter == 3) {
				console.log(winningSet.toString());
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

		var sortedArray = currentPlayer.playerChoices.sort(function (a,b) {
		    if (a[1] < b[1]) return -1;
		    if (a[1] > b[1]) return 1;
		    return 0;
		});

		for(var i=0;i<sortedArray.length;i++) {
			if(currentRow!=sortedArray[i][1]) {
				currentRow = sortedArray[i][1];
				sequenceCounter=0;
				prevColumn="";
				winningSet=[];
			}
			if(prevColumn!="") {
				if(String.fromCharCode(prevColumn.charCodeAt(0) + 1).toLowerCase() == sortedArray[i][0].toLowerCase()) {
					winningSet.push(sortedArray[i]);
					sequenceCounter++;
				} 
			}
			prevColumn = sortedArray[i][0];
			if(sequenceCounter == 3) {
				console.log(winningSet.toString());
				console.log('checkRows()');
				return true;
			}
		}
		
		return false;

	}

	function checkAscDiagonals(){
		
		var currentPlayer = playersArray[currentPlayerIndex],
			sequenceCounter = 0;
		
		var sortedArray = currentPlayer.playerChoices.sort(function (a,b) {
		    if (a[0] < b[0]) return -1;
		    if (a[0] > b[0]) return 1;
		    return 0;
		});

		if(currentPlayer.numberOfMoves >= 4) {
			
			for(var i=0;i<sortedArray.length;i++) {
			
				sequenceCounter = 0;
			
				var currentColumn = sortedArray[i][0],
					currentRow = sortedArray[i][1];
			
				for(var j=0;j<sortedArray.length;j++){
						
					var checkColumn = sortedArray[j][0];
					var checkRow = sortedArray[j][1];

					if((String.fromCharCode(currentColumn.charCodeAt(0) + 1) == checkColumn) && ((currentRow + 1) == checkRow)) {
						sequenceCounter++;
						currentColumn = checkColumn,
						currentRow = checkRow;
						console.log(sequenceCounter);
						if(sequenceCounter == 3) {
							console.log('checkAscDiagonals()');
							return true;
						}
					
					}
					
			  	} 

	  		}

		}

		return false;

	}

	function checkDescDiagonals(){
		
		var currentPlayer = playersArray[currentPlayerIndex],
			sequenceCounter = 0;
		
		var sortedArray = currentPlayer.playerChoices.sort(function (a,b) {
		    if (a[0] < b[0]) return -1;
		    if (a[0] > b[0]) return 1;
		    if (a[1] > b[1]) return -1;
		    if (a[1] < b[1]) return 1;
		    return 0;
		});
		
		if(currentPlayer.numberOfMoves >= 4) {
			for(var i=0;i<sortedArray.length;i++) {
				sequenceCounter = 0;
				var currentColumn = sortedArray[i][0];
				var currentRow = sortedArray[i][1];
				for(var j=0;j<sortedArray.length;j++){
						
					var checkColumn = sortedArray[j][0];
					var checkRow = sortedArray[j][1];

					if((String.fromCharCode(currentColumn.charCodeAt(0) + 1) == checkColumn) && ((currentRow - 1) == checkRow)) {
						sequenceCounter++;
						currentColumn = checkColumn,
						currentRow = checkRow;
						if(sequenceCounter == 4) {
							console.log('checkDescDiagonals()');
							return true;
						}
					
					}
					
			  	} 

	  		}

		}

		return false;

	}

	function finishGame(){
		console.log(playersArray[currentPlayerIndex])
		$('#gameFeedback').text(playersArray[currentPlayerIndex].playerName+ ' wins!');
		changeTextColor();
		removeListeners();
		$('#restartBtn').show();
		$('#restartBtn').click(function(){
			$('.gameBoard li').removeAttr('class');
			initGame();	
		});
	}

	function changeTextColor() {
		if(currentPlayerIndex == 0) {
			$('#gameFeedback').addClass('blue');
			$('#gameFeedback').removeClass('red');
		} else {
			$('#gameFeedback').addClass('red');
			$('#gameFeedback').removeClass('blue');
		}
	}

	function Person(name){
		this.playerName = name;
		this.playerChoices = [];
		this.numberOfMoves = 0;
	}

	initGame();

})(jQuery);