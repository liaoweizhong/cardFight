class Chaoliumeihai extends Card {

    static id = "1"

    constructor (param){
        super(param);

        this.id = "1";
        this.images = "./data/"+this.id+"/image.png";
        this.userId = param.userId;
        this.code = param.code;
        this.xid = param.xid;
    }

}

Card.maps.push(Chaoliumeihai)