class Tile {
    constructor(item) {
        this.item = item;
        this.titleTypeKey = item.type === "DmcVideo" ? "program" :
            item.type === "DmcSeries" ? "series" : "collection";
        this.urlTypeKey = item.type === "DmcVideo" ? "program" :
            item.type === "DmcSeries" ? "series" : "default";
    }

    get backgroundImageUrl() {
        return this.item.image.background ? this.item.image.background["1.78"][this.urlTypeKey].default.url :
            this.item.image.hero_collection["1.78"][this.urlTypeKey].default.url;
    }

    get rating() {
        return this.item.type === "StandardCollection" ? null :
            this.item.ratings[0].value;
    }

    get title() {
        return this.item.text.title.full[this.titleTypeKey].default.content;
    }

    get tileImageUrl() {
        return this.item.image.tile["1.78"][this.urlTypeKey].default.url;
    }

    get videoArtUrl() {
        return this.item.videoArt.length > 0 ? this.item.videoArt[0].mediaMetadata.urls[0].url : null;
    }
}