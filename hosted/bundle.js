"use strict";

var handleNew = function handleNew() {
  redirect({
    redirect: '/maker'
  });
};

var UI = function UI() {
  return /*#__PURE__*/React.createElement("img", {
    src: "/assets/img/new.png",
    alt: "new",
    onClick: handleNew
  });
};

var QRList = function QRList(props) {
  if (props.businessCards.length === 0) {
    return /*#__PURE__*/React.createElement("p", null, "no businessCards code yet");
  }

  var qrNodes = props.businessCards.map(function (card) {
    return /*#__PURE__*/React.createElement("img", {
      key: businessCards._id,
      src: businessCards.qrcode,
      alt: "QRCode",
      className: "businessCards"
    });
  });
  return qrNodes;
};

var loadBusinessCardFromServer = function loadBusinessCardFromServer() {
  sendAjax('GET', '/getQRCodes', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(QRList, {
      businessCards: data.businessCards
    }), document.querySelector("#businessCards"));
  });
};

var setup = function setup() {
  ReactDOM.render( /*#__PURE__*/React.createElement(UI, null), document.querySelector("#new"));
  ReactDOM.render( /*#__PURE__*/React.createElement(QRList, {
    businessCards: []
  }), document.querySelector("#businessCards"));
  loadBusinessCardFromServer();
};

$(document).ready(function () {
  setup();
});
// const handleCreate = (e) =>{
//     e.preventDefault();
//     $("#messageBox").animate({width:'hide'}, 350);
//     if($("#domoName").val() == '' || $("#domoAge").val() == ''){
//         handleError("All fields are required");
//         return false;
//     }
//     sendAjax('POST', $("#domoForm").attr("action"),$("#domoForm").serialize(), function(){
//         loadDomosFromServer();
//     })
//     return false;
// }
// const DomoForm = (props) =>{
//     return (
//         <form id="domoForm"
//             onSubmit={handleDomo}
//             name="domoForm"
//             action="/maker"
//             method="POST"
//             className="domoForm"
//             >
//             <label htmlFor="name">Name: </label>
//             <input id="domoName" type="text" name="name" placeholder="Domo Name"/>
//             <label htmlFor="age">Age: </label>
//             <input id="domoAge" type="text" name="age" placeholder="Domo Age"/>
//             <input type="hidden" name="_csrf" value={props.csrf} />
//             <input type="submit" className="makeDomoSubmit" value="Make Domo"/>
//         </form>
//     );
// }
// const setup = function(csrf){
//     ReactDOM.render(
//         <DomoForm csrf={csrf} />, document.querySelector("#makeDomo")
//     );
//     ReactDOM.render(
//         <DomoList domos={[]} />, document.querySelector("#domos")
//     );
//     loadDomosFromServer();
// };
// const getToken = () =>{
//     sendAjax('GET', '/getToken', null, (result) =>{
//         setup(result.csrfToken);
//     });
// };
// $(document).ready(function(){
//     getToken();
// });
"use strict";
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#messageBox").animate({
    width: 'toggle'
  }, 350);
};

var redirect = function redirect(response) {
  $("#messageBox").animate({
    width: 'hide'
  }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
