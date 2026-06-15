# MR Tracker: Production-Grade Roadmap
## Transform MVP → Enterprise Medical Representative Management Platform

**Current State**: Functional MVP with Auth, Doctor CRUD, Visit & FollowUp management, basic dashboards
**Target State**: Enterprise SaaS platform suitable for pharmaceutical companies with 500+ users per instance

---

## 1️⃣ MUST-HAVE FEATURES (Critical MVP Gaps)

| Feature Name | Business Value | Priority | Backend Changes | Frontend Changes | DB Changes | Complexity |
|---|---|---|---|---|---|---|
| **Pagination & Filtering on All Lists** | Reduce load times for large datasets (1000+ doctors/visits) | H | Add limit/offset/sort to all GET endpoints; query optimization | Infinite scroll or traditional pagination UI | Add indexes on commonly filtered columns | M |
| **Doctor Duplicate Detection** | Prevent data corruption; ensure data integrity | H | Algorithm to find similar doctors (fuzzy match on name+hospital) | Confirmation dialog before adding doctors | Unique constraint on (doctorName, hospitalName) | M |
| **Visit History & Notes** | MRs need to track conversation context; enhance follow-up effectiveness | H | Visit detail page with full history; notes CRUD | Expandable visit detail modal; rich text editor | Add `visitNotes` field to Visit; full-text search index | M |
| **Form Validations & Error Messages** | Reduce user errors; improve UX | H | Backend validation on all inputs (email, phone, dates) | Client-side validation + server error display | N/A | S |
| **Bulk Operations (Import/Export)** | Speed up doctor/visit data entry; enable data portability | M | CSV import endpoint with transaction rollback on errors; export endpoint | CSV upload form; download button for reports | Support for batch operations | M |

---

## 2️⃣ ADVANCED FEATURES (Professional Product Layer)

| Feature Name | Business Value | Priority | Backend Changes | Frontend Changes | DB Changes | Complexity |
|---|---|---|---|---|---|---|
| **Advanced Search** | Find doctors/MRs by specialization, location, visit history | H | Full-text search on Doctor (name, hospital, city, specialization); Elasticsearch integration optional | Search bar with filters + autocomplete | Add `city`, `phone`, `location` to Doctor; add search indexes | M |
| **Multi-Timezone Support** | Global pharmaceutical companies operate across regions | M | Store visits/follow-ups in UTC; user timezone in profile | Display times in user's local timezone; timezone picker in settings | Add `timezone` to User; convert DateTime columns to UTC | M |
| **Soft Delete & Audit Trail** | Regulatory compliance (pharma industry); trace data modifications | H | Add `deletedAt` to all models; log CREATE/UPDATE/DELETE to AuditLog | Restore deleted items from Trash; view audit log | Add `deletedAt` to User, Doctor, Visit; new AuditLog model | M |
| **Visit Templates** | Standardize MR interactions; reduce data entry time | M | Create reusable visit templates (products, questions, follow-up schedules) | Template creation/management UI; apply template to visits | New VisitTemplate model with relations | M |
| **Geographic Territory Mapping** | Assign MRs to specific regions; optimize visit planning | H | Define territories (city/district); assign MRs to territories; route optimization | Map view of doctors/MRs by territory | New Territory model; geographic coordinates for doctors | L |

---

## 3️⃣ ENTERPRISE FEATURES (Large-Scale Organization)

| Feature Name | Business Value | Priority | Backend Changes | Frontend Changes | DB Changes | Complexity |
|---|---|---|---|---|---|---|
| **Multi-Tenant Architecture** | Support multiple pharmaceutical companies on single platform (SaaS) | XL | Add `tenantId` to all models; tenant isolation middleware; billing | Tenant switcher; isolated data views | Global refactor: add `tenantId` FK to all tables | XL |
| **Advanced RBAC (Teams/Departments)** | Larger organizations have complex reporting structures | H | Define departments, teams, supervisors; hierarchical permissions | Org chart view; role assignment UI | New Department, Team models; redesign permissions system | L |
| **Approval Workflows** | High-value visits need manager sign-off before confirmation | M | Visit lifecycle: DRAFT → PENDING_APPROVAL → APPROVED/REJECTED | Visit submission form; manager approval queue | Add `status` field progression to Visit; approval metadata | M |
| **Budget & Sample Management** | Track pharmaceutical samples given; prevent over-spending | M | Sample inventory CRUD; budget limits per MR; consumption tracking | Sample allocation dashboard; low-stock alerts | New Sample, Budget, InventoryLog models | M |
| **Integration Framework (APIs)** | Allow customers to integrate with their CRM/ERP systems | M | REST + GraphQL APIs; API keys for auth; rate limiting; webhooks | N/A (backend-only) | Add ApiKey model; audit API usage | M |

---

## 4️⃣ AI/ML FEATURES (Intelligent Product)

| Feature Name | Business Value | Priority | Backend Changes | Frontend Changes | DB Changes | Complexity |
|---|---|---|---|---|---|---|
| **Smart Follow-Up Recommendations** | AI suggests optimal follow-up timing based on doctor engagement patterns | M | ML model: predict best follow-up date; train on historical visit/follow-up data | Show recommended follow-up dates with confidence score | N/A (inference only) | L |
| **Doctor Engagement Scoring** | Predict which doctors are high-value; prioritize MR visits | M | Calculate engagement score from visit frequency, purchase history, response rates | Color-code doctors (hot/warm/cold); rank by engagement | Add `engagementScore` to Doctor; engagement metrics table | M |
| **Churn Prediction** | Identify doctors at risk of disengaging; trigger intervention | M | ML model: predict doctor churn risk; send alerts to MRs | Churn risk badges on doctor cards; intervention suggestions | N/A | L |
| **Visit Success Prediction** | Before a visit, estimate likelihood of positive outcome | M | ML model trained on doctor profile, MR history, time factors; give success probability | Show success prediction % on visit planning UI | N/A | L |
| **Automated Meeting Notes Transcription** | Record visit audio/video; auto-generate notes | M | Support audio upload; integrate speech-to-text API (Google/Azure); store transcripts | Audio recorder in visit form; transcript display | Add `audioUrl`, `transcriptText` to Visit | M |

---

## 5️⃣ REPORTING FEATURES (Business Intelligence Layer)

| Feature Name | Business Value | Priority | Backend Changes | Frontend Changes | DB Changes | Complexity |
|---|---|---|---|---|---|---|
| **Custom Report Builder** | Allow admins to create ad-hoc reports without coding | M | Query builder backend; predefined dimensions (date, doctor, MR, status) | Drag-and-drop report designer; save templates | N/A | L |
| **Scheduled Report Generation** | Email performance reports daily/weekly/monthly | M | Job queue (BullMQ) to generate reports on schedule; email integration | Schedule UI in settings; view sent reports history | New ScheduledReport model | M |
| **PDF Export** | Download reports, visit summaries for external sharing | M | PDF generation library (pdf-lib or puppeteer); use templates | Export button on all pages; preview before download | N/A | S |
| **Data Pipeline & ETL** | Move data to warehouse for analytics; BI tool integration | M | Data export jobs; support CSV, Parquet, or direct warehouse sync | N/A | N/A | L |

---

## 6️⃣ ANALYTICS & BI FEATURES (Data-Driven Insights)

