"use strict";
/*global alert*/
(function ($) {
  // Number of values in the array
  var ASize = $('#arraysize').val();
  // The array of numbers.
  var theArray = [];

  // check query parameters from URL
  var params = JSAV.utils.getQueryParameter();
  if ("array" in params) { // set value of array pick if it is a param
    $('#arrayValues').val(params.array).prop("disabled", true);
  }
  
  // create a new settings panel and specify the link to show it
  var settings = new JSAV.utils.Settings($(".jsavsettings"));
  // add the layout setting preference
  var arrayLayout = settings.add("layout", {"type": "select", "options": {"bar": "Bar", "array": "Array"}, "label": "Array layout: ", "value": "bar"});
  
  var context = $("#ssperform");
  var emptyContent = $("#avcontainer").html();
  var av, // for JSAV av
    arr,  // for the JSAV array
    pseudo; // for the pseudocode display

  // Process About button: Pop up a message with an Alert
  function about() {
    var mystring = "Insertion Sort Algorithm Visualization\nWritten by ...\nCreated as part of the OpenDSA hypertextbook project.\nFor more information, see http://algoviz.org/OpenDSA\nWritten during Spring, 2012\nLast update: January, 2012\nJSAV library version " + JSAV.version();
    alert(mystring);
  }

  // Process Reset button: Reinitialize the output textbox and the AV
  function reset(flag) {
    if (av) {
      av.clearumsg();
      $("#avcontainer").unbind().html(emptyContent);
    }
    // Clear the array values field, when no params given and reset button hit
    if (flag !== true) {
      if (!$('#arrayValues').prop("disabled")) {
        $('#arrayValues').val("");
      }
    }
  }

  // Validate the user-defined array values
  function processArrayValues() {
    var i,
        num,
        msg = "Must be 5 to 16 positive integers";
    // Convert user's values to an array,
    // assuming values are space separated
    theArray = $('input[name="arrayValues"]', context).val().match(/[0-9]+/g) || [];
    if (theArray.length === 0) { // Empty field
      theArray.length = 0;
      return true;
    }
    if (theArray.length < 5 || theArray.length > 16) {
      alert(msg);
      theArray.length = 0;
      return false;
    }
    for (i = 0; i < theArray.length; i++) {
      theArray[i] = Number(theArray[i]);
      if (isNaN(theArray[i]) || theArray[i] < 0) {
        alert(msg);
        theArray.length = 0;
        return false;
      }
    }
    $('#arraysize').val(theArray.length);
    return true;
  }


  var setBlue = function (index) {
    arr.css(index, {"background-color": "#ddf" });
  };

  // Insertion sort
  function inssort() {
    var i, j;
    av.umsg("Highlighted yellow elements to the left are always sorted. We begin with the element in position 0 in the sorted portion, and we will be moving the element in position 1 (in blue) to the left until it is sorted");
    arr.highlight([0]);
    setBlue(1);
    pseudo.setCurrentLine(1);
    av.step();
    for (i = 1; i < arr.size(); i++) { // Insert i'th record
      setBlue(i);
      av.umsg("Processing element in position " + i);
      pseudo.setCurrentLine(1);
      av.step();
      av.umsg("Move the blue element to the left until it reaches the correct position");
      pseudo.setCurrentLine(2);
      av.step();
      for (j = i; (j > 0) && (arr.value(j) < arr.value(j - 1)); j--) {
        setBlue(j);
        arr.swap(j, j - 1); // swap the two indices
        av.umsg("Swap");
        pseudo.setCurrentLine(3);
        av.step();
      }
      arr.highlight(j);
    }
  }
  
  // Execute the "Run" button function
  function runIt() {
    var i;
    var newSize = $('#arraysize').val();

    if (processArrayValues()) { // if it is false, we got junk user
                                // needs to fix
      if (theArray.length === 0) { // Make a random  array
        ASize = newSize;
        theArray.length = 0; // Out with the old
        // Give random numbers in range 0..999
        for (i = 0; i < ASize; i++) {
          theArray[i] = Math.floor(Math.random() * 1000);
        }
      }
      else { // Use the values we got out of the user's list
        ASize = theArray.length;
      }
      reset(true); // Reset any previous visualization
      av = new JSAV("avcontainer"); // initialize JSAV ..

      // .. and the array. use the layout the user has selected
      arr = av.ds.array(theArray, {indexed: true, layout: arrayLayout.val()});
      for (i = 0; i < theArray.length; i++) {
        arr.css(i, {"background-color": "#eee"});
      }
      pseudo = av.code({url: "../SourceCode/Processing/Sorting/Insertionsort/Insertionsort.pde"},
                       {after: "/* *** ODSATag: Insertionsort *** */"},
                       {before: "/* *** ODSAendTag: Insertionsort *** */"});
      pseudo.setCurrentLine(0);
      av.umsg("Starting Insertion Sort");
      av.displayInit();
      inssort(0, 1);
      pseudo.setCurrentLine(4);
      av.umsg("Done sorting!");
      av.recorded(); // mark the end
    }
  }

  // Connect action callbacks to the HTML entities
  $('input[name="about"]').click(about);
  $('input[name="run"]', context).click(runIt);
  $('input[name="reset"]', context).click(reset);
}(jQuery));
