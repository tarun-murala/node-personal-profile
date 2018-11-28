// ES6 Imports dont work
// const ER_MODEL = require('./mxgraph/er-model.json');
// const DATA_MODEL = require('./mxgraph/data-model.json');

const onLoadMxGraph = () => {
    console.log("Into onLoadMxGraph");
    let mxGraph = new MxGraph();
    mxGraph.processModel(ER_MODEL, "erModel", 
                        false, {width: 80, height: 40});
    mxGraph.processModel(DATA_MODEL, "dataModel",
                        false, {width: 200, height: 40});
}

class MxGraph {
    initialize() {
        console.log("Into MxGraph.initialize()");
    }

    processModel(erModel={}, elementId="erModel", 
                    showMoreInfo=false, settings={width: 80, height:40}) {
        console.log("Into MxGraph.processModel()");
        var container = document.getElementById(elementId);
        if (!mxClient.isBrowserSupported())
            mxUtils.error('Browser is not supported!', 200, false);
        else {
            mxEvent.disableContextMenu(container);
            var graph = new mxGraph(container);
            new mxRubberband(graph);
            
            var parent = graph.getDefaultParent();
            graph.getModel().beginUpdate();

            // Changes the default vertex style in-place
            var style = graph.getStylesheet().getDefaultVertexStyle();
            style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
            style[mxConstants.STYLE_GRADIENTCOLOR] = 'white';
            style[mxConstants.STYLE_PERIMETER_SPACING] = 6;
            // style[mxConstants.STYLE_ROUNDED] = true;
            style[mxConstants.STYLE_SHADOW] = true;
            style = graph.getStylesheet().getDefaultEdgeStyle();

            // Creates a layout algorithm to be used with the graph
            var layout = new mxHierarchicalLayout(graph);
            try {
                this.drawTableWithRelationships(graph, parent, 
                        erModel, settings);
                // Executes the layout
					layout.execute(parent);
            } finally {
                graph.getModel().endUpdate();
            }
        }
    }

    createVertex (graph, parent, settings, {label, name, table_sys_id}) {
        console.log("Into MxGraph.createVertex() -> " + label + " | " + name);
        var {width, height} = settings;
        var vertex = graph.insertVertex(parent, null, label, 0, 0, width, height);
        return vertex; 
    }

    createEdge (graph, parent, parentVertex, childVertex) {
        var edge = graph.insertEdge(parent, null, '', parentVertex, childVertex);
        return edge;
    }

    drawTableWithRelationships(graph, parent, erModel, settings) {
        var pVertex = this.createVertex(graph, parent, settings, erModel.table);
        this.drawRelatedVetrices(graph, parent, settings, pVertex, erModel.relationships);
    }

    drawRelatedVetrices(graph, parent, settings, pVertex, relationships=[]) {
        if(relationships) {
            relationships.forEach(relatedTable => {
                var rVertex = this.createVertex(graph, parent, settings, relatedTable.table);
                var rEdge = this.createEdge(graph, parent, pVertex, rVertex);
                this.drawRelatedVetrices(graph, parent, settings, rVertex, relatedTable.relationships);
            });
        }
    }
}

