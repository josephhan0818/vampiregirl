let affection = 0;

function createHearts(x, y) {
    const heartCount = 5;
    const hearts = [];
    
    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.style.backgroundImage = "url('pic/heart.png')";
        heart.style.left = `${x}px`;
        heart.style.top = `${y}px`;
        document.body.appendChild(heart);
        hearts.push(heart);
    }

    anime({
        targets: hearts,
        translateY: function() { return -100 - (Math.random() * 50); },
        translateX: function() { return Math.random() * 100 - 50; },
        scale: [1, 0.5],
        opacity: [1, 0],
        duration: function() { return 1000 + (Math.random() * 500); },
        easing: 'easeOutExpo',
        complete: function() {
            hearts.forEach(heart => heart.remove());
        }
    });
}

function createBrokenHearts(x, y) {
    const heartCount = 3;
    const hearts = [];
    
    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('div');
        heart.className = 'broken-heart';
        heart.style.left = `${x}px`;
        heart.style.top = `${y}px`;
        document.body.appendChild(heart);
        hearts.push(heart);
    }

    anime({
        targets: hearts,
        translateY: function() { return 100 + (Math.random() * 50); },
        translateX: function() { return Math.random() * 60 - 30; },
        rotate: function() { return Math.random() * -60 - 30; },
        scale: [1, 0.3],
        opacity: [1, 0],
        duration: function() { return 1500 + (Math.random() * 500); },
        easing: 'easeInQuad',
        complete: function() {
            hearts.forEach(heart => heart.remove());
        }
    });
}

// 初始化 ScrollReveal
const sr = ScrollReveal({
    distance: '50px',
    duration: 1000,
    easing: 'ease'
});

function animateStoryContent() {
    sr.reveal('#story p', {
        origin: 'bottom',
        interval: 200
    });
    
    sr.reveal('.character-image', {
        origin: 'top',
        distance: '20px'
    });
    
    sr.reveal('#choices button', {
        origin: 'bottom',
        interval: 100
    });
}

function updateAffectionDisplay(increment = 0) {
    const affectionElement = document.getElementById('affection');
    affectionElement.innerText = `好感度：${affection}`;
    
    const rect = affectionElement.getBoundingClientRect();
    if (increment > 0) {
        createHearts(rect.left + rect.width/2, rect.bottom);
        affectionElement.classList.add('highlight');
        setTimeout(() => affectionElement.classList.remove('highlight'), 500);
    } else if (increment < 0) {
        createBrokenHearts(rect.left + rect.width/2, rect.bottom);
        // 添加震動效果
        anime({
            targets: affectionElement,
            translateX: [
                { value: -4, duration: 50 },
                { value: 4, duration: 50 },
                { value: -4, duration: 50 },
                { value: 0, duration: 50 }
            ],
            easing: 'easeInOutSine'
        });
    }
}

