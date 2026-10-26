/**
 * Chetan Khairnar — Portfolio Script
 * Clean, focused, zero-dependency vanilla JS.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ── 1. PARTICLE CANVAS ──────────────────────────────────────────
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let W = canvas.width  = window.innerWidth;
        let H = canvas.height = window.innerHeight;
        let mouse = { x: null, y: null };

        window.addEventListener('resize', () => {
            W = canvas.width  = window.innerWidth;
            H = canvas.height = window.innerHeight;
        });
        window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
        window.addEventListener('mouseout',  () => { mouse.x = null; mouse.y = null; });

        const COUNT = Math.min(Math.floor((W * H) / 18000), 55);

        class Dot {
            constructor() {
                this.x  = Math.random() * W;
                this.y  = Math.random() * H;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.r  = Math.random() * 1.5 + 0.6;
                this.color = Math.random() > 0.45 ? 'rgba(6,182,212,' : 'rgba(52,211,153,';
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > W) this.vx *= -1;
                if (this.y < 0 || this.y > H) this.vy *= -1;

                if (mouse.x !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const d  = Math.sqrt(dx * dx + dy * dy);
                    if (d < 90) {
                        const f = (90 - d) / 90;
                        this.x -= (dx / d) * f * 1.8;
                        this.y -= (dy / d) * f * 1.8;
                    }
                }

                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                ctx.fillStyle = `${this.color}0.5)`;
                ctx.fill();
            }
        }

        const dots = Array.from({ length: COUNT }, () => new Dot());

        function frame() {
            ctx.clearRect(0, 0, W, H);
            for (let i = 0; i < dots.length; i++) {
                for (let j = i + 1; j < dots.length; j++) {
                    const dx = dots[i].x - dots[j].x;
                    const dy = dots[i].y - dots[j].y;
                    const d  = Math.sqrt(dx * dx + dy * dy);
                    if (d < 95) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(6,182,212,${(1 - d / 95) * 0.18})`;
                        ctx.lineWidth = 0.6;
                        ctx.moveTo(dots[i].x, dots[i].y);
                        ctx.lineTo(dots[j].x, dots[j].y);
                        ctx.stroke();
                    }
                }
                dots[i].update();
            }
            requestAnimationFrame(frame);
        }
        frame();
    }

    // ── 2. MOBILE MENU ──────────────────────────────────────────────
    const menuBtn  = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('flex');
        });
        mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('flex');
            });
        });
    }

    // ── 3. DB SCHEMA MODAL ──────────────────────────────────────────
    const modal       = document.getElementById('schema-modal');
    const modalBody   = document.getElementById('schema-modal-body');
    const closeBtn    = document.getElementById('close-modal-btn');
    const schemaBtns  = document.querySelectorAll('.view-schema-btn');

    const schemas = {
        ecommerce: {
            title: 'E-Commerce Platform — DB Schema',
            tag:   'Django · DRF · Oracle SQL · JWT',
            diagram: `
[User]                  [Product]
  id (PK)                 id (PK)
  email (unique)          title
  password_hash           price (decimal)
  role (enum)             stock_count (int)
      |                       |
      | 1:N                   | 1:N
      v                       v
[Order] ──────────► [OrderItem]
  id (PK)             id (PK)
  user_id (FK)        order_id  (FK)
  status              product_id (FK)
  total_amount        quantity (int)
  created_at          unit_price`,
            snippet: `# Atomic order creation with stock reservation
@transaction.atomic
def create_order(user, cart_items):
    order = Order.objects.create(user=user, status='PENDING')
    total = 0
    for item in cart_items:
        product = Product.objects.select_for_update().get(id=item.product_id)
        if product.stock_count < item.quantity:
            raise ValidationError(f"Insufficient stock: {product.title}")
        product.stock_count -= item.quantity
        product.save()
        OrderItem.objects.create(
            order=order, product=product,
            quantity=item.quantity, unit_price=product.price
        )
        total += product.price * item.quantity
    order.total_amount = total
    order.save()
    return order`
        },
        ems: {
            title: 'Employee Management System — DB Schema',
            tag:   'Django · DRF · MySQL · RBAC',
            diagram: `
[Department]
  id (PK), name, head_id
      | 1:N
      v
[Employee]
  id (PK), employee_code, name
  email, department_id (FK)
  role (Admin | HR | Staff)
      |                       |
      | 1:N                   | 1:N
      v                       v
[AttendanceLog]         [LeaveRequest]
  id (PK)                id (PK)
  employee_id (FK)       employee_id (FK)
  check_in               start_date, end_date
  check_out              status (Pending/Approved/Rejected)
  date                   approved_by (FK → Employee)`,
            snippet: `# Granular object-level permission
class IsHRAdminOrSelf(permissions.BasePermission):
    """
    HR/Admin: full read-write across all employees.
    Staff: can only access their own records.
    """
    def has_object_permission(self, request, view, obj):
        role = getattr(request.user, 'role', '')
        if role in ('ADMIN', 'HR'):
            return True
        return obj.employee == request.user`
        }
    };

    schemaBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const key  = btn.getAttribute('data-project');
            const data = schemas[key];
            if (!data) return;

            modalBody.innerHTML = `
                <div class="border-b border-slate-800 pb-3">
                    <p class="text-xs font-mono text-cyan-400 mb-1">${data.tag}</p>
                    <h3 class="text-lg font-bold text-white">${data.title}</h3>
                </div>
                <div>
                    <p class="text-xs font-mono text-emerald-400 mb-2 font-semibold">Relational Schema</p>
                    <pre class="bg-slate-950 p-4 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed">${data.diagram}</pre>
                </div>
                <div>
                    <p class="text-xs font-mono text-cyan-400 mb-2 font-semibold">Key Backend Pattern</p>
                    <pre class="bg-slate-950 p-4 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto leading-relaxed">${data.snippet}</pre>
                </div>`;

            modal.classList.add('active');
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    }
    if (modal) {
        modal.addEventListener('click', e => {
            if (e.target === modal) modal.classList.remove('active');
        });
        window.addEventListener('keydown', e => {
            if (e.key === 'Escape') modal.classList.remove('active');
        });
    }

    // ── 4. CONTACT FORM ─────────────────────────────────────────────
    const form     = document.getElementById('contact-form');
    const feedback = document.getElementById('form-feedback');
    const submitBtn = document.getElementById('form-submit-btn');

    if (form && feedback && submitBtn) {
        form.addEventListener('submit', e => {
            e.preventDefault();

            const name    = document.getElementById('form-name').value.trim();
            const email   = document.getElementById('form-email').value.trim();
            const subject = document.getElementById('form-subject').value.trim() || 'Backend Developer Opportunity';
            const message = document.getElementById('form-message').value.trim();

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';

            setTimeout(() => {
                feedback.classList.remove('hidden');
                feedback.className = 'p-3.5 rounded-xl text-xs text-center font-mono bg-emerald-950 border border-emerald-800 text-emerald-300';
                feedback.textContent = `✓ Thank you ${name}! Opening your email client to send the message.`;

                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-check mr-2"></i>Sent';
                form.reset();

                window.location.href = `mailto:chetan.khairnar234@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent('From: ' + name + ' (' + email + ')\n\n' + message)}`;
            }, 500);
        });
    }

});
