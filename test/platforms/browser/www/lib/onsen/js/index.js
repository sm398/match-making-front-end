let baseURL = "http://pc3-044-l.cs.st-andrews.ac.uk:3000/game/";
let assignURL = "http://pc3-044-l.cs.st-andrews.ac.uk:3000/game/assign";
let userId;

function pushMatchPage(game) {
    var pageNavigator = document.getElementById('pageNavigator');
    pageNavigator.pushPage('matchPage.html').then(function () {
        for(let i = 0; i < game.players.length/2; i++) {
            document.getElementById("team1").innerHTML +=
                "           <ons-list-item>\n" +
                "                <div class=\"left\">\n" +
                "                    <img class=\"list-item__thumbnail\" src=\"http://placekitten.com/g/40/40\">\n" +
                "                </div>\n" +
                "                <div class=\"center\">\n" +
                "                    <span class=\"list-item__title\">" +  game.players[i] +  " </span><span class=\"list-item__subtitle\">I'm good</span>\n" +
                "                </div>\n" +
                "            </ons-list-item>";
        }

        for(let i = game.players.length/2; i < game.players.length; i++) {
            document.getElementById("team2").innerHTML +=
                "           <ons-list-item>\n" +
                "                <div class=\"left\">\n" +
                "                    <img class=\"list-item__thumbnail\" src=\"http://placekitten.com/g/40/40\">\n" +
                "                </div>\n" +
                "                <div class=\"center\">\n" +
                "                    <span class=\"list-item__title\">" +  game.players[i] +  " </span><span class=\"list-item__subtitle\">I'm good</span>\n" +
                "                </div>\n" +
                "            </ons-list-item>";
        }

    });
}

function pushProfilePage() {
    var pageNavigator = document.getElementById('pageNavigator');
    pageNavigator.pushPage('profilePage.html').then(function () {
    });
}

function camSuccess(imgData) {
    document.getElementById("itemImageTaken").setAttribute("src", "data:image/png;base64, " + imgData);
}

function camError(error) {
    alert(error);
}

function accessCamera() {
    var options = {
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA
    };
    navigator.camera.getPicture(camSuccess, camError, options);
}

function accessGallery() {
    var options = {
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY
    };
    navigator.camera.getPicture(camSuccess, camError, options);
}

function setAddFriendButton() {
    removeLeftToolbarButton();
    addAddFriendButton();
}

function setEditProfileButton() {
    removeLeftToolbarButton();
    addEditProfileButton();
}

function addAddFriendButton() {
    var toolbar = document.getElementById("mainToolbar").getElementsByClassName("right")[0];
    toolbar.innerHTML +=
        "                <ons-toolbar-button class=\"toolbar-button\">\n" +
        "                    <ons-icon icon=\"ion-person-add\" class=\"ons-icon ion-person-add ons-icon--ion\"></ons-icon>\n" +
        "                </ons-toolbar-button>\n"
}

function addEditProfileButton() {
    var toolbar = document.getElementById("mainToolbar").getElementsByClassName("right")[0];
    toolbar.innerHTML +=
        "                <ons-toolbar-button class=\"toolbar-button\">\n" +
        "                    <ons-icon icon=\"ion-edit\" class=\"ons-icon ion-edit ons-icon--ion\"></ons-icon>\n" +
        "                </ons-toolbar-button>\n"
}

function removeLeftToolbarButton() {
    var toolbar = document.getElementById("mainToolbar").getElementsByClassName("right")[0];
    toolbar.innerHTML = "";
}

function disableParameterButtons() {
    parameterButtons = document.getElementsByClassName("parameterButton");
    for (let i = 0; i < parameterButtons.length; i++) {
        parameterButtons.item(i).setAttribute("disabled", "true");
    }
    document.getElementById("matchStatus").innerHTML = '<ons-progress-circular indeterminate></ons-progress-circular>';
}

function enableParameterButtons() {
    parameterButtons = document.getElementsByClassName("parameterButton");
    for (let i = 0; i < parameterButtons.length; i++) {
        parameterButtons.item(i).removeAttribute("disabled");
    }
    document.getElementById("matchStatus").innerHTML = '<ons-icon icon="ion-ios-people"></ons-icon>';
}

function matchMe(name) {
    this.name = name;
    disableParameterButtons();
    postAssign();
}

function fakePlayerPush() {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            //
        }
    }
    xmlHttp.open("POST", assignURL, true); // true for asynchronous
    xmlHttp.send({name: name});
}

function postAssign()
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            let game = JSON.parse(xmlHttp.response);
            userId = game.userId;
            getGame();
            console.log(game);
        }
    }
    xmlHttp.onerror = function(e) {
        enableParameterButtons();
        alert("Error: lost connection or unavailable server.");
    }
    xmlHttp.open("POST", assignURL, true); // true for asynchronous
    xmlHttp.send({name: name});
}

function getGame()
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            let game = JSON.parse(xmlHttp.response);
            console.log(game);
            if (!game.hasOwnProperty("error")) {
                pushMatchPage(game);
            }
            else {
                setTimeout("getGame()", 5000);
            }
        }
    }
    xmlHttp.open("GET", baseURL, true); // true for asynchronous
    xmlHttp.setRequestHeader("userId", userId);
    xmlHttp.send(null);
}

var prevSport = function () {
    var carousel = document.getElementById('mainCarousel');
    carousel.prev();
};

var nextSport = function () {
    var carousel = document.getElementById('mainCarousel');
    carousel.next();
};

var prevFootballType = function () {
    var carousel = document.getElementById('footballCarousel');
    carousel.prev();
};

var nextFootballType = function () {
    var carousel = document.getElementById('footballCarousel');
    carousel.next();
};

ons.ready(function () {
    var carousel = document.addEventListener('postchange', function (event) {
        //console.log('Changed to ' + event.activeIndex)
    });
});
