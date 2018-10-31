// this file defines helper functions
// load some information from files, not the entire data
function loadFile(file, options){
  var typeAndExt = file.type.split('/');
  let name = file.name;
  // key is the name without the extension, e.g. if name: "image.png", key: "image"
  let key = name.substring(0, name.lastIndexOf('.'));
  let type = options.type || typeAndExt[0];
  let fileType = typeAndExt[1];
  (options.onload || function(){})({name, key, type, fileType});
}

// parse the json from a json file
function loadJSON(file, options){
  let name = file.name;
  // key is the name without the extension, e.g. if name: "image.png", key: "image"
  let key = options.key || name.substring(0, name.lastIndexOf('.'));
  let type = options.type || 'json';
  let fileType = 'json';

  var fr = new FileReader();
  fr.onload = (event)=>{
    let data = JSON.parse(event.target.result);
    let result = {name,key,type,fileType,data};
    options.onload(result);
  }
  fr.readAsText(file);
}

// helper function to generate bootstrap notifications
function notify(config){
  $.notify({
    //options
    message: config.message
  }, {
    //settings
    type: config.type || 'notice',
    delay: 1000,
    allow_dismiss: false,
    placement: {
      from: 'bottom',
      align: 'right',
    },
    animate: {
      enter: "animated fadeInDown",
      exit: "animated fadeOutDown",
    }
  })
}

function loadGameData(callback){
  const gameId = $('#user-data')[0].dataset.gameId;
  // make request to server to retrieve game json data
  $.ajax(`/games/${gameId}/data`, {
    success: (data)=>{
      notify({
        message: "Successfully loaded game",
        type: "success"
      })
      callback(data);
    },
    error: (error)=>{
      console.log(error);
      notify({
        message: "Failed to retrieve game data.",
        type: "danger"
      })
    }
  })
}