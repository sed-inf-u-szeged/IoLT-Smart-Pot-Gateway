$(initSelectors);



function initSelectors() {

    var selectedDeviceName;

    var select1check = false;

    var renderedData;

    
    var graph = new Rickshaw.Graph( {
        element: document.querySelector('#currentGraph'),
        renderer: 'line',
        series: [{
            data: [{x:0,y:0}],
            name: "Temperature",
            color: "red"
        },
        {
            data: [{x:0,y:0}],
            name: "Humidity",
            color: "blue"
        },
        {
            data: [{x:0,y:0}],
            name: "Soil-sensor I",
            color: "green"
        },
        {
            data: [{x:0,y:0}],
            name: "Soil-sensor II",
            color: "brown"
        },
        {
            data: [{x:0,y:0}],
            name: "IR light intensity",
            color: "orange"
        },
        {
            data: [{x:0,y:0}],
            name: "Visible light intensity",
            color: "cyan"
        },
        {
            data: [{x:0,y:0}],
            name: "Full light intensity",
            color: "yellow"
        },
        {
            data: [{x:0,y:0}],
            name: "Plant growth",
            color: "darkgreen"
        }]
    });

    var graphHoverDetail = new Rickshaw.Graph.HoverDetail( {
        graph: graph,
        formatter: function(series, x, y) {
            let modified_y;
            switch (series.name) {
                case "Temperature":
                   modified_y = y + " °C";
                    break;
                case "Humidity":
                    modified_y = y + " %";
                    break;
                case "Soil-sensor I":
                    modified_y = y + " ";
                    break;
                case "Soil-sensor II":
                    modified_y = y + " ";
                    break;
                case "Full light intensity":
                    modified_y = y + " lux";
                    break;
                case "IR light intensity":
                    modified_y = y + " lux";
                    break;
                case "Visible light intensity":
                    modified_y = y + " lux";
                    break;
                case "Plant growth":
                    modified_y = y.toFixed(2) + " mm<sup>2</sup>";
                default:
                    break;
            }
            let date = '<span class="date">' + new Date(x * 1000).toString() + '</span>';
            let swatch = '<span class="detail_swatch" style="background-color: ' + series.color + '"></span>';
            let content = swatch + series.name + ": " + modified_y + '<br>' + date;
            return content;
        }
    } );

    var yAxis = new Rickshaw.Graph.Axis.Y({
        graph: graph,
        element: document.querySelector('#current_y_axis'),
        orientation: 'left'
    });

    var slider = new Rickshaw.Graph.RangeSlider({
        graph: graph,
        element: document.querySelector('#graph_slider')
    });

    var legend = new Rickshaw.Graph.Legend({
        graph: graph,
        naturalOrder: true,
        element: document.querySelector('#legendArea')
    });

    var shelving = new Rickshaw.Graph.Behavior.Series.Toggle({
        graph: graph,
        legend: legend
    });



    $('.js-example-basic-single').select2({
        width: 200
    });
    
    $("select[name='selectedDevice']").on('select2:select', function (e) {
        var data = e.params.data;
        selectedDeviceName = e.params.data.text;
        select1check = true;

        console.log(graph);


        if(select1check == true) {
            console.log(graph.series);
            initGraph(selectedDeviceName,graph,legend);
            if ( ! (selectedDeviceName == "BRC_Smartpot_1" && typeof plantgrowth_data !== 'undefined' && plantgrowth_data.length > 0)) {
            
                $('.rickshaw_legend .line:nth-child(8)').attr('hidden','');
                if(graph.series.length == 8) {
                    graph.series.pop();
                }
                graph.update();
    
            } else {
                    $('.rickshaw_legend .line:nth-child(8)').removeAttr('hidden');
                    fillSeries_withPlantGrowthData(graph);
                    graph.update();
                } 
            }
            graph.element.style.visibility = 'visible';
            slider.element.style.visibility = 'visible';
            document.querySelector('#downloadContainer').style.visibility = 'visible';
            document.querySelector('#sensorControlPanel').style.display = 'block';
        

      

    });


    $( "#graph_slider" ).on( "slidechange", function( event, ui ) {
        renderedData = slider.graph.stackedData;
        document.querySelector("#renderedData").value = JSON.stringify(renderedData);
        console.log(slider.graph);
    } );

    $("#return_button").click(function () {
        window.location.href = "/dashboard";
      });



      // Disabled attribute observer, for selected sensors.

      let sensors = $("li");
      let sensorsObject = new Object({
          Temperature: true,
          Humidity: true,
          "Soil-sensor I": true,
          "Soil-sensor II": true,
          "IR light intensity": true,
          "Visible light intensity": true,
          "Full light intensity": true,
          "Plant growth" : true
      });
      document.querySelector("#renderedSensors").value = JSON.stringify(sensorsObject);

      let observer = new MutationObserver(function(mutations) {
        for (let i=0, mutation; mutation = mutations[i]; i++) {
            if( !(String(mutation.target.className).includes("disabled")) ){
                //console.log(mutation.target.lastChild.innerText);
                sensorsObject[mutation.target.lastChild.innerText] = true;
            } else {
                //console.log(mutation.target.lastChild.innerText + " removed.");
                sensorsObject[mutation.target.lastChild.innerText] = false;
            }
            console.log(sensorsObject);
            document.querySelector("#renderedSensors").value = JSON.stringify(sensorsObject);
        };
    });
    

      for (let i = 0; i < sensors.length; i++) {
          observer.observe(sensors[i], {attributes: true});
      }
      
}


