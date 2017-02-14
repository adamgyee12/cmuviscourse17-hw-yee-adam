// Global var for FIFA world cup data
var allWorldCupData;

/**
 * Render and update the bar chart based on the selection of the data type in the drop-down box
 *
 * @param selectedDimension a string specifying which dimension to render in the bar chart
 */
function updateBarChart(selectedDimension) {

    var svgBounds = d3.select("#barChart").node().getBoundingClientRect(),
        xAxisWidth = 100,
        yAxisHeight = 70;

    // ******* TODO: PART I *******
    // Copy over your HW2 code here

        var padding = 3;

        var data = [];
        var years = [];
        var orderedCupData = [];
        for (var i = 0; i < allWorldCupData.length; i++){
          data.unshift(allWorldCupData[i][selectedDimension]);
          years.unshift(allWorldCupData[i]["year"]);
          orderedCupData.unshift(allWorldCupData[i]);
        }

        // ******* TODO: PART I *******
        var spacing = svgBounds["width"] / data.length;
        // Create the x and y scales; make
        // sure to leave room for the axes

        // wanna use a categorical scale instead of linear!!
        // banded scale: d3.scaleBand().domain(years).range([0,svgBounds["width"]])
        // .padding(.2) <=- padding between bars
        var xScale = d3.scaleBand()
          .domain(years)
          .range([0, svgBounds["width"] - xAxisWidth])
          .padding(.05);

        var yScale = d3.scaleLinear()
          .domain([0,d3.max(data)])
          .range([svgBounds["height"] - yAxisHeight,0])
          .nice();

        var xAxis = d3.axisBottom(xScale)
          .ticks(allWorldCupData.length)
          .tickValues(years)
          .tickFormat(d3.format("0000")).ticks(years.length);


        var yAxis = d3.axisLeft(yScale);
          /*.ticks(10)
          .tickValues(data);*/

        // Create colorScale
        var colorScale = d3.scaleLinear()
          .domain([d3.min(data), d3.max(data)])
          .range(["lightblue", "blue", "darkblue"]);

        // Create the axes (hint: use #xAxis and #yAxis)
        var horizontal = d3.select("#xAxis")
          .attr("transform", "translate(70, 350)")
          .call(xAxis)
          .selectAll("text")
          .attr("y", 0)
          .attr("x", 9)
          .attr("dy", ".35em")
          .attr("transform", "rotate(90)")
          .style("text-anchor", "start");;


        var vertical = d3.select("#yAxis")
          .attr("transform", "translate(70,20)")
          .transition().duration(2500)
          .call(yAxis);

        // Create the bars (hint: use #bars)
        var g = d3.select("#bars");
        var bars = g.selectAll("rect")
          .data(orderedCupData);

        var prevBar;
        var prevBarData;
        bars.enter().append("rect").classed("bars",true)
          .attr("x", function(d,i){
            return xScale(years[i]) + padding;
          })
          .attr("y", function(d, i){
            return yScale(data[i]);
          })
          .attr("width", 17)
          .merge(bars)
          .on("click", function(d,i){
            d3.select(".bars-active").attr("class", "bars");
            d3.select(this).attr("class", "bars-active");
            updateInfo(d);
            console.log("Year: " + years[i] + ", Value: " + data[i]);
          })
          .attr("transform", "translate(70, 20)")
          .transition().duration(2500)
          .attr("x", function (d, i) {
              return xScale(years[i]) + padding;
          })
          .attr("y", function (d, i) {
              return yScale(data[i]);
              //svgBounds["width"] / allWorldCupData.length;
          })
          .attr("width", 17)
          .attr("height", function(d,i){
              return svgBounds["height"] - yScale(data[i]) - yAxisHeight;
          })
          .attr("fill", function (d,i) {
              return colorScale(data[i]);
          });
}

/**
 *  Check the drop-down box for the currently selected data type and update the bar chart accordingly.
 *
 *  There are 4 attributes that can be selected:
 *  goals, matches, attendance and teams.
 */
function chooseData() {

  // ******* TODO: PART I *******
  // Copy over your HW2 code here
  var selected = document.getElementById('dataset');
  updateBarChart(selected.options[selected.selectedIndex].value);


}

/**
 * Update the info panel to show info about the currently selected world cup
 *
 * @param oneWorldCup the currently selected world cup
 */
function updateInfo(oneWorldCup) {

    // ******* TODO: PART II *******

    // Update the text elements in the infoBox to reflect:
    // World Cup Title, host, winner, runner_up, and all participating teams that year

    // Hint: For the list of teams, you can create an list element for each team.
    // Hint: Select the appropriate ids to update the text content.

    d3.select("#edition").text(oneWorldCup.EDITION);
    d3.select("#host").text(oneWorldCup.host);
    d3.select("#winner").text(oneWorldCup.winner);
    d3.select("#silver").text(oneWorldCup.runner_up);
    var teams = d3.select("#teams");
    teams.selectAll("li").remove();
    oneWorldCup.teams_names.forEach(function(team_name){
      teams.append("li").text(team_name);
    });

    updateMap(oneWorldCup);


}

/**
 * Renders and updated the map and the highlights on top of it
 *
 * @param the json data with the shape of all countries
 */
