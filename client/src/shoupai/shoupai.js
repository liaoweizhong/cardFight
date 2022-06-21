class Shoupai {

    constructor (dom){

        this.dom = null;

        this.cards = [];

        this.setDom(dom);

    }

    setDom (dom){
        this.dom = dom;
        this.dom.className += " shoupaiBox"
    }

    setCard (card){
        
        // 创建dom
        const dom = this.createCardDom(card);

        // 添加进入到dom
        this.dom.appendChild(dom);

    }

    createCardDom (card){

        var dom = document.createElement("div");

        dom.innerHTML = `
            <div class='cardBox'>
                <div class='cardImage'><img src='${card.imges}' /></div>
                <div class='cardbg'></div>
            </div>
        `;

        return dom.children[0];
    }

}