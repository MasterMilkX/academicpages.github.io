// Main code for Milk's PhD website
// Author: Milk + Github Copilot


//////     INITIALIZATION FUNCTIONS     //////


//initialization function called when the home page loads
function initHome(){
    fillStats();  //fill in the stats
    addBio();   //add the bio
}

//initialization function called when the publications page loads
function initPub(){
    //add the publications from the JSON file
    addJSONPubs();
}



//////      DRAGGABLE DIV MAIN CONTENT WINDOW      ////////



// Make the drag DIV elements draggable:
// Code from: https://www.w3schools.com/howto/howto_js_draggable.asp
let draggs = document.getElementsByClassName("dragDiv");
for (var i = 0; i < draggs.length; i++) {
    dragElement(draggs[i]);
}

//draggable div code
function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    let head = (elmnt.getElementsByClassName("dragDivHeader").length > 0 ? elmnt.getElementsByClassName("dragDivHeader")[0] : null);

    if (head) {
        // if present, the header is where you move the DIV from:
        head.onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

//close the div when the [_] is clicked
function minimizeWindow(min){
    let win = min.parentElement.parentElement.getElementsByClassName("dragDivContent")[0];
    if (min.innerHTML == "[-]"){
        min.innerHTML = "[□]";
        win.style.display = "none";
    }
    else{
        min.innerHTML = "[-]";
        win.style.display = "block";
    }
}




//////      MILK'S BIO CONTENT      ////////



//fill the stats with the default values provided in the json dat file
function fillStats(){
    //fetch from the json 
    let statJSON = null;
    fetch('./json_dat/stats.json')
    .then((response) => response.json())
    .then((json) =>  {statJSON = json;
        //change the values in the table
        let statList = ["pubStat","gameStat","repoStat","systemStat"];
        let statJ = ["publications","games","github","systems"];
        for (let i = 0; i < statList.length; i++){
            document.getElementById(statList[i]).innerHTML = statJSON[statJ[i]];
        }
        netStats();
    });
}



//fill in the stats table with the URL fetch requested stats
function netStats(){
    //get the github repo # stat from API
    fetch('https://api.github.com/users/MasterMilkX/repos')
    .then((response) => response.json())
    .then((json) => {
        document.getElementById("repoStat").previousSibling.innerHTML = "Public Github Repos"
        document.getElementById("repoStat").innerHTML = json.length;
    });
    
}


//add the bio from the json file 
function addBio(){
    //fetch from the json 
    let bioJSON = null;
    fetch('./json_dat/bio.json')
    .then((response) => response.json())
    .then((json) =>  {
        bioJSON = json;
    
        //setup the text for the bio
        var bioDiv = document.getElementById("bio");
        var bioText = document.createElement("p");
        bioDiv.appendChild(bioText);

        //typewrite the bio
        typeWriter(bioText, bioJSON, 20, 0);
    });
}

//show the text inside a div character by character
function typeWriter(element, bioJ, speed, type_ind) {
    let text = bioJ.bio;

    //keep writing until the text is done
    if (type_ind < text.length) {
        let nc = text.charAt(type_ind);
        //new line special symbol
        if (nc == ">"){
            element.innerHTML += "<br>";
        }
        //add a link (only works for up to 10 links)
        else if(nc == "$"){
            type_ind++;
            let ln = parseInt(text.charAt(type_ind));
            let new_link = document.createElement("a");
            new_link.href = bioJ.links[ln].url;
            new_link.target = "_blank";
            new_link.innerHTML = bioJ.links[ln].text;
            element.appendChild(new_link);
        }
        //add a normal character
        else{
            element.innerHTML += nc
        }
        type_ind++;
        setTimeout(function(){typeWriter(element,bioJ,speed,type_ind)}, speed);
    }

    //add a blinking caret to the end of the text
    else{
        var caret = document.createElement("span");
        caret.setAttribute("id", "caret");
        caret.innerHTML = "|";

        element.appendChild(caret);
        setInterval(function () {
            caret.style.opacity = (caret.style.opacity == 0 ? 1 : 0);
        }, 500);
    }
}




//////      PUBLICATIONS      ////////

//add the publications from the json file
function addJSONPubs(){
    //fetch from the json 
    let pubJSON = null;
    fetch('./json_dat/publications.json')
    .then((response) => response.json())
    .then((json) =>  {
        pubJSON = json.publications;
        console.log(pubJSON)
        //add the publications to the page
        for (let i = 0; i < pubJSON.length; i++){
            addPub(pubJSON[i]);
        }
    });
}

//add a publication to the page
function addPub(pubJ){
    //create the main div for the publication
    let pubDiv = document.createElement("div");
    pubDiv.setAttribute("class", "pubitem");

    //create the title div
    let titleDiv = document.createElement("div");
    titleDiv.setAttribute("class", "pubtitle");
    let jtit = pubJ.title;
    if (jtit.includes(":")){
        let jtit_split = jtit.split(":");
        titleDiv.innerHTML = jtit_split[0] + ":<br>" + jtit_split[1];
    }else{
        titleDiv.innerHTML = jtit;
    }
    pubDiv.appendChild(titleDiv);

    //create the abstract div
    let abstractDiv = document.createElement("div");
    abstractDiv.setAttribute("class", "pubabstract");
    abstractDiv.innerHTML = pubJ.abstract;
    pubDiv.appendChild(abstractDiv);

    //add the citations div
    let citationsDiv = document.createElement("div");
    citationsDiv.setAttribute("class", "pubcite");
    citationsDiv.innerHTML = pubJ.cite;
    pubDiv.appendChild(citationsDiv);

    //add the options div
    let optionSetDiv = document.createElement("div");
    optionSetDiv.setAttribute("class", "puboptions");
    
    //add the individual options
    let options = ["abstract", "cite", "pdf", "slides", "system", "code"];
    let opShort = ["abs", "cite", "pdf", "slide", "sys", "code"];
    for (let i = 0; i < options.length; i++){
        let op = options[i];
        if (pubJ[op] == null)
            continue;

        //create the option button div
        let optionDiv = document.createElement("div");
        optionDiv.setAttribute("class", "pubop"+opShort[i]);
        optionDiv.innerHTML = options[i].toUpperCase();

        //add th link to the option
        if(op == "abstract"){
            optionDiv.setAttribute("class","pubopabs activeOp");
            optionDiv.onclick = function(){switchAbstract(optionDiv)};
        }else if(op == "cite"){
            optionDiv.onclick = function(){switchCite(optionDiv)};
        }else{
            optionDiv.onclick = function(){gotoLink(pubJ[op])};
        }

        //add the option to the option set div
        optionSetDiv.appendChild(optionDiv);
    }
    //add the options div to the publication div
    pubDiv.appendChild(optionSetDiv);

    //add the publication to the page
    document.getElementById("pub-right").appendChild(pubDiv);


}


//switch to the abstract div window
function switchAbstract(absBut){
    let bigparent = absBut.parentElement.parentElement;
    let abs = bigparent.getElementsByClassName("pubabstract")[0];
    let cite = bigparent.getElementsByClassName("pubcite")[0];
    abs.style.display = "block";
    cite.style.display = "none"; 
    
    //change to active button
    deactiveAllBut(bigparent);
    absBut.classList.add("activeOp");
}

//switch to the citation div window
function switchCite(citeBut){
    let bigparent = citeBut.parentElement.parentElement;
    let abs = bigparent.getElementsByClassName("pubabstract")[0];
    let cite = bigparent.getElementsByClassName("pubcite")[0];
    cite.style.display = "block";
    abs.style.display = "none";

    //change to active button
    deactiveAllBut(bigparent);
    citeBut.classList.add("activeOp");
    
}

//deactivate all of the puboption buttons
function deactiveAllBut(po){
    let buts = po.getElementsByClassName("puboptions")[0].children;
    for (var i = 0; i < buts.length; i++){
        buts[i].classList.remove("activeOp");
    }
}

//opens a link in a new tab
function gotoLink(link){
    window.open(link, '_blank');
}