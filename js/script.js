

	if( typeof(Storage) !== "undefined" ){
		if(localStorage.getItem("flappy2048best")==null){
			localStorage.setItem("flappy2048best", 0);
		}
	}
	/* 游戏数据 */
	var game = {
		playing: true,
		bird: setTimeout(gravity,20),
		block: setTimeout(moveBlock,20),
		isCollise: false,
		dropRange: 10,
		score: 0
	}

	/* 游戏数据 */
	var text = {
		score : document.getElementById('gScore'),
		best : document.getElementById('gBest')
	}
	text.best.innerHTML = localStorage.getItem("flappy2048best");

	/* 随机障碍物位置 */
	var Y = function(){
			switch(Math.floor(Math.random()*3)){
				case 0: return ["15px","132px"];
				case 1: return ["15px","370px"];
				case 2: return ["250px","370px"];
			}
		}

	var bird = document.getElementById('bird');
	var blocks = document.querySelectorAll('.block');
	initBlock();

	/* 初始化位置 */
	function initBlock(){	
		var getY = Y(); /* 获取纵坐标 */
		bird.style.top = "100px";

		blocks[0].style.left = blocks[1].style.left = "500px";
		blocks[2].style.left = blocks[3].style.left = "830px";
		blocks[0].style.top = blocks[2].style.top = getY[0];
		blocks[1].style.top = blocks[3].style.top = getY[1];
	}
	

	/* 重力算法 */
	function gravity() {
		bird.style.top = bird.offsetTop + game.dropRange + "px";
		game.dropRange ++;


		if(game.playing){
			setTimeout(gravity,20);
		}
	}

	/* 碰撞判定 */
	function collision(blx,bly,bdx,bdy){
		
		if(bdy>500){
			lost(0);
			bounce(-15);
		} else if(bdy <-100){
			lost(0);
			game.dropRange = 5;
		}
		/*	底部柱子给你放点水好了。。	*/
		if(bdx+100>blx && bdx<blx+100 && bdy<bly+100 && bdy+80>bly){
			lost(1);
		}
	}
	
	/* 移动障碍物 */
	function moveBlock(){

		text.score.innerHTML = game.score;

		for(var i = 0; i < 4; i++){
			blocks[i].style.left = blocks[i].offsetLeft - 5 + "px";
			if(blocks[i].offsetLeft < -100){
				resetBlock(blocks[i],i);
			}
			/*	传入柱子和鸟的坐标	*/
			collision(blocks[i].offsetLeft, blocks[i].offsetTop, bird.offsetLeft, bird.offsetTop);

		}
		if(game.playing){
			setTimeout(moveBlock,20);
		}
	}

	/* 障碍物归位和加分 */
	function resetBlock(obj,index){
		obj.style.left = "600px";
		var getY = Y();		/* 获取纵坐标 */
		switch(index){
			case 0:{
				blocks[0].style.top = getY[0];
				blocks[1].style.top = getY[1];
			};break;
			case 3:{
				blocks[2].style.top = getY[0];
				blocks[3].style.top = getY[1];
			};break;
			default: {
				if(!game.isCollise){
					game.score++;
					getHighScore(game.score);
					renderBird(game.score);
				}
				game.isCollise = false;
			}
		}
	}

	/* 弹起鸟 */
	function bounce(num){
		game.dropRange = num;
	}

	/* 更新分数和鸟的颜色 */
	function renderBird(score){
		bird.innerHTML = score;
		if(score==0){
			bird.className = "lv1";
		} else {
			for(var i = 0; i < 12; i++){
				if(score == Math.pow(2,i)) {
					bird.className = "lv" + Math.pow(2,i);
				}
			}
		}
	}

	/*获取最高分*/
	function getHighScore(score){
		if(score>localStorage.getItem("flappy2048best")){
			localStorage.setItem("flappy2048best",score);
		}
		text.best.innerHTML = localStorage.getItem("flappy2048best");
	}
	/* 判负 */
	function lost(bump){
		game.score = 0;
		renderBird(0)

		/* 如果碰撞到柱子，则本轮不得分 */
		if(bump){
			game.isCollise = true;
		}
	}

	/* 键盘操作 */
	window.onkeydown = function(e){
		bounce(-15);
	}
