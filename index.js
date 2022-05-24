const collections = [];
const modal = new Modal();

// Determine the number of full tiles that can be displayed in
// each row with the user's screensize.
const rowSize = Math.floor((window.innerWidth - 62) / 266);

// Index and Tile object of the current focused tile.
var focusedTile = { index: null, tile: null};


// jQuery helper function to determine if and HTML element is fully
// within the viewport.
$.fn.isInViewport = function () {
    let elementTop = $(this).offset().top;
    let elementBottom = elementTop + $(this).outerHeight();

    let viewportTop = window.scrollY;
    let viewportBottom = viewportTop + window.innerHeight;

    return elementTop > viewportTop && elementBottom < viewportBottom;
};


const fetchContainers = async () => {
    const resp = await fetch("https://cd-static.bamgrid.com/dp-117731241344/home.json");
    const body = await resp.json();
    const { data } = body
    const containers = data.StandardCollection.containers;

    containers.forEach(async (container, index) => {
        const newCollection = new Collection(container, rowSize);
        collections.push(newCollection);


        /*
            Fetch full collection for containers that don't come with the
            data pre-populated from the '/home' endpoint. Ideally this would
            happen as these collections come into view on screen but I didn't get
            around to implenting it in that way.
        */
        if (newCollection.visible.length === 0) {
            await newCollection.fetchCollection();
            newCollection.renderVisibleTiles();
        }
    })
}

const focusTile = (collectionIndex, tileIndex) => {
    if (collectionIndex < 0 || collectionIndex > collections.length - 1) return;
    
    if (tileIndex < 0) {
        collections[collectionIndex].scrollPrevious();
        tileIndex = 0;
    }

    if (tileIndex > rowSize - 1) {
        collections[collectionIndex].scrollNext();
        tileIndex = rowSize - 1;
    }

    const collectionHTMLElement = $(".collection")[collectionIndex];
    const tileHTMLElement = $(collectionHTMLElement).find(".tile")[tileIndex]

    $(".tile.focused")?.removeClass("focused");
    $(tileHTMLElement).addClass("focused");


    // Scroll the viewport if the new focued tile is not fully
    // in view.
    if (!$(tileHTMLElement).isInViewport()) {

        if (collectionIndex === 0) {
            $("html, body").animate({ scrollTop: 0 }, 200);
        } else if ($(tileHTMLElement).offset().top < window.scrollY) {
            $("html, body").animate({ scrollTop: window.scrollY - 220 }, 200);
        } else {
            $("html, body").animate({ scrollTop: window.scrollY + 220 }, 200);
        }
    }

    focusedTile = {
        tile: collections[collectionIndex].visible[tileIndex],
        index: [collectionIndex, tileIndex],
    };
}

const renderCollections = () => {
    collections.forEach((collection) => {
       collection.renderVisibleTiles();
    })

    focusTile(0, 0);
}

$(document).ready(async () => {
    await fetchContainers();
    renderCollections();
    $("html, body").animate({ scrollTop: 0 }, 200);

    window.addEventListener("keydown", (e) => {
        if (e.repeat) return;

        switch (e.key) {
            case "ArrowRight": !modal.isOpen && focusTile(focusedTile.index[0], focusedTile.index[1] + 1);
                break;
            case "ArrowLeft": !modal.isOpen && focusTile(focusedTile.index[0], focusedTile.index[1] - 1);
                break;
            case "ArrowUp": !modal.isOpen && focusTile(focusedTile.index[0] - 1, focusedTile.index[1]);
                break;
            case "ArrowDown": !modal.isOpen && focusTile(focusedTile.index[0] + 1, focusedTile.index[1]);
                break;
            case "Enter": modal.isOpen ? modal.closeModal() : modal.openModal(focusedTile.tile);
                break;
            case "Backspace":
            case "Escape": modal.closeModal();
                break;
        }
    })
})