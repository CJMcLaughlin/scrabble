
/* Global Constants */
var NUM_TILES = 7; 
var NUM_TILES_IN_ROW = 10;

/* Now Program knows there abcs. Please don't take off points for bad jokes */
var ScrabbleLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I","J","K","L","M",
"N","O","P","Q","R","S","T", "U", "V", "W","X","Y","Z", "Blank"]; 
/* Values for each letter ex: ScrabbleLetters[0] = A is value for Scrabble Values[0] = 1 */
var ScrabbleValues=   [ 1 ,  3, 3, 2, 1, 4, 2, 4, 1, 8, 5, 1, 3, 1, 1, 3, 10, 1, 
 1, 1, 1, 4, 4, 8, 4 , 10, 0];
 /* The frequency of each element */
 var ScrabbleCount=[9,2,2,4,12,2,3,2,9,1,1,4,2,6,8,2,1,6,4,6,4,2,2,1,2,1,2] 
 


var score = 0;
var board = [];
var values = [];
var lettersArray= [];
var valuesArray = [];

/* Wait until the file is ready */
$(document).ready(function() {
	/*Build the board */
	buildBoard();
	/*Give the player some times */
	giveTiles();
	/*Function that makes the tiles drag and dropable */
	dragDrop();
});

/* 
Sources: JQuery Math.Random(): http://www.w3schools.com/jsref/jsref_random.asp
		 Zip of Images: Came from Prof. Heines old website
		 Dragable Tutorials: https://jqueryui.com/droppable/
		 					 http://stackoverflow.com/questions/3591264/can-table-rows-be-made-draggable
		The id idea came from stack overflow but i couldn't really make it work in the end
		 

*/
function giveTiles(){
	/*Constant path to file adding letters will make it find the picture */
	var imagePath = "images/Tiles/Scrabble_Tile_";
	/*variable to hold code building tiles objects */
	var tiles = "";
	/*varialbe to hold random variable */
	var rand;
	/* Variable to hold letter picked */
	var letter;
	var value;
	var score=0;


	for(var i=0; i < NUM_TILES; i++){
		/*Get a random number use length of array to get an index */
		rand = Math.floor(Math.random() * ScrabbleLetters.length);
		
		/*if there are no more letters left in the array grab a new letter */
		while(ScrabbleCount[rand] == 0){
			rand= Math.floor(Math.random() * ScrabbleLetters.length);
		}
		/* Get the letter and the value from the tables */
		letter = ScrabbleLetters[rand];
		value = ScrabbleValues[rand];
		/*Decrement the count as you "took" away a peice */
		ScrabbleCount[rand]--;
		/*build the code to show the images */
		tiles += "<img id='dragable" + i + "' class=letter_tile" + letter + " limg' src="+imagePath+letter+".jpg>'<ima>";
		/* I was trying to emulate a part of code I saw on stack overflow to "pass" values to the drop function but it didn't work out */
		/* So this is left in case I fix it in the future. */
		valuesArray.push(value);
		lettersArray.push(letter);

	}
	$("#score").html(score);
	$("#tiles").html(tiles);
}
/*IMPORTANT! My board is probably unlike most otherpeople I tried to make the "average" board by 
  creating one that had 4/15 special spaces, the average number. I then shrunk the board down to
  10 spaces to make it look nicer. So on average it should have 4 special times out of ten but there
  is chance all of them are special or none of them are. */
function buildBoard(){
	/* Start to build table*/
	var table = '<table>';
	/* Add the only row */
	table += '<tr>';
	/* Variable to hold randomizer*/
	var rand= Math.floor(Math.random() * NUM_TILES_IN_ROW);
	var rand_element= Math.floor(Math.random() * 4);

	/*On the row we are trying to elumate there are 4 special spaces 4/15 */
	for(var i = 0; i < NUM_TILES_IN_ROW; i++){
		var rand= Math.floor(Math.random() * NUM_TILES_IN_ROW);
		var rand_element= Math.floor(Math.random() * 4);
		if(rand <= 3) {/*is 0 1 2 or 3 = 4/15 */
			if(rand == 0){
				table += "<td class='dub_word tileDrop'></td>"
			}
			else if(rand == 1){
				table += "<td class='dub_letter tileDrop'></td>"
			}
			else if(rand == 2){
				table += "<td class= 'trip_word tileDrop'></td>"
			}
			else{
				table += "<td class= 'trip_letter tileDrop'></td>"
			}

		}
		else{ /* Add a normal tile */
		table += "<td class='tileDrop'></td>";
		}
	}
	table += "</tr></table>"
	$("#board").html(table);

}
/*Function that allows drag and dropping */
function dragDrop(){
	/* Work around for just do #dragable it only applies to first?*/
	for(var i=0; i < 7; i++){
		$("#dragable"+i).draggable({
			/* Makes the letters go back if they dont fit */
			revert: true
		});
	}
	/* Make tiledrop droppable space */
	$(".tileDrop").droppable({
		hoverClass: 'active',
		/* on drop event*/
		drop: function(event, ui){
			/* Limits one per square*/
			$(this).droppable('option', 'accept', ui.draggable);
			$(this).append(ui.draggable);
			/*Get the id (this part didn't work as planned so can be more or less ignored) */
			var index= ui.draggable.attr("id");
			
			/*SOURCE UI documentation */
			var d = ui.draggable;
			var dO = $(this);
			$(d).detach().css({top: 0, left:0}).appendTo(dO);

			
			/* I couldn't get the id system to work but wanted to show that my doub/trip word/letter works */
			/* As a result every letter is worth 3 and you get more for the bonus */
			if($(this).hasClass("dub_letter")){
				score += 3* 2;
			}
			else if($(this).hasClass("trip_letter")){
				score += 3 * 3;
			}
			else if($(this).hasClass("trip_word")){
				score += 3;
				score *= 3;
			}
			else if($(this).hasClass("dub_word")){
				score += 3;
				score *= 2;
			}
			else{
				score += 3;
			}
			//console.log(score); 
			/* Score */
			$("#score").html(score);
		}, /* When leaving deny more items from coming in */
		out: function (event, ui){
			$(this).droppable('option', 'deny', '.drag-item');
		}
	})
}
