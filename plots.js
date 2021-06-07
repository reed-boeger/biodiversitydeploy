function init() {
    var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
      var sampleNames = data.names;

      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      })

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
};

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
};

// Initialize the dashboard
init(); 

// Demographics Panel 
function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      // console.log("results array" + result);
      var PANEL = d3.select("#sample-metadata");
  
      PANEL.html("");

      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      })
      // PANEL.append("h6").text(result.id);
      // PANEL.append("h6").text(result.ethnicity);
      // PANEL.append("h6").text(result.gender);
      // PANEL.append("h6").text(result.age);
      // PANEL.append("h6").text(result.location);
      // PANEL.append("h6").text(result.bbtype);
      // PANEL.append("h6").text(result.wfreq);
    });
  }
// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var chosenSample = samples.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var result = chosenSample[0];
    
  

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    // var sortedBacteria = result.sort((a, b) => a.sample_values - b.sample_values).reverse();
    // var yticks = sortedBacteria.slice(0, 10).map(bacteria => bacteria.otu_ids);
    var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();

    // 8. Create the trace for the bar chart. 
    var barData = {
      x: sample_values.slice(0, 10).reverse(),
      y: yticks,
      type: "bar",
      orientation: "h"
    };
      
    
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found"
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", [barData], barLayout);

     // 1. Create the trace for the bubble chart.
     var bubbleData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth"
        }
      }
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

    
    // 3. Create a variable that holds the washing frequency.
    var metadata = data.metadata;
    var wfreq = metadata.filter(sampleObj => sampleObj.id == sample)[0].wfreq;
   
    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        // domain: { x: [0, 1], y: [0, 1] },
        value: wfreq,
        title: {text: "Bellybutton washing frequency"},
        type: "indicator",

        mode: "gauge+number",
        gauge: {
                axis: { range: [null, 10], tickwidth: 1, tickcolor: "darkblue"},
                bar: { color: "black" },
                steps: [
                  {range: [0, 2], color: "red"},
                  {range: [2, 4], color: "orange"},
                  {range: [4, 6], color: "yellow"},
                  {range: [6, 8], color: "cyan"},
                  {range: [8, 10], color: "royalblue"}
                ]
              }
        }
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 700, 
            height: 600, 
            margin: { t: 20, b: 40, l:100, r:100 } 
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);

  });
}

   