| Feature Name | Business Value | Priority | Backend Changes | Frontend Changes | DB Changes | Complexity |
|---|---|---|---|---|---|---|
| **Real-Time Analytics Dashboard** | Executives see live KPIs: total visits, conversion rates, MR productivity | H | Aggregated stats endpoint; cache with Redis (1-min TTL) | Real-time chart updates (Socket.io); KPI cards | Add analytics cache layer | M |
| **Funnel Analysis** | Track doctor journey: first contact → purchase (conversion funnel) | M | Define stages; calculate conversion rates between stages | Funnel visualization chart | Add stage/funnel metadata to Doctor | M |
| **Cohort Analysis** | Segment MRs/doctors by registration date; track retention | M | Group data by cohorts; retention calculations | Cohort retention table/heatmap | N/A | M |
| **Attribution Modeling** | Understand which MR touchpoints drive conversions | M | Track attribution (first-touch, last-touch, multi-touch); assign credit | Attribution breakdown in reports | N/A | L |

---

## 7️⃣ MOBILE APP FEATURES (React Native / PWA)

| Feature Name | Business Value | Priority | Backend Changes | Frontend Changes | DB Changes | Complexity |
|---|---|---|---|---|---|---|
| **Progressive Web App (PWA)** | MRs in field can access app offline; install on home screen | H | Add service worker; API caching layer | Build PWA manifest; offline-first sync using Service Workers | N/A | M |
| **Mobile App (React Native)** | Native iOS/Android app for better UX, GPS, camera access | M | Same REST APIs; add push notification endpoints | React Native version of frontend | N/A | XL |
| **Geolocation & Route Optimization** | Show nearby doctors; optimize visit order for efficiency | M | Maps/distance APIs; route calculation backend | Google Maps integration; route visualization | Add doctor coordinates | M |
| **Offline Visit Sync** | Log visits offline; sync when connection restored | M | Conflict resolution; last-write-wins merging | Queue UI for pending sync; sync status indicator | Add `syncedAt`, `pendingSync` flags | M |

---

## 8️⃣ ADMIN FEATURES (System Management)

| Feature Name | Business Value | Priority | Backend Changes | Frontend Changes | DB Changes | Complexity |
|---|---|---|---|---|---|---|
| **User Management Dashboard** | Invite/suspend MRs; reset passwords; manage roles | H | User CRUD endpoints; email invitations with tokens; bulk operations | User table with actions; role assignment | Add `isActive`, `invitedAt`, `lastLoginAt` to User | M |
| **System Health Monitor** | Admins see API uptime, error rates, database performance | M | Expose health check endpoint; log errors to centralized logging | Dashboard with health metrics; error logs viewer | Add HealthLog model | M |
| **Feature Flags & Config Manager** | Enable/disable features per tenant without code changes | M | Feature flag service; dynamic config retrieval | Admin panel for flag toggles | New FeatureFlag model | S |
| **Bulk Email/SMS Communications** | Send announcements, training materials to MRs | M | Email/SMS integration (SendGrid, Twilio); template system; delivery tracking | Email/SMS campaign builder | New Campaign, CampaignLog models | M |

---

## 9️⃣ MR (Field Rep) FEATURES (Field Efficiency)

| Feature Name | Business Value | Priority | Backend Changes | Frontend Changes | DB Changes | Complexity |
|---|---|---|---|---|---|---|
| **Smart Visit Scheduler** | AI-powered daily visit plan: which doctors to visit today, in optimal order | H | Route optimization algorithm; consider doctor preferences, geolocation | Recommended visit schedule; map-based route planning | N/A | M |
| **Voice-to-Text Visit Notes** | MRs record visit notes while driving; transcribed automatically | M | Voice upload + speech-to-text API integration | Audio recorder; transcript display/edit | Add `voiceNoteUrl`, `transcriptText` to Visit | M |
| **Doctor Preference Profiles** | Track doctor's preferred contact time, product interests, allergies to certain products | M | Doctor profile builder; preference CRUD | Edit doctor preferences modal | Add `preferences`, `tags` to Doctor | S |
| **Performance Scoring & Leaderboards** | Gamify: show top MRs; motivate performance improvements | M | Calculate performance metrics; leaderboard algorithm | Leaderboard page; personal score card | Add performance metrics table | M |

---

## 🔟 DOCTOR ENGAGEMENT FEATURES (Customer Relationship)

| Feature Name | Business Value | Priority | Backend Changes | Frontend Changes | DB Changes | Complexity |
|---|---|---|---|---|---|---|
| **Doctor Portal / Patient-Facing Login** | Doctors can view: which products discussed, MR contacts, prescription requests | M | Separate auth flow; doctor endpoints; secure access | Doctor login; minimal dashboard showing recent interactions | Add `doctorLoginEnabled` to Doctor; Doctor auth table | M |
| **Appointment Booking** | MRs can request slots; doctors confirm availability | M | Scheduling backend (calendar slots, blocking, reminders) | Calendar UI; booking request system | New Appointment, TimeSlot models | M |
| **Product Catalog & Ordering** | Doctors browse pharmaceutical products; request samples | M | Product CRUD; order management; inventory sync | Product catalog view; shopping cart interface | New Product, Order, OrderItem models | M |
| **Doctor Feedback & Surveys** | Collect product feedback, clinical outcomes via surveys | M | Survey builder; response collection; analytics | Survey form builder; survey responses viewer | New Survey, SurveyResponse models | M |

---

## 1️⃣1️⃣ SECURITY IMPROVEMENTS (Compliance & Protection)

| Feature Name | Business Value | Priority | Backend Changes | Frontend Changes | DB Changes | Complexity |
|---|---|---|---|---|---|---|
| **Two-Factor Authentication (2FA)** | Enhanced account security; prevent unauthorized access | H | TOTP support (via totp lib); backup codes | QR code scanner; 2FA setup wizard | Add `totpSecret`, `backupCodes` to User | M |
| **Data Encryption at Rest** | Encrypt sensitive doctor data (phone numbers, addresses) | M | Encrypt fields before saving to DB; decrypt on retrieval | N/A (transparent) | Use database field-level encryption or application-level | M |
| **Encryption in Transit** | Enforce HTTPS; rate limiting to prevent brute force | H | HTTPS only; rate limiting middleware; CORS hardening | N/A | N/A | S |
| **HIPAA/GDPR Compliance** | Meet healthcare data protection regulations | H | Data retention policies; right-to-be-forgotten (bulk delete); consent logging | Privacy policy; consent forms | Add consent/compliance audit tables | M |
| **Role-Based Access Control (RBAC) Hardening** | Fine-grained permissions; principle of least privilege | M | Redesign permission model (view/edit/delete per resource type) | Permission management UI for role configuration | New Permission, RolePermission models | M |

---

## 1️⃣2️⃣ NOTIFICATION SYSTEM (Multi-Channel Communication)

| Feature Name | Business Value | Priority | Backend Changes | Frontend Changes | DB Changes | Complexity |
|---|---|---|---|---|---|---|
| **In-App Notifications** | Real-time alerts for follow-ups due, new assignments, approvals | H | Notification service; real-time delivery (Socket.io or webhook polling) | Notification bell icon; notification center modal | New Notification model | M |
| **Email Notifications** | Reminders, summaries, alerts sent to email | H | Email service integration (SendGrid/nodemailer); templates; scheduling | N/A (backend-only) | N/A | S |
| **SMS Notifications** | Critical alerts for MRs in field (e.g., urgent follow-ups) | M | SMS integration (Twilio); fallback to email if SMS fails | SMS delivery tracking UI | New SmsLog model | S |
| **Push Notifications (Mobile)** | App notifications for mobile app users; reminders, alerts | M | FCM/APNs integration; device token registration | Push subscription in app settings | New DeviceToken, PushLog models | M |

