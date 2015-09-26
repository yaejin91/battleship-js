var GameManager = function(){

	this.init = function(){

		this.newGame();

		$("input:checkbox").click(function() {

			if ($(this).is(":checked")) {
			    var group = "input:checkbox[name='" + $(this).attr("name") + "']";
			    $(group).prop("checked", false);
			    $(this).prop("checked", true);
			} else {
			    $(this).prop("checked", false);
			}
		});	

		$("#info-submit1").on('click', function(e){

			e.preventDefault();
			var useName1 = $("#username1").val();
			var usePass1 = $("#password1").val();

			gameManager.gameSetup1(useName1,usePass1);
			$('#userModal1').modal('hide')
			$('#userModal2').modal('show')

			$("#info-submit2").on('click', function(e){

				e.preventDefault();
				var useName2 = $("#username2").val();
				var usePass2 = $("#password2").val();

				gameManager.gameSetup2(useName2,usePass2);
				$('#userModal2').modal('hide')

				$('#userModal2').on('hidden.bs.modal', function(){
			    $(this).find('form')[0].reset();
				$("#newgame-button").hide();
				// $("#endturn-button").show();
				$(".ship-box").show();
				});
			})

			//This prevents the previous user inputs from showing up when New Game is pressed again.
			$('#userModal1').on('hidden.bs.modal', function(){
			    $(this).find('form')[0].reset();
			});
		});
	}

	this.newGame = function(){

		$("#newgame").click(function(){
			
			boardSet.boardP1 = new Array();
			boardSet.boardTurnP1 = new Array();

		});

		this.userInfo1 = new UserInfo();
		this.userInfo2 = new UserInfo();
		
	}

	this.gameSetup1 = function(username, password){
		this.userInfo1.username = username;
		this.userInfo1.password = password;

	}

	this.gameSetup2 = function(username,password){
		this.userInfo2.username = username;
		this.userInfo2.password = password;
	}

	var that = this;
	var shipCounter = 0;

	//shipAnchor was previously named placeShip. Renamed for more clarity.
	//shipAnchor indicates the cell number of the grid cell you click on to place the boats.
	
	this.shipDrop = function(targetId) {
	
		var shipSize = 0;
		var shipType = 0;
	    var shipAnchor = targetId;
	    var gridId = targetId;
	    gridId = gridId.substring(-3,9);
	    shipAnchor = shipAnchor.substring(9);
	    shipAnchor = parseInt(shipAnchor);

	 	$("input:checkbox[name=ship]:checked").each(function(){
			shipSize = parseInt($(this).val());
			shipType = $(this).attr('id');
		});

		var rowLength = 5;

		// consider refactoring condition (Jordan said don't count off)
		// at the least, name values with variables to make more readable, and add a comment explaining what's happening
	    if ((rowLength-((shipAnchor+1)%rowLength)+1) >= shipSize && ((shipAnchor+1)%rowLength) != 0) {

			for (var i = shipAnchor; i<(shipAnchor + shipSize); i++) {
                $('#'+gridId+i).css("background-color","brown");
                if (boardSet.currentPlayer == 'P1') {
                    boardSet.boardP1.push(i);

                    if(shipSize == 2){
                        shipArray.shipStateP1.smallShipP1.push(i);
                    }else if(shipSize ==4){
                        shipArray.shipStateP1.bigShipP1.push(i);
                    }

                }else {
                    boardSet.boardP2.push(i);

                    if(shipSize == 2){
                        shipArray.shipStateP2.smallShipP2.push(i);
                    }else if(shipSize ==4){
                        shipArray.shipStateP2.bigShipP2.push(i);
                    }
                };
                $('#'+shipType).parents().eq(2).hide();
			                }
			shipCounter++;
			if(shipCounter == 2){

				if(boardSet.currentPlayer == 'P1'){
					$("#ps-p1").hide();
					$("#ps-p2").show();
					$("#player2").modal('show');
					$('.radio').prop('checked',false);
					$(".ship-box").show();
					boardSet.currentPlayer = 'P2'
					shipCounter = 0;
				} else {
					boardSet.currentPlayer = 'P1';
					$("#ps-p2").hide();
					$("#hm-p1").show();
					$("#hm-player1").modal('show');

				}
				
			};
			
	    } else {  	
	    	$('#error').modal('show');
		}					
	};

	this.hitMiss = function(hmTargetId){

		var gridId = hmTargetId+"";
	    gridId = parseInt(gridId.substring(9));

	    if(boardSet.currentPlayer == "P1"){
	    	if(boardSet.boardP2.indexOf(gridId)<= -1) {
	    		$("#endturnmiss-button").show();
	    		$("#endturnhit-button").hide();
				$('#player-miss').modal('show');
	    		$('#hmp1-cell'+gridId).css("background-color","blue");

	    	} else if (boardSet.boardP2.indexOf(gridId)> -1) {
	    		$("#endturnmiss-button").hide();
	    		$("#endturnhit-button").show();
	    		$('#player-hit').modal('show');
	    		$('#hmp1-cell'+gridId).css("background-image","url(./images/hitmarker.png)");
	    		boardSet.boardTurnP1.push(gridId);

	    	}

	    } else if (boardSet.currentPlayer == "P2"){
	    	if(boardSet.boardP1.indexOf(gridId)<= -1) {
	    		$("#endturnmiss-button").show();
	    		$("#endturnhit-button").hide();
				$('#player-miss').modal('show');
	    		$('#hmp2-cell'+gridId).css("background-color","blue");


	    	} else if (boardSet.boardP1.indexOf(gridId)> -1) {
	    		$("#endturnmiss-button").hide();
	    		$("#endturnhit-button").show();
	    		$('#player-hit').modal('show');
	    		$('#hmp2-cell'+gridId).css("background-image","url(./images/hitmarker.png)");
	    		boardSet.boardTurnP2.push(gridId);

	    		}
			}	  
	}

	this.endTurnMiss = function(){

		if (boardSet.currentPlayer == "P1") {
			$("#hm-p1").hide();
			$("#hm-p2").show();
			boardSet.currentPlayer = "P2";
			$('#player-attack').modal('show');

		}else if(boardSet.currentPlayer == "P2") {
    		$("#hm-p2").hide();
    		$("#hm-p1").show();	
			boardSet.currentPlayer = "P1";
			$('#player-attack').modal('show');
		};
	}

	this.endTurnHit = function(){

		if (boardSet.currentPlayer == "P1") {
    		$("#hm-p1").hide();
    		$("#hm-p2").show();
			boardSet.currentPlayer = "P2";
			$('#player-attack').modal('show');
		}else if(boardSet.currentPlayer == "P2") {
			$("#hm-p2").hide();
			$("#hm-p1").show();
			boardSet.currentPlayer = "P1";
			$('#player-attack').modal('show');
		};
	}

	this.sinkCheck = function(){

        if(shipArray.shipStateP1.smallShipP2 == boardSet.boardTurnP1){

        	$('.sunken-ship').text("You flushed the small ship!!")
        	$('#ship-sink').modal('show');

        } else {

        }
	};

	this.victoryCheck = function(){

	};
};