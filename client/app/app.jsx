let csrfToken = null;
let purchased = false;
let numbCardCreated = 0;

const handleNew = ()=>{
    if(numbCardCreated >=2 && purchased == false){
        handleError("You had reach the maxium amount of business card created for free");
    }
    else{
        redirect({redirect: '/maker'});
    }
}
const handlePurchase = ()=>{
    console.log("call");
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': csrfToken
        }
    });
    sendAjax('POST', '/purchase', null, (data)=>{
        console.log(data.purchased);
        purchased = data.purchased;
        ReactDOM.render(
            <Ads message="Thank you For Purchase. Enjoy your unlimited card generation"/>, document.querySelector("#ads")
        );
    });
}
const getPurchase = ()=>{
    sendAjax('GET', '/account', null, (data) =>{
        console.log(data.account.purchased)
        purchased = data.account.purchased;
        setup();
    });
}
const LoadEditPage = (_cardId)=>{
    console.log(" this is cardId : " + _cardId);
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': csrfToken
        }
    });
    sendAjax('GET', '/edit', {"cardId": _cardId}, redirect);

    return false;
}

const handleDelete = (_cardId)=>{
    console.log(" this is cardId : " + _cardId);
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': csrfToken
        }
    });
    sendAjax('POST', '/delete', {"cardId": _cardId}, redirect);

    return false;
}
const handlePasswordChange = (e)=>{
    e.preventDefault();

    if( $("#oldPass").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '' ){
        handleError("All field are required");
        return false;
    }

    sendAjax('POST', $("#passwordChange").attr("action"),$("#passwordChange").serialize(), function (data) {
            ReactDOM.render(
                <Ads message={data.message} />, document.querySelector("#ads")
            );
        }
    );;
    
    return false;
}
const openPasswordChange = ()=>{
    ReactDOM.render(
        <PasswordChangeWindow />, document.querySelector("#content")
    );
}
const closeOptionWindow = ()=>{
    const opened = false;
    ReactDOM.render(
        <OptionWindow id={[]} open={opened} />, document.querySelector("#pop-up-window")
    );
}
const openOptionWindow = (_id) =>{
    const opened = true;
    ReactDOM.render(
        <OptionWindow id={_id} open={opened} />, document.querySelector("#pop-up-window")
    );
}
const OptionWindow = (props)=>{
    console.log(props.open);
    if(props.open){
        return (
            <div className="pop-up">
                <div  className="pop-up-content">
                    <div id="close" className="close" onClick={closeOptionWindow} >+</div>
                    <button onClick={()=>{LoadEditPage(props.id)}} >Edit</button>
                    <button onClick={()=>{handleDelete(props.id)}}>Delete</button>
                </div>
            </div>
        );
    }
    else{
        return;
    }
}
const Ads = (props) =>{
    return (
        <div>
            <h1>{props.message}</h1>
        </div>
    );
}
const PasswordChangeWindow = () =>{
    return (
        <form
            id="passwordChange"
            name="passwordChange"
            onSubmit={handlePasswordChange}
            action="/passwordChange"
            method="POST"
            className="mainForm"
            >
            
            <label htmlFor="oldpass">Old Password: </label>
            <input id="oldPass" type="password" name="oldPass" placeholder="Old password" required/>
            <label htmlFor="pass">New Password: </label>
            <input id="pass" type="password" name="newPass" placeholder="new password" required/>
            <label htmlFor="pas2">Retype Password: </label>
            <input id="pass2" type="password" name="newPass2" placeholder="retype password" required/>
            <input type="hidden" name="_csrf" value={csrfToken} />
            <input className="formSubmit" type="submit" value="Change" />

        </form>
    );
};
const QRList = (props) =>{
    const ui = (
        <div>
            <img src="/assets/img/new.png" alt="new" onClick={handleNew} />
            <p></p>
        </div>
    );
    
    if(props.businessCards.length === 0){
        return(
            <div id="businessCards" >
                {ui}
            </div>
        );
    }
    numbCardCreated = 0;
    const qrNodes = props.businessCards.map((card)=>{
        numbCardCreated++;
        return (
            <div key={card._id}>
                <img key={card._id} src={card.qrcode} alt="QRCode" onClick={()=>{openOptionWindow(card._id)}} />
                <p>{card.cardName} </p>
            </div>
        );
    });
    
    return (
        <div id="businessCards" >
            {ui}
            {qrNodes} 
        </div>
    );
};

const loadBusinessCardFromServer = () =>{
    sendAjax('GET', '/getQRCodes', null, (data)=>{
        ReactDOM.render(
            <QRList businessCards={data.businessCards} />, document.querySelector("#content")
        );
    });
};

const setup = function(){
    $("#gear").click(()=>{
        if($("#drop-down-list").css("visibility") == "hidden"){
            $("#drop-down-list").css({"visibility":"visible"})
        }
        else{
            $("#drop-down-list").css({"visibility":"hidden"})
        }  
    })

    $("#pay").click(handlePurchase);
    $("#password-change").click(openPasswordChange);

    let _message = "Pay a one-time fee to unlock unlimited card creation";

    console.log(purchased);

    if(purchased){
        _message = "Thank you For Purchase. Enjoy your unlimited card generation";
    }
    ReactDOM.render(
        <Ads message={_message} />, document.querySelector("#ads")
    );
    ReactDOM.render(
        <QRList businessCards={[]} />, document.querySelector("#content")
    );

    loadBusinessCardFromServer();
};

const getToken = () =>{ 
    sendAjax('GET', '/getToken', null, (data) =>{
        csrfToken = data.csrfToken;
        getPurchase()
    });
    
};


$(document).ready(function(){
    getToken();
});

