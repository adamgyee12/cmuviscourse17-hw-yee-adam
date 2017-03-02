/** Global var to store all match data for the 2014 Fifa cup */
var teamData;

/** Global var for list of all elements that will populate the table.*/
var tableElements;


/** Variables to be used when sizing the svgs in the table cells.*/
var cellWidth = 70,
    cellHeight = 20,
    cellBuffer = 15,
    barHeight = 20;

/**Set variables for commonly accessed data columns*/
var goalsMadeHeader = 'Goals Made',
    goalsConcededHeader = 'Goals Conceded';

/** Setup the scales*/
var goalScale = d3.scaleLinear()
    .domain([0, 18]) // shouldn't this come from a var?
    .range([cellBuffer, 2 * cellWidth - cellBuffer])

/**Used for games/wins/losses*/
var gameScale = d3.scaleLinear()
    .domain([0,7]) // shouldn't this come from a var as well?
    .range([0, cellWidth - cellBuffer]);

/**Color scales*/
/**For aggregate columns*/
var aggregateColorScale = d3.scaleLinear()
    .domain([0,6]) // shouldn't this come from a var as well?
    .range(['#ece2f0', '#016450']);

/**For goal Column*/
var goalColorScale = d3.scaleQuantize()
    .domain([-1, 1])
    .range(['#cb181d', '#034e7b']);

/**json Object to convert between rounds/results and ranking value*/
var rank = {
    "Winner": 7,
    "Runner-Up": 6,
    'Third Place': 5,
    'Fourth Place': 4,
    'Semi Finals': 3,
    'Quarter Finals': 2,
    'Round of Sixteen': 1,
    'Group': 0
};

d3.json('data/fifa-matches.json',function(error,data){
    teamData = data;
    console.log(teamData);

    createTable();
    updateTable();
})

/**
 * Loads in the tree information from fifa-tree.csv and calls createTree(csvData) to render the tree.
 *
 */
d3.csv("data/fifa-tree.csv", function (error, csvData) {

    //Create a unique "id" field for each game
    csvData.forEach(function (d, i) {
        d.id = d.Team + d.Opponent + i;
    });

    createTree(csvData);
});



/**
 * Creates a table skeleton including headers that when clicked allow you to sort the table by the chosen attribute.
 * Also calculates aggregate values of goals, wins, losses and total games as a function of country.
 *
 */
function createTable() {

// ******* TODO: PART II *******

  // Creating Axis for Goals Column
  var goalsAxis = d3.axisBottom(goalScale);

  d3.select("#goalHeader").append("svg")
    .style("width", function(d){
      return cellWidth * 2;
    })
    .style("height", cellHeight)
    .call(goalsAxis); // Needs some work to look prettier, but will do for now

  // Populate tableElements
  tableElements = teamData;

  // Add <table rows> for each element in tableElements
  var trs = d3.select("tbody").selectAll("tr")
    .data(tableElements).enter().append("tr");

/*
  trs.each(function(d) {
    var td = d3.select(this).selectAll("td")
      .data(function(d){
        console.log(d);
        return [1,2,3];
      });
    //console.log(this);
  });
*/

// ******* TODO: PART V (Extra Credit) *******

}

/**
 * Updates the table contents with a row for each element in the global variable tableElements.
 *
 */
