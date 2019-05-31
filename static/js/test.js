function makes(player,str){
    var ply = document.getElementById(player);
    console.log(ply.offsetWidth);
    console.log(ply.offsetLeft);
    console.log(ply.offsetTop);
    var img = document.createElement("img");
    img.setAttribute("width", "150");
    img.setAttribute("height", ply.offsetHeight/2);
    img.style.position = 'absolute';
    img.style.top = String(ply.offsetTop) + 'px';
    if (['player1','player2','player3'].includes(player))
    {
        img.setAttribute("src", "Logo/speakl.png");
        img.style.left = String(ply.offsetWidth/2) + 'px';
    }
    else
    {
        img.setAttribute("src", "Logo/speakr.png");
        img.style.left = String(ply.offsetLeft + ply.offsetWidth/2 - img.width) + 'px';
    }
    
    document.body.appendChild(img);
    
    setTimeout(function() {
        img.remove();
    }, 2000);
    
    
}

