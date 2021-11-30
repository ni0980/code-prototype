/* 
This sketch uses a lot of code that was written by Doug Whitton that I'm not entirely sure I understand, 
but that is necessary in connecting the Arduino to a live browser.

I've added some basic graphics and sounds to the code, the potentionmeter and the light sensor are used to change the colour of the background while the button draws an "explosion" of circles.
*/

let playing = false;
let serial;
let latestData = "waiting for data"; // you'll use this to write incoming data to the canvas
let splitter;
let delimiter1 = 0,
    delimiter2 = 0,
    delimiter3 = 0;
let song, song2;
let step1, step2, step3;

function setup() {

    createCanvas(windowWidth, windowHeight);

   
    serial = new p5.SerialPort();
    serial.list();
    console.log("serial.list()   ", serial.list());
    serial.open("COM3");
    serial.on('connected', serverConnected);
    serial.on('list', gotList);
    serial.on('data', gotData);
    serial.on('error', gotError);
    serial.on('open', gotOpen);
    song = createAudio('assets/assets_sounds_bubbles.mp3');
    song2 = createAudio('assets/easy.mp3');

}
////////////////////////////////////////////////////////////////////////////
// End serialport callbacks
///////////////////////////////////////////////////////////////////////////

// We are connected and ready to go
function serverConnected() {
    console.log("Connected to Server");
}

// Got the list of ports
function gotList(thelist) {
    console.log("List of Serial Ports:");
    // theList is an array of their names
    for (var i = 0; i < thelist.length; i++) {
        // Display in the console
        console.log(i + " " + thelist[i]);
    }
}

// Connected to our serial device
function gotOpen() {
    console.log("Serial Port is Open");
}

// Uh oh, here is an error, let's log it
function gotError(theerror) {
    console.log(theerror);
}

// There is data available to work with from the serial port
function gotData() {
    var currentString = serial.readLine(); // read the incoming string
    trim(currentString); // remove any trailing whitespace
    if (!currentString) return; // if the string is empty, do no more
    console.log("currentString  ", currentString); // println the string
    latestData = currentString; // save it for the draw method
    console.log("latestData" + latestData); //check to see if data is coming in
    splitter = split(latestData, ','); // split each number using the comma as a delimiter
    //console.log("splitter[0]" + splitter[0]); 
    delimiter1 = splitter[0]; //put the first sensor's data into a variable
    delimiter2 = splitter[1];
    delimiter3 = splitter[2];
}

// We got raw data from the serial port
function gotRawData(thedata) {
    println("gotRawData" + thedata);
}

function draw() {
    if (delimiter3 > 1) {
        background(delimiter2, 200, 0);
    }
    if (delimiter3 < 1) {
        background(0, 200, 255);
        playTex();
    }
    textSize(14);
    text("", windowWidth / 2 - 75, 10);
    playFeet();
}

function playFeet() {
    if (delimiter1 == 1) {
        song.loop();
        drawFootprint();
    }
    if (delimiter1 == 0) {
        song.stop();
    }
};

function playTex() {
    song2.loop();
    fill(255);
    textSize(40);
    textAlign(CENTER);
    text("Don't be scared", windowWidth / 2, windowHeight / 2);
};

function drawFootprint() {
    for (let i = 0; i < 10; i++) {
        step1 = Math.floor(Math.random() * windowWidth + 50);
        step2 = Math.floor(Math.random() * windowHeight) + 50;
        step3 = Math.floor(Math.random() * 100) + 10;
        fill(100, 100 + step3, 100 + step1);
        noStroke();
        circle(step1, step2, step3);
    }
};