---

## 1️⃣3️⃣ WORKFLOW AUTOMATION (Operational Efficiency)

| Feature Name | Business Value | Priority | Backend Changes | Frontend Changes | DB Changes | Complexity |
|---|---|---|---|---|---|---|
| **Auto-Generated Follow-Ups** | When visit marked COMPLETED, auto-create follow-up (e.g., 7 days later) | M | Automation engine; scheduled job (BullMQ) to create follow-ups | N/A (backend-only) | N/A | S |
| **Escalation Rules** | If doctor not visited in 30 days, escalate to manager; trigger alert | M | Business rules engine; scheduled job for rule evaluation; escalation workflow | Escalation alerts on dashboard | New EscalationRule, Alert models | M |
| **Form Field Customization** | Admins customize form fields (product dropdown, sampling questions) without code | M | Dynamic form schema storage; form builder backend | No-code form builder UI | New FormSchema, FormField models | M |
| **Conditional Workflows** | If doctor NOT_INTERESTED, trigger specific follow-up email template | M | Workflow engine; define conditions + actions | Workflow builder UI (if-then rules) | New Workflow, WorkflowRule models | L |

---

## 1️⃣4️⃣ PERFORMANCE OPTIMIZATIONS (Speed & Reliability)

| Feature Name | Business Value | Priority | Backend Changes | Frontend Changes | DB Changes | Complexity |
|---|---|---|---|---|---|---|
| **Redis Caching Layer** | Cache frequently accessed data (doctors, top MRs, dashboards); reduce DB load | H | Implement Redis cache; cache invalidation strategy; TTLs | Optimistic UI updates | N/A | M |
| **Database Query Optimization** | Add indexes; query optimization; avoid N+1 queries | H | Query profiling; strategic indexing; use eager loading (Prisma select/include) | N/A | Strategic indexes on (userId, doctorId, status, createdAt) | M |
| **Lazy Loading & Code Splitting** | Load dashboard features only when needed; improve initial page load | M | N/A | Route-based code splitting; lazy load heavy components | N/A | S |
| **CDN for Static Assets** | Serve images, JS, CSS from global CDN; reduce latency | M | CloudFront or similar; versioned asset filenames | Configure Vite for CDN-friendly asset paths | N/A | S |
| **API Response Compression** | Gzip compress all API responses; reduce bandwidth 70% | S | Enable gzip middleware on Express | Browser automatically handles | N/A | S |

---

## 1️⃣5️⃣ DEPLOYMENT ARCHITECTURE (DevOps & Infrastructure)

| Feature Name | Business Value | Priority | Backend Changes | Frontend Changes | DB Changes | Complexity |
|---|---|---|---|---|---|---|
| **Docker & Docker Compose** | Containerize backend/frontend/database for consistent deployments | H | Create Dockerfile for Node.js backend; optimize image size | Create Dockerfile for React frontend (multi-stage build) | Docker Compose for local dev | M |
| **CI/CD Pipeline (GitHub Actions)** | Automated testing, linting, deployment on every push | H | Setup GH Actions: lint, test, build, deploy; auto-deploy to staging | Same GH Actions workflow | N/A | M |
| **Kubernetes Deployment** | Auto-scaling, rolling updates, high availability for production | L | Create K8s manifests (deployment, service, ingress, configmap); Helm charts | N/A | N/A | XL |
| **AWS/GCP/Azure Cloud Setup** | Deploy to managed cloud platform (RDS for DB, ECS/App Engine for app, S3 for storage) | H | Environment-specific configs; secrets management | Build optimization for cloud deployment | RDS MySQL instance; CloudSQL for GCP | M |
| **Monitoring & Logging** | Centralized logs (DataDog, New Relic, ELK); error tracking (Sentry) | M | Send logs to logging service; error/exception tracking | Frontend error reporting to Sentry | N/A | S |

---

## 1️⃣6️⃣ DATABASE IMPROVEMENTS (Schema & Scaling)

| Feature Name | Business Value | Priority | Backend Changes | Frontend Changes | DB Changes | Complexity |
|---|---|---|---|---|---|---|
| **Schema Normalization & Redesign** | Optimize current schema: add missing relationships, prevent data anomalies | H | Refactor schema for multi-tenant, audit trail, soft deletes | N/A | Major schema redesign (see revised schema below) | M |
| **Indexing Strategy** | Add indexes on high-query columns (userId, doctorId, createdAt, status) | H | Query analysis; index creation scripts | N/A | Strategic indexes across all tables | S |
| **Read Replicas & Sharding** | Scale read operations; shard data by tenant or region for high volume | L | Prisma connection pooling; read replica support | N/A | Setup MySQL read replicas; shard key strategy | L |
| **Database Backup & Recovery** | Automated daily backups; point-in-time restore capability | M | Backup automation (AWS RDS auto-backup or custom scripts) | N/A | Backup configurations | S |

---

## 1️⃣7️⃣ AUDIT & ACTIVITY TRACKING (Compliance & Forensics)

| Feature Name | Business Value | Priority | Backend Changes | Frontend Changes | DB Changes | Complexity |
|---|---|---|---|---|---|---|
| **Complete Audit Log** | Log all CREATE/UPDATE/DELETE actions with user, timestamp, old/new values | H | Audit middleware; capture all changes | Audit log viewer page (filterable by user, resource, action) | New AuditLog model with detailed change tracking | M |
| **User Activity Timeline** | See all actions taken by a specific user (visits created, doctors updated, etc.) | M | Activity aggregation; timeline service | User activity timeline view | Add activity materialization view | M |
| **Data Change History** | Show history of changes to a doctor or visit; restore to previous state | M | Versioning system; store snapshots of data | View change history modal; restore buttons | Add history tables for key models | M |

---

## 1️⃣8️⃣ ROLE MANAGEMENT ENHANCEMENTS (RBAC → ABAC)

| Feature Name | Business Value | Priority | Backend Changes | Frontend Changes | DB Changes | Complexity |
|---|---|---|---|---|---|---|
| **Attribute-Based Access Control (ABAC)** | Move beyond fixed roles; permissions based on attributes (e.g., "can edit doctors in my region only") | M | Implement ABAC engine; decision logic for resource-level permissions | Permission matrix UI | New RoleAttribute, ResourceAttribute models | L |
| **Custom Roles & Permissions** | Admins define roles (e.g., "Regional Manager", "Data Analyst") with granular permissions | M | Role + permission CRUD; permission inheritance | Role builder UI; permission assignment matrix | New Role, Permission, RolePermission models | M |
| **Delegated Admin** | Allow admins to delegate specific permissions to MRs (e.g., "edit own team's doctors") | M | Delegation logic; hierarchical permissions | Delegation UI in user management | New DelegatedPermission model | M |

---

## 1️⃣9️⃣ SAAS MULTI-TENANT ARCHITECTURE (Hosting Multiple Companies)

| Feature Name | Business Value | Priority | Backend Changes | Frontend Changes | DB Changes | Complexity |
|---|---|---|---|---|---|---|
| **Multi-Tenant Data Isolation** | Each pharmaceutical company's data isolated; transparent tenant filtering on all queries | XL | Add tenantId to all queries; tenant middleware; billing per tenant | Tenant switcher; isolated dashboards/data views | Global schema redesign: add tenantId to all models | XL |
| **Per-Tenant Customization** | Each customer can customize: product catalog, form fields, permissions, branding | H | Multi-tenant feature flag system; theme/config per tenant; custom domain support | Theme switcher; white-label branding (logo, colors) | New TenantConfig, CustomField models | M |
| **Billing & Usage Metering** | Track usage (API calls, users, storage); bill by tier (Starter, Pro, Enterprise) | M | Usage tracking; metering logic; billing API integration (Stripe) | Usage dashboard for admins | New Usage, BillingEvent, Invoice models | M |
| **Onboarding Workflow** | New customer signup → tenant creation → team setup → training | M | Onboarding checklist; multi-step setup wizard backend | Onboarding flow UI; progress tracking | New Onboarding, OnboardingStep models | M |

