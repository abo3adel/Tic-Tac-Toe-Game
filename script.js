/** Helper function to get element text */
function text(txt){
	return txt.innerHTML;
}


		/*
		 * Represents a state in the game
		 */
		 var Init = function(){

			// human play with X or O
			this.playWith = document.getElementById('pw').value;

			// ai playing with X or O
			this.aiPw = function(){
				return this.playWith === 'X' ? 'O' : 'X';
			};

			// game result at this state
			this.result = 'running';

			// get empty cells
			this.emptyCells = function(){
				var indxs = [];
				var cells = document.getElementsByClassName('val');
				for(var i = 0; i < 9; i++){
					if(text(cells[i]) !== this.playWith && text(cells[i]) !== this.aiPw()){
						indxs.push(i);
					}
				}
				return indxs;
			};

			// not very easy
			this.regular = function(available){
				var relative = [];
				for(var x =0; x < available.length; x++){
					if(available[x] - available[x+1] !== -1){
						relative.push(available[x]);
					}
				}
				return relative[Math.floor(Math.random() * relative.length)];
			};

			// AI action
			this.aiAction = function(){
				this.result = 'wait';
				var available = this.emptyCells();
				if(available.length > 1){
					var randCell = this.regular(available);
				}
				var cell = document.getElementsByClassName('val');
				cell[randCell].innerHTML = this.aiPw();
				this.result = 'your turn';
			};

			// get result
			this.getResult = function(){
				var cells = document.getElementsByClassName('val');

				// check rows
				for(var i = 0; i <= 6; i = i +3){
					var first = cells[i],
					second = cells[i+1],
					third = cells[i+2];
					if( text(first).length && text(first) === text(second) && text(second) === text(third) ){
						this.result = text(first) + '-won';
						first.className += ' win';
						second.className += ' win';
						third.className += ' win';
						return true;
					}
				}

				// check cols
				for(var i = 0; i <= 2; i++){
					var first = cells[i],
					second = cells[i+3],
					third = cells[i+6];
					if( text(first).length && text(first) === text(second) && text(second) === text(third) ){
						this.result = text(first) + '-won';
						first.className += ' win';
						second.className += ' win';
						third.className += ' win';
						return true;
					}
				}

				// check diagonals
				for(var i = 0, j = 4; i <= 2; i = i+2, j = j-2){
					var first = cells[i],
					second = cells[i+j],
					third = cells[i+ 2*j];
					if( text(first).length && text(first) === text(second) && text(second) === text(third) ){
						this.result = text(first) + '-won';
						first.className += ' win';
						second.className += ' win';
						third.className += ' win';
						return true;
					}
				}


				// get empty cells
				var empty = this.emptyCells();
				if(!empty.length){
					// the game is draw
					this.result = 'it`s draw';
					return true;
				}
				else{
					return false;
				}

			};

			// reset all cells
			this.restart = function(){
				document.getElementById('h1').innerHTML = 'your turn';
				var cells = document.getElementsByClassName('val');
				for(var i = 0; i < 9; i++){
					cells[i].className = "val";
					cells[i].innerHTML = '';
				}
			};
		};

		var Game = function(){
			var run = new Init();
			
			// check if game still running run ai action
			if(!run.getResult()){
				run.aiAction();
			}
			// check if game ended 
			// show result and rest all cells
			if(run.getResult()){
				document.getElementById('h1').innerHTML = run.result;
				setTimeout(function(){
					run.restart()
				}, 1200);
			}
		};

		$(document).ready(function(){
			// show modal on the begging
			$('#myModal').modal();

			// get user choosed X or O
			$('.pw-X, .pw-O').on('click touchstart', function(){
				$('input.pw').val($(this).attr('data-choose'));
			});

			$('.cell').on('click touchstart', function(e){
				var val = $(this).children();
				
				// if cell already used
				if(val.text().length){
					return false;
				}
				val.text($('input.pw').val());

				// run game instance
				new Game();
			});
		});