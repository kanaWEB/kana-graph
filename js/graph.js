series_nb = 0;
var series = []
options = false;
graph_time = false;
chart = false;

Highcharts.setOptions({
	global: {
		useUTC: false
	}
});

//Generate options for highcharts
function generate_options(data){
	options = {
		chart: {
			renderTo: 'graph',
			type: 'spline'
		},
		title: {
			text: ''
		},
		subtitle: {
			text: ''
		},
		xAxis: {
			type: 'datetime',
			dateTimeLabelFormats: {
				hour: '%H. %M',
			}
		},
		yAxis: {
			title: {
				text: ''
			}
		},
		tooltip: {
			formatter: function() {
				return Highcharts.dateFormat('%H:%M', this.x) + ': <b> ' + this.y.toFixed(1) + '</b>';
			}
		},

		series: []
	}

	var seriesOptions = {
		name: data.name,
		data:[],
		dataLabels:{
			enabled:false,
			formatter: function() {
				if(this.y != null){
					return '<b>' + this.y.toFixed(2);
				}
			}
		}
	}

	options.series.push(seriesOptions);
	options.series[series_nb].data = data.data;
	chart = new Highcharts.Chart(options);
	chart.yAxis[0].update({ 
		title: 
		{
			text: data.range 
		}
	});
	console.log(options);
	console.log(chart);
}

//Make a graph
function make_graph(){
	data_typeid = $("#rrd_typeid").val();
	data_typeid = data_typeid.split("|");
	data_type = data_typeid[0];
	data_id = data_typeid[1]; 

	data_time = $("#rrd_time").val();

	//console.log(data_time);
	//console.log("Make " + data_type + "/" + data_id + ".rrd");


	//If the time period is different we reset the graph
	if(data_time != graph_time && series_nb !=0){
		//console.log(data_time);
		//console.log(graph_time);
		//console.log("Graph destroyed!!!");
		destroy_graph();
	}
	graph_time = data_time;

	$.ajax({
		url: "actions.php",
		dataType: "json",
		data: {type: "data", data:"rrd/export",data_type: data_type , data_id: data_id, data_time:data_time, data_export_type:"json"},
	}).done(function ( data ) {
		//console.log(data);
		if(series_nb == 0){
			generate_options(data);
			//console.log("First generation");
		}
		else{
			//Get Sensor name inside export
			var seriesOptions = {
				name: data.name,
				data:data.data,
				dataLabels:{
					enabled:false,
					formatter: function() {
						if(this.y != null){
							return '<b>' + this.y.toFixed(2);
						}
					}
				}
			}

			chart.addSeries(seriesOptions);
			chart.yAxis[0].update({ 
				title: 
				{
					text: data.range 
				}
			});

		}

		series_nb++;
		//console.log(series_nb);
	});
}

//Destroy charts
function destroy_graph(){
	chart.destroy();
	series_nb = 0;
	series = [];
	options = false;
	$("#rrd_datatoggle").prop( "checked", false );
}

//Update title and subtitle
function update_text_graph(){
	title = $("#rrd_title").val()
	subtitle = $("#rrd_subtitle").val()
	chart.setTitle({
		text: title
	},
	{
		text: subtitle
	});
}

//Disable/Enable dataLabels 
function datalabel_toggle(){
	for (var i = 0; i < chart.series.length; i++) {
		var opt = chart.series[i].options;
		opt.dataLabels.enabled = !opt.dataLabels.enabled;
		chart.series[i].update(opt);
	}
}



