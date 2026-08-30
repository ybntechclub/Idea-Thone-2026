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

// Scroll Reveal - now handled by GSAP ScrollTrigger (see bottom of file)



// WOW Features - Cursor Ambient Glow Tracking (during movement & dragging)
const cursorGlow = document.querySelector('.cursor-glow');
const interactables = document.querySelectorAll('a, button, .btn, .glass');

if (cursorGlow) {
    const updateGlowPos = (x, y) => {
        cursorGlow.animate({
            left: `${x}px`,
            top: `${y}px`
        }, { duration: 400, fill: "forwards" });
    };

    window.addEventListener('mousemove', (e) => {
        updateGlowPos(e.clientX, e.clientY);
    });

    window.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches.length > 0) {
            updateGlowPos(e.touches[0].clientX, e.touches[0].clientY);
        }
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

// Initialize 3D Tilt Effect on Landing Page Feature Cards (Excluding Modals & Forms)
if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll(".card.glass, .team-card.glass, .stat-bento-card.glass, .req-card.glass, .timeline-item.glass"), {
        max: 5,
        speed: 400,
        glare: true,
        "max-glare": 0.15,
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
            if (typeof lenis !== 'undefined') lenis.stop();
            if (cursorDot && cursorGlow) {
                cursorDot.style.display = 'none';
                cursorGlow.style.display = 'none';
            }
            document.body.style.cursor = 'auto';

            // Ensure inner modal content is scrolled to top on open
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) modalContent.scrollTop = 0;
        }
    });
});

