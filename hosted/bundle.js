"use strict";

var csrfToken = null;

var handleNew = function handleNew() {
  redirect({
    redirect: '/maker'
  });
};

var handleEdit = function handleEdit(_cardId) {
  console.log(" this is cardId : " + _cardId);
  $.ajaxSetup({
    headers: {
      'X-CSRF-TOKEN': csrfToken
    }
  });
  sendAjax('POST', '/edit', {
    "cardId": _cardId
  }, redirect);
  return false;
};

var UI = function UI(props) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
    src: "/assets/img/new.png",
    alt: "new",
    onClick: handleNew
  }));
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

var setup = function setup(_csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(UI, {
    csrf: _csrf
  }), document.querySelector("#new"));
  ReactDOM.render( /*#__PURE__*/React.createElement(QRList, {
    businessCards: []
  }), document.querySelector("#businessCards"));
  loadBusinessCardFromServer();
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    csrfToken = result.csrfToken;
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
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
