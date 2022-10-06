//initialization function called when the page loads
function init(){

}






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