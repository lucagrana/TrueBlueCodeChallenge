// Load infos in the details page
function loadList() {
    let elementGroup = '';
    let elements;
    let req = new XMLHttpRequest();
    req.onreadystatechange = function() {
      if (this.readyState == XMLHttpRequest.DONE && (this.status == 200 || this.status == 304)) {
        elements = JSON.parse(this.response);
        for (let i = 0; i < elements.length; i++) {
            elementGroup += '<li onclick=getPageDetails("'+elements[i]._id+'")>'+elements[i].title+'</li>';
        }
        document.getElementById("showList").innerHTML = elementGroup;
      }
      else if (this.readyState == XMLHttpRequest.DONE && this.status != 200) {
        console.log("ERRORE: "+this.status);
      }
    };
    req.open("GET", "http://localhost:3000/list");
    req.send();
}

// Go to details page
function getPageDetails(id) {
    window.location = 'details.html?id='+id;
}

// Load infos in the details page
function loadDetails() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id');
    
    let elements;
    let elementGroup = '';

    let req = new XMLHttpRequest();
    req.onreadystatechange = function() {
      if (this.readyState == XMLHttpRequest.DONE && (this.status == 200 || this.status == 304)) {
        elements = JSON.parse(this.response);
        const data = new Date(elements.expiringDate);
        elementGroup = '<h1>'+elements.title+'</h1><p>'+elements.description+'</p><p> Stato: '+elements.status+
        '</p><p> Data scadenza: ' + data.getDate()+ '-' + (data.getMonth() + 1) + '-' + data.getFullYear() + '</p>' + 
        '<button type="button" class="buttonCanc" onclick=deleteElement("'+elements._id+'")>Elimina</button>' +
        '<button type="button" id="modBtn" class="buttonConfirm"  onclick=getPageModify("'+elements._id+'")>Modifica</button>';
        document.getElementById("singleElement").innerHTML = elementGroup;
      }
      else if (this.readyState == XMLHttpRequest.DONE && this.status != 200) {
        console.log("ERRORE: "+this.status);
      }
    };
    req.open("GET", "http://localhost:3000/list/"+id);
    req.send();
}

// Delete an element
function deleteElement(id) {
    if(!window.confirm("Sei sicuro di voler cancellare l'elemento?")) {
        return false;
      }
    let req = new XMLHttpRequest();
    req.onreadystatechange = function() {
      if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
        window.location.replace('index.html');
      }
      else if (this.readyState == XMLHttpRequest.DONE && this.status != 200) {
        console.console.log("ERRORE: "+this.status);
      }
    };
    req.open('DELETE', "http://localhost:3000/list/"+id);
    req.send();
}

// Go to modify page
function getPageModify(id) {
    window.location = 'modify.html?id='+id;
}

// Load infos in the mod page
function loadModify() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id');

    let elements;

    let req = new XMLHttpRequest();
    req.onreadystatechange = function() {
      if (this.readyState == XMLHttpRequest.DONE && (this.status == 200 || this.status == 304)) {
        elements = JSON.parse(this.response);
        const data = new Date(elements.expiringDate);
        let month, day;
        if ((data.getMonth()+1) <10) {
          month = '0'+ (data.getMonth()+1);
        } else {
          month = data.getMonth()+1;
        }
        if (data.getDate() <10) {
          day = '0'+ (data.getDate()+1);
        } else {
          day = data.getDate();
        }
        //document.getElementById('id').value = elements._id;
        document.getElementById('title').value=elements.title;
        document.getElementById('description').value=elements.description;
        document.getElementById('status').value=elements.status;
        document.getElementById('expiringDate').value="" + data.getFullYear() + "-" + month + "-" + day;
        
      }
      else if (this.readyState == XMLHttpRequest.DONE && (this.status != 200 || this.status != 304)) {
        console.log("ERRORE: "+this.status);
      }
    };
    req.open("GET", "http://localhost:3000/list/"+id);
    req.send();
}

// Apply the mod
function applyMod() {
    if (document.getElementById('title').value == "") {
      alert("INSERIRE TITOLO");
      return false;
    }
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id');

    let date = new Date(document.getElementById('expiringDate').value);

    if (document.getElementById('title').value == "") {
      alert("INSERIRE TITOLO");
      return false;
    }
    if (document.getElementById('expiringDate').value == "") {
      alert("INSERIRE DATA");
      return false;
    }
    const dateNow = new Date(Date.now());
    if (date.getFullYear()<dateNow.getFullYear() || (date.getFullYear()==dateNow.getFullYear() && date.getMonth()<dateNow.getMonth())
    || (date.getFullYear()==dateNow.getFullYear() && date.getMonth()==dateNow.getMonth() && date.getDate() < dateNow.getDate())) {
      alert("IMPOSSIBILE INSERIRE UNA DATA DI SCADENZA PASSATA");
      return false;
    }

    
    let req = new XMLHttpRequest();
    req.onreadystatechange = function() {
      if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
        window.location = 'index.html';
        
      }
      else if (this.readyState == XMLHttpRequest.DONE && this.status != 200) {
        console.console.log("ERRORE: "+this.status);
      }
    };
    req.open("PATCH", "http://localhost:3000/list/"+id);
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify({title:document.getElementById('title').value, description:document.getElementById('description').value, status:document.getElementById('status').value, expiringDate:""+date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()}));  
}

// Add a new element
function addElement() {
  if (document.getElementById('title').value == "") {
    alert("INSERIRE TITOLO");
    return false;
  }
  if (document.getElementById('expiringDate').value == "") {
    alert("INSERIRE DATA");
    return false;
  }
  const date = new Date(document.getElementById('expiringDate').value);
  const dateNow = new Date(Date.now());
  if (date.getFullYear()<dateNow.getFullYear() || (date.getFullYear()==dateNow.getFullYear() && date.getMonth()<dateNow.getMonth())
  || (date.getFullYear()==dateNow.getFullYear() && date.getMonth()==dateNow.getMonth() && date.getDate() < dateNow.getDate())) {
    alert("IMPOSSIBILE INSERIRE UNA DATA DI SCADENZA PASSATA");
    return false;
  }
  let req = new XMLHttpRequest();
  req.onreadystatechange = function() {
    if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
      window.location = 'index.html';
      
    }
    else if (this.readyState == XMLHttpRequest.DONE && this.status != 200) {
      console.console.log("ERRORE: "+this.status);
    }
  };
  req.open("POST", "http://localhost:3000/list/");
  req.setRequestHeader("Content-Type", "application/json");
  req.send(JSON.stringify({title:document.getElementById('title').value, description:document.getElementById('description').value, status:document.getElementById('status').value, expiringDate:""+date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()}));  
}