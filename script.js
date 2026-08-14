// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Scroll Reveal Animation
function reveal() {
    var reveals = document.querySelectorAll('.reveal');
    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 150;
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add('active');
        }
    }

    var staggers = document.querySelectorAll('.reveal-stagger');
    for (var j = 0; j < staggers.length; j++) {
        var windowHeight2 = window.innerHeight;
        var elementTop2 = staggers[j].getBoundingClientRect().top;
        var elementVisible2 = 50;

        if (elementTop2 < windowHeight2 - elementVisible2) {
            // Apply delay based on index for staggered effect
            staggers[j].style.transitionDelay = `${(j % 3) * 0.15}s`;
            staggers[j].classList.add('active');
        }
    }
}

window.addEventListener('scroll', reveal);
// Trigger reveal on load
window.addEventListener('load', reveal);
setTimeout(reveal, 100);

// Glitch effect on title on hover
const title = document.querySelector('.glitch');
if (title) {
    title.addEventListener('mouseover', () => {
        title.style.animation = 'glitch-anim 0.3s cubic-bezier(.25, .46, .45, .94) both infinite';
    });
    title.addEventListener('mouseout', () => {
        title.style.animation = 'none';
    });
}

// WOW Features - Cursor & Interactions

const cursorDot = document.querySelector('.cursor-dot');
const cursorGlow = document.querySelector('.cursor-glow');
const interactables = document.querySelectorAll('a, button, .btn, .glass');

if (cursorDot && cursorGlow) {
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // Dot follows instantly
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Glow follows with slight lag for organic feel
        cursorGlow.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-hover');
        });
    });
}

// Initialize 3D Tilt Effect on all Glass cards
// We check if VanillaTilt is loaded first
if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll(".glass"), {
        max: 5,
        speed: 400,
        glare: true,
        "max-glare": 0.2,
        scale: 1.02
    });
}

// --- Registration Modal Logic ---
const modal = document.getElementById('registerModal');
const openModalBtns = document.querySelectorAll('.open-modal-btn');
const closeModalBtn = document.querySelector('.close-modal');
const participationRadios = document.querySelectorAll('input[name="participation"]');
const teamNameGroup = document.getElementById('teamNameGroup');
const additionalMembers = document.getElementById('additionalMembers');
const member1Title = document.getElementById('member1Title');

// Open Modal
openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        // Disable custom cursor for form interaction
        if (cursorDot && cursorGlow) {
            cursorDot.style.display = 'none';
            cursorGlow.style.display = 'none';
        }
        document.body.style.cursor = 'auto'; // Restore normal cursor
    });
});

// Close Modal
const closeModal = () => {
    modal.classList.remove('show');
    document.body.style.overflow = 'auto'; // Restore scrolling
    // Re-enable custom cursor
    if (cursorDot && cursorGlow) {
        cursorDot.style.display = 'block';
        cursorGlow.style.display = 'block';
    }
    document.body.style.cursor = 'none'; // Back to custom cursor
};

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
}

// Close on outside click
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Toggle Team vs Individual fields
participationRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        if (e.target.value === 'team') {
            teamNameGroup.style.display = 'block';
            additionalMembers.style.display = 'block';
            member1Title.textContent = 'Team Leader';
        } else {
            teamNameGroup.style.display = 'none';
            additionalMembers.style.display = 'none';
            member1Title.textContent = 'Participant / Team Leader';
        }
    });
});

// Add interactable class to modal inputs for cursor effect
const modalInteractables = document.querySelectorAll('.modal input, .modal label, .close-modal, .modal button');
if (modalInteractables.length > 0 && cursorDot && cursorGlow) {
    modalInteractables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-hover');
        });
    });
}

// --- Google Sheets Integration via Apps Script ---
const form = document.getElementById('registrationForm');
const submitBtn = document.getElementById('submitBtn');

// USER: Replace this URL with your Google Apps Script Web App URL
const scriptURL = 'https://script.google.com/macros/s/AKfycbxweIwbGYUPCn-BFLWR3Pr9LesyeygvDfH-hm8xu_ytWmodEMoFLmFZ-m762rH6sUOt/exec';

if (form) {
    form.addEventListener('submit', e => {
        e.preventDefault();

        if (scriptURL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE') {
            alert("Developer Note: Please add your Google Apps Script Web App URL in script.js (line 160) to enable real form submission.");
            return;
        }

        submitBtn.disabled = true;
        let originalText = submitBtn.textContent;
        submitBtn.textContent = "Submitting...";

        let requestBody = new FormData(form);


        fetch(scriptURL, {
            method: 'POST',
            body: requestBody,
            mode: 'no-cors'
        })
            .then(() => {

                alert(
                    "✅ Registration submitted successfully!\n\n" +
                    "Please check the Leader Email for your confirmation and QR code."
                );

                form.reset();

                if (typeof closeModal === 'function') {
                    closeModal();
                }

            })
            .catch(error => {

                console.error("Registration error:", error);

                alert(
                    "❌ Registration failed.\n\n" +
                    "Please try again."
                );

            })
            .finally(() => {

                submitBtn.disabled = false;
                submitBtn.textContent = originalText;

            });
    });
}
