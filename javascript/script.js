window.onload = function () {
    console.log('loaded');
    const $ = function (id) {
        return document.getElementById(id);
    }

    // Control the background music.
    const bgMusic = $('bg-music');
    const format1 = $("sound1");
    const format2 = $("sound2");
    bgMusic.volume = 0.05;
    bgMusic.load();
    bgMusic.play();
    let isMusic = true;
    const player = $('player');
    player.addEventListener('click', () => {
        isMusic = !isMusic;
        bgMusic.volume = isMusic ? 0.05 : 0;
        player.innerHTML = isMusic ? 'Music on' : 'Music off';
    });

    const introBanner = $('intro');
    const rulesBanner = $('rules-banner');
    const gameBanner = $('game-banner');
    const successBanner = $('success-banner');
    const introNext = $('intro-next');
    const rulesNext = $('rules-next');
    const inputBox = $("user-input");
    const bullCountPlaceHolder = $('bull-count');
    const cowCountPlaceHolder = $('cow-count');
    const invalidChars = ['-', '+', 'e', ];
    const attemptCountPlaceHolder = $('attempt-count');
    const guessCountPlaceHolder = $('guessCount');
    const guessTimePlaceHolder = $('guessTime');
    const restartBtn = $('restart-btn');
    const closeBtn = $('close-btn');
    const timerPlaceHolder = $('timer');
    const finalTime = '00:00';
    let userDigits = new Set();
    let seconds = 0;
    let hours = 0;
    let minutes = 0;
    let userInput = '';

    const setProperty = function(element, property, value) {
        console.log("vendor");
        element.style["webkit" + property] = value;
        element.style["moz" + property] = value;
        element.style["ms" + property] = value;
        element.style["o" + property] = value;
    }
    const hideIntro = function () {
        introBanner.style.visibility = 'hidden';
        //rulesBanner.style.transform = 'scale(1) translate(-50%, -50%)';
        setProperty(rulesBanner, 'Transform', 'scale(1) translate(-50%, -50%)');
    };

    setTimeout(hideIntro, 3000);

    rulesNext.addEventListener('click', () => {
        rulesNext.style.visibility = 'hidden';
        rulesNext.style.transition = 'all 0s ease-in-out';
        rulesBanner.style.transition = 'all 0s ease-in-out';
        rulesBanner.style.visibility = 'hidden';
        //gameBanner.style.transform = 'scale(1) translate(-50%, -50%)';
        setProperty(gameBanner, 'Transform', 'scale(1) translate(-50%, -50%)');
        startGame();
    });

    // Generate 4 digit random number with unique digits
    const getRandomNumber = function () {
        var val = Math.floor(1000 + Math.random() * 9000);
        const isUnique = function (num) {
            let copy = num;
            let uniqueDigits = new Set();
            while ((num) > 0) {
                let digit = num % 10;
                if (uniqueDigits.has(digit)) {
                    console.log('Random Number with repeated digits ' + copy)
                    return false;
                }
                uniqueDigits.add(digit)
                num = Math.floor(num / 10)
            }
            return true;
        }
        while (!isUnique(val)) {
            val = Math.floor(1000 + Math.random() * 9000);
        }
        return val.toString();
    };

    // Get the bull count and cow count based on random number and user input.
    const getBullCowCount = function (randomNumber, userNumber) {
        let bull = 0;
        let cow = 0;
        let randomDigits = [];
        let userDigits = [];

        for (let i in userNumber) {
            if (randomNumber[i] == userNumber[i])
                bull++;
            else {
                randomDigits.push(randomNumber[i]);
                userDigits.push(userNumber[i]);
            }
        }

        for (let i in userDigits) {
            if (randomDigits.indexOf(userDigits[i]) != -1) {
                cow++;
            }
        }
        let result = [bull, cow];
        return result;
    };

    const startGame = function () {
        let randomNumber = getRandomNumber();
        let attemptCount = 1;
        let inputDigits = [];
        attemptCountPlaceHolder.textContent = attemptCount;

        // Timer function
        const add = () => {
            seconds++;
            if (seconds >= 60) {
                seconds = 0;
                minutes++;
                if (minutes >= 60) {
                    minutes = 0;
                    hours++;
                }
            }

            timerPlaceHolder.textContent = (hours ? (hours > 9 ? hours : '0' + hours) : '00') + ':' + (minutes ? (minutes > 9 ? minutes : '0' + minutes) : '00') + ':' + (seconds > 9 ? seconds : '0' + seconds);
            timer();
        };

        const timer = () => {
            t = setTimeout(add, 1000);
        };

        timer();

        timerPlaceHolder.textContent = (hours ? (hours > 9 ? hours : '0' + hours) : '00') + ':' + (minutes ? (minutes > 9 ? minutes : '0' + minutes) : '00') + ':' + (seconds > 9 ? seconds : '0' + seconds);

        inputBox.addEventListener('keyup', (e) => {
            let input = e.key;
            if (invalidChars.includes(input) || userInput.length > 3) {
                e.preventDefault();
            }

            // Handle non-numeric character, backspace, duplicate digits.
            if (input.charCodeAt(0) === 66) {
                inputDigits.pop();
                userInput = userInput.substr(0, userInput.length - 1);
                inputBox.value = userInput;
            } else if (inputDigits.includes(input) || input.charCodeAt(0) < 48 || input.charCodeAt(0) > 57) {
                inputBox.value = userInput;
                e.preventDefault();
            } else {
                inputDigits.push(input);
                userInput += input;

                // User has input 4 unique digits.
                if (userInput.length > 3) {
                    console.log('4 digit ' + userInput);
                    console.log('random ' + randomNumber)
                    let result = getBullCowCount(randomNumber, userInput);
                    bullCountPlaceHolder.textContent = result[0];
                    cowCountPlaceHolder.textContent = result[1];
                    attemptCountPlaceHolder.textContent = attemptCount;
                    if (result[0] == 4) {
                        guessTimePlaceHolder.textContent = (hours ? (hours > 9 ? hours : '0' + hours) + ' hours' : '') + ' ' + (minutes ? (minutes > 9 ? minutes : '0' + minutes) + ' minutes' : '') + ' ' + (seconds > 9 ? seconds : '0' + seconds) + ' seconds!';
                        clearTimeout(t);
                        seconds = 0;
                        hours = 0;
                        minutes = 0;
                        gameBanner.style.transition = 'all 0s ease-in-out';
                        gameBanner.style.visibility = 'hidden';

                        guessCountPlaceHolder.textContent = attemptCount;
                        setProperty(successBanner, 'Transform', 'scale(1) translate(-50%, -50%)');
                    }
                    inputDigits = [];
                    userInput = '';
                    attemptCount++;
                    inputBox.value = '';
                    inputBox.focus();
                    return;
                }
            }
        })
    }
};
