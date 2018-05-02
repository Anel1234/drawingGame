﻿var mousePressed = false;
var lastX, lastY;
var ctx;
var canvasHeight;
var canvasWidth;
var selectedColor;
var lines = [];
var linelength = 0;
var undoArray = [];
//var inter;

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
        redrawCanvas();
    }

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
