const QRCode = (props) =>{
    <div>
        <img src={props.url} alt="qrcode" />
    </div>
}

const handleCreate = (e) =>{
    e.preventDefault();

    $("#messageBox").animate({width:'hide'}, 350);

    if($("#firstname").val() == '' || $("#lastname").val() == '' || $("#info").val() == '' ){
        handleError("First & Last name and Description are required");
        return false;
    }

    sendAjax('POST', $("#form").attr("action"),$("#form").serialize(), function(qrcode){
        ReactDOM.render(
            <QRCode url = {qrcode.imageSrc} />, document.querySelector("#content")
        );
    })

    return false;
}
const addLink = () =>{
    
}
const BusinessForm = (props) =>{
    if(props.info.length === 0){
        return (
                <form id="form" action="/GenerateQR" method="post">
                    <div class="banner">
                        <h1>Virtual Business Card</h1>
                    </div>
                    <div class="item">
                        <p>Name</p>
                        <div class="name-item">
                            <input type="text" name="name" placeholder="First" id="firstname"/>
                            <input type="text" name="name" placeholder="Last" id="lastname"/>
                        </div>
                    </div>
                    <div class="contact-item">
                        <div class="item">
                            <p>Email</p>
                            <input type="text" name="name" id="email"/>
                        </div>
                        <div class="item">
                            <p>Phone</p>
                            <input type="text" name="name" id="phone"/>
                        </div>
                    </div>
                    <div class="item">
                        <p>Job/Position</p>
                        <input type="text" name="name" id="title"/>
                    </div>
                    <div class="item">
                        <p>Description About Yourself</p>
                        <textarea rows="3" id="info" required></textarea>
                    </div>
                
                    <div class="item" id="links">
                        <p>Your Links</p>
                        <input type="button" value="+" id="addlink"/> <br/>
                        <input type="url" class="link"/> <br/>
                    </div>
                    <div class="btn-block">
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
            <input type="url" class="link" value={link} />
        </div>
    });

    return (
        <form id="form" action="/maker" method="POST" onSubmit={handleCreate}>
                <div class="banner">
                    <h1>Virtual Business Card</h1>
                </div>
                <div class="item">
                    <p>Name</p>
                    <div class="name-item">
                        <input type="text" name="name" placeholder="First" id="firstname" value={props.info.firstName} />
                        <input type="text" name="name" placeholder="Last" id="lastname" value={props.info.lasttName} />
                    </div>
                </div>
                <div class="contact-item">
                    <div class="item">
                        <p>Email</p>
                        <input type="text" name="name" id="email" value={props.info.email} />
                    </div>
                    <div class="item">
                        <p>Phone</p>
                        <input type="text" name="name" id="phone" value={props.info.phone} />
                    </div>
                </div>
                <div class="item">
                    <p>Job/Position</p>
                    <input type="text" name="name" id="title" value={props.info.title} />
                </div>
                <div class="item">
                    <p>Description About Yourself</p>
                    <textarea rows="3" id="info" value={props.info.title} required></textarea>
                </div>
            
                <div class="item" id="links">
                    <p>Your Links</p>
                    <input type="button" value="+" id="addlink" onClick = {addLink}/> <br/>
                    {links}
                </div>
                <div class="btn-block">
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