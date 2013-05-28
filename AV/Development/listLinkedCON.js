"use strict";
// Various functions and variables that will be used by all of the
// following sections of the tutorial.

// The various arrays to start sweeps with or display
var tempArr = [10];
// List node width = min-width + padding-right
var nodeWidth = 42;
var nodeGap = 25;

//Linked list insertion
(function ($) {
  var av = new JSAV("listLinkedCON1");
  //pseudocode
  var pseudo = av.code({url: "../../../SourceCode/Processing/Lists/LList.pde",
                       lineNumbers: false,
                       startAfter: "/* *** ODSATag: LListInsert *** */",
                       endBefore: "/* *** ODSAendTag: LListInsert *** */"});
  // Left margin of the JSAV List
  var leftMargin = 5;
  // Create an list object under control of JSAV library
  var l = av.ds.list({"nodegap": 25, "center": false, left: leftMargin});
  
  //create two hidden arrays for ".copyValue" animation
  tempArr[0] = ""; 
  var arr = av.ds.array(tempArr, 
            {indexed: true, layout: "array"});
  arr.hide();  
  var cpyArr = [10]; 
  var arr1 = av.ds.array(cpyArr, 
            {indexed: true, layout: "array"});
  arr1.hide();

  //initialize the link list
  av.umsg("The linked list before insertion");
  l.addFirst("15")
   .addFirst(12)
   .addFirst(23)
   .addFirst("20");
  l.layout();
  l.css({top: 50, left: leftMargin});

  //Left margin of bar1
  var bar1Offset = leftMargin + 2 * nodeWidth + 1.5 * nodeGap;
  //Vertical bar in 1st, 2nd, 3rd and 4th step
  var bar1 = av.g.line(bar1Offset, 50, bar1Offset, 80,
		{"stroke-width": 1, "stroke":"#000"});
  //Left margin of "label"
  var labelOffset = leftMargin + nodeWidth * 2 + nodeGap - 4;
  var labelLeftMargin = leftMargin + nodeWidth + 10;
  //Label "curr" and arrow in 1st step
  var label = av.label("curr", 
	          {before: arr, left: labelLeftMargin, top: 3, "font-size":"20px"});
  var arrowLeftMargin = labelLeftMargin + 12;
  //Arrow pointing to "curr" in 1st step
  var arrow = av.g.line(arrowLeftMargin, 25, arrowLeftMargin + 20, 45,
	          {"arrow-end": "classic-wide-long", "opacity": 100,"stroke-width": 2});
  
  //Left margin of arrow2 object
  var arrow2LeftMargin = leftMargin + nodeWidth * 2 + nodeGap - 2;
  //Horizontal arrow in the 4rd step
  var arrow2= av.g.line(arrow2LeftMargin, 65, arrow2LeftMargin + 93, 65,{"arrow-end": "classic-wide-long", "opacity": 0,"stroke-width": 2});

  //Left margin of bar2 in step 4
  var bar2LeftMargin = bar1Offset;
  //Vertical bar in 4th step
  var bar2 = av.g.line(bar2LeftMargin, 80, bar2LeftMargin, 110,
	         {"stroke-width": 1, "stroke":"#000"});	
  bar2.hide();
  pseudo.highlight(1);
  av.displayInit();
    
  //step 2
  var n3 = l.newNode("");	
  // Set the position for the new node
  n3.css({top: 60, left: nodeWidth * 2 + nodeGap - 7}); 
  av.umsg("create a new link node");
  //Copy 10 to the new link node   
  av.effects.copyValue(arr, 0, n3);
  n3.highlight();
  pseudo.unhighlight(1);
  pseudo.highlight(2);
  av.step();
  
    //step 3
  av.umsg("copy current.element() to the new node");
  //Copy 10 to the new link node   
  av.effects.copyValue(l.get(1), n3);
  av.step();

  //step 4
  var node = l.get(1).next();    
  l.get(1).edgeToNext().hide();
  l.get(1).next(n3);	
  n3.next(node);
  n3.unhighlight();
  l.layout({updateTop: false}); // control that top coordinate of nodes should not be recalculated
  l.css({left: leftMargin});  
  l.get(3).highlight();  
  arrow2.show();
  av.umsg(" the next field of the new list node is assigned to point to the current node (the one after the node that curr points to).");
  av.step();

  //step 5
  l.get(1).highlight();
  l.get(3).unhighlight();
  l.get(1).next(n3).edgeToNext().show();	
  arrow2.hide();
  bar1.hide();
  bar2.show();
  av.umsg("the next field of node pointed to by curr is assigned to point to the newly inserted node.");
  av.step();

  //step 6
  l.get(1).unhighlight();
  bar2.hide();
  bar1.show();    
  n3.css({top: 0});
  l.get(2).highlight();
  av.umsg("The new link node is in its correct position in the list");
  l.layout();
  av.step();

  //step 7
  av.effects.copyValue(arr1, 0, l.get(2));
  //l.layout();
  av.umsg("The value of the new link node is set to 10");
  pseudo.unhighlight(2);
  pseudo.highlight(3);
  av.step();

  //step 8
  av.umsg("Increase the list size by 1");
  l.get(2).unhighlight();
  pseudo.unhighlight(3);
  pseudo.highlight(5);
  av.step();
  av.recorded();
}(jQuery));

