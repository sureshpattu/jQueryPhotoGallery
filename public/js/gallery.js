(function ($) {
    function randomString(len, charSet) {
        charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var randomString = '';
        for (var i = 0; i < len; i++) {
            var randomPoz = Math.floor(Math.random() * charSet.length);
            randomString += charSet.substring(randomPoz, randomPoz + 1);
        }
        return randomString;
    }

    function addThumbnail(imgSrc) {
        return '<li class="thumbnail__list"><img src="' + imgSrc + '" class="thumbnail__list-img"/></li>';
    }

    function renderThumbnail(imgArr) {
        var html = [];
        if (imgArr) {
            $.each(imgArr, function (i, v) {
                html.push(addThumbnail(v));
            });
        }
        return '<ul class="gallery__thumbnail__container">' + html.join('') + '</ul>';
    }

    function getPlaceholder() {
        return 'dummy.jpg';
    }

    function disableNext(gallery) {
        gallery.galleryElement.find('.next').addClass('disabled');
    }

    function disablePrev(gallery) {
        gallery.galleryElement.find('.prev').addClass('disabled');
    }

    function enableNext(gallery) {
        gallery.galleryElement.find('.next').removeClass('disabled');
    }

    function enablePrev(gallery) {
        gallery.galleryElement.find('.prev').removeClass('disabled');
    }

    function controls() {
        var html = [];
        html.push('<div class="prev sz-icon-arrow-left"></div>' +
            '<div class="next sz-icon-arrow-right"></div>');
        return '<div class="gallery__controls">' + html.join('') + '</div>';
    }

    function bindClickEvents(galleryElement, self) {
        galleryElement.on('click', '.start', function () {
            self.start();
        });
        galleryElement.find('.stop').on('click', function () {
            self.stop();
        });
        galleryElement.find('.prev').on('click', function () {
            self.prev();
        });
        galleryElement.find('.next').on('click', function () {
            self.next();
        });
    }

    function checkOptions(options) {
        var opt = options;
        opt.images = (opt.images.length) ? opt.images : getPlaceholder();
        opt.container = (opt.container) ? opt.container : 'body';
        opt.thumbnail = (opt.thumbnail) ? true : false;
        opt.autoPlay = (opt.autoPlay) ? true : false;
        opt.start = (opt.start && opt.start <= Number(opt.images.length)) ? opt.start : 1;
        return opt;
    }

    /**
     *
     * @param options should be object of following
     * options.images Array of gallery images URL
     * options.start slide starting point
     * options.autoPlay This option will be false by default
     *
     */
    gallery = function (options) {
        this._opt = checkOptions(options);
        this._opt.imagesLength = Number(this._opt.images.length);
        this._opt.currIndex = Number(this._opt.start);
        this._opt.elementName = 'gallery--' + randomString(5, 'gallery');
        $(this._opt.container).append('<div class="gallery gallery--hidden ' + this._opt.elementName + '"></div>');
        this.galleryElement = $('.' + this._opt.elementName);
        this.galleryElement.append('<img class="gallery__img-preview" src="' + this._opt.images[this._opt.start - 1] + '"/>');
        if (this._opt.thumbnail) {
            this.galleryElement.append(renderThumbnail(options.images));
        }
        this.galleryElement.append(controls());
        if (this._opt.autoPlay) {
            this.start();
        }
        bindClickEvents(this.galleryElement, this);
    };

    gallery.prototype = {
        start: function () {
            this.goTo(this._opt.currIndex);
            this.galleryElement.removeClass('gallery--hidden');
            console.log('started', this._opt);
        },
        stop: function () {
            this.galleryElement.addClass('gallery--hidden');
        },
        next: function () {
            if (this._opt.currIndex <= (this._opt.imagesLength - 1)) {
                this._opt.currIndex++;
                this.goTo(this._opt.currIndex);
                if (this._opt.currIndex === (this._opt.imagesLength)) {
                    disableNext(this);
                }
                enablePrev(this);
            } else {
                disableNext(this);
            }
        },
        prev: function () {
            if ((this._opt.currIndex - 1) !== 0) {
                this._opt.currIndex--;
                this.goTo(this._opt.currIndex);
                if ((this._opt.currIndex - 1) === 0) {
                    disablePrev(this);
                }
                enableNext(this);
            } else {
                disablePrev(this);
            }
        },
        goTo: function (imgNo) {
            var thumbnail;
            console.log(imgNo);
            if (this._opt.images[imgNo - 1]) {
                this.galleryElement.find('.gallery__img-preview').attr('src', this._opt.images[imgNo - 1]);
            }
            if (this._opt.thumbnail) {
                thumbnail = this.galleryElement.find('.thumbnail__list');
                thumbnail.removeClass('active');
                thumbnail.eq(imgNo - 1).addClass('active');
            }
        },
        destroy: function () {
            console.log('destroyed');
        }
    };
    return gallery;
})(jQuery);
