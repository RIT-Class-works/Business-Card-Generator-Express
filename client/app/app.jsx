let csrfToken = null;

const handleNew = ()=>{
    redirect({redirect: '/maker'});
}

const handleEdit = (_cardId)=>{
    console.log(" this is cardId : " + _cardId);
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': csrfToken
        }
    });
    sendAjax('POST', '/edit', {"cardId": _cardId}, redirect);

    return false;
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
            <img key={card._id} src={card.qrcode} createDate={card.createDate} alt="QRCode" className="businessCards" onClick={()=>{handleEdit(card._id)}} />
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

