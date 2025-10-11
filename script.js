// Preload gambar dengan requestAnimationFrame untuk smoothness
function preloadImages() {
    const images = [
        'https://files.catbox.moe/s4uebz.png',
        'https://files.catbox.moe/orwja1.png'
    ];
    images.forEach(src => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            console.log('Gambar preloaded: ' + src); // Debug log
        };
        img.onerror = () => {
            console.error('Gagal preload gambar: ' + src);
        };
    });
}

// Jalankan preload setelah DOM siap
document.addEventListener('DOMContentLoaded', preloadImages);

// Jalankan juga setelah full load untuk safety
window.addEventListener('load', preloadImages);

const paymentNumbers = {
    dana: '081259435726',
    gopay: '081226541936',
    ovo: '088989424856'
};

function copyToClipboard(method) {
    const text = paymentNumbers[method];
    const button = event.target;
    const originalText = button.textContent;

    console.log('Mencoba copy: ' + text); // Debug log

    // Ripple effect sederhana, tapi gunakan requestAnimationFrame untuk smooth
    requestAnimationFrame(() => {
        createRipple(event, button);
    });

    // Metode modern: navigator.clipboard (memerlukan HTTPS atau localhost)
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Copy sukses dengan modern API');
            showSuccess(button, originalText);
        }).catch((err) => {
            console.error('Gagal copy dengan modern API: ', err);
            fallbackCopy(text, button, originalText);
        });
    } else {
        console.log('Menggunakan fallback copy');
        fallbackCopy(text, button, originalText);
    }
}

function fallbackCopy(text, button, originalText) {
    const textarea = document.getElementById('copy-temp');
    if (!textarea) {
        console.error('Textarea copy-temp tidak ditemukan!');
        alert('Error: Elemen copy tidak tersedia. Silakan salin manual: ' + text);
        return;
    }

    // Set text ke textarea
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '0';
    textarea.style.top = '0';
    textarea.style.opacity = '0';
    textarea.style.width = '1px';
    textarea.style.height = '1px';
    textarea.style.padding = '0';
    textarea.style.border = 'none';
    textarea.style.outline = 'none';

    // Focus dan select
    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, 99999); // Untuk mobile

    try {
        const successful = document.execCommand('copy');
        if (successful) {
            console.log('Copy sukses dengan fallback');
            showSuccess(button, originalText);
        } else {
            throw new Error('execCommand gagal');
        }
    } catch (err) {
        console.error('Gagal copy dengan fallback: ', err);
        // Tampilkan nomor di prompt untuk copy manual
        const copied = prompt('Gagal copy otomatis. Salin nomor ini:\n' + text);
        if (copied) {
            showSuccess(button, originalText);
        } else {
            button.textContent = 'Copy Gagal';
            button.style.background = 'linear-gradient(45deg, #ff0000, #cc0000)';
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = 'linear-gradient(45deg, #8a2be2, #4b0082)';
            }, 2000);
        }
    } finally {
        // Reset textarea
        textarea.value = '';
        textarea.blur();
    }
}

function showSuccess(button, originalText) {
    button.textContent = 'Tersalin!';
    button.style.background = 'linear-gradient(45deg, #32cd32, #228b22)';
    requestAnimationFrame(() => {
        button.style.transform = 'scale(1.03)';
    });
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = 'linear-gradient(45deg, #8a2be2, #4b0082)';
        button.style.transform = 'scale(1)';
    }, 1500); // Kurangi durasi dari 2000ms
}

// Fungsi ripple effect untuk button (feedback klik lebih bagus)
function createRipple(event, button) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.4)';
    ripple.style.transform = `translate(${x}px, ${y}px) scale(0)`;
    ripple.style.width = ripple.style.height = '20px'; // Ukuran tetap kecil
    ripple.style.left = '0';
    ripple.style.top = '0';
    ripple.style.pointerEvents = 'none';
    ripple.style.transition = 'transform 0.4s ease-out, opacity 0.4s ease-out';
    button.style.overflow = 'visible';
    button.appendChild(ripple);

    requestAnimationFrame(() => {
        ripple.style.transform = `translate(${x}px, ${y}px) scale(2)`;
        ripple.style.opacity = '0';
    });

    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
        }
        button.style.overflow = 'hidden';
    }, 400);
}

// Optimasi resize dengan requestAnimationFrame
let ticking = false;
function onResize() {
    if (!ticking) {
        requestAnimationFrame(() => {
            // Handle resize jika perlu (misalnya recalculate layout)
            ticking = false;
        });
        ticking = true;
    }
}
window.addEventListener('resize', onResize);

// Detect low performance dan disable animasi (opsional)
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        // Cek performa sederhana
        console.log('Performa check: Halaman siap');
    });
}

// Prevent zoom on touch di mobile untuk smoothness
let lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Pause animasi saat scroll untuk smoothness (opsional, jika masih patah)
let isScrolling = true;
window.addEventListener('scroll', () => {
    if (!isScrolling) {
        isScrolling = true;
        document.body.style.animationPlayState = 'paused';
        setTimeout(() => {
            document.body.style.animationPlayState = 'running';
            isScrolling = true;
        }, 100);
    }
}, { passive: true });