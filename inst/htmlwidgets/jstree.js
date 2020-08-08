function extractKeys(list) {
  return {
    text: list.text,
    data: list.data,
    children: list.children.map(extractKeys)
  };
}

function getNodes(json) {
  return json.map(extractKeys);
}

var inShiny = HTMLWidgets.shinyMode;


HTMLWidgets.widget({

  name: 'jstree',

  type: 'output',

  factory: function(el, width, height) {

    var $el = $(el);
    var options = {};
    var id = el.id + ":jsTreeR.list",
      id_selected = el.id + "_selected:jsTreeR.list";

    return {

      renderValue: function(x) {

        var plugins = [];
        if(x.checkbox) {
          plugins.push('checkbox');
        }
        if(x.search) {
          plugins.push('search');
        }
        if(x.dragAndDrop) {
          plugins.push('dnd');
        }
        if(x.types) {
          plugins.push('types');
        }
        if(x.unique) {
          plugins.push('unique');
        }
        if(x.sort) {
          plugins.push('sort');
        }
        if(x.wholerow) {
          plugins.push('wholerow');
        }
        if(x.contextMenu) {
          plugins.push('contextmenu');
        }
        options.plugins = plugins;

        options.core = {
          'data': x.data,
          'check_callback': x.checkCallback
        };

        if(x.types)
          options.types = x.types;

        if(x.dnd)
          options.dnd = x.dnd;

        $el.jstree(options);


        $el.on("ready.jstree", function(e, data) {
          if(inShiny) {
            Shiny.setInputValue(
              id, getNodes(data.instance.get_json())
            );
            Shiny.setInputValue(
              id_selected, getNodes(data.instance.get_selected(true))
            );
          }
        });

        $el.on("move_node.jstree", function(e, data) {
          if(inShiny)
            Shiny.setInputValue(
              id, getNodes(data.instance.get_json())
            );
        });

        $el.on("changed.jstree", function(e, data) {
          if(inShiny) {
            Shiny.setInputValue(
              id, getNodes(data.instance.get_json())
            );
            Shiny.setInputValue(
              id_selected, getNodes(data.instance.get_selected(true))
            );
          }
        });

      },

      resize: function(width, height) {

        // TODO: code to re-render the widget with a new size

      }

    };
  }
});
