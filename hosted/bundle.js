"use strict";

var handleNew = function handleNew() {
  redirect({
    redirect: '/maker'
  });
};

var handleEdit = function handleEdit(cardId) {
  console.log(" this is cardId : " + card._id);
  sendAjax('GET', '/edit', cardId, redirect);
  return false;
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
      key: card._id,
      src: card.qrcode,
      createDate: card.createDate,
      alt: "QRCode",
      className: "businessCards",
      onClick: function onClick() {
        handleEdit(card._id);
      }
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
