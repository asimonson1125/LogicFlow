const spaceBetween = 30;
let b;
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

    for (let i = 0; i < objects.length; i++) {
      objects[i].remove();
    }
    objects = [];
    for (let i = 0; i < b["objects"].length; i++) {
      let obj = b["objects"][i];
      var rect = new joint.shapes.standard.Rectangle();
      var textWidth = obj["text"].length * 8; // Adjust this factor as
      obj["children"] = [];
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
      widtharr = [];
      if (obj["parent"] !== "None" && obj["parent"] !== null) {
        var arrow = new joint.shapes.standard.Link();
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

        arrow.source(parentRect["reference"]);
        arrow.target(rect);
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
        // xpos =
        //   startWidth + b["objects"][i]["widthBelow"] / 2 - b["objects"][i]['reference'].attributes.size.width/2 +
        //   (parentRect["widthBelow"] / parentRect["children"].length) *
        //     parentRect["children"].indexOf(b["objects"][i]);
      }
      b["objects"][i]["reference"].position(xpos, height);
      // let additional = 0;
      // if (parentRect == undefined){
      //   cw = colWidth;
      // }
      // else if (parentRect['childrenUsed'] == undefined){
      //   b["objects"][i]["childWidths"] == undefined ? parentRect['childrenUsed'] = b['objects'][i]['reference'].attributes.size.width + spaceBetween : parentRect['childrenUsed'] = b["objects"][i]["childWidths"];
      //   cw = colWidth/parentRect['children'].length;
      // } else {
      //   additional = parentRect['childrenUsed'];
      //   cw = (colWidth/parentRect['children'].length);
      //   parentRect['childrenUsed'] += b['objects'][i]['reference'].attributes.size.width + spaceBetween
      // }
      // b["objects"][i]["reference"].position(startWidth + (cw/2) + additional, height);
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

function calcChildWidth(current) {
  let total = 0;
  for (let i = 0; i < current["children"].length; i++) {
    total += calcChildWidth(current["children"][i]);
  }
  console.log(current);
  if (current["children"].length == 0 || current["children"] == undefined) {
    total = current["reference"].attributes.size.width + spaceBetween;
  }
  current["widthBelow"] = total;
  console.log(total, current);
  return total;
}
