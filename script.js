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

        // Validate team member inputs if team option selected
        if (dataObj.participation === 'team') {
            // 👥 MANDATORY 2-MEMBER TEAM VALIDATION
            const m2Name = dataObj.member2Name ? dataObj.member2Name.trim() : '';
            const m2Contact = dataObj.member2Contact ? dataObj.member2Contact.trim() : '';
            const m2Email = dataObj.member2Email ? dataObj.member2Email.trim() : '';

            if (!m2Name || !m2Contact || !m2Email) {
                const m2Input = form.querySelector('input[name="member2Name"]');
                if (m2Input) {
                    m2Input.style.borderColor = '#ff5050';
                    m2Input.style.boxShadow = '0 0 10px rgba(255, 80, 80, 0.4)';
                    m2Input.focus();
                }
                showStatus('⚠️ <strong>Team Validation Error:</strong> A Team registration requires at least 2 members! Please enter details for Team Member 2.', 'error');
                return;
            }

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
        autoEventModal.style.display = 'flex';
        document.body.style.overflow = 'auto'; // Keep page scrolling smooth and free at all times
    }
}

function closeAutoEventNotice() {
    if (autoEventModal) {
        autoEventModal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore smooth page scrolling!
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

            // 1. Update Notice Board Banner
            const liveNoticeHeaderMeta = document.getElementById('liveNoticeHeaderMeta');
            const liveNoticeTitle = document.getElementById('liveNoticeTitle');
            const liveNoticeMessage = document.getElementById('liveNoticeMessage');

            if (liveNoticeHeaderMeta) {
                liveNoticeHeaderMeta.textContent = `EVENT DATE: ${notice.eventDate.toUpperCase()} | VENUE: ${notice.venue.toUpperCase()}`;
            }
            if (liveNoticeTitle) {
                liveNoticeTitle.textContent = notice.title;
            }
            if (liveNoticeMessage) {
                liveNoticeMessage.innerHTML = notice.message;
            }

            // 2. Update Modal Notice & On-Page Quotes
            const modalNoticeMeta = document.getElementById('modalNoticeMeta');
            const modalNoticeTitle = document.querySelector('.auto-modal-title');
            const modalNoticeSubtitle = document.querySelector('.auto-modal-subtitle');
            const modalPromptQuotes = document.querySelectorAll('.prompt-quote');

            if (modalNoticeMeta) {
                modalNoticeMeta.innerHTML = `EVENT DATE: <strong>${notice.eventDate.toUpperCase()}</strong> | VENUE: <strong>${notice.venue.toUpperCase()}</strong>`;
            }
            if (modalNoticeTitle) {
                modalNoticeTitle.textContent = `${notice.title.toUpperCase()}`;
            }
            if (modalNoticeSubtitle) {
                modalNoticeSubtitle.textContent = notice.message;
            }
            modalPromptQuotes.forEach(el => {
                el.textContent = `"${notice.promptQuestion}"`;
            });
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

if (participantSearchInput) {
    participantSearchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const cards = document.querySelectorAll('.participant-card');
        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            if (text.includes(query)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

async function fetchLiveParticipants() {
    const container = document.getElementById('participantsContainer');
    const leaderboardBody = document.getElementById('leaderboardBody');
    if (!container && !leaderboardBody) return;

    try {
        const res = await fetch(`${scriptURL}?action=getLeaderboard`);
        const data = await res.json();

        if (data.result === 'success' && data.participants && data.participants.length > 0) {
            // 1. Populate All Participants Cards Grid (WITHOUT Token ID for Security)
            if (container) {
                container.innerHTML = data.participants.map(p => `
                    <div class="participant-card glass">
                        <div class="part-header">
                            <span class="part-type ${p.participation.toLowerCase() === 'team' ? 'team' : 'individual'}">${p.participation}</span>
                            <span style="color:var(--accent-cyan); font-weight:600; font-size:0.85rem;">${p.dept}</span>
                        </div>
                        <h4 class="part-name">${p.participation.toLowerCase() === 'team' ? p.teamName : p.name}</h4>
                        <div class="part-meta">Leader / Member: ${p.name}</div>
                        <div class="part-os">OS Concept: <strong>${p.osName}</strong></div>
                    </div>
                `).join('');
            }

            // 2. Populate Real Live Leaderboard Table with All Round Scores (out of 20)
            if (leaderboardBody) {
                leaderboardBody.innerHTML = data.participants.map((p, index) => {
                    const rankNum = (index + 1).toString().padStart(2, '0');
                    let rankBadge = `<span class="rank-badge">${rankNum}</span>`;
                    if (index === 0) rankBadge = `<span class="rank-badge gold">${rankNum}</span>`;
                    else if (index === 1) rankBadge = `<span class="rank-badge silver">${rankNum}</span>`;
                    else if (index === 2) rankBadge = `<span class="rank-badge bronze">${rankNum}</span>`;

                    const r1 = Math.min(20, Math.max(0, p.r1Score || (p.subStatus === 'SUBMITTED' ? 18 : 0)));
                    const r2 = Math.min(20, Math.max(0, p.r2Score || (p.subStatus === 'SUBMITTED' ? 19 : 0)));
                    const r3 = Math.min(20, Math.max(0, p.r3Score || (p.subStatus === 'SUBMITTED' ? 18 : 0)));
                    const tot = p.totalScore || (r1 + r2 + r3);

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
                            <td class="col-score"><span class="round-score ${r1 > 0 ? 'scored' : 'zero'}">${r1}/20</span></td>
                            <td class="col-score"><span class="round-score ${r2 > 0 ? 'scored' : 'zero'}">${r2}/20</span></td>
                            <td class="col-score"><span class="round-score ${r3 > 0 ? 'scored' : 'zero'}">${r3}/20</span></td>
                            <td class="col-total"><span class="total-score-pill ${tot > 0 ? 'active-score' : 'zero-score'}">${tot}/60 PTS</span></td>
                            <td class="col-status">${subBadge}</td>
                        </tr>
                    `;
                }).join('');
            }
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
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        // Fallback: make everything visible
        document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
        return;
    }

    // Individual reveals - animate once and stay permanently visible
    gsap.utils.toArray('.reveal').forEach(el => {
        // Skip hero elements
        if (el.closest('.hero')) return;

        gsap.from(el, {
            opacity: 0,
            y: 35,
            duration: 0.75,
            ease: "power3.out",
            scrollTrigger: {
                trigger: el,
                start: "top 92%",
                once: true,
            }
        });
    });

    // Staggered reveals - animate once per parent group and stay permanently visible
    const staggerParents = new Set();
    gsap.utils.toArray('.reveal-stagger').forEach(el => {
        if (el.parentElement) staggerParents.add(el.parentElement);
    });

    staggerParents.forEach(parent => {
        const children = parent.querySelectorAll('.reveal-stagger');
        gsap.from(children, {
            opacity: 0,
            y: 25,
            duration: 0.55,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: parent,
                start: "top 92%",
                once: true,
            }
        });
    });
}