---

## 🌟 FUTURE SCALING FEATURES (Next Horizon)

| Feature Name | Business Value | Priority | Backend Changes | Frontend Changes | DB Changes | Complexity |
|---|---|---|---|---|---|---|
| **AI-Powered Virtual Pharma Rep** | Chatbot that engages doctors, provides product info, schedules appointments | L | LLM integration (GPT-4, Claude); RAG with product knowledge base; conversation history | Chat widget on doctor portal | New ChatConversation model | L |
| **Doctor Network Effects** | Doctors see: peers' experiences with products, community recommendations, case studies | L | Graph database for doctor relationships; community features | Doctor community feed; peer recommendations | N/A | L |
| **Supply Chain Integration** | Track pharmaceutical samples: manufacturing → MR inventory → doctor consumption | L | Integration with manufacturing systems; supply chain APIs | Supply chain dashboard | New SupplyChain, InventoryMovement models | L |
| **Prescription Integration** | MRs log prescriptions written by doctors post-visit; tie to sample distribution | M | Prescription tracking; sync with pharmacy systems (API integration) | Prescription logging UI; ROI calculator (samples → prescriptions) | New Prescription model | M |
| **Competitive Intelligence** | Alerts when competitor MRs visit same doctor; market share tracking | L | Competitor tracking logic; market intelligence aggregation | Competitive dashboard; win/loss analysis | New CompetitorActivity model | L |

---

## 📊 PHASED ROADMAP & PORTFOLIO NARRATIVE

### **PHASE 1: MVP Polish (Weeks 1-4)**
**Tagline**: *"Production-Ready Foundation"*
**What It Tells Recruiters**: You can ship production features, handle edge cases, and think about UX holistically.

**Included Features**:
1. Must-Have Features (all 5)
2. Form validations & error handling
3. Pagination & filtering
4. Soft deletes & basic audit trail
5. HTTPS + rate limiting
6. PDF export reports

**Deliverables**:
- Polished UI with Tailwind refinements
- Comprehensive error handling
- API documentation (Swagger)
- Basic deployment (Docker)

**Metrics to Showcase**:
- 95% code coverage on critical paths
- <500ms API response times (p95)
- Accessibility: WCAG AA compliance
- Load test: 100+ concurrent users on dashboard

**Tech Stack Additions**:
- `swagger-ui-express` + `swagger-jsdoc` for API docs
- `compression` middleware for gzip
- `helmet` for security headers
- `joi` or `zod` for input validation

**Prisma Schema Updates**:
```prisma
// Add audit trail, soft deletes, timestamps
model AuditLog {
  id        Int
  userId    Int
  action    String
  resource  String
  changes   Json
  createdAt DateTime @default(now())
}

// Update User, Doctor, Visit with soft delete + audit
model User {
  // ... existing fields
  deletedAt DateTime?
  updatedAt DateTime @updatedAt
}
```

**Estimated Effort**: 3-4 weeks for solo dev | **Impact**: Transforms MVP into professional product

---

### **PHASE 2: Professional Product Features (Weeks 5-12)**
**Tagline**: *"Enterprise-Ready SaaS Platform"*
**What It Tells Recruiters**: You understand product strategy, can implement complex workflows, and build scalable features.

**Included Features**:
1. Advanced search with filters & full-text search
2. Visit templates & template engine
3. Territory management & geo-mapping
4. Advanced RBAC (teams, departments, supervisors)
5. In-app notifications + email notifications
6. Real-time analytics dashboard with Redis caching
7. User management admin panel
8. Multi-timezone support
9. Approval workflows for visits
10. Sample inventory management

**Deliverables**:
- Feature-complete admin dashboard
- Real-time KPI dashboard for executives
- Advanced search with 10+ filters
- Notification center with delivery tracking
- Maps integration (Google Maps) for territories

**Metrics to Showcase**:
- 50K+ doctors searchable in <100ms (full-text + cache)
- Real-time dashboard updates (sub-1s latency with Socket.io)
- 5000+ concurrent active users supported (Redis + connection pooling)
- Territory-based visit planning reduces travel time 30%

**Tech Stack Additions**:
- `redis` for caching & session management
- `socket.io` for real-time notifications
- `elasticsearch` for advanced search (optional, fallback to MySQL FT)
- `bullmq` for job scheduling (auto-follow-ups, notifications)
- `leaflet.js` or `google-maps-react` for maps
- `nodemailer` + template engine for email

**Prisma Schema Updates**:
```prisma
// New models for advanced features
model Territory {
  id    Int
  name  String
  city  String
  // geographic boundaries
}

model RolePermission {
  id        Int
  roleId    Int
  resource  String // "doctor", "visit", etc.
  action    String // "view", "edit", "delete"
}

model Department {
  id   Int
  name String
}

model Notification {
  id        Int
  userId    Int
  type      String
  message   String
  isRead    Boolean @default(false)
  createdAt DateTime @default(now())
}

model VisitTemplate {
  id       Int
  tenantId Int
  name     String
  // fields for reusable visit structure
}
```

**Estimated Effort**: 6-8 weeks for solo dev or small team (2-3 devs) | **Impact**: Competitive feature parity with enterprise platforms

---

### **PHASE 3: Enterprise & AI-Powered Features (Weeks 13-24)**
**Tagline**: *"Intelligent, Multi-Tenant SaaS"*
**What It Tells Recruiters**: You can architect multi-tenant systems, integrate AI, and scale to thousands of users.

**Included Features**:
1. Multi-tenant architecture (SaaS foundation)
2. Custom role & ABAC permissions
3. AI-powered smart visit scheduler
4. Engagement scoring & churn prediction
5. Doctor portal & appointment booking
6. Advanced reporting & ETL pipeline
7. Mobile app (React Native) / PWA
8. 2FA & encryption at rest
9. Workflow automation engine
10. Supply chain integration (sample tracking)
11. Bulk email/SMS campaigns
12. Scheduled report generation

**Deliverables**:
- Multi-tenant database with isolation
- AI models deployed (engagement scoring, churn)
- React Native mobile app on iOS/Android
- PWA with offline sync
- Booking/appointment calendar system
- Custom report builder UI
- Workflow automation rules engine

**Metrics to Showcase**:
- Support 10+ concurrent tenants (distinct pharmaceutical companies)
- AI churn prediction: 85% accuracy on historical data
- Mobile app: 4.5/5 stars on app stores
- Workflow automation: 60% reduction in manual follow-ups

**Tech Stack Additions**:
- `python` + `scikit-learn` / `tensorflow` for ML models (separate service)
- `prisma` multi-schema support for tenants (or schema per tenant)
- `stripe` for billing
- `twilio` for SMS notifications
- `expo` or `react-native-cli` for mobile app
- `graphql` for advanced querying (optional)
- `kafka` or `bullmq` for event streaming
- `puppeteer` for PDF generation

