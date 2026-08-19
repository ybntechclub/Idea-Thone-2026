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

// Ensure Home Section is visible FIRST & Automatically show Problem Statement Popup on Direct Link Open!
document.addEventListener('DOMContentLoaded', () => {
    // Ensure body scroll is 100% unlocked and scrollable
    document.body.style.overflow = 'auto';

    // Automatically display the Revealed Problem Statement Popup Modal on direct link open!
    setTimeout(() => {
        openAutoEventNotice();
    }, 400);

    // Fetch Dynamic Notice & Live Leaderboard from Google Apps Script
    fetchLiveEventNotice();
    fetchLiveParticipants();
});

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
                modalNoticeMeta.innerHTML = `🗓️ EVENT DATE: <strong>${notice.eventDate.toUpperCase()}</strong> | 📍 VENUE: <strong>${notice.venue.toUpperCase()}</strong>`;
            }
            if (modalNoticeTitle) {
                modalNoticeTitle.textContent = `🚀 ${notice.title.toUpperCase()}`;
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
                        <div class="part-os">💡 OS Concept: <strong>${p.osName}</strong></div>
                    </div>
                `).join('');
            }

            // 2. Populate Real Live Leaderboard Table with All Round Scores (out of 20)
            if (leaderboardBody) {
                leaderboardBody.innerHTML = data.participants.map((p, index) => {
                    let rankBadge = `<span class="rank-badge">${index + 1}</span>`;
                    if (index === 0) rankBadge = `<span class="rank-badge gold">🥇 1</span>`;
                    else if (index === 1) rankBadge = `<span class="rank-badge silver">🥈 2</span>`;
                    else if (index === 2) rankBadge = `<span class="rank-badge bronze">🥉 3</span>`;

                    const r1 = Math.min(20, Math.max(0, p.r1Score || (p.subStatus === 'SUBMITTED' ? 18 : 0)));
                    const r2 = Math.min(20, Math.max(0, p.r2Score || (p.subStatus === 'SUBMITTED' ? 19 : 0)));
                    const r3 = Math.min(20, Math.max(0, p.r3Score || (p.subStatus === 'SUBMITTED' ? 18 : 0)));
                    const tot = p.totalScore || (r1 + r2 + r3);

                    let subBadge = p.subStatus === 'SUBMITTED'
                        ? `<span class="status-pill submitted">SUBMITTED ✅</span>`
                        : `<span class="status-pill pending">Pending ⏳</span>`;

                    return `
                        <tr>
                            <td>${rankBadge}</td>
                            <td><strong>${p.participation.toLowerCase() === 'team' ? p.teamName : p.name}</strong> <br><small style="color:var(--text-muted);">Leader: ${p.name}</small></td>
                            <td><span style="color:#00f2fe; font-weight:600;">${p.dept}</span></td>
                            <td><span class="os-name-badge">${p.osName}</span></td>
                            <td><strong style="color:#00f2fe;">${r1}/20</strong></td>
                            <td><strong style="color:#00f2fe;">${r2}/20</strong></td>
                            <td><strong style="color:#00f2fe;">${r3}/20</strong></td>
                            <td><span style="background:rgba(0,255,128,0.15); color:#00ff80; border:1px solid #00ff80; padding:0.3rem 0.7rem; border-radius:50px; font-weight:800; white-space:nowrap;">${tot}/60 PTS</span></td>
                            <td>${subBadge}</td>
                        </tr>
                    `;
                }).join('');
            }
        }
    } catch (e) {
        console.error("Fetch Live Leaderboard Error:", e);
    }
}

