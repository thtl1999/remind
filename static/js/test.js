function makes(player,str){
    var ply = document.getElementById(player);
    var img = document.createElement("img");
    var txt = document.createElement("figure");
    img.setAttribute("width", "150");
    img.setAttribute("height", ply.offsetHeight/2);
    img.style.position = 'absolute';
    img.style.top = String(ply.offsetTop) + 'px';
    if (['player1','player2','player3'].includes(player))
    {
        img.setAttribute("src", "/Logo/speakl.png");
        img.style.left = String(ply.offsetWidth/2) + 'px';
    }
    else
    {
        img.setAttribute("src", "/Logo/speakr.png");
        img.style.left = String(ply.offsetLeft + ply.offsetWidth/2 - img.width) + 'px';
    }
    
    txt.style.position = 'absolute';
    txt.style.top = img.style.top;
    txt.style.left = img.style.left
    txt.innerHTML = str;
    
    document.body.appendChild(img);
    document.body.appendChild(txt);
    
    setTimeout(function() {
        img.remove();
        txt.remove();
    }, 2000);
    
    
}

function startbutton(){
    if(!ishost)
        return
    var img = document.createElement("img");
    img.setAttribute("id","gamestartbutton");
    img.addEventListener("click",startpressed);
    img.setAttribute("src", "/Logo/시작.png");
    img.setAttribute("width", "400");
    img.style.position = 'absolute';
    
    img.style.top = String(document.documentElement.clientHeight/2 - img.height/2) + 'px';
    img.style.left = String(document.documentElement.clientWidth/2 - img.width/2) + 'px';
    
    img.style.cursor = 'pointer';
    document.body.appendChild(img);
}

//startbutton();

function startpressed(img){
    document.getElementById("gamestartbutton").remove();
    start()
}



function input_Text(){
    var txt = document.getElementById("txtbox").value;

    console.log(txt);
    send(txt);
    
    document.getElementById("txtbox").value = "";
}

function enterkey(e){
    if (e.keyCode == 13) {
        input_Text();
    }
}

function removechara(pid) {
    document.getElementById(pid).style.removeProperty("background-image");
}

function removescore(pi) {
    document.getElementById(pi).innerHTML = '';

}

function assignchara(pid,imgname){
    //example) imgname = 'Character_1';, pid = 'player4';
    document.getElementById(pid).style.backgroundImage = "url('../Logo/" + imgname + ".png')";
}

function assignscore(pi, pname, score){
    // if value score is 20, set player score to 20
    //example) pi = 'p2';, pname = '김민성';
    document.getElementById(pi).innerHTML = pname + ': ' + String(score);
}

function timetick(time){
    //change timer string to time
    //example) time = 68;
    document.getElementById('timer').innerHTML = String(time);
}

function inform(msg){
    var img = document.createElement("img");
    var txt = document.createElement("div");
    img.setAttribute("width", "500");
    img.setAttribute("height", "250");
    img.style.position = 'absolute';
    img.style.top = String(document.documentElement.clientHeight/2 - img.height/2) + 'px';

    img.setAttribute("src", "../Logo/inform.png");
    img.style.left = String(document.documentElement.clientWidth/2 - img.width/2) + 'px';
    
    document.body.appendChild(img);

//    txt.style.display = "block";
//    txt.setAttribute("width", "500px");
//    txt.setAttribute("height", "250px");
    txt.style.width = '500px';
    txt.style.height = '250px';
    txt.style.position = 'absolute';
    txt.style.top = String(img.offsetTop + 70) + 'px';
    txt.style.left = img.style.left
    txt.style.fontSize = '30px';
    txt.style.textAlign = 'center';
    txt.style.wordWrap = 'break-word';
    txt.innerHTML = msg;
    
    
    document.body.appendChild(txt);
    
    setTimeout(function() {
        img.remove();
        txt.remove();
    }, 4000);
}

//sound functions
var mute = false;
function soundplay(name,loop)
{
    if (mute) return;
    //name = 'Click'; , loop = false;
    var audio = new Audio('../sound/'+ name +'.mp3');
    audio.loop = loop;
    audio.play();
    return audio;
}

var temp3 = soundplay('Music1',true);
var temp2 = document.getElementById("mutebtn");
temp2.style.cursor = 'pointer';
temp2.addEventListener("click",function(){
    console.log('?');
    if (mute)
    {
        mute = false;
        //temp3 = soundplay('Music1',true);
        temp3.muted = false;
    }
    else
    {
        mute = true;
        temp3.muted = true;
    }
    
})

//sound functions end


function streaminginput() {
    var type = 0;
    var ad = prompt("스트리밍 주소를 공유해주세요", "");
    if (ad == null || ad == "") {
        //cancel or fail
    }
    else{
        
        if (ad.indexOf('youtu.be') != -1)
        {
            type = 'youtube';
        }
        else if (ad.indexOf('twitch.tv') != -1)
        {
            type = 'twitch';
        }
        else
        {
            //error
            inform('잘못된 주소입니다');
            return;
        }
        
        
        var addlist = ad.split('/');
        var txt = addlist[addlist.length - 1];
        
        console.log(txt);
        console.log(type);

        if(type == 'youtube')
            youtube(txt);
        if(type == 'twitch')
            twitch(txt);
    }
    
}

var temp1 = document.getElementById("streambtn");
temp1.style.cursor = 'pointer';
temp1.addEventListener("click",function(){
    streaminginput();
})