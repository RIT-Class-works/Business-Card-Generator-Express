const handleError = (message)=>{
    $("#errorMessage").text(message);
    //$("#messageBox").animate({width:'toggle'}, 350);
    $("#messageBox").show();
};

const redirect = (response) =>{
    //$("#messageBox").animate({width:'hide'}, 350);
    $("#messageBox").hide();
    window.location = response.redirect;
};

const sendAjax = (type, action, data, success) => {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function(xhr, status, error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });   
};