// Close Modal
const closeModal = () => {
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
        if (typeof lenis !== 'undefined') lenis.start();
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
            if (member1Title) member1Title.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="form-title-svg"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>Team Leader Details`;
        } else {
            if (teamNameGroup) teamNameGroup.style.display = 'none';
            if (additionalMembers) additionalMembers.style.display = 'none';
            if (member1Title) member1Title.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="form-title-svg"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>Primary Contact Details`;
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

// Helper function for strict 10-digit phone validation (Indian Mobile Numbers)
function validatePhone(phone) {
    if (!phone) return false;
    const clean = String(phone).replace(/\D/g, '');
    return /^[6-9]\d{9}$/.test(clean);
}

// Clear red border/error highlights and enforce 10-digit numeric constraint on typing
document.querySelectorAll('input[type="email"]').forEach(input => {
    input.addEventListener('input', () => {
        input.style.borderColor = '';
        input.style.boxShadow = '';
    });
});

document.querySelectorAll('input[type="tel"], input[name*="Contact"]').forEach(input => {
    input.addEventListener('input', () => {
        // Strictly force digits only and max 10 digits
        input.value = input.value.replace(/\D/g, '').slice(0, 10);
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

        // 🔍 LEADER PHONE VALIDATION (10 DIGITS)
        const leaderContactInput = form.querySelector('input[name="leaderContact"]');
        if (!validatePhone(dataObj.leaderContact)) {
            if (leaderContactInput) {
                leaderContactInput.style.borderColor = '#ff5050';
                leaderContactInput.style.boxShadow = '0 0 10px rgba(255, 80, 80, 0.4)';
                leaderContactInput.focus();
            }
            showStatus('❌ Invalid Leader Mobile Number! Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.', 'error');
            return;
        }

        // 🔍 LEADER EMAIL VALIDATION
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

        // Validate team member inputs if team option selected
        if (dataObj.participation === 'team') {
            // 👥 TEAM NAME VALIDATION
            const teamNameInput = form.querySelector('input[name="teamName"]');
            if (!dataObj.teamName || dataObj.teamName.trim() === '') {
                if (teamNameInput) {
                    teamNameInput.style.borderColor = '#ff5050';
                    teamNameInput.style.boxShadow = '0 0 10px rgba(255, 80, 80, 0.4)';
                    teamNameInput.focus();
                }
                showStatus('⚠️ <strong>Team Validation Error:</strong> Please enter your Team Name.', 'error');
                return;
            }

            // 👥 MANDATORY 2-MEMBER TEAM VALIDATION
            const m2Name = dataObj.member2Name ? dataObj.member2Name.trim() : '';
            const m2Contact = dataObj.member2Contact ? dataObj.member2Contact.trim() : '';
            const m2Email = dataObj.member2Email ? dataObj.member2Email.trim() : '';
            const m2Dept = dataObj.member2Dept ? dataObj.member2Dept.trim() : '';

            if (!m2Name || !m2Contact || !m2Email || !m2Dept) {
                const m2Input = form.querySelector('input[name="member2Name"]');
                if (m2Input) {
                    m2Input.style.borderColor = '#ff5050';
                    m2Input.style.boxShadow = '0 0 10px rgba(255, 80, 80, 0.4)';
                    m2Input.focus();
                }
                showStatus('⚠️ <strong>Team Validation Error:</strong> A Team registration requires at least 2 members! Please enter complete details (Name, 10-digit Phone, Email, Dept) for Team Member 2.', 'error');
                return;
            }

            // Member 2 Phone & Email checks
            if (!validatePhone(m2Contact)) {
                const m2ContactInput = form.querySelector('input[name="member2Contact"]');
                if (m2ContactInput) {
                    m2ContactInput.style.borderColor = '#ff5050';
                    m2ContactInput.style.boxShadow = '0 0 10px rgba(255, 80, 80, 0.4)';
                    m2ContactInput.focus();
                }
                showStatus('❌ Invalid Member 2 Mobile Number! Please enter a valid 10-digit mobile number.', 'error');
                return;
            }

            if (!validateEmail(m2Email)) {
                const m2EmailInput = form.querySelector('input[name="member2Email"]');
                if (m2EmailInput) {
                    m2EmailInput.style.borderColor = '#ff5050';
                    m2EmailInput.style.boxShadow = '0 0 10px rgba(255, 80, 80, 0.4)';
                    m2EmailInput.focus();
                }
                showStatus('❌ Invalid Member 2 Email Address! Please enter a valid email.', 'error');
                return;
            }

            // Optional Member 3 & Member 4 Phone & Email checks
            const optionalMembers = [
                { name: 'member3Name', contact: 'member3Contact', email: 'member3Email', label: 'Member 3' },
                { name: 'member4Name', contact: 'member4Contact', email: 'member4Email', label: 'Member 4' }
            ];

            for (let member of optionalMembers) {
                if (dataObj[member.contact] && dataObj[member.contact].trim() !== '') {
                    if (!validatePhone(dataObj[member.contact])) {
                        const inputEl = form.querySelector(`input[name="${member.contact}"]`);
                        if (inputEl) {
                            inputEl.style.borderColor = '#ff5050';
                            inputEl.style.boxShadow = '0 0 10px rgba(255, 80, 80, 0.4)';
                            inputEl.focus();
                        }
                        showStatus(`❌ Invalid mobile number for ${member.label}! Please enter a valid 10-digit mobile number.`, 'error');
                        return;
                    }
                }

                if (dataObj[member.email] && dataObj[member.email].trim() !== '') {
                    if (!validateEmail(dataObj[member.email])) {
                        const inputEl = form.querySelector(`input[name="${member.email}"]`);
                        if (inputEl) {
                            inputEl.style.borderColor = '#ff5050';
                            inputEl.style.boxShadow = '0 0 10px rgba(255, 80, 80, 0.4)';
                            inputEl.focus();
                        }
                        showStatus(`❌ Invalid email address for ${member.label}! Please enter a valid email format.`, 'error');
                        return;
                    }
                }
            }
        }

        submitBtn.disabled = true;
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Registering & Generating Token...';
        showStatus('Processing your registration and saving to database...', 'info');

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

            if (result.result === 'duplicate') {
                showStatus(`⚠️ <strong>Email Already Registered!</strong><br>This email address is already registered under Token ID: <strong style="color: #00f2fe; font-family: monospace;">${result.token}</strong>.<br><small>(Check your email inbox for your registration pass)</small>`, 'error');
                return;
            }

            if (result.result === 'success' && result.token) {
                // 1. Show Animated Success Popup with the REAL token generated by the database
                triggerSuccessAnimation(result.token, dataObj.leaderEmail);
                // 2. Immediately re-fetch live leaderboard and participants directory
                fetchLiveParticipants();
            } else {
                const errorMsg = result.error || result.message || 'Unknown error occurred on Google Apps Script server.';
                showStatus(`❌ <strong>Registration Failed:</strong> ${errorMsg}`, 'error');
            }
        } catch (error) {
            console.error('Registration Submission Error:', error);
            showStatus(`❌ <strong>Connection Error:</strong> Could not connect to registration server. Please check your internet connection and try again. (${error.message || 'Network Error'})`, 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

let successPopupTimeout = null;
let successPopupInterval = null;

function closeRegistrationSuccessPopup() {
    const successPopup = document.getElementById('successPopup');
    if (!successPopup || !successPopup.classList.contains('show')) return;

    if (successPopupTimeout) {
        clearTimeout(successPopupTimeout);
        successPopupTimeout = null;
    }
    if (successPopupInterval) {
        clearInterval(successPopupInterval);
        successPopupInterval = null;
    }

    successPopup.classList.remove('show');

    // Reset Form & Close Registration Modal after popup finishes
    if (form) form.reset();
    if (teamNameGroup) teamNameGroup.style.display = 'none';
    if (additionalMembers) additionalMembers.style.display = 'none';
    if (member1Title) member1Title.textContent = 'Participant / Team Leader';
    if (formStatus) formStatus.style.display = 'none';

    closeModal();
    document.body.style.overflow = 'auto'; // Restore normal scrolling
    if (typeof lenis !== 'undefined') lenis.start();
}

// Trigger Animated Success Popup with 15s Timer & Manual Done Button
function triggerSuccessAnimation(token, email) {
    const successPopup = document.getElementById('successPopup');
    const popupToken = document.getElementById('successPopupToken');
    const countdownSecsEl = document.getElementById('popupCountdownSecs');

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

        // 2. Start 15s visual countdown so participant has ample time to copy token
        let remainingSecs = 15;
        if (countdownSecsEl) countdownSecsEl.textContent = remainingSecs;

        if (successPopupInterval) clearInterval(successPopupInterval);
        successPopupInterval = setInterval(() => {
            remainingSecs--;
            if (countdownSecsEl) countdownSecsEl.textContent = remainingSecs;
            if (remainingSecs <= 0) {
                clearInterval(successPopupInterval);
            }
        }, 1000);

        // 3. Hold popup visible for 15 seconds (or until user clicks Done / Close / Backdrop)
        if (successPopupTimeout) clearTimeout(successPopupTimeout);
        successPopupTimeout = setTimeout(() => {
            closeRegistrationSuccessPopup();
        }, 15000);
    }
}

function showStatus(message, type) {
    if (formStatus) {
        formStatus.style.display = 'block';
        formStatus.className = `form-status ${type}`;
        formStatus.innerHTML = message;
    }
}

// 🚨 AUTO EVENT START NOTICE POPUP MODAL (29 AUGUST 2026)
const autoEventModal = document.getElementById('autoEventModal');
const closeAutoModalBtn = document.getElementById('closeAutoModalBtn');
const exploreEventBtn = document.getElementById('exploreEventBtn');
const revealProblemBtn = document.getElementById('revealProblemBtn');

function openAutoEventNotice() {
    if (autoEventModal) {
        autoEventModal.classList.add('show');
        document.body.style.overflow = 'hidden';
        if (typeof lenis !== 'undefined') lenis.stop();
        // Scroll modal content to top on open
        const modalContent = autoEventModal.querySelector('.modal-content, .auto-modal-card');
        if (modalContent) modalContent.scrollTop = 0;
    }
}

function closeAutoEventNotice() {
    if (autoEventModal) {
        autoEventModal.classList.remove('show');
        document.body.style.overflow = 'auto';
        if (typeof lenis !== 'undefined') lenis.start();
    }
}

// DOMContentLoaded: Start Preloader, Timers, Interactive Features & Fetch Live Data
document.addEventListener('DOMContentLoaded', () => {
    // Start the preloader animation sequence (only on fresh reload/session)
    startPreloader();

    // ⏱️ Initialize Live Hero Countdown Timer
    initCountdownTimer();

    // 💡 Initialize Interactive Concept Inspiration Tags
    initInteractiveTags();

    // 📋 Initialize One-Click Copy Token ID Handler
    initCopyTokenHandler();

    // Fetch Dynamic Notice & Live Leaderboard from Google Apps Script
    fetchLiveEventNotice();
    fetchLiveParticipants();
});

// ⏱️ Real-Time Countdown Timer to 31 August 2026 (11:59 PM IST)
function initCountdownTimer() {
    const daysEl = document.getElementById('cdDays');
    const hoursEl = document.getElementById('cdHours');
    const minsEl = document.getElementById('cdMins');
    const secsEl = document.getElementById('cdSecs');

    const daysMobEl = document.getElementById('cdDaysMob');
    const hoursMobEl = document.getElementById('cdHoursMob');
    const minsMobEl = document.getElementById('cdMinsMob');

    if (!daysEl && !daysMobEl) return;

    // Target Date: August 31, 2026 23:59:59 IST (+05:30)
    const targetDate = new Date('2026-08-31T23:59:59+05:30').getTime();

    function updateTimer() {
        const now = new Date().getTime();
        const diff = targetDate - now;

        if (diff <= 0) {
            if (daysEl) daysEl.textContent = '00';
            if (hoursEl) hoursEl.textContent = '00';
            if (minsEl) minsEl.textContent = '00';
            if (secsEl) secsEl.textContent = '00';

            if (daysMobEl) daysMobEl.textContent = '00';
            if (hoursMobEl) hoursMobEl.textContent = '00';
            if (minsMobEl) minsMobEl.textContent = '00';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minsEl) minsEl.textContent = String(minutes).padStart(2, '0');
        if (secsEl) secsEl.textContent = String(seconds).padStart(2, '0');

        if (daysMobEl) daysMobEl.textContent = String(days).padStart(2, '0');
        if (hoursMobEl) hoursMobEl.textContent = String(hours).padStart(2, '0');
        if (minsMobEl) minsMobEl.textContent = String(minutes).padStart(2, '0');
    }

    updateTimer();
    setInterval(updateTimer, 1000);
}

// 💡 Interactive Concept Tags & Inspiration Prompt Sparks
function initInteractiveTags() {
    const tagsContainer = document.getElementById('interactiveTagsCloud');
    const sparkBadge = document.getElementById('sparkCategoryBadge');
    const sparkPrompt = document.getElementById('sparkPromptText');

    if (!tagsContainer || !sparkBadge || !sparkPrompt) return;

    const tagButtons = tagsContainer.querySelectorAll('.tag');

    tagButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tagButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-category') || btn.textContent.trim();
            const promptText = btn.getAttribute('data-prompt') || '';

            // Fade transition for smooth spark display
            sparkPrompt.style.opacity = '0';
            setTimeout(() => {
                sparkBadge.textContent = category.toUpperCase();
                sparkPrompt.textContent = `"${promptText}"`;
                sparkPrompt.style.opacity = '1';
            }, 150);
        });
    });
}

// 📋 One-Click Copy Token ID Handler
function initCopyTokenHandler() {
    const copyBtn = document.getElementById('copyTokenBtn');
    const tokenBadge = document.getElementById('successPopupToken');
    const copyBtnLabel = document.getElementById('copyBtnLabel');

    if (!copyBtn || !tokenBadge) return;

    copyBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const tokenText = tokenBadge.textContent.trim();
        if (!tokenText) return;

        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(tokenText);
            } else {
                // Fallback for older browsers
                const tempInput = document.createElement('textarea');
                tempInput.value = tokenText;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);
            }

            copyBtn.classList.add('copied');
            if (copyBtnLabel) copyBtnLabel.textContent = 'Copied!';

            setTimeout(() => {
                copyBtn.classList.remove('copied');
                if (copyBtnLabel) copyBtnLabel.textContent = 'Copy';
            }, 2500);
        } catch (err) {
            console.error('Failed to copy token:', err);
        }
    });

    const closeSuccessBtn = document.getElementById('closeSuccessPopupBtn');
    const doneSuccessBtn = document.getElementById('doneSuccessPopupBtn');
    const successPopup = document.getElementById('successPopup');

    if (closeSuccessBtn) {
        closeSuccessBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeRegistrationSuccessPopup();
        });
    }

    if (doneSuccessBtn) {
        doneSuccessBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeRegistrationSuccessPopup();
        });
    }

    if (successPopup) {
        successPopup.addEventListener('click', (e) => {
            if (e.target === successPopup) {
                closeRegistrationSuccessPopup();
            }
        });
    }
}

