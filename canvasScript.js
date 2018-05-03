var mousePressed = false;
var lastX, lastY;
var ctx;
var canvasHeight;
var canvasWidth;
var selectedColor;
var lines = [];
var linelength = 0;
var undoArray = [];
var imgData;
var inter;
var drawingAreaX = 111;
var drawingAreaY = 11;
var	drawingAreaWidth = 267;
var	drawingAreaHeight = 200;
var	colorLayerData;
var	outlineLayerData;
var totalLoadResources = 3;
var curLoadResNum = 0;
var curColor = {
    r: 203,
    g: 53,
    b: 148
};

$(document).ready(function () {

    screen.orientation.lock('landscape');
    
    FB.init({
        appId  : '887894374746822',
        status : true, // check login status
        cookie : true, // enable cookies to allow the server to access the session
        xfbml  : true  // parse XFBML
      });

    // FB.getLoginStatus(function(response) {
    //     statusChangeCallback(response);
    // });

    $(".colorItem").click(function (ele) {
     
        $("#selColor").removeAttr("id");
        $(ele.target).attr("id", "selColor");
        selectedColor = $("#selColor").css("background-color");
        $("#selectedColor").css("color", selectedColor);
    });

    //$("canvas").width(1000).height(1500);
    //var canvas = document.getElementById("canvas");

    ////canvasHeight = "947";
    ////canvasWidth = "1988";

    ////$("#canvas").attr("width", canvasWidth);
    ////$("#canvas").attr("height", canvasHeight);
   
    ctx = document.getElementById('canvas').getContext("2d");

    initialize();

    function initialize() {
         //Register an event listener to call the resizeCanvas() function 
         //each time the window is resized.
        window.addEventListener('resize', resizeCanvas, false);
         //Draw canvas border for the first time.
        resizeCanvas();
    }

    function resizeCanvas() {
        ctx.canvas.width = $("#canvasDiv").width();
        ctx.canvas.height = $("#canvasDiv").height();
        canvasWidth = ctx.canvas.width;
        canvasHeight = ctx.canvas.height;
        
        redrawCanvas();
    }

    colorLayerData = ctx.getImageData(0,0,ctx.canvas.width,ctx.canvas.height);
    // alert(imgData);


    //ctx.canvas.width = $("#canvasDiv").width() - 300;//window.innerWidth;
    //ctx.canvas.height = $("#canvasDiv").height() - 100;//window.innerHeight;
    //ctx.height = 2000;
    //ctx.width = 1000;
    //ctx.translate(0.5, 0.5);

    //$(document).bind( "mouseup touchend", function(e){alert("hello")});

    $("#canvas").bind( "touchstart", function (e) {
        //alert("hello");      
        mousePressed = true;
        Draw(e.originalEvent.touches[0].pageX - $(this).offset().left, e.originalEvent.touches[0].pageY - $(this).offset().top, false);
    });

    $("#canvas").bind( "touchmove", (function (e) {
        if (mousePressed) {
            Draw(e.originalEvent.touches[0].pageX - $(this).offset().left, e.originalEvent.touches[0].pageY - $(this).offset().top, true);
        }
    }));

    $("#canvas").bind( "mousedown", function (e) {
        //alert("hello");
        paintAt(e.pageX, e.pageY);
        mousePressed = true;
        Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, false);
    });

    $("#canvas").bind( "mousemove", (function (e) {
        if (mousePressed) {
            Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true);
        }
    }));

    $("#canvas").bind( "touchend mouseup", (function (e) {
        if (mousePressed) {
            mousePressed = false;
            undoArray.push(linelength)
            linelength = 0;
        }
    }));

    $("#canvas").mouseleave(function (e) {
        if (mousePressed) {
            mousePressed = false;
            undoArray.push(linelength)
            linelength = 0;
        }
    });
});

function Draw(x, y, isDown) {
    if (isDown) {
        var width = parseInt($('#myRange').val());
        ctx.beginPath();
        ctx.strokeStyle = $('#selColor').css("background-color");
        //alert(parseInt($('#myRange').val()));
        ctx.lineWidth = width;/*$('#selWidth').val();*/
        ctx.lineJoin = "round";
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.closePath();       
        ctx.stroke();
        linelength++;

        //lines.push(ctx);
        var line = { strokeStyle: $('#selColor').css("background-color"), lineWidth: width, lineJoin: "round", lastX: lastX, lastY: lastY, x: x, y: y }
        lines.push(line);

        
    }
    ctx.putImageData(colorLayerData, 0, 0);
    lastX = x; lastY = y;
};

var colorMenuOpen = false;

function changeColor(ele) {

    if (colorMenuOpen) {
        //$("#colorMenu").width(0);
        $("#colorMenu").css({ left: 0 });
        $(".active").removeClass("active");
        //$(".slider").hide();
        colorMenuOpen = false;
    }

    else {
        //$("#colorMenu").width(80);
        $("#colorMenu").css({ left: 80 });
        $(".active").removeClass("active");
        $(ele).addClass("active");
        //$(".slider").show();
        colorMenuOpen = true;
    }
  
};

function undo() {
    lines.pop();
    redrawCanvas();
};

function undolastline() {
    var l = undoArray[undoArray.length - 1];
    for (var x = 0; x < l; x++){
        lines.pop();
    }
    undoArray.pop();
    redrawCanvas();
}



function redrawCanvas() {
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    var i;
    var len = lines.length;
    for (i = 0; i < len; i++) {
        
        var x = lines[i];
        //alert(x);
        
        ctx.beginPath();
        ctx.strokeStyle = x.strokeStyle;
        ctx.lineWidth = x.lineWidth;
        ctx.lineJoin = x.lineJoin;
        ctx.moveTo(x.lastX, x.lastY);
        ctx.lineTo(x.x,x.y);
        ctx.closePath();
        ctx.stroke();
    }
};

