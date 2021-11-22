const handleNew = ()=>{
    redirect({redirect: '/maker'});
}

const handleEdit = (cardId)=>{
    console.log(" this is cardId : " + card._id);
    sendAjax('GET', '/edit', cardId, redirect);

    return false;
}

const UI = () =>{
    return (
        <img src="/assets/img/new.png" alt="new" onClick={handleNew} />
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

const setup = function(){
    ReactDOM.render(
        <UI/>, document.querySelector("#new")
    );
    ReactDOM.render(
        <QRList businessCards={[]} />, document.querySelector("#businessCards")
    );

    loadBusinessCardFromServer();
};


$(document).ready(function(){
    setup();
});

