// Calls the json data and uses it to fill the dropdown with initial value.
// optionChanged is called so that all values show in dropdown.
d3.json("./samples.json").then(function(jsonData) {
    
    d3.select("#selDataset")
        .selectAll("option")
        .data(jsonData.names)
        .enter()
        .append("option")
        .text(d=>d)
        .attr("value",d=>d);

    optionChanged(d3.select("#selDataset").property("value"));
});

// Gives the top 10 OTUs and creates horizontal bar chart.
function CreateHBar(x,y,text) {
    var data = [{
        type: 'bar',
        x: x,
        y: y,
        text: text,
        orientation: 'h'
    }];
    
    Plotly.newPlot('bar', data);
}

// Creates bubble chart for the top 10 OTUs
function CreateBubble(x,y,text) {
    var data = [{
        x: x,
        y: y,
        text: text,
        mode: 'markers',
        marker: {
          size: y,
          color: x.map(value=>value)
        }
    }];
    var layout = {
        xaxis: {
            title: {
              text: 'OTU ID',
            }
        },
        yaxis: {
            title: {
              text: 'Value',
            }
        }
    };
    Plotly.newPlot('bubble', data, layout);
}

// Create guage chart to show number of weekly belly button washes.
function CreateGauge(num) {
    
    var data = [
    {
        domain: { x: [0, 1], y: [0, 1] },
        value: num,
        title: "Weekly Belly Button Washing Frequency",
        type: "indicator",
        mode: "gauge+number",
        gauge: {
            axis: { range: [null, 10]},
            bar: { color: "#000000" },
            steps: [
                { range: [0, 1], color: "#FF5733" },
                { range: [1, 2], color: "#FF5E3C" },
                { range: [2, 3], color: "#FF6C4D" },
                { range: [3, 4], color: "#FF7456" },
                { range: [4, 5], color: "#FF8166" },
                { range: [5, 6], color: "#FF8E75" },
                { range: [6, 7], color: "#FE9A83" },
                { range: [7, 8], color: "#FFAE9B" },
                { range: [8, 9], color: "#FFC4B7" },
                { range: [9, 10], color: "#FFEAE5" },
            ],
        }
    }];
    Plotly.newPlot('gauge', data);
}

function Meta(data) {
    var div = d3.select("#sample-metadata");
    div.html("")
    var list = div.append("ul");
    Object.entries(data).forEach(([key, value]) => {
        list.append("li").text(key + ": " + value);
     });
}

// Loads in json data and executes each chart
function optionChanged(value) {
    d3.json("./samples.json").then(function(jsonData) {
        var metadata = jsonData.metadata.filter(data => data.id ==value);

        var sample = jsonData.samples.filter(data => data.id ==value);

        CreateHBar(sample[0].sample_values.slice(0,10).reverse(),sample[0].otu_ids.slice(0,10).reverse().map(a=>"OTU "+ a),sample[0].otu_labels.slice(0,10).reverse());
        CreateBubble(sample[0].otu_ids,sample[0].sample_values,sample[0].otu_labels);
        Meta(metadata[0]);
        CreateGauge(metadata[0].wfreq);
    });


}
