const texts = {
    ar: "البرمجة هي عملية كتابة تعليمات ووجهات توجيه للحاسوب لكي يقوم بمهام محددة وتطوير تطبيقات ويب مذهلة باستخدام أحدث التقنيات واللغات البرمجية المختلفة",
    en: "Programming is the process of creating a set of instructions that tell a computer how to perform a task. It allows developers to build amazing web applications using modern technologies."
};

const textDisplay = document.getElementById("textDisplay");
const inputField = document.getElementById("inputField");
const timerTag = document.getElementById("timer");
const accuracyTag = document.getElementById("accuracy");
const resetBtn = document.getElementById("resetBtn");
const langSelect = document.getElementById("langSelect");
const container = document.querySelector(".container");

const instructionText = document.getElementById("instructionText");
const timerLabel = document.getElementById("timerLabel");
const secLabel = document.getElementById("secLabel");
const accLabel = document.getElementById("accLabel");

let timer;
let maxTime = 60;
let timeLeft = maxTime;
let charIndex = 0;
let mistakes = 0;
let isTyping = false;

function loadParagraph() {
    const currentLang = langSelect.value;
    const typingText = texts[currentLang];

    textDisplay.innerHTML = "";
    typingText.split("").forEach(char => {
        let span = `<span>${char}</span>`;
        textDisplay.innerHTML += span;
    });
    
    if (currentLang === 'ar') {
        textDisplay.setAttribute("dir", "rtl");
        inputField.setAttribute("dir", "rtl");
        container.classList.remove("ltr");
        instructionText.innerHTML = `قم بإعادة كتابة النص الظاهر في الصندوق أدناه بدقة، لديك <strong>دقيقة واحدة (60 ثانية)</strong> لإكمال الاختبار!`;
        timerLabel.innerText = "الوقت المتبقي:";
        secLabel.innerText = "ثانية";
        accLabel.innerText = "نسبة الدقة:";
        inputField.placeholder = "ابدأ الكتابة هنا فوراً...";
    } else {
        textDisplay.setAttribute("dir", "ltr");
        inputField.setAttribute("dir", "ltr");
        container.classList.add("ltr");
        instructionText.innerHTML = `Type the text displayed in the box below accurately, you have <strong>one minute (60 seconds)</strong> to complete the test!`;
        timerLabel.innerText = "Time Left:";
        secLabel.innerText = "seconds";
        accLabel.innerText = "Accuracy:";
        inputField.placeholder = "Start typing here immediately...";
    }

    textDisplay.querySelectorAll("span")[0].classList.add("active");
}

function initTyping() {
    const currentLang = langSelect.value;
    const characters = textDisplay.querySelectorAll("span");
    const typedChar = inputField.value.split("")[charIndex];

    if (!isTyping) {
        timer = setInterval(initTimer, 1000);
        isTyping = true;
    }

    if (typedChar == null) {
        if (charIndex > 0) {
            charIndex--;
            if (characters[charIndex].classList.contains("incorrect")) {
                mistakes--;
            }
            characters[charIndex].classList.remove("correct", "incorrect");
        }
    } else {
        if (characters[charIndex].innerText === typedChar) {
            characters[charIndex].classList.add("correct");
        } else {
            mistakes++;
            characters[charIndex].classList.add("incorrect");
        }
        charIndex++;
    }

    characters.forEach(span => span.classList.remove("active"));
    
    if (charIndex < characters.length) {
        characters[charIndex].classList.add("active");
    } else {
        clearInterval(timer);
        inputField.disabled = true;
        showResult(true, currentLang);
    }

    let accuracy = 100;
    if (charIndex > 0 && mistakes <= charIndex) {
        accuracy = Math.floor(((charIndex - mistakes) / charIndex) * 100);
    }
    accuracyTag.innerText = accuracy;
}

function initTimer() {
    const currentLang = langSelect.value;
    if (timeLeft > 0) {
        timeLeft--;
        timerTag.innerText = timeLeft;
    } else {
        clearInterval(timer);
        inputField.disabled = true;
        showResult(false, currentLang);
    }
}

function showResult(isSuccess, lang) {
    if (isSuccess) {
        swal({
            title: lang === 'ar' ? "🎉 مبروك!" : "🎉 Success!",
            text: lang === 'ar' ? "لقد نجحت وأنهيت النص في الوقت المحدد." : "You completed the text on time.",
            button: lang === 'ar' ? "تمام" : "OK",
            className: "mm",
        }).then(() => {
            resetGame();
        });
    } else {
        swal({
            title: lang === 'ar' ? "❌ انتهى الوقت!" : "❌ Time's Up!",
            text: lang === 'ar' ? "لقد فشلت في إكمال النص، حاول مرة أخرى." : "You failed to complete the text, try again.",
            button: lang === 'ar' ? "حاول مجدداً" : "Retry",
            className: "mm",
        }).then(() => {
            resetGame();
        });
    }
}

function resetGame() {
    clearInterval(timer);
    timeLeft = maxTime;
    charIndex = 0;
    mistakes = 0;
    isTyping = false;
    timerTag.innerText = timeLeft;
    accuracyTag.innerText = 100;
    inputField.value = "";
    inputField.disabled = false;
    loadParagraph();
}

inputField.addEventListener("input", initTyping);
resetBtn.addEventListener("click", resetGame);
langSelect.addEventListener("change", resetGame);

loadParagraph();