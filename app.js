const loveWords = [
    "Anh thương em nhiều lắm 💖",
    "Chỉ cần là em, anh chấp nhận tất cả.",
    "Em là điều ngọt ngào nhất trong cuộc đời anh.",
    "Mỗi ngày có em là mỗi ngày hạnh phúc.",
    "Anh chỉ muốn nắm tay em đi hết cuộc đời này.",
    "Gặp được em là điều may mắn nhất đời anh.",
    "Anh muốn ở bên em, mãi mãi không rời.",
    "Chỉ cần em cười, cả thế giới của anh sáng lên.",
    "Em có biết anh nhớ em đến nhường nào không?",
    "Em là giấc mơ đẹp nhất của anh.",
    "Dù thế nào đi nữa, anh vẫn luôn ở đây vì em.",
    "Yêu em là điều tuyệt vời nhất anh từng làm.",
    "Anh hứa sẽ luôn bên em, bảo vệ và yêu em.",
    "Tim anh đã lỡ nhịp kể từ ngày gặp em.",
    "Thế giới này đẹp hơn vì có em.",
    "Anh yêu em hơn cả ngôn từ có thể diễn tả.",
    "Chỉ cần là em, mọi điều đều trở nên đáng giá.",
    "Không ai thay thế được vị trí của em trong tim anh.",
    "Cảm ơn em vì đã đến và làm anh hạnh phúc.",
    "Anh không cần gì cả, chỉ cần có em là đủ."
];

const heartImagePaths = [
    'img/heart (1).png',
    'img/heart (2).png',
    'img/heart (3).png',
    'img/heart.png',
    'img/hearts.png',
    'img/like.png',
    'img/love (1).png',
    'img/love.png'
];

const loadedHeartImages = [];
let imagesLoadedCount = 0;
let totalImagesToLoad = heartImagePaths.length;

heartImagePaths.forEach(path => {
    const img = new Image();
    img.src = path;
    img.onload = () => {
        imagesLoadedCount++;
    };
    img.onerror = () => {
        console.error(`Không thể tải ảnh: ${path}`);
        imagesLoadedCount++; 
    };
    loadedHeartImages.push(img);
});

const scene = document.getElementById("scene");
let rotateX = 0, rotateY = 0; 
let targetRotateX = 0, targetRotateY = 0; 
const maxRotate = 30; 
const rotationSpeed = 0.1; 
const decayRate = 0.95; 

let lastX = 0, lastY = 0;
let dragging = false;

// Xử lý sự kiện chuột và chạm để xoay cảnh 3D
document.addEventListener("mousedown", (e) => {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    e.preventDefault();
});

document.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    const deltaX = e.clientX - lastX;
    const deltaY = e.clientY - lastY;

    targetRotateY += deltaX * 0.2; 
    targetRotateX -= deltaY * 0.2; 
    
    targetRotateX = Math.max(-maxRotate, Math.min(maxRotate, targetRotateX));
    targetRotateY = Math.max(-maxRotate, Math.min(maxRotate, targetRotateY));

    lastX = e.clientX;
    lastY = e.clientY;
    e.preventDefault();
});

document.addEventListener("mouseup", () => {
    dragging = false;
});
document.addEventListener("mouseleave", () => { 
    dragging = false;
});

// Xử lý cảm ứng
document.addEventListener("touchstart", (e) => {
    if (e.touches.length === 1) { 
        dragging = true;
        lastX = e.touches[0].clientX;
        lastY = e.touches[0].clientY;
        e.preventDefault();
    }
}, { passive: false });