function drawMap(world) {

    //(note that projection is global!
    // updateMap() will need it to add the winner/runner_up markers.)

    projection = d3.geoConicConformal().scale(150).translate([400, 350]);

    // ******* TODO: PART III *******

    // Draw the background (country outlines; hint: use #map)
    // Make sure and add gridlines to the map

    // Hint: assign an id to each country path to make it easier to select afterwards
    // we suggest you use the variable in the data element's .id field to set the id

    // Make sure and give your paths the appropriate class (see the .css selectors at
    // the top of the provided html file)

    //console.log(world);
    var path = d3.geoPath().projection(projection);
    var map = d3.select("#map");//.append("svg").attr("width",900).attr("height",600);
      //map.data(world.arcs).enter().append("path").attr("d",path);

    map.append("path")
    .classed("graticule", true)
    .attr("d", path(d3.geoGraticule10()));

    map.selectAll("path")
      .data(topojson.feature(world, world.objects.countries).features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("id", function(d,i){
        return d.id;
      })
      .on("click", function(d,i){

        d3.select("#country_name").text(d.id);
        var years_played = d3.select("#cups");
        years_played.selectAll("li").remove();

        for (var i = 0; i < allWorldCupData.length; i++){
          var individual_year = allWorldCupData[i];

          for (var j = 0; j < individual_year.teams_iso.length; j++){
            var year = individual_year.teams_iso[j];

            if (year.includes(d.id)){
              years_played.append("li").text(individual_year.year);
            }
          }
        }

      })
      .classed("countries", true);

}

/**
 * Clears the map
 */
function clearMap() {

    // ******* TODO: PART IV*******
    //Clear the map of any colors/markers; You can do this with inline styling or by
    //defining a class style in styles.css
    d3.selectAll(".host-map").attr("class", "countries");
    d3.selectAll(".team-map").attr("class", "countries");
    d3.selectAll(".gold-map").remove();
    d3.selectAll(".silver-map").remove();

    //Hint: If you followed our suggestion of using classes to style
    //the colors and markers for hosts/teams/winners, you can use
    //d3 selection and .classed to set these classes on and off here.

}


/**
 * Update Map with info for a specific FIFA World Cup
 * @param the data for one specific world cup
 */
function updateMap(worldcupData) {

    //Clear any previous selections;
    clearMap();

    // ******* TODO: PART IV *******

    // Add a marker for the winner and runner up to the map.

    //Hint: remember we have a conveniently labeled class called .winner
    // as well as a .silver. These have styling attributes for the two
    //markers.
    //console.log(worldcupData);
    var hostCode = worldcupData.host_country_code;
    var runnerUpPos = worldcupData.ru_pos;
    var winnerPos = worldcupData.win_pos;
    var teams = worldcupData.teams_iso;

    teams.forEach(function(team){
      d3.select("#" + team).attr("class", "team-map");
    })

    d3.select("#" + hostCode).attr("class", "host-map");

    //console.log(winnerPos[0] + "hi");
    var points = d3.select("#points");
    var winner = [{long: winnerPos[0], lat: winnerPos[1]}];

    points.selectAll(".gold-map")
        .data(winner)
        .enter()
        .append("circle")
        .attr("transform", function(d) {
          return "translate(" + projection([d.long,d.lat]) + ")";
        })
        .attr('r', 0)
        .transition().duration(3000).ease(d3.easeBounce)
        .attr('class','gold-map')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', 10)
        .attr("transform", function(d) {
          return "translate(" + projection([d.long,d.lat]) + ")";
        });

    var runnerUp = [{long: runnerUpPos[0], lat: runnerUpPos[1]}];

    points.selectAll(".silver-map")
        .data(runnerUp)
        .enter()
        .append("circle")
        .attr("transform", function(d) {
          return "translate(" + projection([d.long,d.lat]) + ")";
        })
        .attr('r', 0)
        .transition().duration(3000).ease(d3.easeBounce)
        .attr('class','silver-map')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', 10)
        .attr("transform", function(d) {
          return "translate(" + projection([d.long,d.lat]) + ")";
        });


    //Select the host country and change it's color accordingly.

    //Iterate through all participating teams and change their color as well.

    //We strongly suggest using classes to style the selected countries.



}

/* DATA LOADING */

// This is where execution begins; everything
// above this is just function definitions
// (nothing actually happens)

//Load in json data to make map
d3.json("data/world.json", function (error, world) {
    if (error) throw error;
    drawMap(world);
});

// Load CSV file
d3.csv("data/fifa-world-cup.csv", function (error, csv) {

    csv.forEach(function (d) {

        // Convert numeric values to 'numbers'
        d.year = +d.YEAR;
        d.teams = +d.TEAMS;
        d.matches = +d.MATCHES;
        d.goals = +d.GOALS;
        d.avg_goals = +d.AVERAGE_GOALS;
        d.attendance = +d.AVERAGE_ATTENDANCE;
        //Lat and Lons of gold and silver medals teams
        d.win_pos = [+d.WIN_LON, +d.WIN_LAT];
        d.ru_pos = [+d.RUP_LON, +d.RUP_LAT];

        //Break up lists into javascript arrays
        d.teams_iso = d3.csvParse(d.TEAM_LIST).columns;
        d.teams_names = d3.csvParse(d.TEAM_NAMES).columns;

    });

    // Store csv data in a global variable
    allWorldCupData = csv;
    // Draw the Bar chart for the first time
    updateBarChart('attendance');
});
