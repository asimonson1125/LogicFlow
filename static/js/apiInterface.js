const spaceBetween = 30;

async function submitForm(id) {
  document.getElementById("splash").classList.remove("hidden");
  try {
    // debugger;
    const ins = Array.from(document.querySelectorAll(`#${id} textarea`)).concat(
      Array.from(document.querySelectorAll(`#${id} input`))
    );
    data = {};
    for (let i = ins.length - 1; i >= 0; i -= 1) {
      if (ins[i].type == "submit") {
        continue;
      }
      data[ins[i].name] = ins[i].value;
    }
    let a = await fetch(`/api/${id}`, {
      method: "post",
      body: JSON.stringify(data),
    });
    let b = await a.json();

    for (let i = 0; i < objects.length; i++) {
      objects[i].remove();
    }
    objects = [];
    for (let i = 0; i < b["objects"].length; i++) {
      let obj = b["objects"][i];
      var rect = new joint.shapes.standard.Rectangle();
      var textWidth = obj['text'].length * 8; // Adjust this factor as 
      let lines = 1;
      if (textWidth > 208) {
        textWidth = 208;
        newtext = obj['text'];
        obj['text'] = "";
        while(newtext.length > 26){
          lines++;
          last = newtext.substring(0,26).lastIndexOf(" ");
          obj['text'] += newtext.substring(0, last) + "\n";
          newtext = newtext.substring(last+1);
        }
        obj['text'] += newtext;
      }
      var textHeight = 20 * lines + 10; // You can adjust this height as needed
      rect.resize(textWidth, textHeight); // Set the size based on text
      rect.attr({
        body: {
          fill: "lightgray",
        },
        label: {
          text: obj["text"],
          fill: "black",
        },
      });
      rect.addTo(graph);

      let parentRect = null;
      // let parentloc = {x: paper.options.width/2, y: 0};
      widtharr = []
      if (obj["parent"] !== "None" && obj["parent"] !== null) {
        var arrow = new joint.shapes.standard.Link();
        parentRect = b["objects"][obj["parent"] - 1];
        if (parentRect['childWidths'] == undefined){
          parentRect['childWidths'] = rect.attributes.size.width + spaceBetween;
        } else { parentRect['childWidths'] += rect.attributes.size.width + spaceBetween;}

        let saveParent = parentRect;
        while (parentRect['parentRect'] !== undefined && parentRect['childWidths'] > parentRect['parentRect']['childWidths']){
          parentRect['parentRect']['childWidths'] == parentRect['childWidths'];
          parentRect = parentRect['parentRect'];
        }
        parentRect = saveParent;

        obj['parentRect'] = parentRect;
        // parentloc = parentRect.attributes.position
        
        arrow.source(parentRect['reference']);
        arrow.target(rect);
        arrow.addTo(graph);
        objects.push(arrow);
      }

      objects.push(rect);
      obj["reference"] = rect;
    }
    
    widtharr = [0];
    for (let i = 0; i < b["objects"].length; i++) {
      depth = 0;
      parentRect = b['objects'][i]['parentRect'];
      while(parentRect !== undefined){
        depth++;
        parentRect = parentRect['parentRect'];
      }
      parentRect = b['objects'][i]['parentRect'];
      while (widtharr.length <= depth){
        widtharr.push(0);
      }
      let height = 10;
      if(parentRect !== undefined){
        height = parentRect['reference'].attributes.size.height + parentRect['reference'].attributes.position.y + 30;
      }
      // debugger;
      let cw = b['objects'][i]['childWidths'] == undefined ? 0 : b['objects'][i]['childWidths']/2;
      b['objects'][i]['reference'].position(widtharr[depth] + cw, height);
      widtharr[depth] = b['objects'][i]['reference'].attributes.size.width + b['objects'][i]['reference'].attributes.position.x + spaceBetween;
    }

    paper.transformToFitContent();

    document.getElementById("flowchart");
    flowchart.innerHTML = "";
    for (let i = 0; i < b["objects"].length; i++) {
      let obj = b["objects"][i];
      flowchart.innerHTML += `<div id="${obj["id"]}" class="node"><p>${obj["text"]}</p></div>`;
    }
  } finally {
    document.getElementById("splash").classList.add("hidden");
  }
}
