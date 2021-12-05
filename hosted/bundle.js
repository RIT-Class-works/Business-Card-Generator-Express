"use strict";

var csrfToken = null;
var purchased = false;
var numbCardCreated = 0;

var handleNew = function handleNew() {
  if (numbCardCreated >= 2 && purchased == false) {
    handleError("You had reach the maxium amount of business card created for free");
  } else {
    redirect({
      redirect: '/maker'
    });
  }
};

var handlePurchase = function handlePurchase() {
  console.log("call");
  $.ajaxSetup({
    headers: {
      'X-CSRF-TOKEN': csrfToken
    }
  });
  sendAjax('POST', '/purchase', null, function (data) {
    console.log(data.purchased);
    purchased = data.purchased;
    ReactDOM.render( /*#__PURE__*/React.createElement(Ads, {
      message: "Thank you For Purchase. Enjoy your unlimited card generation"
    }), document.querySelector("#ads"));
  });
};

var getPurchase = function getPurchase() {
  sendAjax('GET', '/account', null, function (data) {
    console.log(data.account.purchased);
    purchased = data.account.purchased;
    setup();
  });
};

var LoadEditPage = function LoadEditPage(_cardId) {
  console.log(" this is cardId : " + _cardId);
  $.ajaxSetup({
    headers: {
      'X-CSRF-TOKEN': csrfToken
    }
  });
  sendAjax('GET', '/edit', {
    "cardId": _cardId
  }, redirect);
  return false;
};

var handleDelete = function handleDelete(_cardId) {
  console.log(" this is cardId : " + _cardId);
  $.ajaxSetup({
    headers: {
      'X-CSRF-TOKEN': csrfToken
    }
  });
  sendAjax('POST', '/delete', {
    "cardId": _cardId
  }, redirect);
  return false;
};

var handlePasswordChange = function handlePasswordChange(e) {
  e.preventDefault();

  if ($("#oldPass").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
    handleError("All field are required");
    return false;
  }

  sendAjax('POST', $("#passwordChange").attr("action"), $("#passwordChange").serialize(), function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(Ads, {
      message: data.message
    }), document.querySelector("#ads"));
  });
  ;
  return false;
};

var openPasswordChange = function openPasswordChange() {
  ReactDOM.render( /*#__PURE__*/React.createElement(PasswordChangeWindow, null), document.querySelector("#content"));
};

var closeOptionWindow = function closeOptionWindow() {
  var opened = false;
  ReactDOM.render( /*#__PURE__*/React.createElement(OptionWindow, {
    id: [],
    open: opened
  }), document.querySelector("#pop-up-window"));
};

var openOptionWindow = function openOptionWindow(_id) {
  var opened = true;
  ReactDOM.render( /*#__PURE__*/React.createElement(OptionWindow, {
    id: _id,
    open: opened
  }), document.querySelector("#pop-up-window"));
};

var OptionWindow = function OptionWindow(props) {
  console.log(props.open);

  if (props.open) {
    return /*#__PURE__*/React.createElement("div", {
      className: "pop-up"
    }, /*#__PURE__*/React.createElement("div", {
      className: "pop-up-content"
    }, /*#__PURE__*/React.createElement("div", {
      id: "close",
      className: "close",
      onClick: closeOptionWindow
    }, "+"), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        LoadEditPage(props.id);
      }
    }, "Edit"), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        handleDelete(props.id);
      }
    }, "Delete")));
  } else {
    return;
  }
};

var Ads = function Ads(props) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, props.message));
};

var PasswordChangeWindow = function PasswordChangeWindow() {
  return /*#__PURE__*/React.createElement("form", {
    id: "passwordChange",
    name: "passwordChange",
    onSubmit: handlePasswordChange,
    action: "/passwordChange",
    method: "POST",
    className: "mainForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "oldpass"
  }, "Old Password: "), /*#__PURE__*/React.createElement("input", {
    id: "oldPass",
    type: "password",
    name: "oldPass",
    placeholder: "Old password",
    required: true
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "pass"
  }, "New Password: "), /*#__PURE__*/React.createElement("input", {
    id: "pass",
    type: "password",
    name: "newPass",
    placeholder: "new password",
    required: true
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "pas2"
  }, "Retype Password: "), /*#__PURE__*/React.createElement("input", {
    id: "pass2",
    type: "password",
    name: "newPass2",
    placeholder: "retype password",
    required: true
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: csrfToken
  }), /*#__PURE__*/React.createElement("input", {
    className: "formSubmit",
    type: "submit",
    value: "Change"
  }));
};

var QRList = function QRList(props) {
  var ui = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
    src: "/assets/img/new.png",
    alt: "new",
    onClick: handleNew
  }), /*#__PURE__*/React.createElement("p", null));

  if (props.businessCards.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      id: "businessCards"
    }, ui);
  }

  numbCardCreated = 0;
  var qrNodes = props.businessCards.map(function (card) {
    numbCardCreated++;
    return /*#__PURE__*/React.createElement("div", {
      key: card._id
    }, /*#__PURE__*/React.createElement("img", {
      key: card._id,
      src: card.qrcode,
      alt: "QRCode",
      onClick: function onClick() {
        openOptionWindow(card._id);
      }
    }), /*#__PURE__*/React.createElement("p", null, card.cardName, " "));
  });
  return /*#__PURE__*/React.createElement("div", {
    id: "businessCards"
  }, ui, qrNodes);
};

var loadBusinessCardFromServer = function loadBusinessCardFromServer() {
  sendAjax('GET', '/getQRCodes', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(QRList, {
      businessCards: data.businessCards
    }), document.querySelector("#content"));
  });
};

var setup = function setup() {
  $("#gear").click(function () {
    if ($("#drop-down-list").css("visibility") == "hidden") {
      $("#drop-down-list").css({
        "visibility": "visible"
      });
    } else {
      $("#drop-down-list").css({
        "visibility": "hidden"
      });
    }
  });
  $("#pay").click(handlePurchase);
  $("#password-change").click(openPasswordChange);
  var _message = "Pay a one-time fee to unlock unlimited card creation";
  console.log(purchased);

  if (purchased) {
    _message = "Thank you For Purchase. Enjoy your unlimited card generation";
  }

  ReactDOM.render( /*#__PURE__*/React.createElement(Ads, {
    message: _message
  }), document.querySelector("#ads"));
  ReactDOM.render( /*#__PURE__*/React.createElement(QRList, {
    businessCards: []
  }), document.querySelector("#content"));
  loadBusinessCardFromServer();
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (data) {
    csrfToken = data.csrfToken;
    getPurchase();
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message); //$("#messageBox").animate({width:'toggle'}, 350);

  $("#messageBox").show();
};

var redirect = function redirect(response) {
  //$("#messageBox").animate({width:'hide'}, 350);
  $("#messageBox").hide();
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
