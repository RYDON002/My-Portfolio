
const hamburgers = Array.from(document.querySelectorAll('.hamburger'));
let mobileMenu = document.getElementById('mobileMenu');
let mobileClose = document.getElementById('mobileClose');

const hireBtns = document.querySelectorAll('#hireBtn, #headerHireBtn');
const hireModal = document.getElementById('hireModal');
const modalClose = document.getElementById('modalClose');
const modalWhatsApp = document.getElementById('modalWhatsApp');
const typingText = document.querySelector('.typing-text');

function createMobileMenuIfNeeded() {
    if (mobileMenu) return mobileMenu;
    const mainNav = document.querySelector('.main-nav');

    const aside = document.createElement('aside');
    aside.className = 'mobile-menu';
    aside.id = 'mobileMenu';
    aside.setAttribute('aria-hidden', 'true');

    const inner = document.createElement('div');
    inner.className = 'mobile-menu-inner';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'mobile-close';
    closeBtn.id = 'mobileClose';
    closeBtn.setAttribute('aria-label', 'Close menu');
    closeBtn.textContent = '✕';

    inner.appendChild(closeBtn);

    const ul = document.createElement('ul');
    ul.className = 'mobile-nav-list';

    if (mainNav) {
        const source = mainNav.querySelectorAll('.nav-list li a');
        source.forEach(a => {
            const li = document.createElement('li');
            const a2 = a.cloneNode(true);
            a2.classList.add('mobile-link');
            li.appendChild(a2);
            ul.appendChild(li);
        });
    } else {
        const li = document.createElement('li');
        li.innerHTML = '<a href="portfolio.html" class="mobile-link">Home</a>';
        ul.appendChild(li);
    }

    inner.appendChild(ul);
    aside.appendChild(inner);
    document.body.appendChild(aside);

    mobileMenu = aside;
    mobileClose = closeBtn;

    mobileClose.addEventListener('click', closeMobileMenu);
    mobileMenu.querySelectorAll('.mobile-link').forEach(link => link.addEventListener('click', closeMobileMenu));

    // ensure active link is highlighted inside the generated mobile menu
    markActiveNav();

    return mobileMenu;
}

// mark the nav link that matches the current pathname (works for desktop and mobile)

function markActiveNav() {
    const current = window.location.pathname.split('/').pop().toLowerCase() || 'portfolio.html';
    // desktop links
    document.querySelectorAll('.nav-list a').forEach(a => {
        a.classList.toggle('active', (a.getAttribute('href') || '').toLowerCase().endsWith(current));
    });
    // mobile links (if menu exists)
    document.querySelectorAll('.mobile-nav-list a').forEach(a => {
        a.classList.toggle('active', (a.getAttribute('href') || '').toLowerCase().endsWith(current));
    });
}

// set active nav state on initial load (script is deferred so DOM is ready)
markActiveNav();


function openMobileMenu() {
    createMobileMenuIfNeeded();
    if (!mobileMenu) return;
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    hamburgers.forEach(h => h.setAttribute('aria-expanded', 'true'));
}

function closeMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    hamburgers.forEach(h => h.setAttribute('aria-expanded', 'false'));
}

hamburgers.forEach(h => h.addEventListener('click', openMobileMenu));

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        closeMobileMenu();
        if (hireModal && hireModal.classList.contains('active')) {
            hireModal.classList.remove('active');
            hireModal.setAttribute('aria-hidden', 'true');
        }
    }
});

if (hireBtns && hireBtns.length && hireModal) {
    hireBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            hireModal.classList.add('active');
            hireModal.setAttribute('aria-hidden', 'false');
        });
    });
}

if (modalClose && hireModal) {
    modalClose.addEventListener('click', () => {
        hireModal.classList.remove('active');
        hireModal.setAttribute('aria-hidden', 'true');
    });

    hireModal.addEventListener('click', e => {
        if (e.target === hireModal) {
            hireModal.classList.remove('active');
            hireModal.setAttribute('aria-hidden', 'true');
        }
    });
}

if (modalWhatsApp) {
    const phoneNumber = '2348162993717';
    const preMessage = encodeURIComponent('Hello Rydon! I am .......');
    modalWhatsApp.href = `https://wa.me/${phoneNumber}?text=${preMessage}`;
}

if (typingText) {
    const roles = ['PROGRAMMER', 'FULLSTACK DEVELOPER', 'UI DESIGNER'];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        const current = roles[roleIndex];
        const visible = current.substring(0, charIndex);
        typingText.textContent = visible;

        if (!isDeleting && charIndex < current.length) {
            charIndex++;
            setTimeout(typeEffect, 120);
        } else if (isDeleting && charIndex > 0) {
            charIndex--;
            setTimeout(typeEffect, 100);
        } else if (!isDeleting && charIndex === current.length) {
            isDeleting = true;
            setTimeout(typeEffect, 1500);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            setTimeout(typeEffect, 500);
        }
    }

    typeEffect();
}

