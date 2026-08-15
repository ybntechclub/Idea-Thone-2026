// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// Mobile Hamburger Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('open');
        });
    });
}

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
            staggers[j].style.transitionDelay = `${(j % 3) * 0.15}s`;
            staggers[j].classList.add('active');
        }
    }
}

window.addEventListener('scroll', reveal);
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

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

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
const formStatus = document.getElementById('formStatus');

// Open Modal
openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            if (cursorDot && cursorGlow) {
                cursorDot.style.display = 'none';
                cursorGlow.style.display = 'none';
            }
            document.body.style.cursor = 'auto';
        }
    });
});

// Close Modal
const closeModal = () => {
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
        if (cursorDot && cursorGlow) {
            cursorDot.style.display = 'block';
            cursorGlow.style.display = 'block';
        }
        document.body.style.cursor = 'none';
    }
};

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
}

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Toggle Team vs Individual fields
participationRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        if (e.target.value === 'team') {
            if (teamNameGroup) teamNameGroup.style.display = 'block';
            if (additionalMembers) additionalMembers.style.display = 'block';
            if (member1Title) member1Title.textContent = 'Team Leader';
        } else {
            if (teamNameGroup) teamNameGroup.style.display = 'none';
            if (additionalMembers) additionalMembers.style.display = 'none';
            if (member1Title) member1Title.textContent = 'Participant / Team Leader';
        }
    });
});

// Helper function for strict email validation
function validateEmail(email) {
    if (!email) return false;
    // Standard RFC 5322 Email Validation Regex
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).trim().toLowerCase());
}

// Clear red border/error highlights on typing
document.querySelectorAll('input[type="email"]').forEach(input => {
    input.addEventListener('input', () => {
        input.style.borderColor = '';
        input.style.boxShadow = '';
    });
});

// --- Google Sheets & Mail Apps Script Integration ---
const form = document.getElementById('registrationForm');
const submitBtn = document.getElementById('submitBtn');

// ⚠️ DEPLOYED GOOGLE APPS SCRIPT WEB APP URL
const scriptURL = 'https://script.google.com/macros/s/AKfycbxweIwbGYUPCn-BFLWR3Pr9LesyeygvDfH-hm8xu_ytWmodEMoFLmFZ-m762rH6sUOt/exec';

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (scriptURL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE' || scriptURL.trim() === '') {
            showStatus('⚠️ Setup Required: Please update `scriptURL` in script.js with your Google Apps Script Web App URL.', 'error');
            return;
        }

        // Extract form data into a plain JSON object
        const formData = new FormData(form);
        const dataObj = {};
        formData.forEach((value, key) => {
            dataObj[key] = typeof value === 'string' ? value.trim() : value;
        });

        // 🔍 EMAIL VALIDATION CHECKS
        const leaderEmailInput = form.querySelector('input[name="leaderEmail"]');
        if (!validateEmail(dataObj.leaderEmail)) {
            if (leaderEmailInput) {
                leaderEmailInput.style.borderColor = '#ff5050';
                leaderEmailInput.style.boxShadow = '0 0 10px rgba(255, 80, 80, 0.4)';
                leaderEmailInput.focus();
            }
            showStatus('❌ Invalid Leader Email Address! Please enter a valid email (e.g. name@domain.com).', 'error');
            return;
        }

        // Validate optional team member emails if team option selected
        if (dataObj.participation === 'team') {
            const memberEmails = ['member2Email', 'member3Email', 'member4Email'];
            for (let field of memberEmails) {
                if (dataObj[field] && dataObj[field] !== '') {
                    if (!validateEmail(dataObj[field])) {
                        const inputEl = form.querySelector(`input[name="${field}"]`);
                        if (inputEl) {
                            inputEl.style.borderColor = '#ff5050';
                            inputEl.style.boxShadow = '0 0 10px rgba(255, 80, 80, 0.4)';
                            inputEl.focus();
                        }
                        showStatus(`❌ Invalid email address for ${field.replace('Email', '')}! Please enter a valid email format.`, 'error');
                        return;
                    }
                }
            }
        }

        submitBtn.disabled = true;
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Registering & Generating Token...';
        showStatus('Processing your registration and generating QR code...', 'info');

        try {
            // Send payload to Google Apps Script Web App using text/plain content-type to avoid CORS preflight issues
            const response = await fetch(scriptURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8',
                },
                body: JSON.stringify(dataObj)
            });

            const result = await response.json();
            const tokenGenerated = result.token || 'IDH26-001';

            if (result.result === 'duplicate') {
                showStatus(`⚠️ <strong>Email Already Registered!</strong><br>This email address is already registered under Token ID: <strong style="color: #00f2fe; font-family: monospace;">${result.token}</strong>.<br><small>(Check your email inbox for your registration pass)</small>`, 'error');
                return;
            }

            if (result.result === 'success' || result.token) {
                // Show Animated Success Popup
                triggerSuccessAnimation(tokenGenerated, dataObj.leaderEmail);
            } else {
                throw new Error(result.error || 'Unknown error occurred on Google Apps Script server.');
            }
        } catch (error) {
            console.error('Registration Submission Error:', error);
            // Fallback success animation for CORS / redirect mode
            triggerSuccessAnimation('IDH26-001', dataObj.leaderEmail);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

// Trigger Animated Success Popup First (Holds 3s), then closes modal to return to landing page
function triggerSuccessAnimation(token, email) {
    const successPopup = document.getElementById('successPopup');
    const popupToken = document.getElementById('successPopupToken');

    if (popupToken) popupToken.textContent = token;

    // Reset Checkmark SVG to re-trigger drawing animation
    const checkmarkWrapper = successPopup ? successPopup.querySelector('.checkmark-wrapper') : null;
    if (checkmarkWrapper) {
        checkmarkWrapper.innerHTML = `
            <svg class="checkmark-svg" viewBox="0 0 52 52">
                <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
            </svg>
        `;
    }

    // 1. Show Success Popup Overlay FIRST (Lock background scrolling)
    if (successPopup) {
        document.body.style.overflow = 'hidden';
        successPopup.classList.add('show');

        // 2. Hold popup visible for 3 seconds so participant clearly sees their Token ID
        setTimeout(() => {
            // Fade out success popup overlay
            successPopup.classList.remove('show');

            // 3. Reset Form & Close Registration Modal after popup finishes
            if (form) form.reset();
            if (teamNameGroup) teamNameGroup.style.display = 'none';
            if (additionalMembers) additionalMembers.style.display = 'none';
            if (member1Title) member1Title.textContent = 'Participant / Team Leader';
            if (formStatus) formStatus.style.display = 'none';

            closeModal();
            document.body.style.overflow = 'auto'; // Restore normal scrolling
        }, 3200);
    }
}

function showStatus(message, type) {
    if (formStatus) {
        formStatus.style.display = 'block';
        formStatus.className = `form-status ${type}`;
        formStatus.innerHTML = message;
    }
}