const ER_MODEL = {
    "table": {
        "name": "pm_portfolio",
        "label": "Portfolio",
        "table_sys_id": "707a04579f312300730e5bb0657fcf2b"
    },
    "relationships": [ 
        {
            "table": {
                "name": "pm_program",
                "label": "Program",
                "table_sys_id": "c99ac4979f312300730e5bb0657fcf12",
                "related_column": "portfolio"
            },
            "relationships": [
                {
                    "table": {
                        "name": "pm_program_task",
                        "label": "Program Task",
                        "table_sys_id": "959ac4979f312300730e5bb0657fcf31",
                        "related_column": "parent" 
                    },
                    "relationships": []
                }
            ]
        },
        {
            "table": {
                "name": "pm_project",
                "label": "Project",
                "table_sys_id": "d57a04579f312300730e5bb0657fcf9f",
                "related_column": "primary_portfolio"
            },
            "relationships": [
                {
                    "table": {
                        "name": "pm_project_task",
                        "label": "Project Task",
                        "table_sys_id": "b07a04579f312300730e5bb0657fcf1b",
                        "related_column": "parent"
                    },
                    "relationships": []
                },
                {
                    "table": {
                        "name": "resource_plan",
                        "label": "Resource Plan",
                        "table_sys_id": "9d8a4c579f312300730e5bb0657fcf44",
                        "related_column": "top_task" 
                    },
                    "relationships":[]
                },
                {
                    "table": {
                        "name": "cost_plan",
                        "label": "Cost Plan",
                        "table_sys_id": "fcba04d79f312300730e5bb0657fcf43",
                        "related_column": "top_task" 
                    },
                    "relationships": []
                },
                {
                    "table": {
                        "name": "benefit_plan",
                        "label": "Benefit Plan",
                        "table_sys_id": "60bac0d79f312300730e5bb0657fcf70",
                        "related_column": "top_task" 
                    },
                    "relationships": []
                }
            ]
        },
        {
            "table": {
                "name": "dmn_demand",
                "label": "Demand",
                "table_sys_id": "337a48579f312300730e5bb0657fcfc7",
                "related_column": "portfolio" 
            },
            "relationships":[]
        }
    ]
};

const DATA_MODEL = {
    "table": {
        "name": "pm_portfolio",
        "label": "IT Applications Modernization",
        "sys_id": "707a04579f312300730e5bb0657fcf2b",
        "table_sys_id": "707a04579f312300730e5bb0657fcf2b"
    },
    "relationships": [ 
        {
            "table": {
                "name": "pm_program",
                "label": "Online Payments Security enhancements",
                "sys_id": "c99ac4979f312300730e5bb0657fcf12",
                "table_sys_id": "c99ac4979f312300730e5bb0657fcf12",
                "related_column": "portfolio"
            },
            "relationships": [
                {
                    "table": {
                        "name": "pm_program_task",
                        "label": "Program Task",
                        "sys_id": "959ac4979f312300730e5bb0657fcf31",
                        "table_sys_id": "959ac4979f312300730e5bb0657fcf31",
                        "related_column": "parent" 
                    }
                }
            ]
        },
        {
            "table": {
                "name": "pm_project",
                "label": "Workforce Planning Tool",
                "sys_id": "d57a04579f312300730e5bb0657fcf9f",
                "table_sys_id": "d57a04579f312300730e5bb0657fcf9f",
                "related_column": "primary_portfolio"
            },
            "relationships": [
                {
                    "table": {
                        "name": "pm_project_task",
                        "label": "Project Task 1",
                        "sys_id": "b07a04579f312300730e5bb0657fcf1b",
                        "table_sys_id": "b07a04579f312300730e5bb0657fcf1b",
                        "related_column": "parent" 
                    }
                },
                {
                    "table": {
                        "name": "resource_plan",
                        "label": "Resource Plan 1",
                        "sys_id": "9d8a4c579f312300730e5bb0657fcf44",
                        "table_sys_id": "9d8a4c579f312300730e5bb0657fcf44",
                        "related_column": "top_task" 
                    }
                },
                {
                    "table": {
                        "name": "cost_plan",
                        "label": "Cost Plan 1",
                        "sys_id": "fcba04d79f312300730e5bb0657fcf43",
                        "table_sys_id": "fcba04d79f312300730e5bb0657fcf43",
                        "related_column": "top_task" 
                    }
                },
                {
                    "table": {
                        "name": "benefit_plan",
                        "label": "Benefit Plan 1",
                        "sys_id": "60bac0d79f312300730e5bb0657fcf70",
                        "table_sys_id": "60bac0d79f312300730e5bb0657fcf70",
                        "related_column": "top_task" 
                    }
                }
            ]
        },
        {
            "table": {
                "name": "dmn_demand",
                "label": "Implement Sales Quoting system",
                "sys_id": "337a48579f312300730e5bb0657fcfc7",
                "table_sys_id": "337a48579f312300730e5bb0657fcfc7",
                "related_column": "portfolio" 
            }
        }
    ]
};