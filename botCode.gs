var dataSheet = new DataMap('https://docs.google.com/spreadsheets/d/1dmXWhpryRf8GN25hAnhA-54RWGOuBqyVQ9EQv-QVRrQ/edit');
var botId = "0e6787cae5614ef5f68dd94bd1";

function doPost(e) {
  var post = JSON.parse(e.postData.getDataAsString());
  var text = post.text;
  var name = post.name;
  
  if(text.toLowerCase().substring(0,7) == "!cover") {
    addList(name, text);
  } else if(text.toLowerCase().substring(0,8) == "!myList") {
    getMyList(name);
  } else if(text.toLowerCase().substring(0,11) == "!removeAll") {
    clearList(name);
  }
  
}

function addList(name, text) {
  if(dataSheet.get(name) == undefined) {
    dataSheet.set(name, [text.substring(7)]);
  } else {
    var shiftList = dataSheet.get(name);
    shiftList = shiftList.push(text.substring(7));
  }
  sendText(text.substring(7) + " has been added to your list of shifts that need a cover.");
}

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

function clearList(name) {
  if(dataSheet.get(name) == undefined || shiftList[0] == undedfined) {
    sendText(name + ", you don't have any shifts to remove.");
  } else {
    dataSheet.set(name, []);
    sendText("Removed any shifts needed covering.");
  }
}

function sendText(text){
  UrlFetchApp.fetch("https://api.groupme.com/v3/bots/post", {"method":"post", "payload":'{"bot_id":"' + botId + '","text":"' + text + '"}'})
}

