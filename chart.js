function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Create the buildCharts function.
function buildCharts(sample) {
  // Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
  // Create a variable that holds the samples array. 
  var chartData = data.samples;
  // Create a variable that filters the samples for the object with the desired sample number.
  var chartResultArray = chartData.filter(Object => Object.id == sample);
  // Create a variable that holds the first sample in the array.
  var chartResult = chartResultArray[0];
  // Create a variable that filters the metadata array for the object with the desired sample number.
  var chartMetadata = data.metadata;
  // Create a variable that holds the first sample in the metadata array.
  var chartMetadataArray = chartMetadata.filter(Object => Object.id == sample)[0];
  // Create variables that hold the otu_ids, otu_labels, and sample_values.
  var chartOtuIds = chartResult.otu_ids;
  var chartOtuLabels = chartResult.otu_labels;
  var chartSampleValues = chartResult.sample_values;
  // Create a variable that holds the washing frequency.
  var washingFreq = chartMetadataArray.wfreq;
  // Create the yticks for the bar chart.
  // Hint: Get the the top 10 otu_ids and map them in descending order  
  //  so the otu_ids with the most bacteria are last. 
  var yValues = chartOtuIds.slice(0,10).reverse();
  var yticks = chartOtuIds.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
  // Create the trace for the bar chart. 
  var barData = [{
    x: chartSampleValues.slice(0,10).reverse(),
    y: yticks,
    text: chartOtuLabels.slice(0,10).reverse(),
    type: "bar",
    orientation: 'h'
      
  }];

  // Create the layout for the bar chart. 
  var barLayout = {
     title: "Top 10 Bateria Cultures Found"
  };

  var config = {responsive: true};

  // 1Use Plotly to plot the data with the layout. 

  Plotly.newPlot("bar",barData,barLayout,config);

  // Bubble chart
  // Create the trace for the bubble chart.
  var bubbleData = [
    {
      x: chartOtuIds,
      y: chartSampleValues,
      hovertemplate: '<b>OTU ID</b>: %{x}' +

                        '<br><b>Sample Value</b>: %{y}<br>' +

                        '<b>OTU Labels</b>:  %{text}',
      text: chartOtuLabels,
      mode: 'markers',
      marker:
      {
        color: chartOtuIds,
        size: chartSampleValues,
        colorscale: 'RdBu'
      }
    }
  ];

  // Create the layout for the bubble chart.
  var bubbleLayout = {
    title: 'Bateria Culture per Sample',
    xaxis: {
      title: 'OTU ID'
    },
    hovermode: 'closest'
  };

  // Use Plotly to plot the data with the layout.
  Plotly.newPlot('bubble',bubbleData,bubbleLayout,config);
  
  // Create the trace for the gauge chart.
  var gaugeData = [{
		value: washingFreq,
		title: "<b>Belly Button Washing Frequency</b><br> Scrubs per Week" ,
		type: "indicator",
		mode: "gauge+number",
    gauge: {
      axis: { range: [0, 10] },
      bar: { color: "black" },
      steps: [
        { range: [0, 2], color: "red" },
        { range: [2, 4], color: "orange"},
        { range: [4, 6], color: "yellow"},
        { range: [6, 8], color: "lightgreen"},
        { range: [8, 10], color: "green"},

      ]}
  }];
  
  // Create the layout for the gauge chart.
  var gaugeLayout = { 
    width: 600,
    height: 500, 
    margin: 
    { 
      t: 0,
      b: 0
    } 
  };

  // Use Plotly to plot the gauge data and layout.
  Plotly.newPlot('gauge',gaugeData,gaugeLayout, config);
  
  });
}