**Prisma Schema Major Update**:
```prisma
// Multi-tenant foundation
model Tenant {
  id        Int
  name      String
  // billing, custom fields, etc.
}

// Add tenantId to ALL models
model User {
  id        Int
  tenantId  Int
  // ... existing
  tenant    Tenant @relation(fields: [tenantId], references: [id])
}

// AI features
model EngagementScore {
  id        Int
  doctorId  Int
  score     Float
  calculatedAt DateTime
}

model ChurnPrediction {
  id          Int
  doctorId    Int
  riskScore   Float
  confidence  Float
  actions     String[] // recommended interventions
}

// Workflow automation
model Workflow {
  id        Int
  tenantId  Int
  name      String
  triggers  Json // if conditions
  actions   Json // then actions
  isActive  Boolean
}

// Booking/appointments
model TimeSlot {
  id        Int
  doctorId  Int
  date      DateTime
  startTime String
  endTime   String
  isAvailable Boolean
}

model Appointment {
  id        Int
  slotId    Int
  mrId      Int
  status    String // REQUESTED, CONFIRMED, CANCELLED
}
```

**Estimated Effort**: 8-12 weeks for team (3-4 devs: backend, frontend, ML eng, DevOps) | **Impact**: Enterprise-grade platform competitive with established SaaS solutions

---

### **PHASE 4: Advanced AI & Global Scale (Weeks 25-36)**
**Tagline**: *"AI-Driven Medical Sales Intelligence"*
**What It Tells Recruiters**: You can ship cutting-edge AI products, manage large-scale distributed systems, and think like a product leader.

**Included Features**:
1. LLM-powered virtual pharma rep chatbot
2. Multi-language support (LLM translations)
3. Kubernetes auto-scaling deployment
4. Advanced analytics with BI tool integration (Tableau/Metabase)
5. Doctor network analysis & peer recommendations
6. Prescription ROI tracking
7. Competitive intelligence module
8. Supply chain visibility dashboard
9. Doctor community platform
10. Prescription-to-follow-up automation

**Deliverables**:
- Chatbot UI with doctor interaction history
- Kubernetes cluster with auto-scaling policies
- Analytics warehouse integration (BigQuery/Redshift)
- Interactive BI dashboards (Metabase)
- Doctor network graph visualization
- Competitive activity monitoring dashboard
- Supply chain tracking end-to-end

**Metrics to Showcase**:
- Chatbot handles 10K+ doctor interactions/month
- 99.9% uptime SLA with K8s auto-recovery
- Analytics query response <5s on 100M+ records
- Supply chain: 95% sample tracking accuracy
- Competitive intelligence alerts triggered 1000+ times/month

**Tech Stack Additions**:
- `kubernetes` (EKS/GKE) with Helm
- `bigquery` or `redshift` for data warehouse
- `metabase` or `tableau` for BI dashboards
- `langchain` or `llama-index` for LLM pipelines
- `neo4j` for doctor relationship graph (optional)
- `datadog` or `new-relic` for observability
- `vault` for secrets management

**Final Prisma Schema (Post-Everything)**:
```prisma
// See "REVISED PRISMA SCHEMA OUTLINE" section below
```

**Estimated Effort**: 10-15 weeks for larger team (5-7 devs) | **Impact**: Industry-leading AI-powered medical sales platform

---

## 🏗️ REVISED PRISMA SCHEMA OUTLINE
### (Post-all-phases, production-ready multi-tenant schema)

