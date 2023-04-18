var slider = document.getElementById("BPMRange");
var BPMText = document.getElementById('BPMText');
var minusButton = document.getElementById('minusButton');
var plusButton = document.getElementById('plusButton');
var playButton = document.getElementById('playButton');
var timeSignatures = document.getElementById('timeSignatures');
var beatCircleContainer = document.getElementById('beatCircleContainer');

var firstBeatAudio = new Audio('firstbeat.wav');
var strongBeatAudio = new Audio('strongbeat.wav');
var weakBeatAudio = new Audio('weakbeat.wav');

const minBPM = 30;
const maxBPM = 300;

var beatCircles;

var BPM = 120;
var BPS = 2;
var beat = 0;
var strongBeat = 0;
var strongBeats = 4;
var weakBeats = 0;
var totalBeats = 4;
var currentTimeSig = "4/4"
var sigOverEight = false;
var isPlaying = false;
var expected;
var timer;

BPMText.innerText = BPM;
updateTimeSig();
updateCircles(strongBeats, -1);

timeSignatures.oninput = function(){
    updateTimeSig();
    updateCircles(strongBeats);
    beat = totalBeats - 1;
}

function updateTimeSig(){
    beat = 0;
    strongBeat = 0;
    currentTimeSig = timeSignatures.options[timeSignatures.selectedIndex].value;

    switch (currentTimeSig){
        case "4/4":
            strongBeats = 4;
            weakBeats = 0;
            totalBeats = 4;
            break;
        case "2/4":
            strongBeats = 2;
            weakBeats = 0;
            totalBeats = 2;
            break;
        case "3/4":
            strongBeats = 3;
            weakBeats = 0;
            totalBeats = 3;
            break;
        case "5/4":
            strongBeats = 5;
            weakBeats = 0;
            totalBeats = 5;
            break;
        case "6/8":
            strongBeats = 2;
            weakBeats = 4;
            totalBeats = 6;
            break;
        case "9/8":
            strongBeats = 3;
            weakBeats = 6;
            totalBeats = 9;
            break;
        case "12/8":
            strongBeats = 4;
            weakBeats = 8;
            totalBeats = 12;
            break;
    }
    sigOverEight = (totalBeats / strongBeats) == 3;
}

function updateCircles(numCircles, filledCircle){
    beatCircleContainer.innerHTML = "";
    for(var i = 0; i < numCircles; i++){
        let div = document.createElement('div');
        if (i == 0 && i == filledCircle){
            div.classList.add('beatCircleFirst');
        } else if (i == filledCircle){
            div.classList.add('beatCircleFilled');
        } else {
            div.classList.add('beatCircle');
        }
        beatCircleContainer.appendChild(div);
    }
    beatCircles = document.getElementsByClassName("beatCircle");
}

function incrementBeat(){

    if (!sigOverEight){
        if(beat < totalBeats - 1){
            weakBeatAudio.currentTime = 0;
            weakBeatAudio.play();
            beat++;
        } else {
            firstBeatAudio.currentTime = 0;
            firstBeatAudio.play();
            beat = 0;
        }
        updateCircles(strongBeats, beat); 
    } else {
        if (((beat + 1) % (3) == 0) && beat < totalBeats - 1){
            strongBeatAudio.currentTime = 0;
            strongBeatAudio.play();
            beat++;
            strongBeat++;
            updateCircles(strongBeats, strongBeat);
        } else if(beat < totalBeats - 1){
            weakBeatAudio.currentTime = 0;
            weakBeatAudio.play();
            beat++;
        } else {
            firstBeatAudio.currentTime = 0;
            firstBeatAudio.play();
            beat = 0;
            strongBeat = 0;
            updateCircles(strongBeats, strongBeat);
        }
    }
}

plusButton.onclick = function(){
    if(BPM < maxBPM) {
        BPM++;
    }
    BPMText.innerHTML = BPM;
    slider.value = BPM;
    BPS = BPM / 60;
}

minusButton.onclick = function(){
    if(BPM > minBPM){
        BPM--;
    }
    BPMText.innerText = BPM;
    slider.value = BPM;
    BPS = BPM / 60;
}

playButton.onclick = function(){
    if(!isPlaying){
        beat = totalBeats - 1;
        isPlaying = true;
        playButton.value = "■";
        incrementBeat();
        expected = Date.now() + (1000/BPS) * (sigOverEight ? 1/2 : 1);
        timer = setTimeout(scheduleBeat, (1000/BPS) * (sigOverEight ? 1/2 : 1));
    } else {
        clearInterval(timer);
        updateCircles(strongBeats, -1);
        isPlaying = false;
        beat = 0;
        strongBeat = 0;
        playButton.value = "▸";
        
    }
}

function scheduleBeat(){
    let drift = Date.now() - expected;
    if(isPlaying){
        incrementBeat();
        expected += (1000/BPS * (sigOverEight ? 1/2 : 1)); 
        timer = setTimeout(scheduleBeat, (1000/BPS * (sigOverEight ? 1/2 : 1)) - drift);
    }
}

slider.oninput = function(){
    BPM = this.value; 
    BPMText.innerText = BPM;
    BPS = BPM / 60;
}