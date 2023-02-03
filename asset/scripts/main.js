
$(document).ready(function () {
    const myAudio = $("audio");
    const playBtn = $(".play-button");
    const progress = $("#progress");
    const repeatBtn = $(".repeat-button");
    var currentMusicIdx = 0;
    const nextMusicBtn = $(".forward-button");
    const backMusicBtn = $(".backward-button");
    const cd = $(".header__cd");
    

    const app = {
        isRanDom: false,
        isRepeat: false,
        listMusic: null,
        lastMusic: null,
        isPlaying: false,
        playedList: [],
        songs: [
            {
                name: "Tình đầu",
                singer: "Tăng Duy Tân",
                image: "./asset/images/tinhdau.jpg",
                music: "./asset/musics/tinh-dau.mp3"
            },
            {
                name: "Ánh sao và bầu trời",
                singer: "T.R.I, Cá",
                image: "./asset/images/anh_sao_va_bau_troi.jpg",
                music: "./asset/musics/anh-sao-va-bau-troi.mp3"
            },
            {
                name: "Tháng tư là lời nói dối của em",
                singer: "Hà Anh Tuấn",
                image: "./asset/images/thang-tu-la-loi-noi-doi-cua-em.jpg",
                music: "./asset/musics/thang-tu-la-loi-noi-doi-cua-em.mp3"
            },
            {
                name: "Anh chưa thương em đến vậy đâu",
                singer: "Lady Mây",
                image: "./asset/images/anh-chua-thuong-em-den-vay-dau.jpg",
                music: "./asset/musics/Anh-Chua-Thuong-Em-Den-Vay-Dau-Lady-May.mp3"
            },
            {
                name: "Thằng điên",
                singer: "Justatee x Phương Ly",
                image: "./asset/images/thang-dien.jpeg",
                music: "./asset/musics/thang-dien.mp3"
            },
            {
                name: "Chưa quên người yêu cũ",
                singer: "Hà Nhi",
                image: "./asset/images/chua-quen-nguoi-yeu-cu.jpg",
                music: "./asset/musics/Chua-quen-nguoi-cu.mp3"
            }

        ],
        renderSongs: function () {
            let html = this.songs.map(element =>
                `<li class="playlist__item">
                    <img src="${element.image}"  class="item-picture">
                    <div class="item-content">
                        <h5 class="item-content__name">${element.name}</h5>
                        <p class="item-content__singer">${element.singer}</p>
                    </div>
                    <i class="fa-solid playlist__item-more fa-ellipsis"></i>
                </li>`)
            html = html.join(" ");
            $(".playlist").html(html);
        },
        updatePlayed: function(idx){
            if(this.playedList == this.songs.length){
                this.playedList = [];
                return;
            }
            if(this.playedList.includes(idx))
                return;
            this.playedList.push(idx);
        }
        ,
        get getListMusic() {
            return $(".playlist__item");
        },
        get getLastMusic() {
            return this.listMusic.first();
        },
        selectCurrentMusic: function () {
            // this.lastMusic.css("opacity", "0.3");
            const currentMusic = this.listMusic.eq(currentMusicIdx);
            currentMusic.addClass("playlist__item--active");
            document.querySelector(".playlist__item--active").scrollIntoView();
            // currentMusic.scrollIntoView();
            this.lastMusic.removeClass("playlist__item--active");
            this.lastMusic = currentMusic;
            // currentMusic.css("opacity", "1");
        },
        playMusic: function (index) {
            $(".header__header-music-name").html(`${this.songs[index].name}`);
            $(".header__cd").attr("src", `${this.songs[index].image}`);
            myAudio.attr("src", `${this.songs[index].music}`);
            myAudio.trigger("play");
            currentMusicIdx = index;
            this.selectCurrentMusic();
            
        },
        nextSong: function () {
            let index = currentMusicIdx + 1;
            if (index >= this.songs.length)
                index = 0;
            this.playMusic(index);

        },
        backSong: function () {
            let index = currentMusicIdx - 1;
            if (index <= 0)
                index = this.songs.length - 1;
            this.playMusic(index);
        },
        playRandomSong: function () {
            this.updatePlayed(currentMusicIdx);
            let idx;
            while (true) {
                idx = Math.floor(Math.random() * this.songs.length);
                if (this.playedList.length == this.songs.length && idx!==currentMusicIdx){
                    break;
                }
                if (!this.playedList.includes(idx))
                    break;
            }
            this.playMusic(idx);


        },
        
        handleEvents: function () {
            const width = cd.outerWidth();
            const scr = $("#main");
            let mousedown = false;

            scr.scroll(() => {
                const scrollTop = scr.scrollTop();
                let newWidth = Math.max(width - scrollTop, 0);
                cd.css("width", `${newWidth}px`);
                cd.css("height", `${newWidth}px`);
                cd.css("opacity", newWidth / width);
            }
            )
            // xử lý quay cd
            const cdAnimate = document.querySelector(".header__cd").animate([
                { transform: 'rotate(360deg)' }
            ], {
                duration: 10000,
                iterations: Infinity
            }
            )
            cdAnimate.pause();
            // xử lý dừng, phát nhạc
            playBtn.click(function () {
                app.isPlaying = !app.isPlaying;
                if (app.isPlaying) {
                    myAudio.trigger("play");
                }
                else {
                    myAudio.trigger("pause");
                }
            })
            // khi nhạc phát
            myAudio.on("play", function () {
                playBtn.addClass("playing");
                cdAnimate.play();
            })
            // khi nhạc dừng
            myAudio.on("pause", function () {
                playBtn.removeClass("playing");
                cdAnimate.pause();

            })
            // xử lý tự động qua bài/ lặp lại
            myAudio.on("ended", function () {
                if (app.isRepeat)
                    app.playMusic(currentMusicIdx)
                else if (app.isRanDom)
                    app.playRandomSong();
                else
                    app.nextSong();

            })
            // xử lý lặp lại nhạc
            repeatBtn.click(function () {
                app.isRepeat = !app.isRepeat;
                // if (app.isRepeat) {
                //     app.isRanDom =  false;

                //     randomBtn.toggleClass("active", app.isRanDom);
                // }
                repeatBtn.toggleClass("active", app.isRepeat);

            })
            // xử lý khi tiến độ bài hát thay đổi
            myAudio.on("timeupdate", function () {
                const lengthMusic = myAudio.prop("duration");
                if (lengthMusic) {
                    const progressPercent = Math.floor(myAudio.prop("currentTime") / lengthMusic * 100);
                    progress.val(progressPercent);
                }


            })

            // xử lý khi thay đổi progress bài hát
            progress.on("input", function () {
                
                const progressPercent = this.value;
                const currentTime = progressPercent * myAudio.prop("duration") / 100;
                myAudio.prop("currentTime", `${currentTime}`);
            })
            // xử lý qua bài mới
            nextMusicBtn.click(() => {
                if (app.isRanDom)
                    app.playRandomSong();
                else
                    app.nextSong()
            }
            )
            // xử lý quay lại bài trước
            backMusicBtn.click(() => {
                if (app.isRanDom)
                    app.playRandomSong();
                else
                    app.backSong()
            });
            // phát ngẫu nhiên
            const randomBtn = $(".random-button");
            randomBtn.click(function () {
                app.isRanDom = !app.isRanDom;
                // if (app.isRanDom) {
                //     app.isRepeat = false;
                //     repeatBtn.toggleClass("active", app.isRepeat);
                // }
                randomBtn.toggleClass("active", app.isRanDom);
                this.playedList = [];
            }
            );
            // xử lý khi thay đổi bài hát
            $(".playlist__item").click(function () {

                // priorMusic.css("opacity", "0.3");
                // $(this).css("opacity", "1");
                // priorMusic = $(this);
                const currentMusicName = $(this).find("h5").text();
                const currentIndex = app.songs.findIndex(element => element.name == currentMusicName);
                app.playMusic(currentIndex);
            })

        },
        start: function () {
            this.renderSongs();
            this.listMusic = this.getListMusic;
            this.lastMusic = this.getLastMusic;
            this.lastMusic.addClass("playlist__item--active");
            this.handleEvents();

        }
    }

    app.start();
    // function handle(){

    // }



})
