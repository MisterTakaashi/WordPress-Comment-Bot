const htmlToJson = require('html-to-json');

///////////////////////////////////////////////
//             POST DU COMMENTAIRE           //
///////////////////////////////////////////////

exports.getCommentId = function(url){
  var formElement = getFormElements(url, function(formElement){
    for (i in formElement) {
      if (typeof formElement[i].attribs != "undefined"){
        if (formElement[i].attribs.class == "form-submit"){
          for (l in formElement[i].children){
            if (typeof formElement[i].children[l].attribs != "undefined" && formElement[i].children[l].attribs.name == "comment_post_ID"){
              console.log("id: " + formElement[i].children[l].attribs.value);
            }
          }
          // console.log(formElement.children);
        }
      }
    }
  });
}

exports.getSecus = function(url){
  var secus = [];

  var formElement = getFormElements(url, function(formElement){
    for (i in formElement) {
      if (typeof formElement[i].attribs != "undefined"){
        if (formElement[i].attribs.style == "display: none;"){
          // console.log(formElement[i].children);
          for (l in formElement[i].children) {
            if (typeof formElement[i].children[l].attribs != "undefined"){
              console.log("Sécurité bypass: " + formElement[i].children[l].attribs.id);
              secus.push({type: formElement[i].children[l].attribs.id, value: formElement[i].children[l].attribs.value})
            }
          }
          // console.log(secus);
        }
      }
    }
  });
}

exports.post = function(url, akismet){
  var postData = querystring.stringify({
    'author' : 'Malwok',
    'email' : 'contact@malwok.com',
    'url' : 'https://malwok.com',
    'comment' : 'C\'est vraiment cool !',
    'comment_post_ID' : '5174',
    'comment_parent' : '0',
    'akismet_comment_nonce' : '99eb8ef7a5'
  });

  var options = {
    hostname: 'madmoizerg.com',
    port: 80,
    path: '/wp-comments-post.php',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': postData.length
    }
  };

  var req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
      console.log('No more data in response.')
    })
  });

  req.on('error', (e) => {
    console.log(`problem with request: ${e.message}`);
  });

  // write data to request body
  req.write(postData);
  req.end();
}


getFormElements = function(url, callback){
  var json = [];

  var promise = htmlToJson.request(url, {
    'form': ['form', function ($form) {
      if ($form.attr('action').match(/wp-comments-post.php/)){
        return $form;
      }
    }]
  }, function (err, result) {
    for (var i = 0; i < result.form.length; i++) {
      if (result.form[i] != "undefined"){
        // console.log(result.form[i]);

        for (j in result.form[i]) {
          if (typeof result.form[i][j].children != "undefined"){
            // console.log(result.form[i][j].children);
            for (k in result.form[i][j].children) {
              if (typeof result.form[i][j].children[k].attribs != "undefined"){
                json.push(result.form[i][j].children[k]);
              }
            }
          }
        }
      }
    }

    callback(json);
    return;
  });
}
