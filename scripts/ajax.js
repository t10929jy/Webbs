//Ajax request "load list of model"                                                                      
function load_model_success(response){
    if (response.responseText !== undefined) {
	var resultJSON = JSON.parse(response.responseText);
	premodel.getStore().loadData(resultJSON);
    }
}

//Ajax failed
function load_model_failure(response){
    if (response.responseText !== undefined) {
	alert("Missed loading files")
	    }
}

var params = { "ID": "test" };
Ext.Ajax.request({
	url: "/ecell/list_models.cgi",
	    method: "GET",
	    params: params,
	    success: load_model_success,
	    failure: load_model_failure,
	    })



//Ajax request for "Entity Data"
var session_ID = "";

var tabs_entity = Ext.createWidget('tabpanel',{
	border: false
    });

function handleSuccess(response) {
    if (response.responseText !== undefined) {
	var responseJSON = JSON.parse(response.responseText);
	var responseJSON_process  = responseJSON.Process;
	var responseJSON_variable = responseJSON.Variable;
	session_ID = responseJSON.ID;
	//	console.log(responseJSON_process);
	alert(session_ID);

	if (tabs_entity.items.length == 0) {
	    tabs.add({
		    title: 'Entity',
			items:[ tabs_entity ]
			}).show;
	};
	
	tabs_entity.add({
		title: 'Entity ' + (tabs_entity.items.length + 1),
		    layout: 'hbox',
		    border: false,
		    items: [
			    variable_grid( responseJSON_variable ),
			    process_grid(  responseJSON_process  ),
			    {   
				xtype: 'form',
                                border: false,
                                flex: 1,
                                items: [{
					title: 'Property Details(editable)',
					    //xtype: 'fieldset',            
					    //defaultType: 'textfield',
					    items: [{
						fieldLabel: 'ID',
						    name: 'p_id',
						    disabled: true,
						    editable: false,
						    allowBlank: false,
						    xtype: 'textareafield'
						    },{
						fieldLabel: 'Expression',
						    name: 'expression',
						    editable: false,
						    disabled: true,
						    xtype: 'textareafield',
						    allowBlank: false,
						    },{
						fieldLabel: 'Variable Reference List',
							      name: 'v_r_l',
							      disabled: true,
							      xtype: 'textareafield',
							      editable: false
							      },{
						fieldLabel: 'Property List',
							      xtype: 'textareafield',
							      }]
					    },{
					xtype: 'panel',
					    border: false,
					    style: { "background-color": '#ffffff', "text-align": 'center'  },
					    // items: [ runbutton ]
					    items: [
						    Ext.create('Ext.Button', {
							    text: 'Run!!',
								scale: 'larege',
								width: 100,
								handler: function() {
								var params = { "session_ID": session_ID };
								Ext.Ajax.request({
									url: "/ecell/python_jy3.cgi",
									    method: "GET",
									    params: params,
									    success: result_graph_success,
									    failure: result_graph_failure
									    });
							    }
							})
						    ]
					    }
					]
				    }]
		    }).show;
    }
};

//Ajax failed  
function handleFailure(response) {
    if (response.responseText !== undefined) {
	alert('Sorry!! Failed (T_T)');
    }
}

var charts = Array();
var result_tabs= Ext.createWidget('tabpanel', {
	border: false,
    
});


function result_graph_success(response) {
    if (response.responseText !== undefined) {
	var resultJSON = JSON.parse(response.responseText);	
	//	console.log(result_tabs);
	//	console.log(resultJSON[0]);
	//	charts.push(show_graph(resultJSON[0].Data, resultJSON[0].Title));
	if ( result_tabs.items.length == 0 ){
	    tabs.add({  
		    title: 'Result' + (tabs_entity.items.length + 1),
			layout: 'fit',
			//			width: '100%',
			//			height: 600,
			//			closable: true,
			items: [ result_tabs ]
			}).show();
	};

	result_tabs.add({
		title: 'Result',
		//                title: 'Result' + (result_tabs.items.length + 1),
		    layout: 'fit',
		    items:[ show_graph(resultJSON[0].Data, resultJSON[0].Title) ]
		    });


    }
}

//Ajax failed
function result_graph_failure(response){ 
    if (response.responseText !== undefined) {
	alert('Sorry!! Missed (T_T)');
    }
}
