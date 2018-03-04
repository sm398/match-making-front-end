let baseURL = "http://18.219.156.62:3000/game/";
let assignURL = "http://18.219.156.62:3000/game/assign";
let userId;
var app = {};

ons.ready(function () {
    var carousel = document.addEventListener('postchange', function (event) {
        //console.log('Changed to ' + event.activeIndex)
    });
    ons.createElement('action-sheet.html', { append: true })
        .then(function (sheet) {
            app.showFromTemplate = sheet.show.bind(sheet);
            app.hideFromTemplate = sheet.hide.bind(sheet);
        });
});

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
                "                    <span class=\"list-item__title\">" +  game.players[i].name +  " </span><span class=\"list-item__subtitle\">" + game.players[i].userId + "</span>\n" +
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
                "                    <span class=\"list-item__title\">" +  game.players[i].name +  " </span><span class=\"list-item__subtitle\">" + game.players[i].userId + "</span>\n" +
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

function matchMe() {
    disableParameterButtons();
    postAssign(document.getElementById("name").innerText);
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

function postAssign(username)
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
    console.log(username);
    xmlHttp.send({name: username});
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

var onSuccess = function(position) {
    /*alert('Latitude: '          + position.coords.latitude          + '\n' +
        'Longitude: '         + position.coords.longitude         + '\n' +
        'Altitude: '          + position.coords.altitude          + '\n' +
        'Accuracy: '          + position.coords.accuracy          + '\n' +
        'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
        'Heading: '           + position.coords.heading           + '\n' +
        'Speed: '             + position.coords.speed             + '\n' +
        'Timestamp: '         + position.timestamp                + '\n');*/

    var latlng = {lat: parseFloat(position.coords.latitude), lng: parseFloat(position.coords.longitude)};
    geocoder = new google.maps.Geocoder();
    geocoder.geocode({'location': latlng}, function(results, status) {
        if (status === 'OK') {
            if (results[1]) {
                document.getElementById("location").innerText = results[0].formatted_address.split(",")[1];
            } else {
                window.alert('No results found');
            }
        } else {
            window.alert('Geocoder failed due to: ' + status);
        }
    });
};

// onError Callback receives a PositionError object
//
function onError(error) {
    alert('code: '    + error.code    + '\n' +
        'message: ' + error.message + '\n');
}

(function() {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
})();

