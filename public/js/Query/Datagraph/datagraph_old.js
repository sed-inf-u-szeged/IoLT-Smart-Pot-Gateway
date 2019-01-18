$(initSelectors);



function initSelectors() {

    var selectedDeviceName;
    var selectedSensorName;

    var select1check = false;
    var select2check = false;

    var firstrenderCheck = false;

    var renderedData;

    
    var graph = new Rickshaw.Graph( {
        element: document.querySelector('#currentGraph'),
        series: [{
            data: [{x:0,y:0}]
        }]
    });

    var graphHoverDetail = new Rickshaw.Graph.HoverDetail( {
        graph: graph,
        yFormatter: function(x) { return x + " " },
        xFormatter: function(x) {
            return new Date(x * 1000).toString();
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



    $('.js-example-basic-single').select2({
        width: 200
    });
    
    $("select[name='selectedDevice']").on('select2:select', function (e) {
        var data = e.params.data;
        console.log(data);
        selectedDeviceName = e.params.data.text;
        select1check = true;


        if(select1check == true && select2check == true) {
            initGraph(selectedDeviceName,selectedSensorName,graph,graphHoverDetail,renderedData);
            graph.element.style.visibility = 'visible';
            slider.element.style.visibility = 'visible';
            document.querySelector('#downloadContainer').style.visibility = 'visible';
        }

      

    });

    $("select[name='selectedSensor']").on('select2:select', function (e) {
        var data = e.params.data;
        console.log(data);
        selectedSensorName = e.params.data.text;
        select2check = true;

        if(select1check == true && select2check == true) {
            initGraph(selectedDeviceName,selectedSensorName,graph,graphHoverDetail,renderedData);
            graph.element.style.visibility = 'visible';
            slider.element.style.visibility = 'visible';
            document.querySelector('#downloadContainer').style.visibility = 'visible';
        }

       

    });


    $( "#graph_slider" ).on( "slidechange", function( event, ui ) {
        renderedData = slider.graph.stackedData;
        document.querySelector("#renderedData").value = JSON.stringify(renderedData);
        console.log(renderedData);
    } );

    $("#return_button").click(function () {
        window.location.href = "/dashboard";
      });

}


function initGraph(Devicename,Sensorname,graph,graphHover,renderedData) {

    var seriesName;
    var seriesColor;
    var hoverDetailFunction;

    switch (Sensorname) {
        case "Temperature [°C]":
            seriesName = "Temperature";
            seriesColor = "red";
            hoverDetailFunction = function(x) { return x + " °C" }
            break;
        case "Humidity [%]":
            seriesName = "Humidity";
            seriesColor = "blue";
            hoverDetailFunction = function(x) { return x + " %" }
            break;
        case "Soil-sensor I":
            seriesName = "Soil-sensor I";
            seriesColor = "green";
            hoverDetailFunction = function(x) { return x + "" }
            break;
        case "Soil-sensor II":
            seriesName = "Soil-sensor II";
            seriesColor = "brown";
            hoverDetailFunction = function(x) { return x + "" }
            break;
        case "Full light intensity [lux]":
            seriesName = "Full light intensity";
            seriesColor = "yellow";
            hoverDetailFunction = function(x) { return x + " lux" }
            break;
        case "IR light intensity [lux]":
            seriesName = "IR light intensity";
            seriesColor = "orange";
            hoverDetailFunction = function(x) { return x + " lux" }
            break;
        case "Visible light intensity [lux]":
            seriesName = "Visible light intensity";
            seriesColor = "cyan";
            hoverDetailFunction = function(x) { return x + " lux" }
            break;
        default:
            break;
    }

    console.log(seriesName);
    console.log(seriesColor);


    let tempdata = [];

    console.log(measured_data);

    measured_data.forEach(function(data) {
        if(Devicename == data["Device"]) {
            let o = {x:0,y:0};
            o.x = Math.floor((Date.parse(data.Time))/1000);
            o.y = data[Sensorname];
            tempdata.push(o);
            console.log(o);
        }
    });

    
    graph.series[0].data = tempdata;
    graph.series[0].name = seriesName;
    graph.series[0].color = seriesColor;
    graphHover.yFormatter = hoverDetailFunction;
    graph.update();
    
    document.querySelector("#renderedData").value = JSON.stringify(graph.stackedData);

}












  function initGraph2() {

    let tempdata = [];

    console.log(measured_data);

    measured_data.forEach(function(data) {
        let o = {x:0,y:0};
        o.x = Math.floor((Date.parse(data.Time))/1000);
        o.y = data["Temperature [°C]"];
        tempdata.push(o);
    });


    var tempGraph = new Rickshaw.Graph( {
        element: document.querySelector("#tempGraph"),
        renderer: 'line',
        series: [{
            name: 'Temperature',
            color: 'red',
            data: tempdata
        }]
    });
     
    var tempHoverDetail = new Rickshaw.Graph.HoverDetail( {
        graph: tempGraph,
        yFormatter: function(x) { return x + " °C" },
    } );

    var y_axis = new Rickshaw.Graph.Axis.Y( {
        graph: tempGraph,
        orientation: 'left',
        element: document.getElementById('temp_y_axis'),
    } );
   

    var tempRangeSlider = new Rickshaw.Graph.RangeSlider( {
        graph: tempGraph,
        element: document.getElementById('tempRangeSlider')
    } );

    initTempDeviceSelection(tempGraph);

    tempGraph.render();
  }

  function initTempDeviceSelection(tempGraph) {
    $('.js-example-basic-single').select2();
    $("select[name='Temp_selectedDevice']").on('select2:select', function (e) {
        let newdata = [];
        measured_data.forEach(data => {
            console.log(e.params.data.id);
            if(data.Device == e.params.data.id) {
                let o = {x:0,y:0};
                o.x = Math.floor((Date.parse(data.Time))/1000);
                o.y = data["Temperature [°C]"];
                newdata.push(o);
            }
        });
        tempGraph.series[0].data = newdata;
        tempGraph.update();
      });
  }