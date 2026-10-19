/**
 * CHETAN KHAIRNAR - PORTFOLIO INTERACTIVITY ENGINE
 * Features:
 * - Particle/Cyber Network Canvas
 * - Interactive CLI Terminal
 * - Live REST API Sandbox (Swagger style)
 * - Schema & Architecture Modal
 * - Skills Filter Engine
 * - Web Audio API Synthetic Feedback
 * - One-click Copy & Form Handling
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. AUDIO SYNTHESIZER (WEB AUDIO API)
    // ==========================================
    let audioEnabled = true;
    let audioCtx = null;

    function initAudio() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    function playBeep(freq = 600, type = 'sine', duration = 0.05) {
        if (!audioEnabled) return;
        try {
            initAudio();
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch (e) {
            // Audio context not allowed without interaction
        }
    }

    const soundToggle = document.getElementById('sound-toggle');
    if (soundToggle) {
        soundToggle.addEventListener('click', () => {
            audioEnabled = !audioEnabled;
            soundToggle.innerHTML = audioEnabled ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-mute"></i>';
            soundToggle.title = audioEnabled ? 'Mute sound effects' : 'Enable sound effects';
            if (audioEnabled) playBeep(880, 'sine', 0.08);
        });
    }

    // ==========================================
    // 2. CYBER CANVAS PARTICLE BACKGROUND
    // ==========================================
    const canvas = document.getElementById('cyber-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const particles = [];
        const particleCount = Math.min(Math.floor((width * height) / 14000), 75);
        let mouse = { x: null, y: null, radius: 120 };

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.8;
                this.vy = (Math.random() - 0.5) * 0.8;
                this.radius = Math.random() * 1.8 + 0.8;
                this.color = Math.random() > 0.4 ? 'rgba(6, 182, 212,' : 'rgba(52, 211, 153,';
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `${this.color} 0.65)`;
                ctx.fill();
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx = -this.vx;
                if (this.y < 0 || this.y > height) this.vy = -this.vy;

                // Mouse push
                if (mouse.x != null && mouse.y != null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < mouse.radius) {
                        const force = (mouse.radius - dist) / mouse.radius;
                        this.x -= (dx / dist) * force * 2.5;
                        this.y -= (dy / dist) * force * 2.5;
                    }
                }

                this.draw();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animateCanvas() {
            ctx.clearRect(0, 0, width, height);

            // Connect lines
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 110) {
                        const opacity = (1 - dist / 110) * 0.25;
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(6, 182, 212, ${opacity})`;
                        ctx.lineWidth = 0.7;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            particles.forEach(p => p.update());
            requestAnimationFrame(animateCanvas);
        }

        animateCanvas();
    }

    // ==========================================
    // 3. MOBILE MENU TOGGLE
    // ==========================================
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', () => {
            const isHidden = mobileMenu.classList.contains('hidden');
            if (isHidden) {
                mobileMenu.classList.remove('hidden');
                mobileMenu.classList.add('flex');
            } else {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('flex');
            }
            playBeep(520, 'sine', 0.04);
        });

        // Close on link click
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('flex');
            });
        });
    }

    // ==========================================
    // 4. COPY EMAIL CLIPBOARD
    // ==========================================
    const copyEmailBtn = document.getElementById('copy-email-btn');
    const copyEmailText = document.getElementById('copy-email-text');
    if (copyEmailBtn && copyEmailText) {
        copyEmailBtn.addEventListener('click', () => {
            const email = "chetan.khairnar234@gmail.com";
            navigator.clipboard.writeText(email).then(() => {
                const originalText = copyEmailText.textContent;
                copyEmailText.textContent = "Copied to clipboard!";
                copyEmailBtn.classList.add('border-emerald-500');
                playBeep(750, 'triangle', 0.08);

                setTimeout(() => {
                    copyEmailText.textContent = originalText;
                    copyEmailBtn.classList.remove('border-emerald-500');
                }, 2500);
            });
        });
    }

    // ==========================================
    // 5. ANIMATED STAT COUNTERS
    // ==========================================
    const counters = document.querySelectorAll('.counter');
    let animatedCounters = false;

    function runCounters() {
        if (animatedCounters) return;
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            let count = 0;
            const speed = target / 30;

            const updateCount = () => {
                count += speed;
                if (count < target) {
                    counter.innerText = Math.ceil(count) + (target === 100 ? '%' : '+');
                    setTimeout(updateCount, 40);
                } else {
                    counter.innerText = target + (target === 100 ? '%' : '+');
                }
            };
            updateCount();
        });
        animatedCounters = true;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                runCounters();
            }
        });
    }, { threshold: 0.4 });

    const statsSection = document.querySelector('.counter');
    if (statsSection) {
        observer.observe(statsSection.closest('section'));
    }

    // ==========================================
    // 6. SKILLS FILTERING
    // ==========================================
    const skillTabs = document.querySelectorAll('.skill-tab');
    const skillCards = document.querySelectorAll('.skill-card');

    skillTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            playBeep(640, 'sine', 0.04);
            skillTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const filter = tab.getAttribute('data-filter');

            skillCards.forEach(card => {
                if (filter === 'all' || card.classList.contains(filter)) {
                    card.style.display = 'block';
                    card.style.opacity = '0';
                    setTimeout(() => card.style.opacity = '1', 50);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // ==========================================
    // 7. INTERACTIVE CLI TERMINAL ENGINE
    // ==========================================
    const terminalOutput = document.getElementById('terminal-output');
    const terminalInput = document.getElementById('terminal-input');
    const cmdPills = document.querySelectorAll('.cmd-pill');

    const terminalCommands = {
        'help': `
Available Commands:
  <span class="text-cyan-400">help</span>             Show this help menu
  <span class="text-cyan-400">skills</span>           List core technical competencies
  <span class="text-cyan-400">projects</span>         Explore backend architectures built by Chetan
  <span class="text-cyan-400">experience</span>       Details of 6-month Software Dev Internship
  <span class="text-cyan-400">education</span>        Degree credentials (M.Sc & B.Sc in CS)
  <span class="text-cyan-400">cat resume.txt</span>   Print resume synopsis
  <span class="text-cyan-400">sudo hire chetan</span> Trigger instant hiring pipeline
  <span class="text-cyan-400">contact</span>          View direct phone, email, and location
  <span class="text-cyan-400">clear</span>            Clear terminal console
  <span class="text-cyan-400">whoami</span>           Current user identity
`,
        'skills': `
<span class="text-emerald-400 font-bold">[CORE BACKEND ARSENAL]</span>
-----------------------------------------------------------
- Language:         Python 3.x (OOP, Generators, Iterators, Decorators)
- Frameworks:       Django, Django REST Framework (DRF)
- Databases:        Oracle SQL, MySQL, SQLite, Django ORM
- Cloud & Infra:    AWS (EC2, S3), Caching strategies
- API & Testing:    Postman, Swagger/OpenAPI, JWT Authentication, RBAC
- Mobile & Hybrid:  Flutter, Java, Kotlin, Firebase
- Development Tools:VS Code, Git & GitHub, Oracle SQL Developer
`,
        'projects': `
<span class="text-cyan-400 font-bold">[ENGINEERED BACKEND SYSTEMS]</span>
-----------------------------------------------------------
1. <strong class="text-white">E-Commerce Backend Platform</strong> (Python, Django, DRF, Oracle SQL)
   &bull; Developed full REST APIs: catalog, cart, orders, inventory.
   &bull; Integrated JWT tokens & role-based access control.
   &bull; Normalized Oracle SQL tables with atomic transactions.

2. <strong class="text-white">Employee Management System</strong> (Python, Django, DRF, MySQL)
   &bull; Enterprise backend managing profiles, attendance, leaves.
   &bull; Granular RBAC permissions between employees and HR.
   &bull; Automated leave validation and exception handlers.
`,
        'experience': `
<span class="text-yellow-400 font-bold">[WORK EXPERIENCE]</span>
-----------------------------------------------------------
Company:   <strong>Paarsh Infotech PVT. LTD.</strong>
Role:      Software Development Intern
Duration:  Jan 2024 &ndash; Jul 2024 (6 Months)
Focus:
  &bull; Built production-grade scalable REST APIs with Django & DRF.
  &bull; Optimized SQL queries, schema indexing, and caching.
  &bull; Implemented JWT auth and granular role-based permissions.
`,
        'education': `
<span class="text-purple-400 font-bold">[ACADEMIC BACKGROUND]</span>
-----------------------------------------------------------
1. <strong>Master of Science in Computer Science (M.Sc.)</strong>
   Institution: Savitribai Phule Pune University
   Graduation:  2022 &ndash; 2024 | CGPA: 7.25 / 10

2. <strong>Bachelor of Science in Computer Science (B.Sc.)</strong>
   Institution: Savitribai Phule Pune University
   Graduation:  2018 &ndash; 2022 | CGPA: 6.9 / 10
`,
        'cat resume.txt': `
<span class="text-slate-300">
=============================================================
CHETAN UTTAM KHAIRNAR - PYTHON BACKEND DEVELOPER
Location: Nashik, Maharashtra | Phone: +91 8308952105
Email:    chetan.khairnar234@gmail.com
Status:   Seeking Junior Backend Developer Role
=============================================================
Specialties: Django & DRF, REST API Design, JWT, Oracle SQL,
MySQL, Schema Optimization, Postman Testing, AWS (EC2/S3).
</span>
`,
        'sudo hire chetan': `
<span class="text-emerald-400 font-bold">[SUCCESS 201 CREATED]</span>
-----------------------------------------------------------
Access granted! You are hiring an exceptional backend engineer.
Sending dispatch notification to: <a href="mailto:chetan.khairnar234@gmail.com" class="underline text-cyan-400">chetan.khairnar234@gmail.com</a>
Or direct dial: <a href="tel:+918308952105" class="underline text-emerald-400">+91 8308952105</a>
`,
        'contact': `
<span class="text-cyan-400 font-bold">[COMMUNICATION CHANNELS]</span>
-----------------------------------------------------------
Email:    chetan.khairnar234@gmail.com
Phone:    +91 8308952105
Location: Nashik, Maharashtra, India
GitHub:   https://github.com/ChetanKhairnar7-ui
WhatsApp: https://wa.me/918308952105
`,
        'whoami': `guest@recruiter-workstation: authorized visitor`,
        'date': new Date().toUTCString()
    };

    function runTerminalCmd(rawInput) {
        const cmd = rawInput.trim().toLowerCase();
        playBeep(700, 'triangle', 0.03);

        const promptLine = document.createElement('div');
        promptLine.className = 'text-slate-400 flex items-center gap-2';
        promptLine.innerHTML = `<span class="text-cyan-400 font-bold">chetan@server:~$</span> <span class="text-white">${rawInput}</span>`;
        terminalOutput.appendChild(promptLine);

        if (cmd === 'clear') {
            terminalOutput.innerHTML = '';
        } else if (terminalCommands[cmd]) {
            const respLine = document.createElement('div');
            respLine.className = 'text-xs text-slate-300 leading-relaxed pl-2 border-l border-cyan-500/30';
            respLine.innerHTML = terminalCommands[cmd];
            terminalOutput.appendChild(respLine);
        } else if (cmd === '') {
            // do nothing
        } else {
            const errLine = document.createElement('div');
            errLine.className = 'text-rose-400 text-xs pl-2';
            errLine.innerHTML = `command not found: '${rawInput}'. Type <span class="text-cyan-300 font-semibold">'help'</span> for available commands.`;
            terminalOutput.appendChild(errLine);
        }

        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    if (terminalInput) {
        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const val = terminalInput.value;
                terminalInput.value = '';
                runTerminalCmd(val);
            }
        });
    }

    cmdPills.forEach(pill => {
        pill.addEventListener('click', () => {
            const cmd = pill.textContent.trim();
            if (terminalInput) terminalInput.value = cmd;
            runTerminalCmd(cmd);
        });
    });

    // ==========================================
    // 8. INTERACTIVE REST API EXPLORER / SWAGGER
    // ==========================================
    const apiMethod = document.getElementById('api-method');
    const apiEndpoint = document.getElementById('api-endpoint');
    const apiSendBtn = document.getElementById('api-send-btn');
    const apiResponseBody = document.getElementById('api-response-body');
    const apiStatusBadge = document.getElementById('api-status-badge');
    const apiLatency = document.getElementById('api-latency');
    const postBodyContainer = document.getElementById('post-body-container');

    const apiDatabase = {
        '/api/v1/profile': {
            status: 200,
            statusText: '200 OK',
            data: {
                name: "Chetan Uttam Khairnar",
                title: "Python Backend Developer",
                education: "M.Sc. in Computer Science (SPPU, 2024)",
                cgpa: 7.25,
                experience_months: 6,
                company: "Paarsh Infotech PVT. LTD.",
                core_specialization: "Django, DRF, REST API Architecture, Relational Databases",
                open_to_relocation: true,
                contact: {
                    email: "chetan.khairnar234@gmail.com",
                    phone: "+91 8308952105",
                    location: "Nashik, Maharashtra"
                }
            }
        },
        '/api/v1/skills?category=backend': {
            status: 200,
            statusText: '200 OK',
            data: {
                category: "Backend & Python Engineering",
                languages: ["Python (OOP, Generators, Iterators, File I/O, Decorators)", "SQL"],
                frameworks: ["Django", "Django REST Framework (DRF)"],
                database_management: ["Oracle SQL", "MySQL", "SQLite", "Django ORM"],
                security: ["JWT Authentication", "Role-Based Access Control (RBAC)"],
                cloud_and_caching: ["AWS EC2", "AWS S3", "In-Memory Caching Strategies"],
                testing: ["Postman Collection Runner", "Swagger / OpenAPI"]
            }
        },
        '/api/v1/projects/ecommerce': {
            status: 200,
            statusText: '200 OK',
            data: {
                id: "proj_ecommerce_01",
                name: "E-Commerce Backend Platform",
                stack: ["Python", "Django", "Django REST Framework", "Oracle SQL"],
                architecture_type: "RESTful Monolithic Micro-Services Ready",
                modules: [
                    "Product Catalog Management",
                    "Session & User Persistent Cart",
                    "Atomic Order Processing",
                    "Stock & Inventory Reservation Logic"
                ],
                security: "JWT Access & Refresh Token Rotation",
                database_engine: "Oracle Relational Engine with Foreign Key Constraints",
                testing_coverage: "100% Postman Tested Endpoints"
            }
        },
        '/api/v1/projects/ems': {
            status: 200,
            statusText: '200 OK',
            data: {
                id: "proj_ems_02",
                name: "Employee Management System",
                stack: ["Python", "Django", "DRF", "MySQL"],
                features: [
                    "Employee Lifecycle & Onboarding",
                    "Department Hierarchy Assignment",
                    "Daily Attendance Tracking",
                    "Hierarchical Leave Approval Engine"
                ],
                permissions: "Permission-based Access Control (Admin, HR, Staff)",
                error_handling: "Standardized Exception Envelopes"
            }
        },
        '/api/v1/experience': {
            status: 200,
            statusText: '200 OK',
            data: {
                company: "Paarsh Infotech PVT. LTD.",
                role: "Software Development Intern",
                tenure: "January 2024 – July 2024",
                key_deliverables: [
                    "Engineered modular REST endpoints using DRF ViewSets",
                    "Refactored complex database queries to reduce execution latency",
                    "Implemented JWT stateless auth guards",
                    "Established caching layers for read-heavy operations"
                ],
                recommendation_available: true
            }
        },
        '/api/v1/certifications': {
            status: 200,
            statusText: '200 OK',
            data: {
                total_certifications: 6,
                items: [
                    { title: "Full Stack Development Internship Certification", issuer: "Paarsh Infotech" },
                    { title: "Python 101 For Data Science", issuer: "IBM Cognitive Class" },
                    { title: "Machine Learning With Python", issuer: "IBM Cognitive Class" },
                    { title: "SQL and Relational Databases 101", issuer: "IBM Cognitive Class" },
                    { title: "Prepare Data for Exploration", issuer: "Coursera" },
                    { title: "Foundation : Data, Data, Everywhere", issuer: "Coursera" }
                ]
            }
        },
        '/api/v1/hire-me': {
            status: 201,
            statusText: '201 Created',
            data: {
                status: "OFFER_DISPATCHED",
                candidate: "Chetan Uttam Khairnar",
                target_role: "Junior Backend Developer",
                message: "Interview invitation received! Emailing Chetan directly.",
                preferred_contact: "chetan.khairnar234@gmail.com",
                timestamp: new Date().toISOString()
            }
        }
    };

    if (apiMethod && postBodyContainer && apiEndpoint) {
        apiMethod.addEventListener('change', () => {
            if (apiMethod.value === 'POST') {
                postBodyContainer.classList.remove('hidden');
                apiEndpoint.value = '/api/v1/hire-me';
            } else {
                postBodyContainer.classList.add('hidden');
                if (apiEndpoint.value === '/api/v1/hire-me') {
                    apiEndpoint.value = '/api/v1/profile';
                }
            }
        });

        apiEndpoint.addEventListener('change', () => {
            if (apiEndpoint.value === '/api/v1/hire-me') {
                apiMethod.value = 'POST';
                postBodyContainer.classList.remove('hidden');
            } else {
                apiMethod.value = 'GET';
                postBodyContainer.classList.add('hidden');
            }
        });
    }

    if (apiSendBtn) {
        apiSendBtn.addEventListener('click', () => {
            playBeep(820, 'sine', 0.05);
            const endpoint = apiEndpoint.value;
            const latency = Math.floor(Math.random() * 20) + 12;

            apiLatency.textContent = `${latency}ms`;
            apiResponseBody.textContent = 'Executing query & dispatching headers...';

            setTimeout(() => {
                const response = apiDatabase[endpoint] || {
                    status: 404,
                    statusText: '404 Not Found',
                    data: { error: "Endpoint not found in route table" }
                };

                apiStatusBadge.textContent = response.statusText;
                if (response.status >= 200 && response.status < 300) {
                    apiStatusBadge.className = 'px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold';
                } else {
                    apiStatusBadge.className = 'px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800 font-bold';
                }

                apiResponseBody.textContent = JSON.stringify(response.data, null, 2);
            }, 200);
        });
    }

    // ==========================================
    // 9. ARCHITECTURE MODAL DETAILS
    // ==========================================
    const projectModal = document.getElementById('project-modal');
    const modalContent = document.getElementById('modal-content');
    const closeModal = document.getElementById('close-modal');
    const modalBtns = document.querySelectorAll('.project-modal-btn');

    const projectArchitectures = {
        'ecommerce': {
            title: "E-Commerce Backend Platform Architecture",
            tag: "Django + DRF + Oracle SQL + JWT",
            description: "High-level schema relationship and API execution lifecycle designed by Chetan Khairnar.",
            schema: `
+-------------------------------------------------------+
|                 ORACLE RELATIONAL SCHEMA             |
+-------------------------------------------------------+
 [User Model]           [Product Model]
  - id (PK)              - id (PK)
  - email (Unique)       - title (Varchar)
  - password_hash        - price (Decimal)
  - role (Enum)          - stock_count (Int)
        |                      |
        | 1:N                  | 1:N
        v                      v
 [Order Model] -------> [OrderItem Model]
  - id (PK)              - id (PK)
  - user_id (FK)         - order_id (FK)
  - status (Varchar)     - product_id (FK)
  - total_amount         - quantity (Int)
  - created_at           - unit_price
`,
            codeSnippet: `
# models.py - Atomic Order Creation with Stock Deduction
from django.db import transaction
from rest_framework import exceptions

@transaction.atomic
def create_order(user, cart_items):
    order = Order.objects.create(user=user, status='PENDING')
    total = 0
    for item in cart_items:
        product = Product.objects.select_for_update().get(id=item.product_id)
        if product.stock_count < item.quantity:
            raise exceptions.ValidationError(f"Insufficient stock for {product.title}")
        product.stock_count -= item.quantity
        product.save()
        OrderItem.objects.create(order=order, product=product, quantity=item.quantity)
        total += product.price * item.quantity
    order.total_amount = total
    order.save()
    return order
`
        },
        'ems': {
            title: "Employee Management System Architecture",
            tag: "Django + DRF + MySQL + RBAC",
            description: "Enterprise Role-Based Access Control and Department Ledger Flow.",
            schema: `
+-------------------------------------------------------+
|                  MYSQL RELATIONAL SCHEMA              |
+-------------------------------------------------------+
 [Department]
  - id (PK), name, head_id
        | 1:N
        v
 [Employee Model]
  - id (PK), employee_code, name, email, department_id (FK), role (Admin/HR/Staff)
        |                      |
        | 1:N                  | 1:N
        v                      v
 [AttendanceLog]        [LeaveRequest]
  - id (PK)              - id (PK)
  - employee_id (FK)     - employee_id (FK)
  - check_in_time        - start_date, end_date
  - check_out_time       - status (Pending/Approved/Rejected)
  - date                 - approved_by (FK -> Employee)
`,
            codeSnippet: `
# permissions.py - Granular Role Protection
from rest_framework import permissions

class IsHRAdminOrSelf(permissions.BasePermission):
    """
    Staff can only inspect their own attendance & leave ledger.
    HR Admins have read/write across all department employees.
    """
    def has_object_permission(self, request, view, obj):
        if request.user.is_staff or request.user.role in ['ADMIN', 'HR']:
            return True
        return obj.employee == request.user
`
        }
    };

    modalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const projKey = btn.getAttribute('data-project');
            const data = projectArchitectures[projKey];
            if (!data) return;

            playBeep(620, 'sine', 0.05);
            modalContent.innerHTML = `
                <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                        <span class="text-xs font-mono text-cyan-400 uppercase">${data.tag}</span>
                        <h3 class="text-xl font-bold text-white">${data.title}</h3>
                    </div>
                </div>
                <p class="text-xs text-slate-300">${data.description}</p>
                <div>
                    <div class="text-xs font-mono text-emerald-400 mb-1">Database Schema Relationship:</div>
                    <pre class="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto">${data.schema}</pre>
                </div>
                <div>
                    <div class="text-xs font-mono text-cyan-400 mb-1">Production Backend Pattern:</div>
                    <pre class="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto">${data.codeSnippet}</pre>
                </div>
            `;
            projectModal.classList.add('active');
        });
    });

    if (closeModal && projectModal) {
        closeModal.addEventListener('click', () => {
            projectModal.classList.remove('active');
        });
        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) {
                projectModal.classList.remove('active');
            }
        });
    }

    // ==========================================
    // 10. CONTACT FORM SUBMISSION
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');
    const submitBtn = document.getElementById('submit-form-btn');

    if (contactForm && formFeedback && submitBtn) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            playBeep(900, 'triangle', 0.08);

            const name = document.getElementById('sender-name').value;
            const email = document.getElementById('sender-email').value;
            const subject = document.getElementById('sender-subject').value || "Portfolio Opportunity";
            const message = document.getElementById('sender-message').value;

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Dispatching Message...';

            setTimeout(() => {
                formFeedback.classList.remove('hidden');
                formFeedback.className = 'p-3 rounded-xl text-xs font-mono text-center bg-emerald-950 border border-emerald-800 text-emerald-300';
                formFeedback.innerHTML = `&check; Thank you <strong>${name}</strong>! Your inquiry regarding <em>"${subject}"</em> has been logged. Chetan will respond to <strong>${email}</strong> promptly.`;

                // Also trigger mailto for seamless client email
                const mailtoUrl = `mailto:chetan.khairnar234@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("From: " + name + " (" + email + ")\n\n" + message)}`;
                
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Dispatched';
                contactForm.reset();

                // Open default email client after brief confirmation
                window.location.href = mailtoUrl;
            }, 800);
        });
    }

});
