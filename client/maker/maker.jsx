
const closeQRWindow = ()=>{
    redirect({redirect: '/app'});
}
const QRWindow = (props)=>{
    return (
        <div className="pop-up">
            <div  className="pop-up-content">
                <div id="close" className="close" onClick={closeQRWindow} >+</div>
                <img src={props.url.qrcode} alt="qrcode" />
            </div>
        </div>
    );
}
const getLastQRCode = ()=>{

    sendAjax('GET', '/getLastAdded', null, (data)=>{
        ReactDOM.render(
            <QRWindow url={data.businessCard} />, document.querySelector("#pop-up-window")
        );
    });
}
const handleCreate = (e) =>{
    e.preventDefault();

    $("#messageBox").animate({width:'hide'}, 350);

    if( $("#cardName").val() == '' || $("#firstname").val() == '' || $("#lastname").val() == '' || $("#info").val() == '' ){
        handleError("Card Name, Your First & Last name, and Description are required");
        return false;
    }

    sendAjax('POST', $("#form").attr("action"),$("#form").serialize(), function () {
            getLastQRCode();
        }
    );;
    
    return false;
}
const handleEdit = (e) =>{
    e.preventDefault();

    $("#messageBox").animate({width:'hide'}, 350);

    if($("#cardName").val() == '' || $("#firstname").val() == '' || $("#lastname").val() == '' || $("#info").val() == '' ){
        handleError("Card Name, Your First & Last name, and Description are required");
        return false;
    }

    sendAjax('POST', $("#form").attr("action"),$("#form").serialize(), function (data) {
            ReactDOM.render(
                <QRWindow url={data.businessCard} />, document.querySelector("#pop-up-window")
            );
        }
    );;
    
    return false;
}
const addLink = () =>{
    const element = document.querySelector("#links");
    const input = document.createElement("input");
    const br = document.createElement("br");
    
    input.type = "url";
    input.name = "link";
    input.className = "link";
    
    element.append(input);
    element.append(br);
}

const BusinessForm = (props) =>{
    if(props.info.length === 0){
        return (
                <form id="form" action="/maker" method="post" onSubmit={handleCreate}>
                    <div className="banner">
                        <input type="text" name="cardName" placeholder="New Business Card" id="cardName" required/>
                    </div>
                    <div className="item">
                        <p>Name</p>
                        <div className="name-item">
                            <input type="text" name="firstname" placeholder="First" id="firstname" required/>
                            <input type="text" name="lastname" placeholder="Last" id="lastname" required/>
                        </div>
                    </div>
                    <div className="contact-item">
                        <div className="item">
                            <p>Email</p>
                            <input type="text" name="email" id="email"/>
                        </div>
                        <div className="item">
                            <p>Phone</p>
                            <input type="text" name="phone" id="phone"/>
                        </div>
                    </div>
                    <div className="item">
                        <p>Job/Position</p>
                        <input type="text" name="title" id="title"/>
                    </div>
                    <div className="item">
                        <p>Description About Yourself</p>
                        <textarea rows="3" name="info" id="info" required></textarea>
                    </div>
                
                    <div className="item" id="links">
                        <p>Your Links</p>
                        <input type="button" value="+" id="addlink" onClick={addLink} /> <br/>
                        <input type="url" name="link" className="link"/> <br/>
                    </div>
                    <div className="btn-block">
                    <button id="generate" type="submit">Generate</button>
                    </div>
                    <input type="hidden" name="_csrf" value={props.csrf} />
                    <div id="content">
                    </div>
            </form>
        );
    }
    
    let links;
    console.log(props.info.links);
    if(props.info.links.length >0){
        links = props.info.links.map((link)=>{
            <div>
                <input type="url" name="link" className="link" value={link} />
            </div>
        });
    }
    else{
        links = (
            <div>
                <input type="url" name="link" className="link" />
            </div>
        );
    }

    let email;
    if(props.info.email !=""){
        email = (
            <div className="item">
                <p>Email</p>
                <input type="text" name="email" id="email" defaultValue={props.info.email} />
            </div>  
        );  
    }
    else{
        email = (
            <div className="item">
                <p>Email</p>
                <input type="text" name="email" id="email" />
            </div>  
        ); 
    }

    let phone;
    if(props.info.phone !=""){
        phone = (
            <div className="item">
                <p>Phone</p>
                <input type="text" name="phone" id="phone" defaultValue={props.info.phone} />
            </div> 
        );
    }
    else{
        phone = (
            <div className="item">
                <p>Phone</p>
                <input type="text" name="phone" id="phone" />
            </div>  
        );
    }

    let title;
    if(props.info.title !=""){
        title = (
            <div className="item">
                <p>Job/Position</p>
                <input type="text" name="title" id="title" defaultValue={props.info.title} />
            </div>
        );
    }
    else{
        title = (
            <div className="item">
                <p>Job/Position</p>
                <input type="text" name="title" id="title" />
            </div>
        );
    }

    return (
        <form id="form" action="/edit" method="POST" onSubmit={handleEdit}>
                <div className="banner">
                    <input type="text" name="cardName"  defaultValue={props.info.cardName} id="cardName" required/>
                </div>
                <div className="item">
                    <p>Name</p>
                    <div className="name-item">
                        <input type="text" name="firstname" placeholder="First" id="firstname" defaultValue={props.info.firstName} required/>
                        <input type="text" name="lastname" placeholder="Last" id="lastname" defaultValue={props.info.lastName} required/>
                    </div>
                </div>
                <div className="contact-item">
                    {email}
                    {phone}
                </div>
                {title}
                <div className="item">
                    <p>Description About Yourself</p>
                    <textarea rows="3" name="info" id="info" defaultValue={props.info.description} required></textarea>
                </div>
            
                <div className="item" id="links">
                    <p>Your Links</p>
                    <input type="button" value="+" id="addlink" onClick = {addLink}/> <br/>
                    {links}
                </div>
                <div className="btn-block">
                <button id="generate" type="submit">Update</button>
                </div>
                <input type="hidden" name="_csrf" value={props.csrf} />
                <input type="hidden" name="_id" value={props.info._id} />
                <div id="content">
                </div>
        </form>
    );
}
const setup = function(csrf){
    let query = $("#kjhsitaasdasdasdasdfcvxcvxvl").val();
    console.log("query: " + query);
    if(query === "" || query === null){
        ReactDOM.render(
            <BusinessForm csrf={csrf} info={[]} />, document.querySelector("#businessForm")
        );
    }
    else{
        sendAjax('GET', '/getBusinessCard', {cardId: query}, (data)=>{
            console.log("BusinessCard.firtName: " + data.businessCard.firstName);
            ReactDOM.render(
                <BusinessForm csrf={csrf} info={data.businessCard} />, document.querySelector("#businessForm")
            );
        });
    }
};

const getToken = () =>{ 
    sendAjax('GET', '/getToken', null, (result) =>{
        setup(result.csrfToken)
    });
    
};

$(document).ready(function(){
    getToken();
});