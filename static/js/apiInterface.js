const spaceBetween = 30;
let b;
let selected = null;

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
    b = await a.json();

    objects = graph.getCells()
    for (let i = 0; i < objects.length; i++) {
      objects[i].remove();
    }
    objects = [];
    for (let i = 0; i < b["objects"].length; i++) {
      let obj = b["objects"][i];
      var rect = new joint.shapes.standard.Rectangle();
      obj["children"] = [];
      rect.addTo(graph);
      setupRect(obj, rect);

      let parentRect = null;
      // let parentloc = {x: paper.options.width/2, y: 0};
      widtharr = [];
      if (obj["parent"] !== "None" && obj["parent"] !== null) {
        var arrow = new joint.shapes.standard.Link();
        arrow.attr({
          line: {
            stroke: "white",
            strokeWidth: 2,
            wrapper: {
              connection: true,
              strokeWidth: 10,
              strokeLinejoin: "round",
            },
          },
        });
        parentRect = b["objects"][obj["parent"] - 1];
        if (parentRect["childWidths"] == undefined) {
          parentRect["childWidths"] = rect.attributes.size.width + spaceBetween;
        } else {
          parentRect["childWidths"] +=
            rect.attributes.size.width + spaceBetween;
        }

        let saveParent = parentRect;
        while (
          parentRect["parentRect"] !== undefined &&
          parentRect["childWidths"] > parentRect["parentRect"]["childWidths"]
        ) {
          parentRect["parentRect"]["childWidths"] = parentRect["childWidths"];
          parentRect = parentRect["parentRect"];
        }

        parentRect = saveParent;

        obj["parentRect"] = parentRect;
        parentRect["children"].push(obj);
        // parentloc = parentRect.attributes.position

        arrow.target(rect);
        arrow.source(parentRect["reference"]);
        arrow.addTo(graph);
        objects.push(arrow);
      }

      objects.push(rect);
      obj["reference"] = rect;
    }

    let startWidth = 0;
    for (let i = 0; i < b["objects"].length; i++) {
      if (
        b["objects"][i]["parent"] == null ||
        b["objects"][i]["parent"] == "None"
      ) {
        b["objects"][i]["startWidth"] = startWidth;
        b["objects"][i]["widthBelow"] = calcChildWidth(b["objects"][i]);
        startWidth += b["objects"][i]["widthBelow"];
      }
    }

    for (let i = 0; i < b["objects"].length; i++) {
      parentRect = b["objects"][i]["parentRect"];
      let startWidth = null;
      while (parentRect !== undefined) {
        startWidth = parentRect["startWidth"];
        parentRect = parentRect["parentRect"];
      }
      if (startWidth == undefined) {
        startWidth = b["objects"][i]["startWidth"];
      }
      parentRect = b["objects"][i]["parentRect"];
      let height = 10;
      if (parentRect !== undefined) {
        height =
          parentRect["reference"].attributes.size.height +
          parentRect["reference"].attributes.position.y +
          30;
      }
      xpos =
        startWidth +
        b["objects"][i]["widthBelow"] / 2 -
        b["objects"][i]["reference"].attributes.size.width / 2;
      if (parentRect !== undefined) {
        xpos =
          parentRect["reference"].attributes.position.x +
          parentRect["reference"].attributes.size.width / 2 -
          parentRect["widthBelow"] / 2 +
          b["objects"][i]["widthBelow"] / 2 -
          b["objects"][i]["reference"].attributes.size.width / 2 +
          (parentRect["widthBelow"] / parentRect["children"].length) *
            parentRect["children"].indexOf(b["objects"][i]);
      }
      b["objects"][i]["reference"].position(xpos, height);
    }

    paper.transformToFitContent({ padding: 10 });
    document.getElementById('paper-container').scrollTo({top:0, left:0})
    paper.setOrigin(10, 10);
    document.getElementById('scaler').value = 1;
    scalePaper(1);
  } finally {
    document.getElementById("splash").classList.add("hidden");
  }
}

function calcChildWidth(current) {
  let total = 0;
  for (let i = 0; i < current["children"].length; i++) {
    total += calcChildWidth(current["children"][i]);
  }
  if (current["children"].length == 0 || current["children"] == undefined) {
    total = current["reference"].attributes.size.width + spaceBetween;
  }
  current["widthBelow"] = total;
  return total;
}

function setupRect(obj, rect) {
  var textWidth = obj["text"].length * 8; // Adjust this factor as
  let lines = 1;
  if (textWidth > 208) {
    textWidth = 208;
    newtext = obj["text"];
    obj["text"] = "";
    while (newtext.length > 26) {
      lines++;
      last = newtext.substring(0, 26).lastIndexOf(" ");
      obj["text"] += newtext.substring(0, last) + "\n";
      newtext = newtext.substring(last + 1);
    }
    obj["text"] += newtext;
  }
  var textHeight = 20 * lines + 10; // You can adjust this height as needed
  rect.resize(textWidth, textHeight); // Set the size based on text
  rect.attr({
    body: {
      class: "jj-step-body"
    },
    label: {
      text: obj["text"],
      class: "jj-step-text",
    },
  });

  paper.findViewByModel(rect).on("cell:pointerclick", function () {
    console.log('Rectangle clicked');
    selectObject(rect);
  });
}

function selectObject(object) {
  let t = ""
  for (let i = 0; i < b["objects"].length; i++) {
    if (b['objects'][i]['reference'] == object){
      t = b["objects"][i].text.replaceAll("\n", " ");
      selected = b["objects"][i];
      break;
    }
  }
  document.getElementById("textEditor").value = t;
  document.getElementById("objDelete").onclick = () => {
    object.remove();
  };
}

function updateText(){
  let t = document.getElementById('textEditor').value;
  selected['text'] = t;
  setupRect(selected, selected['reference']);
}


function addBox() {
  obj = { text: "New Box Text...", parent: null, children: [] };
  let rect = new joint.shapes.standard.Rectangle();
  obj["reference"] = rect;
  rect.addTo(graph);
  setupRect(obj, rect);
  if(b == undefined) {
    b = {"objects": []}
  }
  b["objects"].push(obj);
}

function scalePaper(scale){
  paper.scale(scale, scale);
}

function scalePaper(){
  let scale = document.getElementById('scaler').value;
  paper.scale(scale,scale);
}
