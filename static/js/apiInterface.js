async function submitForm(id) {
  document.getElementById("splash").classList.remove("hidden");
  try {
    // debugger;
    const ins = Array.from(document.querySelectorAll(`#${id} textarea`)).concat(
      Array.from(document.querySelectorAll(`#${id} input`))
    );
    data = {};
    for (let i = ins.length - 1; i >= 0; i -= 1) {
      if (ins[i].type == 'submit') {
        continue;
      }
      data[ins[i].name] = ins[i].value;
    }
    let a = await fetch(`/api/${id}`, {
      method: "post",
      body: JSON.stringify(data),
    });
    let b = await a.json();
    document.getElementById('flowchart');
    flowchart.innerHTML = '';
    for(let i = 0; i < b['objects'].length; i++){
      let obj = b['objects'][i];
      flowchart.innerHTML += `<div id="${obj['id']}" class="node"><p>${obj['text']}</p></div>`
    }
  } finally {
    document.getElementById("splash").classList.add("hidden");
  }
}
