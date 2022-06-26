class Chaoliumeihai extends Card {

    static id = "1"

    constructor (param){
        debugger;
        super(param);

        this.id = "1";
        this.images = "./data/"+this.id+"/image.png";
        this.userId = param.userId;
        this.code = param.code;
    }

}

Card.maps.push(Chaoliumeihai)