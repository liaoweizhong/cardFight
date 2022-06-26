class Shoupai {

    constructor (dom){

        this.dom = null;

        this.cards = [];

        this.setDom(dom);

        this.use = function(){}

    }

    setDom (dom){
        this.dom = dom;
        this.dom.className += " shoupaiBox"

        this.dom.addEventListener("click",(e)=>{
            debugger;
            var type = e.type;
            var dom = e.target;
            //对dom进行taggle调用
            var _dom = dom;
            var dea = null;
            for( var i=0;i<3;i++ ){
                dea = _dom.getAttribute("@"+type);
                if( dea ){
                    dea = dea.split(" ");
                    for( var i in dea )
                        this[dea[i]](_dom);
                    break;
                }
                _dom = _dom.parentElement;
            }
             
        })
    }

    setCard (card){

        debugger;
        
        // 创建dom
        const dom = this.createCardDom(card);

        // 添加进入到dom
        this.dom.appendChild(dom);

    }

    createCardDom (card){

        var dom = document.createElement("div");

        dom.innerHTML = `
            <div class='cardBox' @click='clickFn'>
                <div class='cardImage'><img src='${card.images}' /></div>
                <div class='cardbg'></div>
            </div>
        `;

        card.dom = dom.children[0];

        card.dom.card = card;

        return dom.children[0];
    }

    clickFn (dom){
        debugger;
        this.use(dom.card);
    }

}