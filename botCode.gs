var dataSheet = new DataMap('https://docs.google.com/spreadsheets/d/1dmXWhpryRf8GN25hAnhA-54RWGOuBqyVQ9EQv-QVRrQ/edit');
var botId = "0e6787cae5614ef5f68dd94bd1";

function doPost(e) {
  var post = JSON.parse(e.postData.getDataAsString());
  var text = post.text;
  var name = post.name;
  
  //parsing through user message to find function
  if(text.toLowerCase().substring(0,7) == "!cover") {
    addList(name, text);
  } else if(text.toLowerCase().substring(0,8) == "!myList") {
    getMyList(name);
  } else if(text.toLowerCase().substring(0,11) == "!removeAll") {
    clearList(name);
  } else if(text.toLowerCase().substring(0,10) == "!removeMy") {
    removeFromMyList(name, text);
  }
  
}

// Adds to the user's list of shifts
function addList(name, text) {
  if(dataSheet.get(name) == undefined) {
    dataSheet.set(name, [text.substring(7)]);
  } else {
    var shiftList = dataSheet.get(name);
    shiftList = shiftList.push(text.substring(7));
  }
  sendText(text.substring(7) + " has been added to your list of shifts that need a cover.");
}

// Returns the user's list of shifts
function getMyList(name) {
  var shiftList = dataSheet.get(name);
  if(shiftList == undefined || shiftList[0] == undefined) {
    sendText("You haven't added any shifts you need a cover for!");
  } else {
    var retList = "";
    for(var i = 0; i < shiftList.length() - 1; i++) {
      retList += shiftList[i] + ", ";
    }
    retList += shiftList[shiftList.length()];
    sendText("Here are the shifts " + name + " needs covering: " + retList);
  }
}

// Completely clears the user's list
function clearList(name) {
  if(dataSheet.get(name) == undefined || shiftList[0] == undedfined) {
    sendText(name + ", you don't have any shifts to remove.");
  } else {
    dataSheet.set(name, []);
    sendText("Removed any shifts needed covering.");
  }
}

// Removing from calling user's list
function removeFromMyList(name, text) {
  var shiftDate = text.substring(8);
  var shiftList = dataSheet.get(name);
  var removed = false;
  if(shiftList != unedfined) {
    for(var i = 0; i < shiftList.length(); i++) {
      if(shiftList[i] == shiftDate) {
        shiftList[i] = null;
        sendText("Removed " + shiftDate + " from your list of shifts. Don't forget" +
                 " to notify a director!");
        removed = true;
      }
    }
  }
  if(!removed)
    sendText("There was no shift " + shiftDate + " to remove.");
}

function sendText(text){
  UrlFetchApp.fetch("https://api.groupme.com/v3/bots/post", {"method":"post", "payload":'{"bot_id":"' + botId + '","text":"' + text + '"}'})
}

