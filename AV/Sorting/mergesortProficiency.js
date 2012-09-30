"use strict";
/*global alert*/
(function ($) {
  // Process help button: Give a full help page for this activity
  // We might give them another HTML page to look at.
  function help() {
    window.open("MSprofHelp.html", 'helpwindow');
  }

  // Process about button: Pop up a message with an Alert
  function about() {
    alert("Mergesort Proficiency Exercise\nWritten by Daniel Breakiron\nCreated as part of the OpenDSA hypertextbook project.\nFor more information, see http://algoviz.org/OpenDSA\nSource and development history available at\nhttps://github.com/cashaffer/OpenDSA\nCompiled with JSAV library version " + JSAV.version());
  }

  /* ********************************************
   *  MERGESORT PROFICIENCY EXERCISE CODE       *
   ******************************************* */
	
  // Variables used by "setPosition()"
  var rowHeight = 80;        // Space required for each row to be displayed
  var canvasWidth = 800;     // The width of the display
  var blockWidth = 47;       // The width of an array element
	
  // Variables used to keep track of the index and array of
  // currently selected element
  var mergeValueIndex = -1;
  var mergeValueArr = null;
		
  var arraySize = 10,
      initialArray = [],
      userAnswerValue = [],
      userAnswerDepth = [],
      av = new JSAV($("#container"));

  av.recorded();   // we are not recording an AV with an algorithm
	
  /**
   * Processes the reset button
   * - Clears existing arrays
   * - Generates a new set of random numbers to sort
   * - Initializes the arrays the user will use to merge
  */
  function initialize() {
    // Clear all existing arrays
    $("#arrays").html("");

    // Generate random numbers for the exercise
    initialArray = [];
    userAnswerValue = [];
    userAnswerDepth = [];
    for (var i = 0; i < arraySize; i++) {
      var randomVal = Math.floor(Math.random() * 100);
      initialArray[i] = randomVal;
      userAnswerValue[i] = randomVal;
    }

    // Dynamically create arrays
    initArrays(0, initialArray.length - 1, 1, 1, userAnswerDepth);
		
    // Reset the merge variables
    resetMergeVars();

    // Create arrays to store the user's answers and hide it because
    // it simply maintains state and is not used for display purposes
    // Need to record the order of the values and how deep in the
    // recursion they are in order to ensure a correct answer
    userAnswerValue = av.ds.array(userAnswerValue);
    userAnswerValue.hide();
    userAnswerDepth = av.ds.array(userAnswerDepth);
    userAnswerDepth.hide();

    av.umsg("Directions: Click on a numbered block to select it.  Then click on an empty block where it should be placed.");
    av.forward();
    av._undo = [];
    return [userAnswerValue, userAnswerDepth];
  }

  /**
   * Creates the model solution which is used for grading the exercise
   * - We must track the value at each horizontal position and vertical
   *   position (depth) to ensure each element is sorted in the correct order
  */
  function modelSolution(jsav) {
    var modelArr = jsav.ds.array(initialArray, {indexed: true, layout: "array"});
    var depth = 1;
    var modelDepthArr = [];
    initDepth(0, initialArray.length - 1, depth, modelDepthArr);
    modelDepthArr = jsav.ds.array(modelDepthArr,
                                  {indexed: true, layout: "array"});
    jsav.displayInit();
		
    var temp = [];
    mergeSort(jsav, modelArr, temp, modelDepthArr, 0,
              initialArray.length - 1, depth);
    modelDepthArr.element.css({"top": rowHeight + "px"});
    return [modelArr, modelDepthArr];
  }
	
  // Using continuous mode slows the exercise down considerably
  // (probably because it has to check that all the arrays are correct)
  var exercise = av.exercise(modelSolution, initialize,
                   {css: "background-color"}); //{feedback: "continuous", fixmode: "undo"}
  exercise.reset();
    
  /**
   * Dynamically and recursively create the necessary arrays
   * Initialize all single element arrays to contain the appropriate
   * numbers from the initialArray and all other arrays to be empty
  */
  function initArrays(l, r, level, column) {
    var numElements = r - l + 1;
    var contents = new Array(numElements);
		
    // Set the contents for single element arrays
    if (numElements === 1) {
      contents = [initialArray[l]];
    }
		
    // Dynamically create and position arrays
    var arr = av.ds.array(contents, {indexed: true, center: false,
                                      layout: "array"});
    // Set the ID for the array
    arr.element.attr("id", "array_" + level + "_" + column + "_" + l);
    setPosition(arr, level, column);
    // Attach the click handler to the array
    arr.click(function (index) { clickHandler(this, index); });

    if (l === r) {
      userAnswerDepth[l] = level;
      return;
    }
		
    var mid = Math.floor((l + r) / 2);
    // Recurse, passing the appropriate arguments necessary for
    // setPosition() to the next function call
    initArrays(l, mid, level + 1, 2 * column - 1, userAnswerDepth);
    initArrays(mid + 1, r, level + 1, 2 * column, userAnswerDepth);
  }
    
  /**
   * Calculates and sets the appropriate 'top' and 'left' CSS values based
   * on the specified array's level of recursion, column number and the
   * number of elements in the array
   *
   * arr - the JSAV array to set the 'top' and 'left' values for
   * level - the level of recursion, the full-size array is level 1
   * column - the array's column number in the current row
  */
  function setPosition(arr, level, column) {
    // Calculate the number of arrays in the current row
    var numArrInRow = Math.pow(2, level - 1);

    // Calculate the left value of the current array by dividing
    // the width of the canvas by twice the number of arrays that should
    // appear in that row: (canvasWidth / (2 * numArrInRow))
    // Odd multiples of the resulting value define a line through the center
    // of each array in the row and are found using the formula (2 * column - 1)
    // Note: while it is not used, even multiples define the center between
    // two consecutive arrays. Since we want the left value rather than the
    // center value of each array we calculate the length each array
    // (blockWidth *  arr.size()), divide this value in half and
    // subtract it from the center line to find the left value
    var left = (canvasWidth / (2 * numArrInRow)) * (2 * column - 1) -
               (blockWidth * arr.size() / 2);
    var top = rowHeight * (level - 1);

    // Set the top and left values so that all arrays are spaced properly
    arr.element.css({"left": left, "top": top});
  }
    
  // Initialize the modelDepthArray by calculating the starting depth
  // of each number
  function initDepth(l, r, depth, depthArray) {
    if (l === r) {
      depthArray[l] = depth;
      return;
    }
		
    var mid = Math.floor((l + r) / 2);
    // Recurse, passing the appropriate arguments necessary for
    // setPosition() to the next function call
    initDepth(l, mid, depth + 1, depthArray);
    initDepth(mid + 1, r, depth + 1, depthArray);
  }

  // Generate the model answer (called by modelSolution())
  function mergeSort(jsav, array, temp, depthArray, l, r, depth) {
    // Record the depth and return when list has one element
    if (l === r) {
      depthArray.value(l, depth);
      return;
    }
		
    // Select midpoint
    var mid = Math.floor((l + r) / 2);
		
    // Mergesort first half
    mergeSort(jsav, array, temp, depthArray, l, mid, depth + 1);
    // Mergesort second half
    mergeSort(jsav, array, temp, depthArray, mid + 1, r, depth + 1);
		
    // Copy subarray into temp
    for (var i = l; i <= r; i++) {
      temp[i] = array.value(i);
    }

    // Do the merge operation back to the array
    var i1 = l;
    var	i2 = mid + 1;
    for (var curr = l; curr <= r; curr++) {
      if (i1 === mid + 1) {          // Left sublist exhausted
        array.value(curr, temp[i2++]);
      }
      else if (i2 > r) {             // Right sublist exhausted
        array.value(curr, temp[i1++]);
      }
      else if (temp[i1] < temp[i2]) { // Get smaller
        array.value(curr, temp[i1++]);
      }
      else {
        array.value(curr, temp[i2++]);
      }
			
      // Update the depth of each number being merged
      depthArray.value(curr, depth);
      jsav.stepOption("grade", true);
      jsav.step();
    }
    return array;
  }

  // Click handler for all array elements
  function clickHandler(arr, index) {
    if (mergeValueIndex === -1) { // No element is currently selected,
                                  // select the current element
      // Don't let the user select an empty element
      if (arr.value(index) === "") { return; }
      arr.highlight(index);
      mergeValueArr = arr;
      mergeValueIndex = index;
      return;
    }
    else if (arr === mergeValueArr && index === mergeValueIndex) {
      // Deselect the currently selected element
      resetMergeVars();
    }
    else if (arr !== mergeValueArr) { // Decide how to handle a selected element
      // Don't let the user overwrite a merged element
      if (arr.value(index) !== "") { return; }
      var arrLevel = getLevel(arr);
      var mvaLevel = getLevel(mergeValueArr);
			
      // Ensure the user only merges one level up, not down or too far up
      if (arrLevel === mvaLevel - 1) {
	// Complete merge by setting the value of the current element
        // to the stored value
        arr.value(index, mergeValueArr.value(mergeValueIndex));
				
	// Update the value in the userAnswerValue array and the depth
        // in the userAnswerDepth array
        var usrAnsIndex = findUsrAnswerIndex(arr, index);
        userAnswerValue.value(usrAnsIndex, arr.value(index));
        userAnswerDepth.value(usrAnsIndex, arrLevel);

        if (mergeValueArr !== null && mergeValueIndex > -1) {
          // Clear values the user has already merged
          mergeValueArr.value(mergeValueIndex, "");
					
          // Hide arrays once the user empties them
          if (mergeValueArr.isEmpty()) {
            mergeValueArr.hide();
          }
        }
				
	// Reset the merge variables so we have a clean state for an undo
        resetMergeVars();
				
	// Mark this as a step to be graded and a step that can be undone
        // (continuous feedback)
        exercise.gradeableStep();
      }
      else {
	// Deselect the current element, if the user is trying to merge down
        // rather than up
        resetMergeVars();
      }
    }
  }
	
  // Convenience function to reset the merge variables
  function resetMergeVars() {
    if (mergeValueArr !== null) {
      // Deselect an element after it is merged or if it is clicked again
      mergeValueArr.unhighlight(mergeValueIndex);
    }
		
    // Reset so the next element can be merged
    mergeValueArr = null;
    mergeValueIndex = -1;
  }
	
  /**
   * Given an array and an index in that array, calculates the
   * corresponding position in the userAnswerValue array
   * - The index (starting at 0) within a given row (level) of the
   *   currently selected element
   * - Used to update the userAnswerValue array each time an element is moved
  */
  function findUsrAnswerIndex(arr, idx)	{
    return parseArrId(arr)[2] + idx;
  }
    
  /**
   * Return the recursion level of the given array
   * Used to ensure a user only merges an element into an array
   * directly above the current one, can't merge down or too far up
  */
  function getLevel(arr) {
    return parseArrId(arr)[0];
  }
	
  /**
   * Parses the level and column from the specified array's ID attribute
   * - Expects array names matching the following pattern: 'array_\d+_\d+_\d+'
   *   where the first number is the level, the second number is the column
   *   [see setPosition()]
   *   and the third is the offset between indices in the given array and
   *   indices in the userAnswerValue array
  */
  function parseArrId(arr) {
    var id = arr.element.attr("id");
    var args = id.split("_");
    var level = parseInt(args[1], 10);
    var column = parseInt(args[2], 10);
    var arrOffset = parseInt(args[3], 10);
    return [level, column, arrOffset];
  }
    
  // Extend the JSAV array with an isEmpty method that returns true
  // if the array contains no values
  JSAV._types.ds.AVArray.prototype.isEmpty = function () {
    for (var i = 0; i < this.size(); i++) {
      if (this.value(i) !== "") { return false; }
    }
    return true;
  };
		
  // Extend the JSAV array with a toString method for visual inspection
  // of the array --  Useful for debugging
  JSAV._types.ds.AVArray.prototype.toString = function () {
    var size = this.size();
    var str = '[';
		
    for (var i = 0; i < size; i++) {
      str += this.value(i);
      if (i < size - 1)	{
        str += ', ';
      }
    }
    return str + ']';
  };
		
  // DEBUGGING function - toString function used to inspect JavaScript objects
  function inspect(obj) {
    var str = '';
    var prop;
    for (prop in obj) {
      str += prop + " value :" + obj[prop] + "\n";
    }
    return str;
  }

  $('input[name="help"]').click(help);
  $('input[name="about"]').click(about);
}(jQuery));