function initGraph(Devicename,graph,legend) {

    let tempdata = [];

    for (let i = 0; i < 7; i++) {
        let t = [];
        tempdata.push(t);
    }

    

    measured_data.forEach(function(data) {
        if(Devicename == data["Device"]) {
            let o1 = {x: Math.floor((Date.parse(data.Time))/1000) , y: data["Temperature [°C]"] };
            let o2 = {x: Math.floor((Date.parse(data.Time))/1000) , y: data["Humidity [%]"] };
            let o3 = {x: Math.floor((Date.parse(data.Time))/1000) , y: data["Soil-sensor I"] };
            let o4 = {x: Math.floor((Date.parse(data.Time))/1000) , y: data["Soil-sensor II"] };
            let o5 = {x: Math.floor((Date.parse(data.Time))/1000) , y: data["IR light intensity [lux]"] };
            let o6 = {x: Math.floor((Date.parse(data.Time))/1000) , y: data["Visible light intensity [lux]"] };
            let o7 = {x: Math.floor((Date.parse(data.Time))/1000) , y: data["Full light intensity [lux]"] };
            
            tempdata[0].push(o1);
            tempdata[1].push(o2);
            tempdata[2].push(o3);
            tempdata[3].push(o4);
            tempdata[4].push(o5);
            tempdata[5].push(o6);
            tempdata[6].push(o7);

            
        }  
    });

    
    
    for (let i = 0; i < tempdata.length; i++) {
         graph.series[i].data = tempdata[i];
    }
    
    if ( Devicename == "BRC_Smartpot_1" && typeof plantgrowth_data !== 'undefined' && plantgrowth_data.length > 0 ) {
        if(graph.series.length == 7) {
            let PGObject = {
                data: [{x:0,y:0}],
                name: "Plant growth",
                color: "darkgreen"
            };
        graph.series.push(PGObject);
        fillSeries_withPlantGrowthData(graph);
        }
    } 

    graph.render();
    
    document.querySelector("#renderedData").value = JSON.stringify(graph.stackedData);








    
    

}

function fillSeries_withPlantGrowthData(graph) {

    let pg_data = [];

    plantgrowth_data.forEach(function(datablock) {
        let y_data = 0;
        for(var propertyName in datablock) {
            if (propertyName != "Time" && propertyName != "_id") {
                y_data += datablock[propertyName];
            }
        }
        y_data = y_data/12;
        let o1 = {x: Math.floor((Date.parse(datablock.Time))/1000) , y: y_data};
        pg_data.push(o1);
    });

    graph.series[7].data = pg_data;
}