```prisma
// ============ CORE MULTI-TENANT ============
model Tenant {
  id                Int     @id @default(autoincrement())
  name              String
  legalName         String
  website           String?
  logo              String?
  isPaused          Boolean @default(false)
  billingEmail      String
  createdAt         DateTime @default(now())
  
  // Relations
  users             User[]
  doctors           Doctor[]
  visits            Visit[]
  followups         FollowUp[]
  permissions       Permission[]
  departments       Department[]
  territories       Territory[]
  customFields      CustomField[]
  templates         VisitTemplate[]
  workflows         Workflow[]
  auditLogs         AuditLog[]
  
  @@unique([name])
}

// ============ USER & AUTH ============
enum Role {
  SUPER_ADMIN
  ADMIN
  MANAGER
  MR
  DOCTOR
  DATA_ANALYST
}

model User {
  id            Int      @id @default(autoincrement())
  tenantId      Int
  email         String   @unique
  password      String
  name          String
  phone         String?
  role          Role     @default(MR)
  
  // Profile
  profilePhoto  String?
  department    String?
  timezone      String   @default("UTC")
  
  // Auth & Security
  isActive      Boolean  @default(true)
  isVerified    Boolean  @default(false)
  totpSecret    String?  // 2FA
  backupCodes   String[] // 2FA recovery
  lastLoginAt   DateTime?
  passwordChangedAt DateTime?
  
  // Tenant & Hierarchy
  supervisorId  Int?     // For manager relationships
  supervisor    User?    @relation("Supervision", fields: [supervisorId], references: [id])
  subordinates  User[]   @relation("Supervision")
  
  // Soft Delete & Audit
  deletedAt     DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  // Relations
  tenant        Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  visits        Visit[]
  followups     FollowUp[]
  auditLogs     AuditLog[]
  notifications Notification[]
  deviceTokens  DeviceToken[]
  customRoles   CustomRole[]
  delegatedPerms DelegatedPermission[]
  
  @@unique([tenantId, email])
  @@index([tenantId, role])
  @@index([supervisorId])
}

model DoctorUser {
  id        Int @id @default(autoincrement())
  doctorId  Int @unique
  userId    Int @unique
  doctor    Doctor @relation(fields: [doctorId], references: [id], onDelete: Cascade)
  user      User @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
}

// ============ DOCTOR & HEALTHCARE ============
model Doctor {
  id                Int     @id @default(autoincrement())
  tenantId          Int
  
  // Core Info
  name              String
  hospitalName      String?
  specialization    String?
  phone             String?
  email             String?
  address           String?
  city              String?
  latitude          Float?  // For geo-mapping
  longitude         Float?
  
  // Doctor Profile
  registrationNo    String? // Medical registration number
  licenseNo         String?
  qualifications    String[]
  yearsOfExperience Int?
  npi               String? // US: National Provider Identifier
  
  // Engagement Tracking
  engagementScore   Float   @default(0)
  churnRiskScore    Float   @default(0)
  lastVisitDate     DateTime?
  visitCount        Int     @default(0)
  
  // Preferences & Tags
  preferences       Json?   // e.g., { "preferredTime": "9AM", "interests": ["Cardiology"] }
  tags              String[]
  category          String? // Hot/Warm/Cold
  
  // Soft Delete & Audit
  deletedAt         DateTime?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  // Relations
  tenant            Tenant  @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  visits            Visit[]
  followups         FollowUp[]
  appointments      Appointment[]
  prescriptions     Prescription[]
  surveys           Survey[]
  engagementMetrics EngagementMetric[]
  
  @@unique([tenantId, registrationNo])
  @@index([tenantId, city])
  @@index([tenantId, engagementScore])
  @@index([tenantId, lastVisitDate])
  @@fulltext([name, hospitalName])
}

// ============ VISIT & ACTIVITY ============
enum VisitStatus {
  DRAFT
  PENDING_APPROVAL
  APPROVED
  SCHEDULED
  PENDING
  COMPLETED
  CANCELLED
  NOT_INTERESTED
}

model Visit {
  id                  Int       @id @default(autoincrement())
  tenantId            Int
  userId              Int       // MR who logged the visit
  doctorId            Int
  
  visitDate           DateTime
  notes               String?   @db.Text
  productsDiscussed   String?   @db.Text
  samplesGiven        Int       @default(0)
  nextActionDate      DateTime?
  
  // Advanced Tracking
  status              VisitStatus @default(PENDING)
  successPrediction   Float?    // AI: likelihood of positive outcome (0-1)
  isApprovalRequired  Boolean   @default(false)
  approvedBy          Int?      // Admin who approved
  approvedAt          DateTime?
  
  // Recording
  audioUrl            String?   // Voice recording
  transcriptText      String?   @db.Text // Transcribed notes
  photoUrl            String?   // Doctor meeting photo
  
  // Soft Delete & Audit
  deletedAt           DateTime?
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
  
  // Relations
  tenant              Tenant    @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  user                User      @relation(fields: [userId], references: [id], onDelete: Restrict)
  doctor              Doctor    @relation(fields: [doctorId], references: [id], onDelete: Restrict)
  followups           FollowUp[]
  orders              Order[]
  
  @@index([tenantId, userId, visitDate])
  @@index([tenantId, doctorId])
  @@index([tenantId, status])
}

model FollowUp {
  id          Int       @id @default(autoincrement())
  tenantId    Int
  visitId     Int
  
  notes       String?   @db.Text
  nextDate    DateTime
  status      String    @default("PENDING") // PENDING, COMPLETED, RESCHEDULED
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  tenant      Tenant    @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  visit       Visit     @relation(fields: [visitId], references: [id], onDelete: Cascade)
  
  @@index([tenantId, nextDate])
  @@index([tenantId, status])
}

// ============ APPOINTMENTS & BOOKING ============
model TimeSlot {
  id          Int     @id @default(autoincrement())
  tenantId    Int
  doctorId    Int
  
  date        DateTime
  startTime   String  // HH:mm format
  endTime     String
  isAvailable Boolean @default(true)
  
  createdAt   DateTime @default(now())
  
  // Relations
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  doctor      Doctor   @relation(fields: [doctorId], references: [id], onDelete: Cascade)
  appointments Appointment[]
  
  @@unique([doctorId, date, startTime])
  @@index([doctorId, date])
}

model Appointment {
  id          Int     @id @default(autoincrement())
  tenantId    Int
  slotId      Int
  mrId        Int     // User (MR)
  doctorId    Int
  
  status      String  @default("REQUESTED") // REQUESTED, CONFIRMED, REJECTED, CANCELLED, COMPLETED
  notes       String?
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  slot        TimeSlot @relation(fields: [slotId], references: [id], onDelete: Cascade)
  doctor      Doctor   @relation(fields: [doctorId], references: [id], onDelete: Restrict)
  
  @@index([tenantId, status])
  @@index([mrId, createdAt])
}

// ============ PRODUCTS & ORDERS ============
model Product {
  id          Int     @id @default(autoincrement())
  tenantId    Int
  
  name        String
  description String? @db.Text
  category    String  // e.g., "Cardiology", "Oncology"
  image       String?
  dosage      String?
  price       Float?
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  orders      OrderItem[]
  
  @@index([tenantId, category])
}

model Order {
  id          Int     @id @default(autoincrement())
  tenantId    Int
  visitId     Int
  
  status      String  @default("PENDING") // PENDING, APPROVED, SHIPPED, DELIVERED
  quantity    Int
  totalPrice  Float?
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  visit       Visit    @relation(fields: [visitId], references: [id], onDelete: Restrict)
  items       OrderItem[]
  
  @@index([tenantId, status])
}

model OrderItem {
  id          Int     @id @default(autoincrement())
  orderId     Int
  productId   Int
  quantity    Int
  price       Float
  
  // Relations
  order       Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product     Product @relation(fields: [productId], references: [id], onDelete: Restrict)
  
  @@unique([orderId, productId])
}

// ============ PRESCRIPTIONS ============
model Prescription {
  id          Int     @id @default(autoincrement())
  tenantId    Int
  doctorId    Int
  
  productName String
  dosage      String?
  quantity    Int
  prescribedDate DateTime
  notes       String?
  
  createdAt   DateTime @default(now())
  
  // Relations
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  doctor      Doctor   @relation(fields: [doctorId], references: [id], onDelete: Restrict)
  
  @@index([tenantId, doctorId, prescribedDate])
}

// ============ SURVEYS & FEEDBACK ============
model Survey {
  id          Int     @id @default(autoincrement())
  tenantId    Int
  doctorId    Int?    // Optional: can be general survey
  
  title       String
  description String? @db.Text
  questions   Json    // Array of {question, type, options}
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  doctor      Doctor?  @relation(fields: [doctorId], references: [id], onDelete: SetNull)
  responses   SurveyResponse[]
  
  @@index([tenantId, doctorId])
}

model SurveyResponse {
  id          Int     @id @default(autoincrement())
  surveyId    Int
  responderId Int?    // User (doctor or MR)
  
  answers     Json    // {questionId: answer}
  
  createdAt   DateTime @default(now())
  
  // Relations
  survey      Survey  @relation(fields: [surveyId], references: [id], onDelete: Cascade)
  
  @@index([surveyId])
}

// ============ TEMPLATES & CUSTOMIZATION ============
model VisitTemplate {
  id          Int     @id @default(autoincrement())
  tenantId    Int
  
  name        String
  description String?
  fields      Json    // {fieldName: { type, required, options }}
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  
  @@unique([tenantId, name])
}

model CustomField {
  id          Int     @id @default(autoincrement())
  tenantId    Int
  
  resourceType String // "Visit", "Doctor", "FollowUp"
  fieldName   String
  fieldType   String  // "text", "select", "date", etc.
  options     String[]?
  isRequired  Boolean @default(false)
  displayOrder Int
  
  // Relations
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  
  @@unique([tenantId, resourceType, fieldName])
}

// ============ WORKFLOWS & AUTOMATION ============
model Workflow {
  id          Int     @id @default(autoincrement())
  tenantId    Int
  
  name        String
  description String?
  triggers    Json    // { event: "visit_completed", conditions: {...} }
  actions     Json    // { type: "send_email", template: "...", recipients: [...] }
  isActive    Boolean @default(true)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  
  @@index([tenantId, isActive])
}

// ============ ROLES & PERMISSIONS ============
model Permission {
  id          Int     @id @default(autoincrement())
  tenantId    Int
  
  resource    String  // "visit", "doctor", "user"
  action      String  // "create", "read", "update", "delete"
  description String?
  
  // Relations
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  rolePerms   RolePermission[]
  
  @@unique([tenantId, resource, action])
}

model RolePermission {
  id            Int     @id @default(autoincrement())
  roleId        Int
  permissionId  Int
  
  // Relations
  role          CustomRole @relation(fields: [roleId], references: [id], onDelete: Cascade)
  permission    Permission @relation(fields: [permissionId], references: [id], onDelete: Cascade)
  
  @@unique([roleId, permissionId])
}

model CustomRole {
  id          Int     @id @default(autoincrement())
  userId      Int
  
  name        String  // Custom role name
  permissions RolePermission[]
  
  createdAt   DateTime @default(now())
  
  // Relations
  user        User    @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model DelegatedPermission {
  id            Int     @id @default(autoincrement())
  fromUserId    Int     // Admin delegating
  toUserId      Int     // User receiving permission
  
  resourceType  String  // "doctor", "territory"
  resourceId    Int
  action        String  // "edit", "delete"
  
  expiresAt     DateTime?
  
  // Relations
  fromUser      User    @relation("Delegator", fields: [fromUserId], references: [id], onDelete: Cascade)
  toUser        User    @relation("Delegatee", fields: [toUserId], references: [id], onDelete: Cascade)
}

// ============ TERRITORIES & REGIONS ============
model Territory {
  id          Int     @id @default(autoincrement())
  tenantId    Int
  
  name        String
  region      String?
  city        String?
  state       String?
  country     String?
  
  createdAt   DateTime @default(now())
  
  // Relations
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  
  @@unique([tenantId, name])
}

model Department {
  id          Int     @id @default(autoincrement())
  tenantId    Int
  
  name        String
  head        String?
  budget      Float?
  
  createdAt   DateTime @default(now())
  
  // Relations
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  
  @@unique([tenantId, name])
}

// ============ NOTIFICATIONS ============
model Notification {
  id          Int     @id @default(autoincrement())
  userId      Int
  
  title       String
  message     String  @db.Text
  type        String  // "visit_reminder", "approval_request", "alert"
  isRead      Boolean @default(false)
  actionUrl   String?
  
  createdAt   DateTime @default(now())
  readAt      DateTime?
  
  // Relations
  user        User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId, isRead, createdAt])
}

model DeviceToken {
  id          Int     @id @default(autoincrement())
  userId      Int
  
  token       String  @unique // FCM or APNs token
  deviceType  String  // "ios", "android", "web"
  isActive    Boolean @default(true)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  user        User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
}

// ============ AUDIT & COMPLIANCE ============
model AuditLog {
  id          Int     @id @default(autoincrement())
  tenantId    Int
  userId      Int?    // Who made the change
  
  action      String  // "CREATE", "UPDATE", "DELETE"
  resourceType String // "Doctor", "Visit", "User"
  resourceId  Int
  changes     Json?   // { old: {...}, new: {...} }
  ipAddress   String?
  userAgent   String?
  
  createdAt   DateTime @default(now())
  
  // Relations
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  
  @@index([tenantId, createdAt])
  @@index([tenantId, userId, action])
}

// ============ ENGAGEMENT & AI TRACKING ============
model EngagementMetric {
  id          Int     @id @default(autoincrement())
  doctorId    Int
  
  visitCount  Int     @default(0)
  lastVisit   DateTime?
  responseRate Float?
  conversionRate Float?
  avgTimeBetweenVisits Int? // days
  
  calculatedAt DateTime @default(now())
  
  // Relations
  doctor      Doctor  @relation(fields: [doctorId], references: [id], onDelete: Cascade)
  
  @@index([doctorId])
}

model ChurnPrediction {
  id          Int     @id @default(autoincrement())
  doctorId    Int     @unique
  
  riskScore   Float   // 0-1
  confidence  Float   // 0-1
  recommendations String[]
  
  calculatedAt DateTime @default(now())
  
  // Relations
  doctor      Doctor  @relation(fields: [doctorId], references: [id], onDelete: Cascade)
}

model SampleInventory {
  id          Int     @id @default(autoincrement())
  tenantId    Int
  
  productName String
  quantityGiven Int
  quantityReceived Int
  mrId        Int?
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
}

// ============ BILLING & USAGE (SaaS) ============
model UsageMetric {
  id          Int     @id @default(autoincrement())
  tenantId    Int     @unique
  
  apiCalls    Int     @default(0)
  activeUsers Int     @default(0)
  storageGB   Float   @default(0)
  
  month       DateTime
  
  // Relations
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  
  @@unique([tenantId, month])
}

model Invoice {
  id          Int     @id @default(autoincrement())
  tenantId    Int
  
  amount      Float
  status      String  // "PENDING", "PAID", "OVERDUE"
  month       DateTime
  dueDate     DateTime
  paidAt      DateTime?
  
  createdAt   DateTime @default(now())
  
  // Relations
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  
  @@index([tenantId, status])
}
```

