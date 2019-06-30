$(initSelectors);



function initSelectors() {

    var selected_slot_number;

    var select1check = false;

    var renderedData;

    
    var graph = new Rickshaw.Graph( {
        element: document.querySelector('#currentGraph'),
        renderer: 'line',
        series: [{
            data: [{x:0,y:0}],
            name: "Plant growth",
            color: "green"
        }]
    });

    var graphHoverDetail = new Rickshaw.Graph.HoverDetail( {
        graph: graph,
        formatter: function(series, x, y) {
            let modified_y;
            switch (series.name) {
                case "Plant growth":
                   modified_y = y.toFixed(2) + " cm<sup>2</sup>";
                    break;
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
    
    $("select[name='selected_slot']").on('select2:select', function (e) {
        selected_slot_number = e.params.data.text;
        select1check = true;
        

        if(select1check == true) {
            initGraph(selected_slot_number,graph);
            graph.element.style.visibility = 'visible';
            slider.element.style.visibility = 'visible';
            document.querySelector('#downloadContainer').style.visibility = 'visible';
            document.querySelector('#sensorControlPanel').style.display = 'block';
        }

      

    });


    $( "#graph_slider" ).on( "slidechange", function( event, ui ) {
        renderedData = slider.graph.stackedData;
        document.querySelector("#renderedData").value = JSON.stringify(renderedData);
    } );

    $("#return_button").click(function () {
        window.location.href = "/dashboard";
      });



      // Disabled attribute observer, for selected sensors.

      let sensors = $("li");
      let sensorsObject = new Object({
          "Plant growth": true
      });
      document.querySelector("#renderedSensors").value = JSON.stringify(sensorsObject);

      let observer = new MutationObserver(function(mutations) {
        for (let i=0, mutation; mutation = mutations[i]; i++) {
            if( !(String(mutation.target.className).includes("disabled")) ){
                console.log(mutation.target.lastChild.innerText);
                sensorsObject[mutation.target.lastChild.innerText] = true;
            } else {
                console.log(mutation.target.lastChild.innerText + " removed.");
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


function initGraph(slot_num,graph) {

    let tempdata = [];

    measured_data.forEach(function(data) {
        for (const key in data) {
            if(slot_num == key) {
                let o1 = {x: Math.floor((Date.parse(data.Time))/1000) , y: data[slot_num] };
                
                tempdata.push(o1);
            }   
        }
    });

    console.log(tempdata);

    graph.series[0].data = tempdata;

    graph.render();
    
    document.querySelector("#renderedData").value = JSON.stringify(graph.stackedData);

}