document.addEventListener("touchmove", (e) => {
    if (!dragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - lastX;
    const deltaY = e.touches[0].clientY - lastY;

    targetRotateY += deltaX * 0.2;
    targetRotateX -= deltaY * 0.2;

    targetRotateX = Math.max(-maxRotate, Math.min(maxRotate, targetRotateX));
    targetRotateY = Math.max(-maxRotate, Math.min(maxRotate, targetRotateY));

    lastX = e.touches[0].clientX;
    lastY = e.touches[0].clientY;
    e.preventDefault();
}, { passive: false });

document.addEventListener("touchend", () => {
    dragging = false;
});
document.addEventListener("touchcancel", () => { 
    dragging = false;
});


// Hàm tạo chữ rơi
function createFallingText() {
    const textElement = document.createElement("div");
    textElement.className = "falling-element falling-text"; // Thêm class chung
    textElement.innerText = loveWords[Math.floor(Math.random() * loveWords.length)];

    // Vị trí X ngẫu nhiên
    const startX = Math.random() * window.innerWidth;
    textElement.style.left = startX + "px";

    // Kích thước chữ responsive (tối thiểu 16px, tối đa 40px, dựa trên 3-5% chiều rộng)
    const fontSize = Math.max(16, Math.min(40, window.innerWidth * (0.03 + Math.random() * 0.02)));
    textElement.style.fontSize = `${fontSize}px`;

    // Vị trí Z ngẫu nhiên để tạo hiệu ứng 3D sâu
    const zLayer = Math.random() * 400 - 200; // Từ -200px đến 200px
    // Góc xoay ban đầu ngẫu nhiên (chỉ rotateZ để không bị "ngã")
    const initialRotateZ = Math.random() * 360; 

    // Chỉ áp dụng translateZ và rotateZ ban đầu
    textElement.style.transform = `translateZ(${zLayer}px) rotateZ(${initialRotateZ}deg)`;

    scene.appendChild(textElement);

    // Xóa phần tử sau khi animation kết thúc (fallAndFade)
    textElement.addEventListener('animationend', (event) => {
        if (event.animationName === 'fallAndFade') {
            textElement.remove();
        }
    });

    // Fade in bằng cách thiết lập opacity sau một khoảng thời gian ngắn
    setTimeout(() => {
        textElement.style.opacity = 1;
    }, 10); // Một chút delay để animation bắt đầu
}

// Hàm tạo trái tim rơi
function createFallingHeart() {
    if (loadedHeartImages.length === 0 || imagesLoadedCount < totalImagesToLoad) {
        return; 
    }

    const heartElement = document.createElement("div");
    heartElement.className = "falling-element falling-heart"; // Thêm class chung
    const randomImg = loadedHeartImages[Math.floor(Math.random() * loadedHeartImages.length)];
    const imgTag = document.createElement('img');
    imgTag.src = randomImg.src;
    heartElement.appendChild(imgTag);

    const startX = Math.random() * window.innerWidth;
    heartElement.style.left = startX + "px";

    const heartSize = Math.max(25, Math.min(60, window.innerWidth * (0.04 + Math.random() * 0.03)));
    heartElement.style.width = `${heartSize}px`;
    heartElement.style.height = `${heartSize}px`;

    const zLayer = Math.random() * 400 - 200;
    const initialRotateZ = Math.random() * 360; 
    heartElement.style.transform = `translateZ(${zLayer}px) rotateZ(${initialRotateZ}deg)`;

    scene.appendChild(heartElement);

    heartElement.addEventListener('animationend', (event) => {
        if (event.animationName === 'fallAndFade') {
            heartElement.remove();
        }
    });

    setTimeout(() => {
        heartElement.style.opacity = 1;
    }, 10);
}

// Hàm cập nhật animation của scene
function animateScene() {
    // Làm mượt chuyển động xoay của scene
    if (!dragging) {
        targetRotateX *= decayRate; 
        targetRotateY *= decayRate;
        if (Math.abs(targetRotateX) < 0.1) targetRotateX = 0;
        if (Math.abs(targetRotateY) < 0.1) targetRotateY = 0;
    }
    
    rotateX += (targetRotateX - rotateX) * rotationSpeed;
    rotateY += (targetRotateY - rotateY) * rotationSpeed;

    scene.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

    requestAnimationFrame(animateScene);
}

// Bắt đầu tạo các phần tử rơi sau khi trang tải
window.onload = () => {
    // Tạo ban đầu một số lượng lớn các phần tử để lấp đầy màn hình
    const initialElements = Math.floor(window.innerWidth / 30); 
    for (let i = 0; i < initialElements; i++) {
        createFallingText();
        createFallingHeart();
    }

    // Thiết lập interval để tạo các phần tử mới liên tục
    setInterval(createFallingText, 1000); // Tạo chữ mỗi 1 giây
    setInterval(createFallingHeart, 800); // Tạo trái tim mỗi 0.8 giây

    animateScene(); // Bắt đầu vòng lặp animation cho scene
};

window.addEventListener('resize', () => {
    // Không cần tạo lại tất cả phần tử, chỉ cần đảm bảo kích thước font/heart mới sẽ được áp dụng cho các phần tử mới.
    // Các phần tử cũ sẽ tiếp tục rơi theo animation hiện tại.
});