async function fetchLiveEventNotice() {
    try {
        const res = await fetch(`${scriptURL}?action=getNotice`);
        const data = await res.json();

        if (data.status === 'success' && data.notice) {
            const notice = data.notice;

            // 1. Safely update dynamic Event Date & Venue text without breaking HUD markup or icons
            const liveNoticeEventDate = document.getElementById('liveNoticeEventDate');
            const liveNoticeVenue = document.getElementById('liveNoticeVenue');

            if (liveNoticeEventDate && notice.eventDate) {
                liveNoticeEventDate.textContent = notice.eventDate.toUpperCase();
            }
            if (liveNoticeVenue && notice.venue) {
                liveNoticeVenue.textContent = notice.venue.toUpperCase();
            }

            // 2. Update Modal Notice Meta & On-Page Quotes
            const modalNoticeMeta = document.getElementById('modalNoticeMeta');
            const modalPromptQuotes = document.querySelectorAll('.prompt-quote');

            if (modalNoticeMeta && notice.eventDate && notice.venue) {
                modalNoticeMeta.innerHTML = `EVENT DATE: <strong>${notice.eventDate.toUpperCase()}</strong> | VENUE: <strong>${notice.venue.toUpperCase()}</strong>`;
            }
            if (notice.promptQuestion) {
                modalPromptQuotes.forEach(el => {
                    el.textContent = `"${notice.promptQuestion}"`;
                });
            }
        }
    } catch (e) {
        console.log("Live notice fetch fallback active:", e);
    }
}