function choose(option) {
    window.currentScene = option;
    const prevAffection = affection; // 記錄改變前的好感度
    const story = document.getElementById('story');
    const choices = document.getElementById('choices');
    
    // 添加淡入動畫
    story.classList.remove('fade-in');
    void story.offsetWidth;
    story.classList.add('fade-in');
    
    // 在載入圖片前顯示載入狀態
    const loadingTemplate = `<div class="loading">載入中...</div>`;
    
    if (option === 'start') {
        story.innerHTML = loadingTemplate;
        const img = new Image();
        img.onload = function() {
            story.innerHTML = `
                <img src="pic/oldcastledoor.png" class="character-image fade-in">
                <p>【哥德古堡·夜】</p>
                <p>月光灑落在灰白石磚地面，你的腳步聲在寂靜中顯得格外清晰，突然間，面前的大門「吱呀」一聲打開。</p>
            `;
            choices.innerHTML = `
                <button onclick="choose('continue')">繼續</button>
            `;
        };
        img.src = "pic/happy.png";
    } else if (option === 'continue') {
        story.innerHTML = loadingTemplate;
        const img = new Image();
        img.onload = function() {
            story.innerHTML = `
                <img src="pic/happy.png" class="character-image fade-in">
                <p>一位銀髮紅眼的女孩站在門口，似笑非笑地看著你。</p>
                <p>「人類……你是自願來的，還是……迷路了呢？」</p>
            `;
            choices.innerHTML = `
                <button onclick="choose('introduce')">自信地微笑並介紹自己</button>
                <button onclick="choose('leave')">保持警戒，試圖離開</button>
            `;
        };
        img.src = "pic/happy.png";
    } else if (option === 'introduce') {
        affection += 1;
        updateAffectionDisplay(1);
        story.innerHTML = `
            <img src="pic/happy.png" class="character-image">
            <p>你抬起頭，對她微笑。「我叫做{你的名字}，剛好路過，這裡⋯很特別。」</p>
            <p>她彎起嘴角，露出一點尖牙。「有趣的人類。進來喝杯紅酒……還是，你比較喜歡⋯紅的其他東西？」</p>
        `;
        choices.innerHTML = `
            <button onclick="choose('askAboutHer')">試著反問她的身份</button>
            <button onclick="choose('enterCastle')">進入古堡</button>
        `;
    } else if (option === 'leave') {
        affection -= 1;
        updateAffectionDisplay(-1);
        story.innerHTML = `
            <img src="pic/angry.png" class="character-image">
            <p>你轉身想離開，卻發現門後是無盡的霧氣與黑暗。</p>
            <p>「呵，太遲了，這是我的領域。你走不了，除非⋯」</p>
        `;
        choices.innerHTML = `
            <button onclick="choose('calmDown')">勉強冷靜下來</button>
            <button onclick="choose('resist')">強硬抵抗</button>
        `;
    } else if (option === 'askAboutHer') {
        affection += 1;
        updateAffectionDisplay(1);
        story.innerHTML = `
            <img src="pic/sad.png" class="character-image">
            <p>你望向她：「妳是誰？為什麼會住在這種地方？」</p>
            <p>她的表情稍微柔和了一點：「我叫莉莉絲，這裡是我的家，也是……我的牢籠。」</p>
        `;
        choices.innerHTML = `<button onclick="choose('enterCastle')">進入古堡</button>`;
    } else if (option === 'calmDown') {
        story.innerHTML = `
            <img src="pic/happy.png" class="character-image">
            <p>你深吸一口氣，試著冷靜。「那我該怎麼做？」</p>
            <p>莉莉絲的表情有些玩味。「很好，至少你不笨。」</p>
        `;
        choices.innerHTML = `<button onclick="choose('enterCastle')">進入古堡</button>`;
    } else if (option === 'resist') {
        story.innerHTML = `
            <img src="pic/BadEnd.png" class="character-image">
            <p>你嘗試抵抗，但她瞬間消失又出現在你背後，一記輕拍，你就昏迷了。</p>
            <p>【BAD END：血色夜曲】</p>
        `;
        choices.innerHTML = '';
    } else if (option === 'enterCastle') {
        story.innerHTML = `
          <img src="pic/happy.png" class="character-image">
            <p>你進入古堡，蠟燭點亮的走廊看起來異常華麗。</p>
            <p>莉莉絲：「今晚，你可以選擇做三件事來打發時間。」</p>
        `;
        choices.innerHTML = `
            <button onclick="choose('dance')">陪她跳一支維也納舞</button>
            <button onclick="choose('bloodCollection')">參觀她的血液收藏</button>
            <button onclick="choose('library')">閱讀她的古書</button>
        `;
    } else if (option === 'dance') {
        affection += 1;
        updateAffectionDisplay(1);
        story.innerHTML = `
            <img src="pic/love.png" class="character-image">
            <p>你大膽地伸出手：「跳一支舞，如何？」</p>
            <p>她嘴角一翹，優雅地伸出手。</p>
            <p>你們在古堡廳堂翩翩起舞，彷彿回到了十九世紀的舞會。</p>
        `;
        choices.innerHTML = `<button onclick="choose('endingCheck')">結束這晚的互動</button>`;
    } else if (option === 'bloodCollection') {
        story.innerHTML = `
            <img src="pic/happy.png" class="character-image">
            <p>你硬著頭皮看著瓶瓶罐罐裡的紅液體。</p>
            <p>「這些都是紀念品，人類的情緒⋯會留在血液裡。」</p>
            <p>你忍住不適感，看完了展覽。</p>
        `;
        choices.innerHTML = `<button onclick="choose('endingCheck')">結束這晚的互動</button>`;
    } else if (option === 'library') {
        affection += 1;
        updateAffectionDisplay(1);
        story.innerHTML = `
            <img src="pic/happy.png" class="character-image">
            <p>你挑了一本破舊的書閱讀，發現裡面記錄著吸血鬼的歷史與人類的悲劇。</p>
            <p>「你懂得比我想像中多。」</p>
        `;
        choices.innerHTML = `<button onclick="choose('endingCheck')">結束這晚的互動</button>`;
    } else if (option === 'endingCheck') {
        if (affection >= 3) {
            story.innerHTML = `
                <img src="pic/GoodEnd.png" class="character-image">
                <p>在月光下，她輕聲說：「你是……不同的人類。」</p>
                <p>她靠近，吻了你。</p>
                <p>「也許，我願意給你第二次見面的機會。」</p>
                <p>【GOOD END：月光之約】</p>
                <button class="restart-button" onclick="choose('start')">重新開始</button>
            `;
        } else {
            story.innerHTML = `
                <img src="pic/BadEnd.png" class="character-image">
                <p>你不慎激怒了莉莉絲。她的眼神冷了下來。</p>
                <p>「遊戲結束，人類。」</p>
                <p>你失去意識，在黑暗中被永遠遺忘。</p>
                <p>【BAD END：血色夜曲】</p>
                <button class="restart-button" onclick="choose('start')">重新開始</button>
            `;
        }
        choices.innerHTML = '';
        affection = 0; // 重置好感度
    }
}

