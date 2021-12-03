let csrfToken = null;

const handleNew = ()=>{
    redirect({redirect: '/maker'});
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
const UI = (props) =>{
    return (
        <div>
            <img src="/assets/img/new.png" alt="new" onClick={handleNew} />
        </div>
    );
}

const QRList = (props) =>{
    if(props.businessCards.length === 0){
        return(
            <p>no businessCards code yet</p>
        );
    }
    const qrNodes = props.businessCards.map((card)=>{
        return (
            <div>
                <img key={card._id} src={card.qrcode} alt="QRCode" className="businessCards" onClick={()=>{openOptionWindow(card._id)}} />
                <p>{card.cardName} </p>
            </div>
            
        );
    });

    return qrNodes;
};

const loadBusinessCardFromServer = () =>{
    sendAjax('GET', '/getQRCodes', null, (data)=>{
        ReactDOM.render(
            <QRList businessCards={data.businessCards} />, document.querySelector("#businessCards")
        );
    });
};

const setup = function(_csrf){
    ReactDOM.render(
        <UI csrf={_csrf} />, document.querySelector("#new")
    );
    ReactDOM.render(
        <QRList businessCards={[]} />, document.querySelector("#businessCards")
    );

    loadBusinessCardFromServer();
};

const getToken = () =>{ 
    sendAjax('GET', '/getToken', null, (result) =>{
        csrfToken = result.csrfToken;
        setup(result.csrfToken)
    });
    
};

$(document).ready(function(){
    getToken();
});

