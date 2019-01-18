var RealtimeGraph = function(){

	var palette = new Rickshaw.Color.Palette( { scheme: [
        "#ff0000",
 		"#0000ff",
		"#00ffff",
		"#00ff00",
		"#ff00ff",
		"#000080",
		"#f39c12"


    ] } );

	// function to invoke Rickshaw and plot the graph
	this.drawGraph = function(seriesData)
	{
		// instantiate our graph!
		this.palette = palette;

		this.graph = new Rickshaw.Graph( {
			element: document.getElementById("chart"),
			width: 900,
			height: 500,
			renderer: 'line',
			stroke: true,
			preserve: true,
			series: seriesData	
		} );

		this.graph.render();

		this.hoverDetail = new Rickshaw.Graph.HoverDetail( {
			graph: this.graph,
			xFormatter: function(x) {
				return new Date(x * 1000).toString();
			}
		} );

		this.annotator = new Rickshaw.Graph.Annotate( {
			graph: this.graph,
			element: document.getElementById('timeline')
		} );

		this.legend = new Rickshaw.Graph.Legend( {
			graph: this.graph,
			element: document.getElementById('legend')

		} );

		this.shelving = new Rickshaw.Graph.Behavior.Series.Toggle( {
			graph: this.graph,
			legend: this.legend
		} );

		this.order = new Rickshaw.Graph.Behavior.Series.Order( {
			graph: this.graph,
			legend: this.legend
		} );

		this.highlighter = new Rickshaw.Graph.Behavior.Series.Highlight( {
			graph: this.graph,
			legend: this.legend
		} );

		this.smoother = new Rickshaw.Graph.Smoother( {
			graph: this.graph,
			element: document.querySelector('#smoother')
		} );

		this.ticksTreatment = 'glow';

		this.xAxis = new Rickshaw.Graph.Axis.Time( {
			graph: this.graph,
			ticksTreatment: this.ticksTreatment,
			timeFixture: new Rickshaw.Fixtures.Time.Local()
		} );

		this.xAxis.render();

		this.yAxis = new Rickshaw.Graph.Axis.Y( {
			graph: this.graph,
			tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
			ticksTreatment: this.ticksTreatment
		} );

		this.yAxis.render();


		this.controls = new RenderControls( {
			element: document.querySelector('form'),
			graph: this.graph
		} );

	}

	this.graphData = function(data)
	{
		
		var key = 0;
		var seriesData = [];
		var timestamp = Date.now()/1000;
		var maxPoints = 25; 
		for (var j in data)
		{
			if (typeof data[j] === 'number') {
				this.graph.series[key].data.push({x:timestamp,y:data[j]});
				if (this.graph.series[key].data.length > maxPoints)
				{
					this.graph.series[key].data.splice(0,1);//only display up to maxPoints
				}
				key++;
			} else if (typeof data[j] === 'string') {
				if(!isNaN(data[j])) {
					var value = parseFloat(data[j]);
					this.graph.series[key].data.push({x:timestamp,y:value});
					if (this.graph.series[key].data.length > maxPoints)
					{
						this.graph.series[key].data.splice(0,1);//only display up to maxPoints
					}
					key++;
				}
			}
		}
		this.graph.render();	
	}

	this.displayChart = function(device,data){

		var key = 0;
		var seriesData = [];
		var timestamp = Date.now()/1000;
		for (var j in data)
		{
			if (typeof data[j] === 'number') {
				seriesData[key]={};
				seriesData[key].name=j;
				seriesData[key].color = palette.color();
				seriesData[key].data=[];

				seriesData[key].data[0]={};
				seriesData[key].data[0].x = timestamp;
				seriesData[key].data[0].y = data[j];
				key++;
			} else if (typeof data[j] === 'string') {
				if(!isNaN(data[j])) {
					var value = parseFloat(data[j]);
					seriesData[key]={};
					seriesData[key].name=j;
					seriesData[key].color = palette.color();
					seriesData[key].data=[];

					seriesData[key].data[0]={};
					seriesData[key].data[0].x = timestamp;
					seriesData[key].data[0].y = value;6
					key++;
				}
			}
		}
		this.drawGraph(seriesData);
	}
};