function updateTable() {

// ******* TODO: PART III *******
  //d3.selectAll(".tbl_el").remove();
  var trs = d3.select("tbody").selectAll("tr")
  .on("click", function(d,i){ // SHOULD ONLY BE ABLE TO CLICK ON NAME OF COUNTRY TO EXPAND
    updateList(i);
  })
  .data(tableElements);
  trs.enter().append("tr").merge(trs);

  // Clear all tds before adding in new data
  trs.selectAll("td").remove();

  var tds = trs.selectAll("td")
    .data(function(d){

      var data_columns = [];

      if (d.value.type == "aggregate") {
        // Team name
        data_columns.push({"type":d.value.type, "vis":"text", "value":d.key});
        // Goals
        data_columns.push({"type":d.value.type, "vis":"goals", "value":{"Delta Goals":d.value["Delta Goals"], "Goals Conceded":d.value["Goals Conceded"], "Goals Made":d.value["Goals Made"]}});
        // Result
        data_columns.push({"type":d.value.type, "vis":"text", "value":d.value.Result.label});
        // Wins
        data_columns.push({"type":d.value.type, "vis":"bar", "value":d.value.Wins});
        // Losses
        data_columns.push({"type":d.value.type, "vis":"bar", "value":d.value.Losses});
        // Total Games
        data_columns.push({"type":d.value.type, "vis":"bar", "value":d.value.TotalGames});
      } else {
        // Game opponent Name
        data_columns.push({"type":d.value.type, "vis":"text", "value":d.key});
        // Goals
        data_columns.push({"type":d.value.type, "vis":"goals", "value":{"Delta Goals":d.value["Goals Made"] - d.value["Goals Conceded"], "Goals Conceded":d.value["Goals Conceded"], "Goals Made":d.value["Goals Made"]}});
        // Result
        data_columns.push({"type":d.value.type, "vis":"text", "value":d.value.Result.label});
        // Wins
        data_columns.push({"type":d.value.type, "vis":"bar", "value":0});
        // Losses
        data_columns.push({"type":d.value.type, "vis":"bar", "value":0});
        // Total Games
        data_columns.push({"type":d.value.type, "vis":"bar", "value":0});
      }
      return data_columns;
    })
    .enter().append("td");

    // Use <td> associated data to alter the cells
    // Team Name / Result
    tds.filter(function(d) {
      return d.vis == 'text'
    })
    .text(function(d){
      return d.value;
    });

    // Wins / Losses / Total Games
    tds.filter(function (d) {
      return d.vis == 'bar'
    })
    .append("svg")
    .style("width", function(d){
      return (d.type == "aggregate") ? gameScale(d.value) : 0;
    })
    .style("height", cellHeight)
    .append("rect")
    .style("height", cellHeight)
    .style("width", function(d){
      return (d.type == "aggregate") ? gameScale(d.value) : 0;
    })
    .attr("fill", function(d) {
      return (d.type == "aggregate") ? aggregateColorScale(d.value) : "none";
    })
    .append("text").text(function(d){ // Text is not showing up
      return d.value;
    })
    .attr("text-anchor", "middle")
    .attr("x", 10).attr("y", 10);

    // Delta Goals
    tds.filter(function (d) {
      return d.vis == 'goals'
    })
    .append("svg")
    .style("width", function(d){
      return cellWidth * 2;
    })
    .style("height", cellHeight)
    .attr("x", function(d){
      return goalScale(0);
    })
    .append("rect").classed("goalBar", true) // Adding delta bar
    .attr("height", function(d){
      return (d.type == "aggregate") ? 10 : 5;
    })
    .attr("width", function(d){
      //console.log(d.value["Delta Goals"]);
      return goalScale(Math.abs(d.value["Delta Goals"])) - goalScale(0);
    })
    .attr("x", function(d){ // Start rectangle at the min of goals conceded and goals made
      //console.log(d3.min([d.value["Goals Conceded"], d.value["Goals Made"]]));
      return goalScale(d3.min([d.value["Goals Conceded"], d.value["Goals Made"]]));
      //console.log(goalScale(11));
      //return goalScale(0);
    })
    .attr("y", function(d){
      return (d.type == "aggregate") ? (cellHeight / 2 - (10 / 2)) : (cellHeight / 2 - (5 / 2));
    })
    .attr("fill", function(d) {
      if (d.value["Delta Goals"] < 0){
        return "red";
      } else {
        return "blue";
      }
    })

    // Goals Conceded
    tds.filter(function (d) {
      return d.vis == 'goals'
    })
    .selectAll("svg")
    .append("circle")
    .attr("cx", function(d){
      return goalScale(d.value["Goals Conceded"]);
    })
    .attr("cy", function(d){
      return (cellHeight / 2);
    })
    .attr("r", 5)
    .attr("fill", function(d){
      return (d.type == "aggregate") ? "red" : "white";
    })
    .attr("style", function(d){
      return (d.type == "aggregate") ? "" : "stroke:red; stroke-width:1";
    });

    // Goals Made
    tds.filter(function (d) {
      return d.vis == 'goals'
    })
    .selectAll("svg")
    .append("circle")
    .attr("cx", function(d){
      return goalScale(d.value["Goals Made"]);
    })
    .attr("cy", function(d){
      return (cellHeight / 2);
    })
    .attr("r", 5)
    .attr("fill", function(d){
      if (d.value["Delta Goals"] == 0){
        return (d.type == "aggregate") ? "grey" : "white";
      } else {
        return (d.type == "aggregate") ? "blue" : "white";
      }
    })
    .attr("style", function(d){
      if (d.value["Delta Goals"] == 0){
        return (d.type == "aggregate") ? "" : "stroke:grey; stroke-width:1";
      } else {
        return (d.type == "aggregate") ? "" : "stroke:blue; stroke-width:1";
      }
    });

};


/**
 * Collapses all expanded countries, leaving only rows for aggregate values per country.
 *
 */
function collapseList() {

    // ******* TODO: PART IV *******


}

/**
 * Updates the global tableElements variable, with a row for each row to be rendered in the table.
 *
 */
function updateList(i) {

    // ******* TODO: PART IV *******
    console.log(i);

    if (tableElements[i].value.type != "aggregate"){
      console.log("you clicked on a game");
      return;
    }

    // Handle cases

    // Add games to tableElements (how to get this game data?)
    var games = teamData[i].value.games;
    //console.log(games);
    //tableElements = tableElements.concat(games);
    for (var j = games.length-1; j > 0; j--){
      //console.log(games[j]);
      tableElements.splice(i+1, 0, games[j]);
    }
/*
    console.log(firstHalf);
    console.log(secondHalf);
    firstHalf.splice(i,0,games);
    firstHalf.concat(secondHalf);

    tableElements = firstHalf;
    console.log(tableElements);
    //console.log(tableElements);
    */
    //console.log(tableElements);

    /*games.forEach(function(game){
      tableElements.in
      console.log(game);
    });*/
    //console.log(teamData[i].value.games);

    // updateTable
    updateTable();

}

/**
 * Creates a node/edge structure and renders a tree layout based on the input data
 *
 * @param treeData an array of objects that contain parent/child information.
 */
function createTree(treeData) {

    // ******* TODO: PART VI *******


};

/**
 * Updates the highlighting in the tree based on the selected team.
 * Highlights the appropriate team nodes and labels.
 *
 * @param team a string specifying which team was selected in the table.
 */
function updateTree(row) {

    // ******* TODO: PART VII *******


}

/**
 * Removes all highlighting from the tree.
 */
function clearTree() {

    // ******* TODO: PART VII *******


}
