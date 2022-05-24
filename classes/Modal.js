class Modal {
    constructor() {
        this.isOpen = false;
    }

    openModal = (tile) => {
        this.isOpen = true;

        const modal = $("#media-modal");
        const backgroundImage = $(modal).find(".background-image");
        const videoArt = $(modal).find(".video-art");

        if (tile.videoArtUrl) {
            $(videoArt).attr("src", tile.videoArtUrl);
            $(videoArt).css("display", "block");
            $(backgroundImage).css("display", "none");
        } else {
            $(backgroundImage).attr("src", tile.backgroundImageUrl);
            $(backgroundImage).css("display", "block");
            $(videoArt).css("display", "none");
        }
        
        if (tile.rating) {
            $(modal).find(".media-rating").html(tile.rating);
            $(modal).find(".media-rating").css("display", "block");
        } else {
            $(modal).find(".media-rating").css("display", "none");
        }

        $(modal).find(".media-title").html(tile.title)
        $(modal).css("opacity", "1");
    }

    closeModal = () => {
        this.isOpen = false;

        const modal = $("#media-modal");
        const backgroundImage = $(modal).find(".background-image");
        const videoArt = $(modal).find(".video-art");

        $(backgroundImage).attr("src", "");
        $(backgroundImage).css("display", "none");
        $(videoArt).attr("src", "");
        $(videoArt).css("display", "none");
        $(modal).find(".media-rating").html("");
        $(modal).find(".media-rating").css("display", "none");
        $(modal).find(".media-title").html("")
        $(modal).css("opacity", "0");
    }
}