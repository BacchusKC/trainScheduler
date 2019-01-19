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

  $("#add-train-btn").on("click", function(event) {
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
  
  // Create Firebase event for adding train to the database and a row in the html when a user adds an entry
  database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());
  
    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var destination = childSnapshot.val().destination;
    var frequency = childSnapshot.val().frequency;
    var firstTrain = childSnapshot.val().firstTrain;
  
    // Train Info
    console.log(trainName);
    console.log(destination);
    console.log(frequency);
    console.log(firstTrain);
  
    // To calculate the next train and minutes until next
    var totalMinutes = moment().diff(moment(firstTrain, "HH:mm"), "minutes");
    console.log(totalMinutes);
    var totalTrains = totalMinutes / frequency;
    console.log(totalTrains);
    var roundTrains = totalTrains.toFixed(0);
    console.log(roundTrains);
    var minutesAway = frequency - (totalMinutes - (roundTrains * frequency));
    var nextTrain = moment().add(minutesAway, 'minutes').format("ddd, MMM Do, h:mm:ss a");
    
  
    // Create the new row
    var newRow = $("<tr>").append(
      $("<td>").text(trainName),
      $("<td>").text(destination),
      $("<td>").text(frequency+" mins"),
      $("<td>").text(nextTrain),
      $("<td>").text(minutesAway+" mins"),
    );
  
    // Append the new row to the table
    $("#train-table > tbody").append(newRow);
  });