// 添加圖片預載入
window.addEventListener('load', function() {
    const images = [
        'happy.png',
        'angry.png',
        'sad.png',
        'love.png',
        'GoodEnd.png',
        'BadEnd.png'
    ];
    
    images.forEach(img => {
        const image = new Image();
        image.src = `pic/${img}`;
    });
    
    const debugElement = document.getElementById('debug');
    if (typeof window.Story !== 'undefined') {
        debugElement.style.display = 'none';
        console.log('SugarCube loaded successfully');
    } else {
        debugElement.innerText = 'Error: SugarCube failed to load';
        console.error('SugarCube not loaded');
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const debugElement = document.getElementById('debug');
    const storyElement = document.getElementById('story');
    const bgm = document.getElementById('bgm');
    const musicToggle = document.getElementById('musicToggle');

    // 音樂控制初始化
    let musicEnabled = false;
    bgm.volume = 0.3;

    musicToggle.addEventListener('click', function() {
        musicEnabled = !musicEnabled;
        if (musicEnabled) {
            bgm.play().then(() => {
                musicToggle.textContent = '♪';
            }).catch(err => {
                console.log('播放失敗：', err);
                musicEnabled = false;
            });
        } else {
            bgm.pause();
            musicToggle.textContent = '♫';
        }
    });

    // 確保音樂狀態與顯示同步
    bgm.addEventListener('play', () => {
        musicToggle.textContent = '♪';
        musicEnabled = true;
    });

    bgm.addEventListener('pause', () => {
        musicToggle.textContent = '♫';
        musicEnabled = false;
    });

    if (storyElement) {
        debugElement.style.display = 'none';
        choose('start');
    } else {
        debugElement.innerText = 'Error: Story element not found!';
    }
});

// 音樂控制初始化
document.addEventListener('DOMContentLoaded', function() {
    const bgm = document.getElementById('bgm');
    const musicToggle = document.getElementById('musicToggle');
    let isMusicPlaying = false;

    bgm.volume = 0.3;

    musicToggle.addEventListener('click', function() {
        if (!isMusicPlaying) {
            bgm.play().then(() => {
                isMusicPlaying = true;
                musicToggle.textContent = '🔊';
            }).catch(error => {
                console.log("播放失敗：", error);
            });
        } else {
            bgm.pause();
            isMusicPlaying = false;
            musicToggle.textContent = '🔈';
        }
    });

    // 確保音樂狀態與顯示同步
    bgm.addEventListener('playing', () => {
        isMusicPlaying = true;
        musicToggle.textContent = '🔊';
    });

    bgm.addEventListener('pause', () => {
        isMusicPlaying = false;
        musicToggle.textContent = '🔈';
    });
});

// 確保初始化時顯示好感度
document.addEventListener('DOMContentLoaded', function() {
    updateAffectionDisplay();
    // ...existing code...
});

// 初始化頁面動畫
document.addEventListener('DOMContentLoaded', function() {
    // ...existing code...
    
    // 初始按鈕動畫
    anime({
        targets: '.music-button',
        scale: [0, 1],
        opacity: [0, 1],
        duration: 800,
        easing: 'easeOutElastic(1, .8)'
    });
});

// 儲存遊戲進度
function saveGame() {
    const gameState = {
        affection: affection,
        currentScene: window.currentScene || 'start'
    };
    localStorage.setItem('vampireGameSave', JSON.stringify(gameState));
}

// 讀取遊戲進度
function loadGame() {
    const savedState = localStorage.getItem('vampireGameSave');
    if (savedState) {
        const gameState = JSON.parse(savedState);
        affection = gameState.affection;
        choose(gameState.currentScene);
        updateAffectionDisplay();
        return true;
    }
    return false;
}

document.addEventListener('DOMContentLoaded', function() {
    const titleScreen = document.getElementById('title-screen');
    const gameScreen = document.getElementById('game');
    const startButton = document.getElementById('start-game');
    const loadButton = document.getElementById('load-game');
    
    // 檢查是否有儲存檔
    if (localStorage.getItem('vampireGameSave')) {
        loadButton.disabled = false;
    }
    
    startButton.addEventListener('click', function() {
        anime({
            targets: titleScreen,
            opacity: 0,
            duration: 800,
            easing: 'easeOutQuad',
            complete: function() {
                titleScreen.style.display = 'none';
                gameScreen.style.display = 'block';
                anime({
                    targets: gameScreen,
                    opacity: [0, 1],
                    duration: 800,
                    easing: 'easeInQuad'
                });
                choose('start');
            }
        });
    });
    
    loadButton.addEventListener('click', function() {
        if (loadGame()) {
            titleScreen.style.display = 'none';
            gameScreen.style.display = 'block';
        }
    });
    
    // 自動儲存
    window.addEventListener('beforeunload', saveGame);
});