//Linked list deletion
(function ($) {
  var av = new JSAV("listLinkedCON2");
  //pseudocode
  var pseudo = av.code({url: "../../../SourceCode/Processing/Lists/LList.pde",
                       lineNumbers: false,
                       startAfter: "/* *** ODSATag: LListRemove *** */",
                       endBefore: "/* *** ODSAendTag: LListRemove *** */"});
  // Left margin of the JSAV List
  var leftMargin = 5;
  var l = av.ds.list({"nodegap": 25, "center": false, "left": leftMargin});
  //create a the hidden array
  var arr = av.ds.array(tempArr, {indexed: true, layout: "array"});
  arr.hide();

  //Left margin of bar1 in step 1
  var bar1LeftMargin = leftMargin + nodeWidth * 2 + nodeGap * 1.5;
  //vertical bar in 1st step
  var bar1 = av.g.line(bar1LeftMargin, 50, bar1LeftMargin, 80,
	         {"stroke-width": 1, "stroke":"#000"});

  //Left margin of label in step 1
  var labelLeftMargin = leftMargin + nodeWidth + 10;
  //label "curr" and arrow in the 1st step
  var label = av.label("curr", 
	          {before: arr, left: labelLeftMargin, top: 0, "font-size":"20px"});
  //Left margin of arrow in step 1
  var arrowLeftMargin = labelLeftMargin + 12;
  //arrow pointing to "curr" in the 1st step
  var arrow = av.g.line(arrowLeftMargin, 25, arrowLeftMargin + 20, 45,
	          {"arrow-end": "classic-wide-long", "opacity": 100,"stroke-width": 2});

  //Left margin of labelIt in the 3rd step
  var labelItLeftMargin = leftMargin + nodeGap + nodeWidth * 2 - 40;
  //label "it" and arrow in the 3rd step
  var labelIt = av.label("it", 
	            {before: arr, left: labelItLeftMargin, top: 104, "font-size":"20px"});
  //Left margin of arrowIt the 3rd step
  var arrowItLeftMargin = labelItLeftMargin + 18;
  var arrowIt = av.g.line(arrowItLeftMargin, 105, arrowItLeftMargin + 50, 75,
	            {"arrow-end": "classic-wide-long", "opacity": 0,"stroke-width": 2});
  labelIt.hide();
  //Left margin of dashline in the 4th step
  var dashlineLeftMargin = leftMargin + nodeGap + nodeWidth * 2 - 3;
  //dashline in the 4th step
  var dashline = av.g.polyline([[dashlineLeftMargin, 66], 
	  [dashlineLeftMargin + 13, 66], [dashlineLeftMargin + 13, 30],[dashlineLeftMargin + 83,30],[dashlineLeftMargin + 83,66],[dashlineLeftMargin + 101,66]], {"arrow-end":"classic-wide-long", "opacity":0, "stroke-width":2,"stroke-dasharray":"-"});
  var bar4 = av.g.line(dashlineLeftMargin + 23, 15, dashlineLeftMargin + 23, 45,
	         {"stroke-width": 1, "stroke":"#000"});
  bar4.hide();
	
  //Left Margin of arrowIt1 in the 5th step
  var arrowIt1LeftMargin = labelItLeftMargin + 15 ;
  //arrow pointing to 10 in the 5th step
  var arrowIt1 = av.g.line(arrowIt1LeftMargin, 115, arrowIt1LeftMargin + 20, 115,
	             {"arrow-end": "classic-wide-long", "opacity": 0,"stroke-width": 2});

  //initialize the linked list
  av.umsg("The linked list before deletion");
  l.addFirst(12)
   .addFirst(10)
   .addFirst(23)
   .addFirst("20");
  l.layout();
  l.css({top: 50});
	
  //create new node 10
  var n3 = l.newNode("10");
  n3.highlight();
  n3.css({left: 105, top: 50}); 
  n3.hide();
  pseudo.highlight(1);
  av.displayInit(); 

  //step 2
  l.get(2).highlight();
  l.layout({updateLeft: false});
  av.umsg("10 is the current node to be deleted");
  av.step(); 

  //step 3
  labelIt.show();
  arrowIt.show();
  av.umsg("Remember the value by setting \"it\" to point to the element");
  pseudo.unhighlight(1);
  pseudo.highlight(3);
  av.step();

  //step 4
  l.get(1).edgeToNext().hide();
  l.get(2).edgeToNext().hide();
  bar1.hide();
  dashline.show();
  bar4.show();
  av.umsg(" The next field of the preceding list node is set to point to the node following the one being deleted");	
  pseudo.unhighlight(3);
  pseudo.highlight(6);
  av.step();	

  ////step 5
  l.remove(2);
  dashline.hide();
  bar4.hide();
  arrowIt.hide();
  bar1.show();  
  l.layout();
  l.get(1).edgeToNext().show();
  arrowIt1.show();
  n3.show();
  n3.hide();
  n3.show();
  av.umsg(" Finally, the node is removed from the linked list");
  pseudo.unhighlight(6);
  pseudo.highlight(7);
  av.step();
  av.recorded();
}(jQuery));

