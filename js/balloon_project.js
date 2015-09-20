var boardWidth = 9;
var boardHeight= 9;
var balloonWidth = 60;
var balloonHeight= 60;
var pixelWidth = 1 + (boardWidth * balloonWidth);
var pixelHeight= 1 + (boardHeight * balloonHeight);

var gCanvasElement;
var gDrawingContext;

var balloonArray;
var isAddMode = true;
var hexColor = "#66FF00";
var projectVersion = 1;
var projectName = "Meu Projeto";

function Balloon(row, column, color) {
    this.row = row;
    this.column = column;
	this.color = color; 
}

function initialize() {
    canvasElement = document.createElement("canvas");
	canvasElement.id = "balloonCanvas";
	document.body.appendChild(canvasElement);
	
    gCanvasElement = canvasElement;
    gCanvasElement.width = pixelWidth;
    gCanvasElement.height = pixelHeight;
    gCanvasElement.addEventListener("click", canvasOnClick, false);
    gDrawingContext = gCanvasElement.getContext("2d");
	
	document.getElementById('fileinput').addEventListener('change', readFile, false);
	
	balloonArray = new Array();
    drawBoard();
}

function getCursorPosition(e) {
    var x;
    var y;
	
    if (e.pageX != undefined && e.pageY != undefined) {
		x = e.pageX;
		y = e.pageY;
    }
    else {
		x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
	
    x -= gCanvasElement.offsetLeft;
    y -= gCanvasElement.offsetTop;
    x = Math.min(x, boardWidth * balloonWidth);
    y = Math.min(y, boardHeight * balloonHeight);
	
    var balloon = new Balloon(Math.floor(y/balloonHeight), Math.floor(x/balloonWidth), hexColor);
    return balloon;
}

function canvasOnClick(e) {
    var Balloon = getCursorPosition(e);
    for (var i = 0; i < balloonArray.length; i++) {
		if ((balloonArray[i].row == Balloon.row) && (balloonArray[i].column == Balloon.column)) {
			clickOnBalloon(i);
			return;
		}
    }
    clickOnEmptyCell(Balloon);
}

function clickOnBalloon(balloonIndex) {
	if (isAddMode) {
		balloonArray[balloonIndex].color = hexColor;
		drawBoard();
	} else {
		balloonArray.splice(balloonIndex, 1);
		drawBoard();
	}
}

function clickOnEmptyCell(balloon) {
	if(isAddMode){
		balloonArray.push(new Balloon(balloon.row, balloon.column, hexColor));
		drawBoard();
	}
	return;
}

function drawBoard() {
    
    gDrawingContext.clearRect(0, 0, pixelWidth, pixelHeight);

    gDrawingContext.beginPath();
    
    /* vertical lines */
    for (var x = 0; x <= pixelWidth; x += balloonWidth) {
		gDrawingContext.moveTo(0.5 + x, 0);
		gDrawingContext.lineTo(0.5 + x, pixelHeight);
    }
    
    /* horizontal lines */
    for (var y = 0; y <= pixelHeight; y += balloonHeight) {
		gDrawingContext.moveTo(0, 0.5 + y);
		gDrawingContext.lineTo(pixelWidth, 0.5 +  y);
    }
    
    /* draw it */
    gDrawingContext.strokeStyle = "#ccc";
    gDrawingContext.stroke();
    
    for (var i = 0; i < balloonArray.length; i++) {
		drawBalloon(balloonArray[i]);
    }
}

function drawBalloon(balloon) {
    var x = (balloon.column * balloonWidth) + (balloonWidth/2);
    var y = (balloon.row * balloonHeight) + (balloonHeight/2);
    var radius = (balloonWidth/2) - (balloonWidth/20);
    gDrawingContext.beginPath();
    gDrawingContext.arc(x, y, radius, 0, Math.PI*2, false);
    gDrawingContext.closePath();
    gDrawingContext.strokeStyle = "#000";
    gDrawingContext.stroke();
	gDrawingContext.fillStyle = balloon.color;
	gDrawingContext.fill();
}

function addColumn() {
	boardWidth++;
	pixelWidth = 1 + (boardWidth * balloonWidth);
	gCanvasElement.width = pixelWidth;
	drawBoard();
}

function subtractColumn(){
	if (boardWidth == 1) {
		return
	} else {
		boardWidth--;
		pixelWidth = 1 + (boardWidth * balloonWidth);
		gCanvasElement.width = pixelWidth;
		drawBoard();
	}
}

function addRow() {
	boardHeight++;
	pixelHeight = 1 + (boardHeight * balloonHeight);
	gCanvasElement.height = pixelHeight;
	drawBoard();
}

function subtractRow(){
	if (boardHeight == 1) {
		return;
	} else {
		boardHeight--;
		pixelHeight = 1 + (boardHeight * balloonHeight);
		gCanvasElement.height = pixelHeight;
		drawBoard();
	}
}

function setSelectedHexColor(element) {
	hexColor = element.value;
}

function changeMode(element){
	if(isAddMode) {
		isAddMode = false;
		element.innerHTML = "Remover";	
	} else {
		isAddMode = true;
		element.innerHTML = "Adicionar";	
	}
}

function isInCoordinates(row, column) {
	for(var i = 0; i < balloonArray.length; i++){
		if(balloonArray[i].row == row && balloonArray[i].column == column){
			return true;
		}
	}
	return false;
}

function fillEmptySpaces(){
	for (var i = 0; i < boardHeight; i++) {
		for (var j = 0; j < boardWidth; j++) {
			if (!isInCoordinates(i, j)) {
				balloonArray.push(new Balloon(i, j, hexColor));
			};
		}
	}
	drawBoard();
}

function eraseAll(){
	balloonArray = new Array();
	drawBoard();
}

function saveToFile(){
	if (balloonArray.length == 0) {
		return;
	}
	if (projectName == "Meu Projeto") {
		var name = prompt("De um nome para seu projeto:", "Meu Projeto");
		if (name != null) {
			projectName = name;
		} else {
			return;
		}
	} else {
		projectVersion = parseInt(projectVersion) + 1;
	}
	var fileContent = projectName + ";" + projectVersion;
	fileContent += "|" + boardWidth + ";" + boardHeight;
	for(var i = 0; i < balloonArray.length; i++){
		fileContent+= "|" + balloonArray[i].row + ";" + balloonArray[i].column + ";" + balloonArray[i].color;
	}
	var blob = new Blob([fileContent], {type: "text/plain;charset=utf-8"});
	saveAs(blob, projectName + "_" + projectVersion + ".ballpro");
}

function saveToImage() {
	if (balloonArray.length == 0) {
		return;
	}
	if (projectName == "Meu Projeto") {
		var name = prompt("De um nome para sua imagem:", "Meu Projeto");
		if (name != null) {
			projectName = name;
		} else {
			return;
		}
	}
	var canvas = document.getElementById("balloonCanvas");
	canvas.toBlob(function(blob){
		saveAs(blob, projectName + "_" + projectVersion + ".png");
	});
}

function readFile(event){
	if (window.File && window.FileReader && window.FileList && window.Blob) {
		var file = event.target.files[0]; 
		if (file) {
			var fileReader = new FileReader();
			fileReader.onload = function(e) { 
				renderDataString(e.target.result);
			}
			fileReader.readAsText(file);
		} else { 
			alert("Falha na leitura do arquivo.");
		}
	} else {
		alert('Seu navegador não suporta a leitura de arquivos.');
	}
}

function renderDataString(dataString){
	var dataStringArray = dataString.split("|");
	
	var projectData = dataStringArray[0].split(";");
	projectName = projectData[0];
	projectVersion = projectData[1];
	
	var canvasSizeArray = dataStringArray[1].split(";");
	boardWidth = canvasSizeArray[0];
	boardHeight= canvasSizeArray[1];
	pixelWidth = 1 + (boardWidth * balloonWidth);
	pixelHeight= 1 + (boardHeight * balloonHeight);	
	gCanvasElement.width = pixelWidth;
    gCanvasElement.height = pixelHeight;
	
	balloonArray = new Array();
	for(var i = 2; i < dataStringArray.length; i++){
		var ballon = dataStringArray[i].split(";");
		balloonArray.push(new Balloon(ballon[0], ballon[1], ballon[2]));
	}
	drawBoard();
}