---

## 💡 UPDATED TECH STACK BY PHASE

### **PHASE 1: MVP Polish**
| Component | Current | Additions |
|---|---|---|
| Backend Runtime | Node.js 18+ | (no change) |
| Framework | Express 5.x | `helmet`, `compression`, `cors` v3+ |
| ORM | Prisma 7.x | (no change) |
| Database | MySQL 8 | (no change) |
| Auth | JWT + bcrypt | `joi` or `zod` for validation |
| API Docs | None | `swagger-ui-express`, `swagger-jsdoc` |
| Frontend | React 18, Vite | `react-router-dom` v6, `axios` |
| Styling | Tailwind CSS 3 | (refinements only) |
| Deployment | Manual | Docker, Docker Compose |

### **PHASE 2: Professional Product**
| Component | Addition | Purpose |
|---|---|---|
| Cache Layer | Redis 7+ | Session + query caching (1-5 min TTL) |
| Real-Time | Socket.io 4.x | Notifications, live dashboard updates |
| Job Queue | BullMQ 3.x | Scheduled jobs, async workflows |
| Search | Elasticsearch 8 (optional) | Full-text search on 1M+ records |
| Maps | Leaflet + Google Maps API | Territory visualization, route planning |
| Email | Nodemailer + templates | Transactional + marketing emails |
| CI/CD | GitHub Actions | Lint, test, build, deploy on push |
| Monitoring | Datadog agent (free tier) | Logs, metrics, traces |

### **PHASE 3: Enterprise & AI**
| Component | Addition | Purpose |
|---|---|---|
| Billing | Stripe API | SaaS subscription management |
| SMS | Twilio | Notifications, 2FA |
| ML Pipeline | Python + scikit-learn | Engagement scoring, churn modeling |
| Mobile | React Native + Expo | iOS/Android apps |
| PWA | Workbox, Service Workers | Offline sync, app-like experience |
| BI | Metabase (self-hosted) | Custom reports, dashboards |
| Message Queue | Apache Kafka or BullMQ | Event streaming for multi-tenant |
| Encryption | `node-crypto` + `bcryptjs` | At-rest + in-transit encryption |

### **PHASE 4: Advanced AI & Scale**
| Component | Addition | Purpose |
|---|---|---|
| LLM API | OpenAI GPT-4 / Claude | Virtual pharma rep chatbot |
| Vector DB | Pinecone or Milvus | RAG for doctor-specific knowledge base |
| Orchestration | Kubernetes (EKS/GKE) | Auto-scaling, multi-region deployment |
| Data Warehouse | BigQuery or Redshift | 100M+ record analytics |
| Graph DB | Neo4j | Doctor network analysis, peer recommendations |
| Secrets | HashiCorp Vault | Secret rotation, audit trail |
| Observability | Datadog + custom metrics | 99.9% SLA monitoring |
| CDN | CloudFront or Cloudflare | Global edge caching for 50ms latency |

---

## 📋 PORTFOLIO PRESENTATION GUIDE

### **Case Study Narrative**
Frame your project as a **"Enterprise SaaS Journey"**:

1. **Problem Statement** (1 min)
   - "Pharmaceutical companies need field rep management tools, but existing solutions are $50K+/year and require IT support"
   - "Solo MRs can't track visits efficiently; lack data for management visibility"

2. **Your Solution** (2 min)
   - Built full-stack MR Tracker in 3 phases
   - **MVP**: Core CRUD, auth, basic dashboards → ships in 4 weeks
   - **Professional**: Enterprise workflows, real-time analytics, multi-timezone support → ready for 1000 users
   - **Scalable SaaS**: Multi-tenant, AI-powered recommendations, mobile app → competitive with Salesforce