// Initial state of a linked list when using a header node
(function ($) {
  var jsav = new JSAV("listLinkedCON3", {"animationMode": "none"});
  var l = jsav.ds.list({"nodegap": 30, "top": 100, left: 300});

  //Left margin of head
  var headLeftMargin = 280;
  //Top margin of head
  var headTopMargin = 50;
  //Label "head"
  var headLabel = jsav.label("head",
	  {before: l, left: headLeftMargin, top: headTopMargin, "font-size":"20px"});
  //Head arrow
  var headArrow = jsav.g.line(headLeftMargin + 12, headTopMargin + 25, headLeftMargin + 12 + 20, headTopMargin + 45,
	  {"arrow-end": "classic-wide-long", "opacity": 100,"stroke-width": 2});

  //Left margin of curr
  var currLeftMargin = 373;
  //Top margin of curr
  var currTopMargin = 50;
  //Label "curr" and its arrow
  var currLabel = jsav.label("curr",
	  {before: l, left: currLeftMargin, top: currTopMargin, "font-size":"20px"});
  //Curr arrow
  var currArrow = jsav.g.line(currLeftMargin + 12, currTopMargin + 25, currLeftMargin + 12 + 20, currTopMargin + 45,
	  {"arrow-end": "classic-wide-long", "opacity": 100,"stroke-width": 2});

  //Left margin of tail
  var tailLeftMargin = 430;
  //Top margin of tail
  var tailTopMargin = 50;
  //label "tail" and its arrow
  var tailLabel = jsav.label("tail",
	  {before: l, left: tailLeftMargin, top: tailTopMargin, "font-size":"20px"});
  //Tail arrow
  var tailArrow = jsav.g.line(tailLeftMargin + 8, tailTopMargin + 25, tailLeftMargin + 8 - 20, tailTopMargin + 45,
	  {"arrow-end": "classic-wide-long", "opacity": 100,"stroke-width": 2});

  //Diagonal slash
  var slash = jsav.g.line(427, 131, 457, 100,
	  {"opacity": 100,"stroke-width": 1});

  l.addFirst(15)
   .addFirst("");
  l.layout();
}(jQuery));