function onSignIn(googleUser) {
    // Useful data for your client-side scripts:
    var profile = googleUser.getBasicProfile();
    console.log("ID: " + profile.getId()); // Don't send this directly to your server!
    console.log('Full Name: ' + profile.getName());
    console.log('Given Name: ' + profile.getGivenName());
    console.log('Family Name: ' + profile.getFamilyName());
    console.log("Image URL: " + profile.getImageUrl());
    console.log("Email: " + profile.getEmail());
    
    // The ID token you need to pass to your backend:
    var id_token = googleUser.getAuthResponse().id_token;
    console.log("ID Token: " + id_token);
};

function facebookLogin(){

    FB.getLoginStatus(function(response){
        if (response.status === 'connected'){           
        }
        else{
            FB.login(function(response){
                if (response.status === 'connected') {
                    }
                    else {
                    }
            });
        }
    })    
};

function facebookSend(){
    var dataUrl = canvas.toDataURL();
    alert(dataUrl);
    FB.ui({
        method: 'send',
        name: 'This is a test - DO NOT BE ALARMED',
        link: 'https://anel1234.github.io/drawingGame/drawnTogether',
        picture: 'bobross.png'
    })

    // FB.ui({
    //     method: 'apprequests',
    //     // to: "",
    //     message: 'Testing the App',
    //     picture: dataUrl
    // },
    // function(response){
    //     console.log(response);
    // });
};

//#region fill
matchOutlineColor = function (r, g, b, a) {

    return (r + g + b < 100 && a === 255);
}

matchStartColor = function (pixelPos, startR, startG, startB) {

    var r = 63//outlineLayerData.data[pixelPos],
        g = 23,//outlineLayerData.data[pixelPos + 1],
        b = 101,//outlineLayerData.data[pixelPos + 2],
        a = 12//outlineLayerData.data[pixelPos + 3];

    // If current pixel of the outline image is black
    if (matchOutlineColor(r, g, b, a)) {
        return false;
    }

    r = 13;//colorLayerData.data[pixelPos];
    g = 103;//colorLayerData.data[pixelPos + 1];
    b = 43;//colorLayerData.data[pixelPos + 2];

    // If the current pixel matches the clicked color
    if (r === startR && g === startG && b === startB) {
        return true;
    }

    // If current pixel matches the new color
    if (r === curColor.r && g === curColor.g && b === curColor.b) {
        // if (r === 45 && g === 23 && b === 66) {
        return false;
    }

    return true;
}

colorPixel = function (pixelPos, r, g, b, a) {

    colorLayerData.data[pixelPos] = r;
    colorLayerData.data[pixelPos + 1] = g;
    colorLayerData.data[pixelPos + 2] = b;
    colorLayerData.data[pixelPos + 3] = a !== undefined ? a : 255;
}

floodFill = function (startX, startY, startR, startG, startB) {

    var newPos,
        x,
        y,
        pixelPos,
        reachLeft,
        reachRight,
        drawingBoundLeft = drawingAreaX,
        drawingBoundTop = drawingAreaY,
        drawingBoundRight = drawingAreaX + drawingAreaWidth - 1,
        drawingBoundBottom = drawingAreaY + drawingAreaHeight - 1,
        pixelStack = [[startX, startY]];

    while (pixelStack.length) {

        newPos = pixelStack.pop();
        x = newPos[0];
        y = newPos[1];

        // Get current pixel position
        pixelPos = (y * canvasWidth + x) * 4;

        // Go up as long as the color matches and are inside the canvas
        while (y >= drawingBoundTop && matchStartColor(pixelPos, startR, startG, startB)) {
            y -= 1;
            pixelPos -= canvasWidth * 4;
        }

        pixelPos += canvasWidth * 4;
        y += 1;
        reachLeft = false;
        reachRight = false;

        // Go down as long as the color matches and in inside the canvas
        while (y <= drawingBoundBottom && matchStartColor(pixelPos, startR, startG, startB)) {
            y += 1;

            colorPixel(pixelPos, curColor.r, curColor.g, curColor.b);

            if (x > drawingBoundLeft) {
                if (matchStartColor(pixelPos - 4, startR, startG, startB)) {
                    if (!reachLeft) {
                        // Add pixel to stack
                        pixelStack.push([x - 1, y]);
                        reachLeft = true;
                    }
                } else if (reachLeft) {
                    reachLeft = false;
                }
            }

            if (x < drawingBoundRight) {
                if (matchStartColor(pixelPos + 4, startR, startG, startB)) {
                    if (!reachRight) {
                        // Add pixel to stack
                        pixelStack.push([x + 1, y]);
                        reachRight = true;
                    }
                } else if (reachRight) {
                    reachRight = false;
                }
            }

            pixelPos += canvasWidth * 4;
        }
    }
}

paintAt = function (startX, startY) {

    var pixelPos = (startY * canvasWidth + startX) * 4,
        r = colorLayerData.data[pixelPos],
        g = colorLayerData.data[pixelPos + 1],
        b = colorLayerData.data[pixelPos + 2],
        a = colorLayerData.data[pixelPos + 3];

    if (r === curColor.r && g === curColor.g && b === curColor.b) {
        // if (r === 123 && g === 123 && b === 112) {
        // Return because trying to fill with the same color
        return;
    }

    if (matchOutlineColor(r, g, b, a)) {
        // Return because clicked outline
        return;
    }

    floodFill(startX, startY, r, g, b);

    Draw();
}