class Collection {
    constructor (container, numVisible) { 
        this.id = container.set.refId || container.set.setId;
        this.title = container.set.text.title.full.set.default.content;

        // Paginate the list of tiles.
        this.numVisible = numVisible;
        this.previous = [];
        this.visible = container.set.items?.slice(0, numVisible).map(item => new Tile(item)) || [];
        this.next = container.set.items?.slice(numVisible).map(item => new Tile(item)) || [];
    }

    fetchCollection = async () => {
        const resp = await fetch(`https://cd-static.bamgrid.com/dp-117731241344/sets/${this.id}.json`);
        const body = await resp.json();
        const { data } = body;

        const set = Object.keys(data)[0];
        const items = data[set].items || [];

        this.previous = [];
        this.visible = items.slice(0, this.numVisible).map(item => new Tile(item)) || [];
        this.next = items.slice(this.numVisible).map(item => new Tile(item)) || [];
    }

    renderVisibleTiles = () => {
        const mediaList = document.getElementById("media-list")
        const mediaRowTemplate = document.getElementById("media-row");
        const mediaTileTemplate = document.getElementById("media-tile");
        
        var row = document.getElementById(this.id);
        const isNewRow = !row;

        if (isNewRow) {
            row = document.importNode(mediaRowTemplate.content, true);
            row.querySelector(".collection").setAttribute("id", this.id);
            row.querySelector(".title").innerHTML = this.title;
        }

        const mediaTiles = row.querySelector(".media-tiles");
        mediaTiles.innerHTML = "";

        this.visible.forEach((tile) => {
            const tileInstance = document.importNode(mediaTileTemplate.content, true);
            const tileImage = $(tileInstance).find(".tile-image");
            $(tileImage).attr("src", tile.tileImageUrl);
            mediaTiles.appendChild(tileInstance);
        });

        // Render only the first tile of the next page to preview wha'ts next.
        if (this.next.length > 0) {
            const tile = this.next[0];
            const tileInstance = document.importNode(mediaTileTemplate.content, true);
            const tileImage = $(tileInstance).find(".tile-image");
            $(tileImage).attr("src", tile.tileImageUrl);
            $(tileInstance).find(".tile").append('<div class="next-tile-overlay"/>');
            mediaTiles.appendChild(tileInstance);
        }

        if (isNewRow) {
            mediaList.appendChild(row);
        } else {
            document.getElementById(this.id).innerHTML = row.innerHTML;
        }
    }

    scrollNext = () => {
        if (this.next.length === 0) return;

        this.previous.push(this.visible.shift());
        this.visible.push(this.next.shift());
        this.renderVisibleTiles();
    }

    scrollPrevious = () => {
        if (this.previous.length === 0) return;

        this.next.unshift(this.visible.pop());
        this.visible.unshift(this.previous.pop());
        this.renderVisibleTiles();
    }
}
