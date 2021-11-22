"use strict";

var QRCode = function QRCode(props) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
    src: props.url,
    alt: "qrcode"
  }));
};

var loadQRCode = function loadQRCode() {
  sendAjax('GET', '/getLastAdded', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(QRCode, {
      url: data.businessCard.imageSrc
    }), document.querySelector("#content"));
  });
};

var handleCreate = function handleCreate(e) {
  e.preventDefault();
  $("#messageBox").animate({
    width: 'hide'
  }, 350);

  if ($("#firstname").val() == '' || $("#lastname").val() == '' || $("#info").val() == '') {
    handleError("First & Last name and Description are required");
    return false;
  }

  sendAjax('POST', $("#form").attr("action"), $("#form").serialize(), function () {
    loadQRCode();
  });
  return false;
};

var addLink = function addLink() {};

var BusinessForm = function BusinessForm(props) {
  if (props.info.length === 0) {
    return /*#__PURE__*/React.createElement("form", {
      id: "form",
      action: "/maker",
      method: "post"
    }, /*#__PURE__*/React.createElement("div", {
      className: "banner"
    }, /*#__PURE__*/React.createElement("h1", null, "Virtual Business Card")), /*#__PURE__*/React.createElement("div", {
      className: "item"
    }, /*#__PURE__*/React.createElement("p", null, "Name"), /*#__PURE__*/React.createElement("div", {
      className: "name-item"
    }, /*#__PURE__*/React.createElement("input", {
      type: "text",
      name: "firstname",
      placeholder: "First",
      id: "firstname"
    }), /*#__PURE__*/React.createElement("input", {
      type: "text",
      name: "lastname",
      placeholder: "Last",
      id: "lastname"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "contact-item"
    }, /*#__PURE__*/React.createElement("div", {
      className: "item"
    }, /*#__PURE__*/React.createElement("p", null, "Email"), /*#__PURE__*/React.createElement("input", {
      type: "text",
      name: "email",
      id: "email"
    })), /*#__PURE__*/React.createElement("div", {
      className: "item"
    }, /*#__PURE__*/React.createElement("p", null, "Phone"), /*#__PURE__*/React.createElement("input", {
      type: "text",
      name: "phone",
      id: "phone"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "item"
    }, /*#__PURE__*/React.createElement("p", null, "Job/Position"), /*#__PURE__*/React.createElement("input", {
      type: "text",
      name: "title",
      id: "title"
    })), /*#__PURE__*/React.createElement("div", {
      className: "item"
    }, /*#__PURE__*/React.createElement("p", null, "Description About Yourself"), /*#__PURE__*/React.createElement("textarea", {
      rows: "3",
      name: "info",
      id: "info",
      required: true
    })), /*#__PURE__*/React.createElement("div", {
      className: "item",
      id: "links"
    }, /*#__PURE__*/React.createElement("p", null, "Your Links"), /*#__PURE__*/React.createElement("input", {
      type: "button",
      value: "+",
      id: "addlink"
    }), " ", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("input", {
      type: "url",
      name: "link",
      className: "link"
    }), " ", /*#__PURE__*/React.createElement("br", null)), /*#__PURE__*/React.createElement("div", {
      className: "btn-block"
    }, /*#__PURE__*/React.createElement("button", {
      id: "generate",
      type: "submit"
    }, "Generate")), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("div", {
      id: "content"
    }));
  }

  var links = props.info.links.map(function (link) {
    /*#__PURE__*/
    React.createElement("div", null, /*#__PURE__*/React.createElement("input", {
      type: "url",
      name: "link",
      className: "link",
      value: link
    }));
  });
  return /*#__PURE__*/React.createElement("form", {
    id: "form",
    action: "/maker",
    method: "POST",
    onSubmit: handleCreate
  }, /*#__PURE__*/React.createElement("div", {
    className: "banner"
  }, /*#__PURE__*/React.createElement("h1", null, "Virtual Business Card")), /*#__PURE__*/React.createElement("div", {
    className: "item"
  }, /*#__PURE__*/React.createElement("p", null, "Name"), /*#__PURE__*/React.createElement("div", {
    className: "name-item"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "firstname",
    placeholder: "First",
    id: "firstname",
    value: props.info.firstName
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "lastname",
    placeholder: "Last",
    id: "lastname",
    value: props.info.lasttName
  }))), /*#__PURE__*/React.createElement("div", {
    className: "contact-item"
  }, /*#__PURE__*/React.createElement("div", {
    className: "item"
  }, /*#__PURE__*/React.createElement("p", null, "Email"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "email",
    id: "email",
    value: props.info.email
  })), /*#__PURE__*/React.createElement("div", {
    className: "item"
  }, /*#__PURE__*/React.createElement("p", null, "Phone"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "phone",
    id: "phone",
    value: props.info.phone
  }))), /*#__PURE__*/React.createElement("div", {
    className: "item"
  }, /*#__PURE__*/React.createElement("p", null, "Job/Position"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "title",
    id: "title",
    value: props.info.title
  })), /*#__PURE__*/React.createElement("div", {
    className: "item"
  }, /*#__PURE__*/React.createElement("p", null, "Description About Yourself"), /*#__PURE__*/React.createElement("textarea", {
    rows: "3",
    name: "info",
    id: "info",
    value: props.info.title,
    required: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "item",
    id: "links"
  }, /*#__PURE__*/React.createElement("p", null, "Your Links"), /*#__PURE__*/React.createElement("input", {
    type: "button",
    value: "+",
    id: "addlink",
    onClick: addLink
  }), " ", /*#__PURE__*/React.createElement("br", null), links), /*#__PURE__*/React.createElement("div", {
    className: "btn-block"
  }, /*#__PURE__*/React.createElement("button", {
    id: "generate",
    type: "submit"
  }, "Generate")), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("div", {
    id: "content"
  }));
};

var setup = function setup(csrf) {
  var query = $("#kjhsitl").value;

  if (query != "" || query != null) {
    sendAjax('GET', '/getBusinessCard', query, function (data) {
      ReactDOM.render( /*#__PURE__*/React.createElement(BusinessForm, {
        csrf: csrf,
        info: data.businessCard
      }), document.querySelector("#businessForm"));
    });
  } else {
    ReactDOM.render( /*#__PURE__*/React.createElement(BusinessForm, {
      csrf: csrf,
      info: []
    }), document.querySelector("#businessForm"));
  }
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
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