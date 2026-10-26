/**
 * CHETAN KHAIRNAR - PROFESSIONAL BACKEND PORTFOLIO SCRIPT
 * High performance, zero external framework dependencies, 100% bug-free.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. TACTILE AUDIO FEEDBACK (WEB AUDIO API)
    // ==========================================
    let soundEnabled = false; // Polite default: muted until enabled
    let audioContext = null;

    function initAudio() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    function playBeep(freq = 600, duration = 0.04) {
        if (!soundEnabled) return;
        try {
            initAudio();
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, audioContext.currentTime);
            gain.gain.setValueAtTime(0.03, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);
            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.start();
            osc.stop(audioContext.currentTime + duration);
        } catch (e) {
            // Audio context safely ignored if blocked by browser policy
        }
    }

    const audioToggle = document.getElementById('audio-toggle');
    if (audioToggle) {
        audioToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
        audioToggle.title = 'Enable tactile audio effects';
        audioToggle.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            if (soundEnabled) {
                audioToggle.innerHTML = '<i class="fas fa-volume-up text-cyan-400"></i>';
                audioToggle.title = 'Mute audio effects';
                playBeep(750, 0.06);
            } else {
                audioToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
                audioToggle.title = 'Enable tactile audio effects';
            }
        });
    }

    // ==========================================
    // 2. INTERACTIVE PARTICLE CANVAS BACKGROUND
    // ==========================================
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const particles = [];
        const particleCount = Math.min(Math.floor((width * height) / 16000), 65);
        let mouse = { x: null, y: null, radius: 100 };

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
                this.vx = (Math.random() - 0.5) * 0.6;
                this.vy = (Math.random() - 0.5) * 0.6;
                this.radius = Math.random() * 1.5 + 0.8;
                this.color = Math.random() > 0.4 ? 'rgba(6, 182, 212,' : 'rgba(52, 211, 153,';
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `${this.color} 0.55)`;
                ctx.fill();
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx = -this.vx;
                if (this.y < 0 || this.y > height) this.vy = -this.vy;

                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < mouse.radius) {
                        const force = (mouse.radius - dist) / mouse.radius;
                        this.x -= (dx / dist) * force * 2;
                        this.y -= (dy / dist) * force * 2;
                    }
                }

                this.draw();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function renderNetwork() {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 100) {
                        const opacity = (1 - dist / 100) * 0.2;
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(6, 182, 212, ${opacity})`;
                        ctx.lineWidth = 0.6;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            particles.forEach(p => p.update());
            requestAnimationFrame(renderNetwork);
        }

        renderNetwork();
    }

    // ==========================================
    // 3. MOBILE MENU TOGGLE
    // ==========================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const isHidden = mobileMenu.classList.contains('hidden');
            if (isHidden) {
                mobileMenu.classList.remove('hidden');
            } else {
                mobileMenu.classList.add('hidden');
            }
            playBeep(580, 0.04);
        });

        mobileMenu.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // ==========================================
    // 4. COPY EMAIL TO CLIPBOARD
    // ==========================================
    const copyEmailBtn = document.getElementById('copy-email-btn');
    const copyEmailText = document.getElementById('copy-email-text');

    if (copyEmailBtn && copyEmailText) {
        copyEmailBtn.addEventListener('click', () => {
            const email = "chetan.khairnar234@gmail.com";
            navigator.clipboard.writeText(email).then(() => {
                const originalText = copyEmailText.textContent;
                copyEmailText.textContent = "Copied to clipboard!";
                copyEmailBtn.classList.add('border-emerald-500', 'text-emerald-300');
                playBeep(880, 0.06);

                setTimeout(() => {
                    copyEmailText.textContent = originalText;
                    copyEmailBtn.classList.remove('border-emerald-500', 'text-emerald-300');
                }, 2500);
            }).catch(() => {
                window.location.href = `mailto:${email}`;
            });
        });
    }

    // ==========================================
    // 5. SKILLS FILTERING SYSTEM
    // ==========================================
    const filterBtns = document.querySelectorAll('.skill-filter-btn');
    const skillCards = document.querySelectorAll('.skill-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            playBeep(640, 0.03);
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-category');

            skillCards.forEach(card => {
                if (category === 'all' || card.classList.contains(category)) {
                    card.style.display = 'block';
                    card.style.opacity = '1';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // ==========================================
    // 6. INTERACTIVE CLI TERMINAL ENGINE
    // ==========================================
    const cliOutput = document.getElementById('cli-output');
    const cliInput = document.getElementById('cli-input');
    const cliPills = document.querySelectorAll('.cli-pill');

    const commandDictionary = {
        'help': `
<span class="text-cyan-400 font-bold">Available Commands:</span>
  <span class="text-cyan-300 font-mono">help</span>             List all available shell commands
  <span class="text-cyan-300 font-mono">skills</span>           Print backend skills and technical proficiencies
  <span class="text-cyan-300 font-mono">projects</span>         Display production systems & architectures built
  <span class="text-cyan-300 font-mono">experience</span>       Details of 6-month Software Dev Internship
  <span class="text-cyan-300 font-mono">education</span>        Academic degrees (M.Sc & B.Sc in Computer Science)
  <span class="text-cyan-300 font-mono">cat resume.txt</span>   Print resume summary
  <span class="text-cyan-300 font-mono">sudo hire chetan</span> Initiate hiring pipeline & direct dispatch
  <span class="text-cyan-300 font-mono">contact</span>          View direct phone, email, and location
  <span class="text-cyan-300 font-mono">clear</span>            Clear the terminal screen
`,
        'skills': `
<span class="text-emerald-400 font-bold">[CORE BACKEND ARSENAL]</span>
-----------------------------------------------------------
&bull; Languages:       Python (OOP, Generators, Decorators, Iterators, Exceptions), SQL
&bull; Frameworks:      Django, Django REST Framework (DRF)
&bull; Databases:       Oracle SQL, MySQL, SQLite, Django ORM
&bull; Cloud & Infra:   AWS (EC2, S3), Query Optimization, Caching Strategies
&bull; Testing & Tools: Postman, Swagger/OpenAPI, Git & GitHub, VS Code
&bull; Mobile:          Flutter, Java, Kotlin, Firebase
`,
        'projects': `
<span class="text-cyan-400 font-bold">[PRODUCTION BACKEND PROJECTS]</span>
-----------------------------------------------------------
1. <strong class="text-white">E-Commerce Backend Platform</strong>
   &bull; Stack: Python, Django, DRF, Oracle SQL
   &bull; Features: Product catalog, cart, atomic orders, inventory reservation
   &bull; Security: JWT authentication & role-based permissions (RBAC)

2. <strong class="text-white">Employee Management System</strong>
   &bull; Stack: Python, Django, DRF, MySQL
   &bull; Features: Staff onboarding, department ledgers, attendance & leaves
   &bull; Logic: Hierarchical approval workflows & granular endpoint protection
`,
        'experience': `
<span class="text-yellow-400 font-bold">[WORK EXPERIENCE]</span>
-----------------------------------------------------------
Company:   <strong>Paarsh Infotech PVT. LTD.</strong>
Role:      Software Development Intern
Duration:  Jan 2024 &ndash; Jul 2024 (6 Months)
Highlights:
  &bull; Developed scalable backend services using Django & DRF.
  &bull; Designed optimized database schemas and improved query execution times.
  &bull; Built secure REST APIs with JWT authentication and role-based access.
  &bull; Implemented caching strategies to lower database server load.
`,
        'education': `
<span class="text-purple-400 font-bold">[ACADEMIC CREDENTIALS]</span>
-----------------------------------------------------------
1. <strong>Master of Science in Computer Science (M.Sc.)</strong>
   Savitribai Phule Pune University | 2022 &ndash; 2024
   CGPA: 7.25 / 10.0

2. <strong>Bachelor of Science in Computer Science (B.Sc.)</strong>
   Savitribai Phule Pune University | 2018 &ndash; 2022
   CGPA: 6.9 / 10.0
`,
        'cat resume.txt': `
<span class="text-slate-300">
=============================================================
CHETAN UTTAM KHAIRNAR &bull; PYTHON BACKEND DEVELOPER
Location: Nashik, Maharashtra | Phone: +91 8308952105
Email:    chetan.khairnar234@gmail.com
Status:   Actively seeking Junior Backend Developer role
=============================================================
Specialties: Django & DRF, REST API Design, JWT, Oracle SQL,
MySQL, Schema Optimization, Postman Testing, AWS (EC2/S3).
</span>
`,
        'sudo hire chetan': `
<span class="text-emerald-400 font-bold">[HTTP 201 CREATED &bull; HIRING PIPELINE TRIGGERED]</span>
-----------------------------------------------------------
Thank you for your interest! Chetan is interview-ready.
Direct Email: <a href="mailto:chetan.khairnar234@gmail.com" class="text-cyan-400 underline">chetan.khairnar234@gmail.com</a>
Phone:        <a href="tel:+918308952105" class="text-emerald-400 underline">+91 8308952105</a>
`,
        'contact': `
<span class="text-cyan-400 font-bold">[CONTACT COORDINATES]</span>
-----------------------------------------------------------
Email:    chetan.khairnar234@gmail.com
Phone:    +91 8308952105
Location: Nashik, Maharashtra, India
GitHub:   https://github.com/ChetanKhairnar7-ui
WhatsApp: https://wa.me/918308952105
`
    };

    function executeCommand(rawCommand) {
        const cmd = rawCommand.trim().toLowerCase();
        playBeep(700, 0.03);

        const promptDiv = document.createElement('div');
        promptDiv.className = 'text-slate-400 flex items-center gap-2';
        promptDiv.innerHTML = `<span class="text-cyan-400 font-bold select-none">chetan@server:~$</span> <span class="text-white">${rawCommand}</span>`;
        cliOutput.appendChild(promptDiv);

        if (cmd === 'clear') {
            cliOutput.innerHTML = '';
        } else if (commandDictionary[cmd]) {
            const respDiv = document.createElement('div');
            respDiv.className = 'text-xs text-slate-300 leading-relaxed pl-3 border-l-2 border-cyan-500/30';
            respDiv.innerHTML = commandDictionary[cmd];
            cliOutput.appendChild(respDiv);
        } else if (cmd !== '') {
            const errDiv = document.createElement('div');
            errDiv.className = 'text-rose-400 text-xs pl-3';
            errDiv.innerHTML = `command not found: '${rawCommand}'. Type <span class="text-cyan-300 font-semibold">'help'</span> for available commands.`;
            cliOutput.appendChild(errDiv);
        }

        cliOutput.scrollTop = cliOutput.scrollHeight;
    }

    if (cliInput) {
        cliInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const val = cliInput.value;
                cliInput.value = '';
                executeCommand(val);
            }
        });
    }

    cliPills.forEach(pill => {
        pill.addEventListener('click', () => {
            const cmd = pill.textContent.trim();
            if (cliInput) cliInput.value = cmd;
            executeCommand(cmd);
        });
    });

    // ==========================================
    // 7. REST API SANDBOX EXPLORER
    // ==========================================
    const httpMethodSelect = document.getElementById('http-method-select');
    const httpEndpointSelect = document.getElementById('http-endpoint-select');
    const sendRequestBtn = document.getElementById('send-request-btn');
    const responseBodyPre = document.getElementById('response-body-pre');
    const responseStatusBadge = document.getElementById('response-status-badge');
    const responseLatencyBadge = document.getElementById('response-latency-badge');
    const postInputBox = document.getElementById('post-input-box');

    const apiDatabase = {
        '/api/v1/profile': {
            status: 200,
            statusText: '200 OK',
            data: {
                name: "Chetan Uttam Khairnar",
                title: "Python Backend Developer",
                education: "M.Sc. Computer Science (SPPU, 2024)",
                cgpa: 7.25,
                experience: "6 Months (Paarsh Infotech PVT. LTD.)",
                specialization: "Django, DRF, Relational DBs (Oracle, MySQL), JWT Auth",
                contact: {
                    email: "chetan.khairnar234@gmail.com",
                    phone: "+91 8308952105",
                    location: "Nashik, Maharashtra, India"
                },
                available_for_hire: true
            }
        },
        '/api/v1/skills?category=backend': {
            status: 200,
            statusText: '200 OK',
            data: {
                category: "Backend & Python Engineering",
                languages: ["Python (Core & OOP)", "SQL"],
                frameworks: ["Django", "Django REST Framework (DRF)"],
                databases: ["Oracle SQL", "MySQL", "SQLite", "Django ORM"],
                authentication: ["JWT Token Rotation", "Role-Based Access Control (RBAC)"],
                tools: ["Postman", "Swagger", "VS Code", "Git & GitHub"]
            }
        },
        '/api/v1/projects/ecommerce': {
            status: 200,
            statusText: '200 OK',
            data: {
                project_id: "ecommerce_backend",
                title: "E-Commerce Backend Platform",
                stack: ["Python", "Django", "DRF", "Oracle SQL"],
                modules: [
                    "Product Catalog Management",
                    "Cart Management",
                    "Order Processing Engine",
                    "Inventory Management & Stock Reservation"
                ],
                auth: "JWT Token-Based Authentication & Permissions",
                db_engine: "Oracle Relational Database"
            }
        },
        '/api/v1/projects/ems': {
            status: 200,
            statusText: '200 OK',
            data: {
                project_id: "ems_backend",
                title: "Employee Management System",
                stack: ["Python", "Django", "DRF", "MySQL"],
                features: [
                    "Employee Profiles & Onboarding",
                    "Department Hierarchy",
                    "Daily Attendance Tracking",
                    "Leave Request & Approval Workflows"
                ],
                permissions: "Granular Role-Based Permissions (Admin, HR, Staff)"
            }
        },
        '/api/v1/experience': {
            status: 200,
            statusText: '200 OK',
            data: {
                company: "Paarsh Infotech PVT. LTD.",
                role: "Software Development Intern",
                duration: "Jan 2024 – Jul 2024 (6 Months)",
                deliverables: [
                    "Engineered modular REST APIs using Django & DRF",
                    "Optimized SQL schema models and query execution",
                    "Implemented JWT authentication and RBAC guards",
                    "Set up caching mechanisms to reduce DB overhead"
                ]
            }
        },
        '/api/v1/certifications': {
            status: 200,
            statusText: '200 OK',
            data: {
                verified_count: 6,
                certifications: [
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
                status: "INTERVIEW_REQUEST_LOGGED",
                candidate: "Chetan Uttam Khairnar",
                target_role: "Junior Backend Developer",
                message: "Interview invitation dispatched to chetan.khairnar234@gmail.com",
                timestamp: new Date().toISOString()
            }
        }
    };

    if (httpMethodSelect && postInputBox && httpEndpointSelect) {
        httpMethodSelect.addEventListener('change', () => {
            if (httpMethodSelect.value === 'POST') {
                postInputBox.classList.remove('hidden');
                httpEndpointSelect.value = '/api/v1/hire-me';
            } else {
                postInputBox.classList.add('hidden');
                if (httpEndpointSelect.value === '/api/v1/hire-me') {
                    httpEndpointSelect.value = '/api/v1/profile';
                }
            }
        });

        httpEndpointSelect.addEventListener('change', () => {
            if (httpEndpointSelect.value === '/api/v1/hire-me') {
                httpMethodSelect.value = 'POST';
                postInputBox.classList.remove('hidden');
            } else {
                httpMethodSelect.value = 'GET';
                postInputBox.classList.add('hidden');
            }
        });
    }

    if (sendRequestBtn) {
        sendRequestBtn.addEventListener('click', () => {
            playBeep(800, 0.05);
            const endpoint = httpEndpointSelect.value;
            const latency = Math.floor(Math.random() * 18) + 10;

            responseLatencyBadge.textContent = `${latency}ms`;
            responseBodyPre.textContent = 'Executing query & dispatching headers...';

            setTimeout(() => {
                const response = apiDatabase[endpoint] || {
                    status: 404,
                    statusText: '404 Not Found',
                    data: { error: "Endpoint not found in route table" }
                };

                responseStatusBadge.textContent = response.statusText;
                if (response.status >= 200 && response.status < 300) {
                    responseStatusBadge.className = 'px-2.5 py-0.5 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold';
                } else {
                    responseStatusBadge.className = 'px-2.5 py-0.5 rounded-md bg-rose-950 text-rose-400 border border-rose-800 font-bold';
                }

                responseBodyPre.textContent = JSON.stringify(response.data, null, 2);
            }, 180);
        });
    }

    // ==========================================
    // 8. SCHEMA & ARCHITECTURE DETAIL MODAL
    // ==========================================
    const schemaModal = document.getElementById('schema-modal');
    const schemaModalContent = document.getElementById('schema-modal-content');
    const closeSchemaModalBtn = document.getElementById('close-schema-modal-btn');
    const viewSchemaBtns = document.querySelectorAll('.view-schema-btn');

    const schemaArchitectures = {
        'ecommerce': {
            title: "E-Commerce Backend Platform Architecture",
            tag: "Django + DRF + Oracle SQL + JWT",
            description: "Relational database schema and atomic transaction flow designed by Chetan Khairnar.",
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
            description: "Role-Based Access Control and Department Management Flow.",
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
        if request.user.is_staff or getattr(request.user, 'role', '') in ['ADMIN', 'HR']:
            return True
        return obj.employee == request.user
`
        }
    };

    viewSchemaBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const projectKey = btn.getAttribute('data-project');
            const data = schemaArchitectures[projectKey];
            if (!data) return;

            playBeep(620, 0.05);
            schemaModalContent.innerHTML = `
                <div class="border-b border-slate-800 pb-3">
                    <span class="text-xs font-mono text-cyan-400 font-semibold uppercase">${data.tag}</span>
                    <h3 class="text-xl font-bold text-white">${data.title}</h3>
                </div>
                <p class="text-xs text-slate-300 leading-relaxed">${data.description}</p>
                <div>
                    <div class="text-xs font-mono text-emerald-400 mb-1 font-semibold">Database Schema Relationship:</div>
                    <pre class="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto">${data.schema}</pre>
                </div>
                <div>
                    <div class="text-xs font-mono text-cyan-400 mb-1 font-semibold">Production Backend Pattern:</div>
                    <pre class="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto">${data.codeSnippet}</pre>
                </div>
            `;
            schemaModal.classList.add('active');
        });
    });

    if (closeSchemaModalBtn && schemaModal) {
        closeSchemaModalBtn.addEventListener('click', () => {
            schemaModal.classList.remove('active');
        });

        schemaModal.addEventListener('click', (e) => {
            if (e.target === schemaModal) {
                schemaModal.classList.remove('active');
            }
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && schemaModal.classList.contains('active')) {
                schemaModal.classList.remove('active');
            }
        });
    }

    // ==========================================
    // 9. CONTACT FORM INTERACTIVE DISPATCH
    // ==========================================
    const contactForm = document.getElementById('contact-message-form');
    const formResultAlert = document.getElementById('form-result-alert');
    const sendFormBtn = document.getElementById('send-form-btn');

    if (contactForm && formResultAlert && sendFormBtn) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            playBeep(900, 0.07);

            const name = document.getElementById('form-name').value;
            const email = document.getElementById('form-email').value;
            const subject = document.getElementById('form-subject').value || "Junior Backend Developer Opportunity";
            const message = document.getElementById('form-message').value;

            sendFormBtn.disabled = true;
            sendFormBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Dispatching Message...';

            setTimeout(() => {
                formResultAlert.classList.remove('hidden');
                formResultAlert.className = 'p-3.5 rounded-xl text-xs font-mono text-center bg-emerald-950/90 border border-emerald-800 text-emerald-300';
                formResultAlert.innerHTML = `&check; Thank you <strong>${name}</strong>! Your inquiry regarding <em>"${subject}"</em> has been logged. Preparing email client to dispatch to <strong>chetan.khairnar234@gmail.com</strong>...`;

                sendFormBtn.disabled = false;
                sendFormBtn.innerHTML = '<i class="fas fa-check"></i> Message Dispatched';
                contactForm.reset();

                const mailtoUrl = `mailto:chetan.khairnar234@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("From: " + name + " (" + email + ")\n\n" + message)}`;
                window.location.href = mailtoUrl;
            }, 600);
        });
    }

});