3. **Technical Achievements** (3 min)
   - ✅ Full-stack: React, Node, MySQL, Prisma, Socket.io, Redis
   - ✅ Architecture: Multi-tenant database isolation, RBAC → ABAC, event-driven
   - ✅ Performance: 50K doctors searchable in <100ms (Elasticsearch + cache)
   - ✅ Reliability: Docker containerized, K8s-ready, 99.9% SLA
   - ✅ AI: Engagement scoring + churn prediction (85% accuracy)

4. **Business Impact** (2 min)
   - Reduce MR admin time 40% (automated follow-ups, smart scheduling)
   - Increase doctor visits 30% (territory optimization, engagement scoring)
   - Reduce churn 25% (early intervention via predictive alerts)

### **Metrics to Highlight**
- **Performance**: <200ms API p95, <1s dashboard loads, 99.9% uptime
- **Scale**: 10K+ concurrent users, 500K+ doctors, <100ms search
- **Code Quality**: 90%+ test coverage, 0 security vulnerabilities (Snyk)
- **Team Size**: Built by 1-5 devs (show flexibility)

### **Demo Flow**
1. **Login** (5s)
   - Show 2FA flow (security-conscious)
2. **Admin Dashboard** (15s)
   - Real-time KPI cards updating via Socket.io
   - Geographic territory map
3. **Advanced Search** (10s)
   - Filter doctors by specialization, city, engagement level
   - Show <100ms response for 100K+ records
4. **AI Insights** (10s)
   - Churn risk dashboard
   - Engagement score trends
   - Smart visit recommendations (with logic explanation)
5. **Mobile / PWA** (10s)
   - Show offline sync, geolocation, responsive design
6. **Analytics** (10s)
   - Custom report builder, funnel analysis, cohort retention

### **Artifacts to Include**
1. **Architecture Diagrams**
   - Phase-by-phase system design
   - Data flow: MR app → backend → analytics warehouse
   - Multi-tenant isolation strategy

2. **Database Schema Diagram**
   - ER diagram showing 20+ models, relationships
   - Highlight: audit trail, soft deletes, normalization

3. **Performance Benchmarks**
   - Load testing results (K6 or Artillery)
   - Query performance: index impact on search
   - Cache hit rates

4. **Security Audit**
   - OWASP Top 10 compliance checklist
   - 2FA flow diagram
   - Data encryption strategy

5. **Product Roadmap**
   - Gantt chart: Phase 1-4, timelines
   - Feature matrix: scope, priority, effort

6. **Code Samples**
   - Multi-tenant middleware (shows architecture thinking)
   - React hooks for state management (shows frontend expertise)
   - ML model training script (shows AI capability)

### **Talking Points for Recruiters/Clients**
- **"How did you handle multi-tenancy?"** → Explain: middleware isolation, scoped queries, per-tenant config
- **"Why Prisma + MySQL vs GraphQL?"** → Explain: tradeoff speed of delivery vs. complexity; easy to migrate to GraphQL
- **"Show me scalability?"** → Demo: Redis cache, Elasticsearch search, Docker compose local = easy K8s prod
- **"How would you charge for this?"** → Explain: SaaS pricing: Starter ($99/mo, 10 users) → Pro ($299/mo) → Enterprise (custom)
- **"Security?"** → Show: 2FA, encryption, audit logs, RBAC hardening, zero-trust architecture

### **LinkedIn / Portfolio Positioning**
**Title**: *"Enterprise Medical Representative Management SaaS — Full-Stack, Multi-Tenant, AI-Powered"*

**Description**:
```
Built MR Tracker, an enterprise SaaS platform for pharmaceutical companies:

🏗️ ARCHITECTURE
• Multi-tenant database with tenant isolation
• RBAC → ABAC permission system
• Event-driven workflows, job queues

⚡ FEATURES
• AI engagement scoring + churn prediction (85% accuracy)
• Real-time analytics (Socket.io, Redis)
• Smart visit scheduler (route optimization)
• Mobile app (React Native) + PWA (offline sync)
• Multi-language, multi-timezone support

🎯 PERFORMANCE
• Search 500K doctors in <100ms
• <200ms API p95 latency
• 99.9% SLA, K8s-ready deployment

🛠️ STACK
Backend: Node.js, Express, Prisma, MySQL, Redis, BullMQ
Frontend: React, React Native, Vite, Tailwind
Infra: Docker, GitHub Actions, Kubernetes, AWS

Impact: 40% time savings for MRs, 30% increase in visit efficiency
```

---

## 🎯 KEY SUCCESS METRICS (By Phase)

| Phase | Launch KPI | Growth KPI | Operational KPI |
|---|---|---|---|
| Phase 1 | MVP with 5+ users testing | 0% churn | 95% uptime, <500ms latency |
| Phase 2 | 100+ active users | 20%+ MoM growth | 99% uptime, <200ms p95 |
| Phase 3 | 10+ tenant companies | 50%+ revenue growth | 99.9% uptime, <2000 concurrent users |
| Phase 4 | 100+ tenants, $100K+ ARR | 100%+ YoY growth | 99.99% uptime, 50K+ concurrent users |

---

## 🚀 QUICK-START: PHASE 1 IMMEDIATE TASKS

### **Week 1: Foundation Polish**
- [ ] Add input validation (`joi` or `zod`) to all endpoints
- [ ] Implement soft delete + `deletedAt` field on User, Doctor, Visit
- [ ] Add Swagger API documentation
- [ ] Setup GitHub Actions CI/CD pipeline
- [ ] Docker + Docker Compose files

### **Week 2: Frontend UX**
- [ ] Pagination on all list pages
- [ ] Advanced filter UI (specialization, city, status)
- [ ] Confirm dialogs for destructive actions
- [ ] Error toast notifications
- [ ] Loading states on all async operations

### **Week 3: Security & Monitoring**
- [ ] Add HTTPS, rate limiting (`express-rate-limit`)
- [ ] Input validation on all forms (XSS prevention)
- [ ] CORS hardening
- [ ] Audit logging for key actions
- [ ] Error tracking (Sentry or DataDog trial)

### **Week 4: Testing & Polish**
- [ ] Unit tests for critical auth, RBAC, dashboard endpoints (50%+ coverage)
- [ ] Postman / Insomnia API testing suite
- [ ] Load test: 100 concurrent users on dashboard
- [ ] Accessibility audit (WCAG AA)
- [ ] Mobile responsive design review

---

## 📞 IMPLEMENTATION RECOMMENDATIONS

### **Solo Developer Path** (6-9 months to Phase 3)
- Weeks 1-4: Phase 1 (polish + deployment)
- Weeks 5-12: Phase 2 (professional features)
- Weeks 13-24: Phase 3 (enterprise + AI, with freelance ML engineer for models)
- Use "no-code" tools where possible (Metabase for BI, Stripe for billing)

### **Small Team Path** (3-4 months to Phase 3)
- 1 Backend lead
- 1 Frontend lead
- 1 DevOps/Infra engineer (part-time)
- Parallel work on Phases 1-2 simultaneously

### **Cost Estimates**
| Component | Phase 1-2 | Phase 3 | Phase 4 |
|---|---|---|---|
| AWS/Cloud | $500-1K/mo | $2-5K/mo | $10-20K/mo |
| Third-party APIs | $0 | $500-1K/mo (Stripe, Twilio) | $2-5K/mo (LLM, data warehouse) |
| Observability | Free tier | $300-500/mo | $1-2K/mo |
| Total | <$500/mo | $2-6K/mo | $13-27K/mo |

---

This roadmap is **production-ready, recruiter-impressive, and implementable in phases**. Start with Phase 1, and each subsequent phase adds enterprise polish and complexity without requiring a rebuild. Good luck! 🚀