const contactForm = document.getElementById('contactForm');
const contactFeedback = document.getElementById('contactFeedback');

let emailjsReady = false;
let emailjsServiceId = null;
let emailjsTemplateId = null;
let emailjsUserId = null;
   
if (contactForm) {
    emailjsServiceId = contactForm.dataset.emailjsService;
    emailjsTemplateId = contactForm.dataset.emailjsTemplate;
    emailjsUserId = contactForm.dataset.emailjsUser;
    if (window.emailjs && emailjsUserId) {
        try {
            emailjs.init(emailjsUserId);
            emailjsReady = true;
        } catch (e) {
            console.warn('EmailJS init failed', e);
            emailjsReady = false;
        }
    }

    async function sendViaApi(serviceId, templateId, userId, templateParams) {
        const url = 'https://api.emailjs.com/api/v1.0/email/send';
        const payload = {
            service_id: serviceId,
            template_id: templateId,
            user_id: userId,
            template_params: templateParams
        };

        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const text = await res.text();
        if (!res.ok) {
            throw { status: res.status, text };
        }
        return text;
    }

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        contactFeedback.textContent = '';
        const form = e.currentTarget;
        const data = new FormData(form);
        const payload = {
            name: (data.get('name') || '').trim(),
            email: (data.get('email') || '').trim(),
            message: (data.get('message') || '').trim()
        };

        if (!payload.name || !payload.email || !payload.message) {
            contactFeedback.textContent = 'Please complete all fields.';
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const origText = submitBtn ? submitBtn.textContent : null;
        if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }

        try {
            if (!emailjsServiceId || !emailjsTemplateId || !emailjsUserId) {
                contactFeedback.textContent = 'EmailJS configuration missing (service/template/user ID). Check Contact.html.';
                return;
            }

            const templateParams = {
                from_name: payload.name,
                from_email: payload.email,
                    message: payload.message,
                    name: payload.name,
                    email: payload.email,
                    user_name: payload.name,
                    user_email: payload.email,
                    message_html: payload.message,
                    reply_to: payload.email
            };

            try {
                const apiRespText = await sendViaApi(emailjsServiceId, emailjsTemplateId, emailjsUserId, templateParams);
                console.log('EmailJS REST send response:', apiRespText);
                contactFeedback.textContent = 'Message sent — thank you!';
                form.reset();
                return;
            } catch (apiErr) {
                console.warn('EmailJS REST send failed, will try SDK fallback if available', apiErr);

                if (window.emailjs && !emailjsReady && emailjsUserId) {
                    try { emailjs.init(emailjsUserId); emailjsReady = true; } catch (ie) { console.warn('EmailJS init failed', ie); }
                }

                if (window.emailjs && emailjsReady) {
                    try {
                        const resp = await emailjs.send(emailjsServiceId, emailjsTemplateId, templateParams);
                        if (resp && (resp.status === 200 || resp.text || resp.status === 'OK')) {
                            contactFeedback.textContent = 'Message sent — thank you!';
                            form.reset();
                            return;
                        }
                    } catch (sdkErr) {
                        console.error('EmailJS SDK send error', sdkErr);
                        let sdkText = '';
                        try {
                            if (typeof Response !== 'undefined' && sdkErr instanceof Response) sdkText = await sdkErr.text();
                            else if (sdkErr && typeof sdkErr.text === 'string') sdkText = sdkErr.text;
                            else if (sdkErr && typeof sdkErr.message === 'string') sdkText = sdkErr.message;
                            else sdkText = String(sdkErr);
                        } catch (r) { sdkText = String(sdkErr); }

                        if (sdkText && String(sdkText).toLowerCase().includes('public key')) contactFeedback.textContent = 'EmailJS Public Key is invalid. Check the User ID in Contact.html.';
                        else if (sdkText && String(sdkText).toLowerCase().includes('service id not found')) contactFeedback.textContent = 'EmailJS Service ID not found. Check the Service ID in Contact.html.';
                        else contactFeedback.textContent = sdkText ? `EmailJS error: ${sdkText}` : 'Failed to send message via EmailJS.';
                        return;
                    }
                }

                if (apiErr && apiErr.status && apiErr.text) {
                    if (String(apiErr.text).toLowerCase().includes('public key')) contactFeedback.textContent = 'EmailJS Public Key is invalid. Check the User ID in Contact.html.';
                    else if (String(apiErr.text).toLowerCase().includes('service id not found')) contactFeedback.textContent = 'EmailJS Service ID not found. Check the Service ID in Contact.html.';
                    else contactFeedback.textContent = `EmailJS error: ${apiErr.text}`;
                } else {
                    contactFeedback.textContent = 'Failed to send message via EmailJS (network or CORS issue).';
                }
            }
        } catch (err) {
            console.error('Contact send error', err);
            contactFeedback.textContent = err && err.message ? `Error: ${err.message}` : 'Network error. Could not send message.';
        } finally {
            if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = origText; }
        }
    });
}