if (autoEventModal) {
    autoEventModal.addEventListener('click', (e) => {
        if (e.target === autoEventModal) {
            closeAutoEventNotice();
        }
    });
}

if (closeAutoModalBtn) closeAutoModalBtn.addEventListener('click', closeAutoEventNotice);

if (exploreEventBtn) {
    exploreEventBtn.addEventListener('click', () => {
        closeAutoEventNotice();
        const noticeSec = document.getElementById('notice');
        if (noticeSec) noticeSec.scrollIntoView({ behavior: 'smooth' });
    });
}

if (revealProblemBtn) {
    revealProblemBtn.addEventListener('click', openAutoEventNotice);
}

const navNoticeLink = document.querySelector('.nav-notice-link');
if (navNoticeLink) {
    navNoticeLink.addEventListener('click', (e) => {
        openAutoEventNotice();
    });
}

// 🏆 Leaderboard & Participants 2-Tab Switcher
const tabLeaderboardBtn = document.getElementById('tabLeaderboardBtn');
const tabParticipantsBtn = document.getElementById('tabParticipantsBtn');
const tabLeaderboardContent = document.getElementById('tabLeaderboardContent');
const tabParticipantsContent = document.getElementById('tabParticipantsContent');

if (tabLeaderboardBtn && tabParticipantsBtn) {
    tabLeaderboardBtn.addEventListener('click', () => {
        tabLeaderboardBtn.classList.add('active');
        tabParticipantsBtn.classList.remove('active');
        tabLeaderboardContent.classList.add('active');
        tabParticipantsContent.classList.remove('active');
        fetchLiveParticipants();
    });

    tabParticipantsBtn.addEventListener('click', () => {
        tabParticipantsBtn.classList.add('active');
        tabLeaderboardBtn.classList.remove('active');
        tabParticipantsContent.classList.add('active');
        tabLeaderboardContent.classList.remove('active');
        fetchLiveParticipants();
    });
}

