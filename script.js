var config = {
    apiKey: "AIzaSyC7xi_kPtoHnwkKTDcHGiad3augWZ6G9yc",
    authDomain: "train-scheduler-45c2a.firebaseapp.com",
    databaseURL: "https://train-scheduler-45c2a.firebaseio.com",
    projectId: "train-scheduler-45c2a",
    storageBucket: "train-scheduler-45c2a.appspot.com",
    messagingSenderId: "679167127614"
};

firebase.initializeApp(config);
var database = firebase.database();

$("#add-train-btn").on("click", function (event) {
    event.preventDefault();
    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var frequency = $("#frequency-input").val().trim();
    var firstTrain = moment($("#first-input").val().trim(), "HH:mm").format("X");



    // Creates local "temporary" object for holding train data
    var newTrain = {
        name: trainName,
        destination: destination,
        frequency: frequency,
        firstTrain: firstTrain
    };

    // Uploads train data to the database
    database.ref().push(newTrain);

    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#frequency-input").val("");
    $("#first-input").val("");
});

database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());
    // database.ref().once('value', function(DataSnapshot){
    //     var test = DataSnapshot.val();
    //     console.log(test);
    // });
        
    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var destination = childSnapshot.val().destination;
    var frequency2 = childSnapshot.val().frequency;
    var firstTrain2 = childSnapshot.val().firstTrain;

    // Train Info
    console.log(trainName);
    console.log(destination);
    console.log(frequency2);
    console.log(firstTrain2);

    // To calculate the next train and minutes until next
    var totalMinutes = moment().diff(moment(firstTrain2, "X"), "minutes");
    console.log(totalMinutes);
    var fixedMinutes = 1440 + totalMinutes;
    console.log(fixedMinutes);
    var totalTrains = fixedMinutes / frequency2;
    console.log(totalTrains);
    var roundTrains = Math.trunc(totalTrains);
    console.log(roundTrains);
    var minutesAway = frequency2 - (fixedMinutes - (roundTrains * frequency2));
    var nextTrain = moment().add(minutesAway, 'minutes').format("ddd, MMM Do, h:mm a");


    // Create the new row
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(destination),
        $("<td>").text(frequency2 + " mins"),
        $("<td>").text(nextTrain),
        $("<td>").text(minutesAway + " mins"),
        $("<td>").html('<button id="delete">Delete</button>')
    )
   
    // Append the new row to the table
    $("#train-table > tbody").append(newRow);
});

$(document).on("click", "#delete", function() {
    $(this).parent().parent().remove();
    // database.ref(this).parent().remove();
});

var refresh = setInterval(refreshTime, 60000);
// Create Firebase event for adding train to the database and a row in the html when a user adds an entry
function refreshTime() {
    $("#train-table > tbody").empty();
    database.ref().on("child_added", function (childSnapshot) {
        console.log(childSnapshot.val());

        // Store everything into a variable.
        var trainName = childSnapshot.val().name;
        var destination = childSnapshot.val().destination;
        var frequency2 = childSnapshot.val().frequency;
        var firstTrain2 = childSnapshot.val().firstTrain;

        // Train Info
        console.log(trainName);
        console.log(destination);
        console.log(frequency2);
        console.log(firstTrain2);

        // To calculate the next train and minutes until next
        var totalMinutes = moment().diff(moment(firstTrain2, "X"), "minutes");
        console.log(totalMinutes);
        var fixedMinutes = 1440 + totalMinutes;
        console.log(fixedMinutes);
        var totalTrains = fixedMinutes / frequency2;
        console.log(totalTrains);
        var roundTrains = Math.trunc(totalTrains);
        console.log(roundTrains);
        var minutesAway = frequency2 - (fixedMinutes - (roundTrains * frequency2));
        var nextTrain = moment().add(minutesAway, 'minutes').format("ddd, MMM Do, h:mm a");


        // Create the new row
        var newRow = $("<tr>").append(
            $("<td>").text(trainName),
            $("<td>").text(destination),
            $("<td>").text(frequency2 + " mins"),
            $("<td>").text(nextTrain),
            $("<td>").text(minutesAway + " mins"),
            $("<td>").html('<button id="delete">Delete</button>')
        );

        // Append the new row to the table
        $("#train-table > tbody").append(newRow);
    });
}
