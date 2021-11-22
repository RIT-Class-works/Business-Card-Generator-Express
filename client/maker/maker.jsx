const QRCode = (props) =>{
    return(
        <div>
            <img src={props.url} alt="qrcode" />
        </div>
    ); 
}
const loadQRCode = ()=>{
    sendAjax('GET', '/getLastAdded', null, (data)=>{

        ReactDOM.render(
            <QRCode url={data.businessCard.imageSrc} />, document.querySelector("#content")
        );
    });
}
const handleCreate = (e) =>{
    e.preventDefault();

    $("#messageBox").animate({width:'hide'}, 350);

    if($("#firstname").val() == '' || $("#lastname").val() == '' || $("#info").val() == '' ){
        handleError("First & Last name and Description are required");
        return false;
    }

    sendAjax('POST', $("#form").attr("action"),$("#form").serialize(), function(){
        loadQRCode();
    })

    return false;
}
const addLink = () =>{
    
}
const BusinessForm = (props) =>{
    if(props.info.length === 0){
        return (
                <form id="form" action="/maker" method="post">
                    <div className="banner">
                        <h1>Virtual Business Card</h1>
                    </div>
                    <div className="item">
                        <p>Name</p>
                        <div className="name-item">
                            <input type="text" name="firstname" placeholder="First" id="firstname"/>
                            <input type="text" name="lastname" placeholder="Last" id="lastname"/>
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
                        <input type="button" value="+" id="addlink"/> <br/>
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
    
    const links = props.info.links.map((link)=>{
        <div>
            <input type="url" name="link" className="link" value={link} />
        </div>
    });

    return (
        <form id="form" action="/maker" method="POST" onSubmit={handleCreate}>
                <div className="banner">
                    <h1>Virtual Business Card</h1>
                </div>
                <div className="item">
                    <p>Name</p>
                    <div className="name-item">
                        <input type="text" name="firstname" placeholder="First" id="firstname" value={props.info.firstName} />
                        <input type="text" name="lastname" placeholder="Last" id="lastname" value={props.info.lasttName} />
                    </div>
                </div>
                <div className="contact-item">
                    <div className="item">
                        <p>Email</p>
                        <input type="text" name="email" id="email" value={props.info.email} />
                    </div>
                    <div className="item">
                        <p>Phone</p>
                        <input type="text" name="phone" id="phone" value={props.info.phone} />
                    </div>
                </div>
                <div className="item">
                    <p>Job/Position</p>
                    <input type="text" name="title" id="title" value={props.info.title} />
                </div>
                <div className="item">
                    <p>Description About Yourself</p>
                    <textarea rows="3" name="info" id="info" value={props.info.title} required></textarea>
                </div>
            
                <div className="item" id="links">
                    <p>Your Links</p>
                    <input type="button" value="+" id="addlink" onClick = {addLink}/> <br/>
                    {links}
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
const setup = function(csrf){
    let query = $("#kjhsitl").value;
    if(query != "" || query != null){
        sendAjax('GET', '/getBusinessCard', query, (data)=>{

            ReactDOM.render(
                <BusinessForm csrf={csrf} info={data.businessCard} />, document.querySelector("#businessForm")
            );
        });
    }
    else{
        ReactDOM.render(
            <BusinessForm csrf={csrf} info={[]} />, document.querySelector("#businessForm")
        );
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