// 🔍 Search & Live Participants Fetch
const participantSearchInput = document.getElementById('participantSearchInput');
const refreshParticipantsBtn = document.getElementById('refreshParticipantsBtn');

if (refreshParticipantsBtn) {
    refreshParticipantsBtn.addEventListener('click', () => {
        fetchLiveParticipants();
    });
}

// ============================================
// 👥 Registered Participants Directory Pagination & Search (6 cards per page)
// ============================================
const PARTICIPANTS_PAGE_SIZE = 6;
let currentParticipantsPage = 1;
let currentSearchQuery = '';

function renderParticipantsGrid(page = 1) {
    const container = document.getElementById('participantsContainer');
    const paginationContainer = document.getElementById('participantsPagination');
    if (!container) return;

    // Filter by active search query
    const filtered = (cachedParticipantsList || []).filter(p => {
        if (!currentSearchQuery) return true;
        const targetText = `${p.name || ''} ${p.teamName || ''} ${p.dept || ''} ${p.osName || ''} ${p.participation || ''}`.toLowerCase();
        return targetText.includes(currentSearchQuery);
    });

    if (filtered.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
                <p style="font-size: 1.1rem; margin-bottom: 0.5rem; color: #fff;">🔍 No matching participants found.</p>
                <small>Try searching with another keyword (e.g. name, team, or department).</small>
            </div>
        `;
        if (paginationContainer) paginationContainer.innerHTML = '';
        return;
    }

    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / PARTICIPANTS_PAGE_SIZE) || 1;

    // Clamp requested page
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    currentParticipantsPage = page;

    const startIdx = (currentParticipantsPage - 1) * PARTICIPANTS_PAGE_SIZE;
    const endIdx = Math.min(startIdx + PARTICIPANTS_PAGE_SIZE, totalItems);
    const currentPageItems = filtered.slice(startIdx, endIdx);

    // Render Cards for Current Page (6 symmetric cards: 2 rows x 3 columns)
    container.innerHTML = currentPageItems.map(p => `
        <div class="participant-card glass">
            <div class="part-header">
                <span class="part-type ${p.participation && p.participation.toLowerCase() === 'team' ? 'team' : 'individual'}">${p.participation || 'INDIVIDUAL'}</span>
                <span style="color:var(--accent-cyan); font-weight:600; font-size:0.85rem;">${p.dept || 'N/A'}</span>
            </div>
            <h4 class="part-name">${p.participation && p.participation.toLowerCase() === 'team' ? p.teamName : p.name}</h4>
            <div class="part-meta">Leader / Member: ${p.name}</div>
            <div class="part-os">OS Concept: <strong>${p.osName || 'To Be Decided'}</strong></div>
        </div>
    `).join('');

    // Render Pagination Controls Bar for Directory
    if (paginationContainer) {
        if (totalPages <= 1) {
            paginationContainer.innerHTML = `
                <div class="pagination-info">Showing <strong>1–${totalItems}</strong> of <strong>${totalItems}</strong> participants</div>
                <div class="pagination-controls">
                    <button type="button" class="page-btn page-nav-btn" disabled>Page 1 of 1</button>
                </div>
            `;
        } else {
            let pageButtonsHTML = '';
            for (let i = 1; i <= totalPages; i++) {
                pageButtonsHTML += `
                    <button type="button" class="page-btn ${i === currentParticipantsPage ? 'active' : ''}" onclick="goToParticipantsPage(${i})">${i}</button>
                `;
            }

            paginationContainer.innerHTML = `
                <div class="pagination-info">
                    Showing <strong>${startIdx + 1}–${endIdx}</strong> of <strong>${totalItems}</strong> registered participants
                </div>
                <div class="pagination-controls">
                    <button type="button" class="page-btn page-nav-btn" ${currentParticipantsPage === 1 ? 'disabled' : ''} onclick="goToParticipantsPage(${currentParticipantsPage - 1})">
                        &larr; Prev
                    </button>
                    ${pageButtonsHTML}
                    <button type="button" class="page-btn page-nav-btn" ${currentParticipantsPage === totalPages ? 'disabled' : ''} onclick="goToParticipantsPage(${currentParticipantsPage + 1})">
                        Next &rarr;
                    </button>
                </div>
            `;
        }
    }
}

// Global page jump handler for participants
window.goToParticipantsPage = function(pageNum) {
    renderParticipantsGrid(pageNum);
};

if (participantSearchInput) {
    participantSearchInput.addEventListener('input', (e) => {
        currentSearchQuery = e.target.value.toLowerCase().trim();
        renderParticipantsGrid(1); // Reset to page 1 on search
    });
}

// ============================================
// 🏆 Leaderboard Pagination & Live Fetch (5 entries per page)
// ============================================
const LEADERBOARD_PAGE_SIZE = 5;
let currentLeaderboardPage = 1;
let cachedParticipantsList = [];

function renderLeaderboardTable(page = 1) {
    const leaderboardBody = document.getElementById('leaderboardBody');
    const paginationContainer = document.getElementById('leaderboardPagination');
    if (!leaderboardBody) return;

    if (!cachedParticipantsList || cachedParticipantsList.length === 0) {
        leaderboardBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 2rem; color: var(--text-muted);">No participant entries registered yet.</td></tr>`;
        if (paginationContainer) paginationContainer.innerHTML = '';
        return;
    }

    const totalItems = cachedParticipantsList.length;
    const totalPages = Math.ceil(totalItems / LEADERBOARD_PAGE_SIZE) || 1;
    
    // Clamp requested page
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    currentLeaderboardPage = page;

    const startIdx = (currentLeaderboardPage - 1) * LEADERBOARD_PAGE_SIZE;
    const endIdx = Math.min(startIdx + LEADERBOARD_PAGE_SIZE, totalItems);
    const currentPageItems = cachedParticipantsList.slice(startIdx, endIdx);

    const sparkleStarSVG = `<svg class="sparkle-star" viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/></svg>`;
    const crownSVG = `<svg class="rank-icon gold-crown" viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M2 19h20v2H2v-2zM2 5l5 3.5L12 2l5 6.5L22 5v12H2V5z"/></svg>`;
    const silverMedalSVG = `<svg class="rank-icon silver-medal" viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M12 2l2.4 4.8 5.3.8-3.8 3.7.9 5.3-4.8-2.5-4.8 2.5.9-5.3-3.8-3.7 5.3-.8z"/></svg>`;
    const bronzeStarSVG = `<svg class="rank-icon bronze-star" viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;

    // Render Table Rows for Current Page (Max 5 items)
    leaderboardBody.innerHTML = currentPageItems.map((p, idx) => {
        const overallIndex = startIdx + idx;
        const rankNum = (overallIndex + 1).toString().padStart(2, '0');
        
        // Single evaluation score (out of 100) from Google Sheet
        const score = Number(p.score !== undefined ? p.score : (p.totalScore !== undefined ? p.totalScore : 0));
        const isScored = score > 0;
        const scoreText = `${score}/100 PTS`;
        
        let rankBadge = `<span class="rank-badge">${rankNum}</span>`;
        let scorePillHTML = `<span class="total-score-pill ${isScored ? 'active-score' : 'zero-score'}">${scoreText}</span>`;

        if (overallIndex === 0) {
            rankBadge = `<span class="rank-badge gold">${crownSVG} <span>${rankNum}</span></span>`;
            if (isScored) {
                scorePillHTML = `<span class="total-score-pill podium-gold-score"><span class="sparkle-wrap s-left">${sparkleStarSVG}</span><span>${scoreText}</span><span class="sparkle-wrap s-right">${sparkleStarSVG}</span></span>`;
            }
        } else if (overallIndex === 1) {
            rankBadge = `<span class="rank-badge silver">${silverMedalSVG} <span>${rankNum}</span></span>`;
            if (isScored) {
                scorePillHTML = `<span class="total-score-pill podium-silver-score"><span class="sparkle-wrap s-left">${sparkleStarSVG}</span><span>${scoreText}</span><span class="sparkle-wrap s-right">${sparkleStarSVG}</span></span>`;
            }
        } else if (overallIndex === 2) {
            rankBadge = `<span class="rank-badge bronze">${bronzeStarSVG} <span>${rankNum}</span></span>`;
            if (isScored) {
                scorePillHTML = `<span class="total-score-pill podium-bronze-score"><span class="sparkle-wrap s-left">${sparkleStarSVG}</span><span>${scoreText}</span><span class="sparkle-wrap s-right">${sparkleStarSVG}</span></span>`;
            }
        }

        let subBadge = p.subStatus === 'SUBMITTED'
            ? `<span class="status-pill submitted">SUBMITTED</span>`
            : `<span class="status-pill pending">PENDING</span>`;

        const displayName = p.participation && p.participation.toLowerCase() === 'team' ? p.teamName : p.name;
        const leaderText = p.participation && p.participation.toLowerCase() === 'team' ? `Leader: ${p.name}` : `Solo Architect`;

        return `
            <tr>
                <td class="col-rank">${rankBadge}</td>
                <td class="col-participant">
                    <div class="participant-name-wrap">
                        <strong class="p-name">${displayName}</strong>
                        <span class="p-leader">${leaderText}</span>
                    </div>
                </td>
                <td class="col-branch"><span class="branch-badge">${p.dept}</span></td>
                <td class="col-score">${scorePillHTML}</td>
                <td class="col-status">${subBadge}</td>
            </tr>
        `;
    }).join('');

    // Render Pagination Controls Bar
    if (paginationContainer) {
        if (totalPages <= 1) {
            paginationContainer.innerHTML = `
                <div class="pagination-info">Showing <strong>1–${totalItems}</strong> of <strong>${totalItems}</strong> entries</div>
                <div class="pagination-controls">
                    <button type="button" class="page-btn page-nav-btn" disabled>Page 1 of 1</button>
                </div>
            `;
        } else {
            let pageButtonsHTML = '';
            for (let i = 1; i <= totalPages; i++) {
                pageButtonsHTML += `
                    <button type="button" class="page-btn ${i === currentLeaderboardPage ? 'active' : ''}" onclick="goToLeaderboardPage(${i})">${i}</button>
                `;
            }

            paginationContainer.innerHTML = `
                <div class="pagination-info">
                    Showing <strong>${startIdx + 1}–${endIdx}</strong> of <strong>${totalItems}</strong> participants
                </div>
                <div class="pagination-controls">
                    <button type="button" class="page-btn page-nav-btn" ${currentLeaderboardPage === 1 ? 'disabled' : ''} onclick="goToLeaderboardPage(${currentLeaderboardPage - 1})">
                        &larr; Prev
                    </button>
                    ${pageButtonsHTML}
                    <button type="button" class="page-btn page-nav-btn" ${currentLeaderboardPage === totalPages ? 'disabled' : ''} onclick="goToLeaderboardPage(${currentLeaderboardPage + 1})">
                        Next &rarr;
                    </button>
                </div>
            `;
        }
    }
}

// Global page jump handler
window.goToLeaderboardPage = function(pageNum) {
    renderLeaderboardTable(pageNum);
};

async function fetchLiveParticipants() {
    const container = document.getElementById('participantsContainer');
    const leaderboardBody = document.getElementById('leaderboardBody');
    if (!container && !leaderboardBody) return;

    try {
        const res = await fetch(`${scriptURL}?action=getLeaderboard`);
        const data = await res.json();

        if (data.result === 'success' && data.participants && data.participants.length > 0) {
            // Sort participants by score descending, then submission status, then token
            cachedParticipantsList = data.participants.slice().sort((a, b) => {
                const sA = Number(a.score !== undefined ? a.score : (a.totalScore !== undefined ? a.totalScore : 0));
                const sB = Number(b.score !== undefined ? b.score : (b.totalScore !== undefined ? b.totalScore : 0));
                if (sB !== sA) return sB - sA;
                if (a.subStatus === 'SUBMITTED' && b.subStatus !== 'SUBMITTED') return -1;
                if (b.subStatus === 'SUBMITTED' && a.subStatus !== 'SUBMITTED') return 1;
                return (a.token || '').localeCompare(b.token || '');
            });

            // 1. Render Paginated Participants Cards Grid (Max 6 per page)
            renderParticipantsGrid(currentParticipantsPage);

            // 2. Render Paginated Leaderboard Table (Max 5 per page)
            renderLeaderboardTable(currentLeaderboardPage);
        }
    } catch (e) {
        console.error("Fetch Live Leaderboard Error:", e);
    }
}

// ============================================
// GSAP & Lenis Smooth Scroll Integration
// ============================================

// Initialize Lenis Smooth Scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
});

function lenisRaf(time) {
    lenis.raf(time);
    requestAnimationFrame(lenisRaf);
}
requestAnimationFrame(lenisRaf);

// Connect Lenis to GSAP ScrollTrigger
if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
}

// ============================================
// Preloader Animation (Fast & Session-Aware)
// ============================================
const preloader = document.getElementById('preloader');
const preloaderCounter = document.querySelector('.preloader-counter');
const preloaderBarFill = document.querySelector('.preloader-bar-fill');
const preloaderStatus = document.querySelector('.preloader-status-text');

// Check if preloader has already run in this session
const hasPreloaded = sessionStorage.getItem('ideathon_preloaded_session');

function startPreloader() {
    if (!preloader || hasPreloaded || typeof gsap === 'undefined') {
        // Instant reveal if already visited in this session
        if (preloader) preloader.style.display = 'none';
        document.body.classList.remove('preloader-active');
        document.querySelectorAll('.hero-container > *, .hero-stats-bento-grid, .stat-bento-card, .reveal, .reveal-stagger').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
        initScrollAnimations();
        return;
    }

    // Mark as preloaded for this browser tab session
    sessionStorage.setItem('ideathon_preloaded_session', 'true');
    document.body.classList.add('preloader-active');

    const counter = { val: 0 };
    const tl = gsap.timeline();

    tl.to(counter, {
        val: 100,
        duration: 2.2,
        ease: "power2.inOut",
        onUpdate: () => {
            const v = Math.floor(counter.val);
            if (preloaderCounter) preloaderCounter.textContent = v + '%';
            if (preloaderBarFill) preloaderBarFill.style.width = v + '%';
            if (preloaderStatus) {
                if (v < 35) preloaderStatus.textContent = 'CONNECTING TO SYSTEM...';
                else if (v < 75) preloaderStatus.textContent = 'LOADING EVENT MODULES...';
                else preloaderStatus.textContent = 'SYSTEM READY • WELCOME';
            }
        }
    })
    .to('.preloader-content', {
        scale: 0.92,
        opacity: 0,
        duration: 0.35,
        ease: "power2.in",
    }, "+=0.15")
    .to(preloader, {
        yPercent: -100,
        duration: 0.7,
        ease: "power4.inOut",
        onComplete: () => {
            preloader.style.display = 'none';
            document.body.classList.remove('preloader-active');
            initHeroAnimations();
            initScrollAnimations();
        }
    }, "-=0.05");
}

// ============================================
// Hero Entrance Animations (Organized & Clean)
// ============================================
function initHeroAnimations() {
    if (typeof gsap === 'undefined') return;

    // Ensure all hero elements are fully visible and active
    document.querySelectorAll('.hero-container > *, .hero-stats-bento-grid, .stat-bento-card').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
    });

    const heroTl = gsap.timeline();

    heroTl
        .from('.hero-eyebrow', { opacity: 0, y: 25, duration: 0.65, ease: "power3.out" })
        .from('.hero-main-title', { opacity: 0, y: 25, duration: 0.75, ease: "power3.out" }, "-=0.4")
        .from('.hero-subtitle', { opacity: 0, y: 25, duration: 0.65, ease: "power3.out" }, "-=0.4")
        .from('.hero-meta-grid', { opacity: 0, y: 25, duration: 0.6, ease: "power3.out" }, "-=0.35")
        .from('.hero-lead-text', { opacity: 0, y: 25, duration: 0.6, ease: "power3.out" }, "-=0.35")
        .from('.hero-action-buttons', { opacity: 0, y: 25, duration: 0.55, ease: "power3.out" }, "-=0.3")
        .from('.hero-stats-bento-grid', { opacity: 0, y: 25, duration: 0.6, ease: "power3.out" }, "-=0.3");
}

// ============================================
// GSAP ScrollTrigger Section Reveals
// ============================================
function initScrollAnimations() {
    // Ensure all elements are 100% visible in the DOM by default
    document.querySelectorAll('.reveal, .req-card').forEach(el => {
        el.style.opacity = '1';
    });

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        return;
    }

    // Refresh ScrollTrigger coordinate calculations
    ScrollTrigger.refresh();

    // Individual section reveals - animate once and stay permanently visible
    gsap.utils.toArray('.reveal').forEach(el => {
        // Skip hero elements (handled by hero timeline)
        if (el.closest('.hero')) return;

        gsap.fromTo(el,
            { opacity: 0, y: 25 },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power2.out",
                clearProps: "transform,opacity",
                scrollTrigger: {
                    trigger: el,
                    start: "top 95%",
                    once: true,
                }
            }
        );
    });
}

// Recalibrate triggers on full window load and resize
window.addEventListener('load', () => {
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
});
window.addEventListener('resize', () => {
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
});

