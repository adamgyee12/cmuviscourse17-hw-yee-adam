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

    var svg = d3.select("#barChart")
      .attr("style", "backgroundColor: blue");
      console.log(svg);
    var width = 500;
    var height = 400;
    var padding = 3;

    console.log(svgBounds);

    var data = [];
    var years = [];
    for (var i = 0; i < allWorldCupData.length; i++){
      data.unshift(allWorldCupData[i][selectedDimension]);
      years.unshift(allWorldCupData[i]["year"]);
    }
    console.log(data);
    console.log(years);

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
            /*
    var xScale = d3.scaleLinear()
      .domain([d3.min(years), d3.max(years)])
      .range([0, svgBounds["width"] - padding])
      .nice();
      */
    /* mine pre lecture
    var xScale = d3.scaleLinear()
      .domain([0, allWorldCupData.length])
      .range([5, svgBounds["width"] - 90])
      .nice();

    //var minYear = d3.min(allWorldCupData, function(d){ return d.year; }); This loops through the world cup data and retuns minimum value
    var xScaleAxis = d3.scaleLinear()
      .domain([d3.min(years), d3.max(years)])
      .range([0, svgBounds["width"]])
      .nice();
      */

    var yScale = d3.scaleLinear()
      .domain([0,d3.max(data)])
      .range([svgBounds["height"] - yAxisHeight,0])
      .nice();

    /* mine pre-lecture
    var yScale = d3.scaleLinear()
      .domain([0,d3.max(data)])
      .range([0, svgBounds["height"]-70])
      .nice();


    var yScaleAxis = d3.scaleLinear()
      .domain([d3.max(data), 0])
      .range([0, svgBounds["height"]-70])
      .nice();
      */

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
      .data(allWorldCupData);

    bars.enter().append("rect").classed("bars",true)
      .attr("x", function(d,i){
        return xScale(years[i]) + padding;
      })
      .attr("y", function(d, i){
        return yScale(data[i])
      })
      .attr("width", 17)
      .merge(bars)
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
          console.log(d);
          return svgBounds["height"] - yScale(data[i]) - yAxisHeight;
      })
      .attr("fill", function (d,i) {
          return colorScale(data[i]);
      });





    // ******* TODO: PART II *******

    // Implement how the bars respond to click events
    // Color the selected bar to indicate is has been selected.
    // Make sure only the selected bar has this new color.

    // Output the selected bar to the console using console.log()

}

/**
 *  Check the drop-down box for the currently selected data type and update the bar chart accordingly.
 *
 *  There are 4 attributes that can be selected:
 *  goals, matches, attendance and teams.
 */
function chooseData() {

    // ******* TODO: PART I *******
    //Changed the selected data when a user selects a different
    // menu item from the drop down.
    var selected = document.getElementById('dataset');
    updateBarChart(selected.options[selected.selectedIndex].value);
//console.log(sel.options[sel.selectedIndex].value)

}

/* DATA LOADING */

// This is where execution begins; everything
// above this is just function definitions
// (nothing actually happens)

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
