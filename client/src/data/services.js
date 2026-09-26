/* GENERATED FILE — do not edit directly.
   Source: assets/js/data.js
   Regenerate: node deploy/port-data-modules.js
   Edit the source file, then re-run, so the static site and the React app
   cannot drift apart. */

/* =============================================================================
   SITE CONTENT
   -----------------------------------------------------------------------------
   All page content lives here so you never have to touch the HTML.

   › To add a service: copy a block in SERVICES and edit the fields.
   › To remove one:   delete its block (or flip `featured: false`).
   › `featured: true` also pins it to the homepage grid (first 9 are shown).
   › `category` controls which group it appears under on services.html —
     use an existing value or add yours to CATEGORY_ORDER below.
   ========================================================================== */

/* ------------------------------------------------------------------- ICONS -- */
/* 24x24 stroke icons. Add new ones here, then reference by key in SERVICES.    */
export const ICONS = {
  /* Delivery */
  pipeline:
    '<path d="M4 6h6M4 12h10M4 18h6"/><circle cx="17" cy="6" r="2.5"/><circle cx="19" cy="18" r="2.5"/><path d="M17 8.5v7"/>',
  layers:
    '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/>',
  check:
    '<path d="m5 12.5 4.5 4.5L19 7"/>',
  rocket:
    '<path d="M12 3c3 1.6 5 4.6 5 8l-2.6 2.6h-4.8L7 11c0-3.4 2-6.4 5-8Z"/><path d="M9.6 13.6 8 20l3-2 3 2-1.6-6.4"/><circle cx="12" cy="9" r="1.5"/>',
  branch:
    '<circle cx="7" cy="5" r="2.2"/><circle cx="7" cy="19" r="2.2"/><circle cx="17" cy="9" r="2.2"/><path d="M7 7.2v9.6M17 11.2c0 3.8-4 2.8-6.5 4.6"/>',

  /* Infrastructure & cloud */
  terminal:
    '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="m7 9 3 3-3 3M13 15h4"/>',
  cloud:
    '<path d="M7 18h10a4 4 0 0 0 .6-7.96A6 6 0 0 0 6 11.5 3.5 3.5 0 0 0 7 18Z"/>',
  sliders:
    '<path d="M4 6h9M19 6h1M4 12h3M13 12h7M4 18h9M19 18h1"/><circle cx="15.5" cy="6" r="2.2"/><circle cx="9.5" cy="12" r="2.2"/><circle cx="15.5" cy="18" r="2.2"/>',
  globe:
    '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z"/>',
  zap:
    '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>',
  refresh:
    '<path d="M20 11a8 8 0 0 0-14-4L4 9"/><path d="M4 5v4h4"/><path d="M4 13a8 8 0 0 0 14 4l2-2"/><path d="M20 19v-4h-4"/>',

  /* Platform & containers */
  cube:
    '<path d="M12 3 3.5 7.5v9L12 21l8.5-4.5v-9L12 3Z"/><path d="M3.5 7.5 12 12l8.5-4.5M12 12v9"/>',
  box:
    '<path d="M12 3 4 7v10l8 4 8-4V7l-8-4Z"/><path d="M4 7l8 4 8-4M12 11v10"/>',
  compass:
    '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/>',
  sparkles:
    '<path d="M11 3l1.5 4.1L16.6 8.6l-4.1 1.5L11 14.2 9.5 10.1 5.4 8.6l4.1-1.5L11 3Z"/><path d="M17.8 14.4l.8 2.1 2.1.8-2.1.8-.8 2.1-.8-2.1-2.1-.8 2.1-.8.8-2.1Z"/>',
  network:
    '<circle cx="12" cy="5" r="2.2"/><circle cx="5" cy="19" r="2.2"/><circle cx="19" cy="19" r="2.2"/><path d="M12 7.2v4.3M10.4 12.6 6.2 16.9M13.6 12.6 17.8 16.9"/>',

  /* Reliability & performance */
  chart:
    '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  eye:
    '<path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6Z"/><circle cx="12" cy="12" r="2.6"/>',
  route:
    '<circle cx="6" cy="18" r="2.2"/><circle cx="18" cy="6" r="2.2"/><path d="M8.4 18H14a3.5 3.5 0 0 0 0-7h-4a3.5 3.5 0 0 1 0-7h5.4"/>',
  bell:
    '<path d="M18 8a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8"/><path d="M13.7 20a2 2 0 0 1-3.4 0"/>',
  pulse:
    '<path d="M2 12h4l2.5-6 3.5 12 3-8 2 4h5"/>',
  database:
    '<ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
  trend:
    '<path d="m3 17 6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
  gauge:
    '<path d="M4 18a9 9 0 1 1 16 0"/><path d="m12 14 4.5-4"/><circle cx="12" cy="18" r="1.6"/>',
  wave:
    '<path d="M2 12.5c2.5-5 5-5 7.5 0s5 5 7.5 0 3.5-4 5-2"/><path d="M2 18c2.5-5 5-5 7.5 0s5 5 7.5 0 3.5-4 5-2"/>',

  /* Security & compliance */
  shield:
    '<path d="M12 3 5 6v6c0 4.2 2.9 7.6 7 9 4.1-1.4 7-4.8 7-9V6l-7-3Z"/><path d="m9.5 12 1.8 1.8L15 10"/>',
  key:
    '<circle cx="8" cy="12" r="3.2"/><path d="M11.2 12H21M18 12v3M14.8 12v2.4"/>',
  search:
    '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
  patch:
    '<rect x="2.5" y="9.5" width="19" height="5" rx="2.5" transform="rotate(-45 12 12)"/><circle cx="12" cy="12" r="1.5"/>',
  scale:
    '<path d="M12 4v16M7.5 20h9"/><path d="M5 7h14"/><path d="M8 7l-3 6h6L8 7ZM16 7l-3 6h6l-3-6Z"/>',
  badge:
    '<circle cx="12" cy="9" r="5"/><path d="m8.5 13.4-1 7.6 4.5-2.6 4.5 2.6-1-7.6"/>',
  clipboard:
    '<rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9.5 4V3h5v1"/><path d="m9.5 13 1.8 1.8L15 11"/>',

  /* Networking & data */
  cert:
    '<rect x="3" y="4" width="18" height="11" rx="2"/><path d="M7 8h7M7 11h4"/><path d="M12 15v3M9 18h6"/>',

  /* Optimisation & advisory */
  gears:
    '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
  book:
    '<path d="M4 5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2V5Z"/><path d="M8 3v18"/>',
  headset:
    '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><path d="M4 14h3v5H6a2 2 0 0 1-2-2v-3Z"/><path d="M20 14h-3v5h1a2 2 0 0 0 2-2v-3Z"/><path d="M17 19v1a2 2 0 0 1-2 2h-2"/>',
  graduation:
    '<path d="M2 9l10-5 10 5-10 5L2 9Z"/><path d="M6 11.2V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.8"/>',
  sitemap:
    '<rect x="3" y="3" width="7" height="6" rx="1.5"/><rect x="14" y="3" width="7" height="6" rx="1.5"/><rect x="8.5" y="15" width="7" height="6" rx="1.5"/><path d="M6.5 9v3h11V9M12 12v3"/>',

  /* Social marks */
  linkedin:
    '<path d="M4.5 9v10M4.5 5.5v.01M9.5 19v-5.5a3 3 0 0 1 6 0V19"/><path d="M9.5 19v-9.5"/>',
  github:
    '<path d="M9 19c-4 1.2-4-2.2-6-2.7m12 5v-3.4a3 3 0 0 0-.9-2.3c3-.3 6.1-1.5 6.1-6.6a5.2 5.2 0 0 0-1.4-3.6 4.8 4.8 0 0 0-.1-3.6s-1.6-.5-5.2 1.9a12.6 12.6 0 0 0-6.8 0C4.1 1.3 2.5 1.8 2.5 1.8a4.8 4.8 0 0 0-.1 3.6A5.2 5.2 0 0 0 1 9c0 5 3.1 6.3 6.1 6.6A3 3 0 0 0 6 17.9V21"/>',
  x:
    '<path d="M4 4l7.5 9.5L4.5 20M20 4l-7.3 8.6M20 20l-6.4-8.1"/>',
};

/* --------------------------------------------------------- CATEGORY ORDER -- */
/* Groups on services.html render in this exact order. Add a new category name
   here and it appears as a new section automatically.                          */
export const CATEGORY_ORDER = [
  "Delivery Automation",
  "Infrastructure & Cloud",
  "Platform & Containers",
  "Reliability & Performance",
  "Security & Compliance",
  "Networking & Data",
  "Optimisation & Advisory",
];

/* ---------------------------------------------------------------- SERVICES -- */
export const SERVICES = [
  /* ================================================== DELIVERY AUTOMATION == */
  {
    id: "cicd",
    icon: "pipeline",
    category: "Delivery Automation",
    name: "CI/CD Pipeline Engineering",
    summary:
      "Automated build, test and deploy pipelines that turn every commit into a repeatable, auditable release.",
    bullets: [
      "GitHub Actions, GitLab CI, Jenkins & Azure Pipelines",
      "Parallel builds, caching and artifact promotion",
      "Quality gates, approvals and rollback on failure",
    ],
    featured: true,
  },
  {
    id: "gitops",
    icon: "layers",
    category: "Delivery Automation",
    name: "GitOps & Release Management",
    summary:
      "Git becomes the single source of truth for what runs where — with progressive rollouts and instant rollback.",
    bullets: [
      "ArgoCD and Flux continuous delivery",
      "Blue/green, canary and feature-flag releases",
      "Environment promotion with approval workflows",
    ],
    featured: true,
  },
  {
    id: "testing",
    icon: "check",
    category: "Delivery Automation",
    name: "Automated Testing & Quality Gates",
    summary:
      "Tests that run on every pull request, block bad merges, and give engineers confidence to move quickly.",
    bullets: [
      "Unit, integration and end-to-end test orchestration",
      "Coverage thresholds and merge-blocking gates",
      "Parallel test sharding to keep feedback under minutes",
    ],
    featured: false,
  },
  {
    id: "release-management",
    icon: "rocket",
    category: "Delivery Automation",
    name: "Release Management & Change Control",
    summary:
      "Predictable, traceable releases with the audit trail your compliance team keeps asking for.",
    bullets: [
      "Versioning, changelogs and release notes automation",
      "Change approval workflows without the red tape",
      "Who-shipped-what audit history",
    ],
    featured: false,
  },
  {
    id: "self-service",
    icon: "branch",
    category: "Delivery Automation",
    name: "Developer Self-Service & Golden Paths",
    summary:
      "New services scaffolded in minutes from blessed templates, instead of hand-rolled and half-documented.",
    bullets: [
      "Service templates with CI, monitoring and IaC baked in",
      "Self-service provisioning with guardrails",
      "Reduced cognitive load for new joiners",
    ],
    featured: false,
  },

  /* =============================================== INFRASTRUCTURE & CLOUD == */
  {
    id: "iac",
    icon: "terminal",
    category: "Infrastructure & Cloud",
    name: "Infrastructure as Code",
    summary:
      "Your entire cloud estate described in version control — reviewable, reproducible and rebuildable from scratch.",
    bullets: [
      "Terraform, OpenTofu, Pulumi & CloudFormation",
      "Remote state, workspaces and modular reusability",
      "Drift detection and policy-checked pull requests",
    ],
    featured: true,
  },
  {
    id: "cloud-migration",
    icon: "cloud",
    category: "Infrastructure & Cloud",
    name: "Cloud Architecture & Migration",
    summary:
      "Well-architected landing zones and migrations that move workloads without moving your risk profile.",
    bullets: [
      "AWS, Azure and Google Cloud landing zones",
      "Lift-and-shift, replatform and re-architect paths",
      "Network, IAM and multi-account structure design",
    ],
    featured: true,
  },
  {
    id: "config-management",
    icon: "sliders",
    category: "Infrastructure & Cloud",
    name: "Configuration Management",
    summary:
      "Servers and appliances configured from code, so rebuilding a box is boring and identical every time.",
    bullets: [
      "Ansible, Chef and Puppet role design",
      "Idempotent playbooks and hardened baselines",
      "Patching and compliance drift reports",
    ],
    featured: false,
  },
  {
    id: "multi-cloud",
    icon: "globe",
    category: "Infrastructure & Cloud",
    name: "Multi-Cloud & Hybrid Strategy",
    summary:
      "A deliberate, costed answer to multi-cloud — or a clear recommendation that you don't need it.",
    bullets: [
      "Workload placement and portability assessments",
      "Cross-cloud networking and identity",
      "On-prem to cloud connectivity and hybrid patterns",
    ],
    featured: false,
  },
  {
    id: "serverless",
    icon: "zap",
    category: "Infrastructure & Cloud",
    name: "Serverless Architecture",
    summary:
      "Event-driven workloads that scale to zero and stay cheap, without melting under cold starts.",
    bullets: [
      "Lambda, Cloud Functions and Azure Functions",
      "Event sourcing, queues and step functions",
      "Cold-start tuning and concurrency control",
    ],
    featured: false,
  },
  {
    id: "modernisation",
    icon: "refresh",
    category: "Infrastructure & Cloud",
    name: "Legacy Application Modernisation",
    summary:
      "Incrementally untangle the monolith and the hand-built VM estate — without a risky big-bang rewrite.",
    bullets: [
      "Strangler-fig migration sequencing",
      "Containerising and replatforming legacy apps",
      "Decommissioning plan for the old footprint",
    ],
    featured: false,
  },

  /* ================================================ PLATFORM & CONTAINERS == */
  {
    id: "kubernetes",
    icon: "cube",
    category: "Platform & Containers",
    name: "Kubernetes & Containers",
    summary:
      "Production-grade clusters with sane defaults, safe rollouts and an operator experience your team will actually enjoy.",
    bullets: [
      "EKS, AKS, GKE and self-managed clusters",
      "Helm, Kustomize and GitOps-driven deployments",
      "Node autoscaling, resource tuning and cost control",
    ],
    featured: true,
  },
  {
    id: "docker",
    icon: "box",
    category: "Platform & Containers",
    name: "Docker & Containerization",
    summary:
      "Small, secure, reproducible images with builds fast enough that nobody avoids changing the Dockerfile.",
    bullets: [
      "Multi-stage builds and layer cache optimisation",
      "Distroless and non-root runtime images",
      "Local development parity with production",
    ],
    featured: false,
  },
  {
    id: "platform-eng",
    icon: "compass",
    category: "Platform & Containers",
    name: "Internal Developer Platform",
    summary:
      "A paved road for your developers: self-service environments and golden-path templates in one portal.",
    bullets: [
      "Backstage portals and service catalogues",
      "Golden-path scaffolding for new services",
      "On-demand and ephemeral preview environments",
    ],
    featured: false,
  },
  {
    id: "preview-envs",
    icon: "sparkles",
    category: "Platform & Containers",
    name: "Ephemeral & Preview Environments",
    summary:
      "A real, isolated environment spun up per pull request and torn down on merge — sharing nothing with production.",
    bullets: [
      "Per-branch environments from pull request to merge",
      "Seeded, anonymised test data",
      "Automatic teardown to keep the cloud bill flat",
    ],
    featured: false,
  },
  {
    id: "edge-cdn",
    icon: "network",
    category: "Platform & Containers",
    name: "Edge & CDN Configuration",
    summary:
      "Static assets and APIs served from close to your users, with cache rules that don't serve stale nonsense.",
    bullets: [
      "CloudFront, Cloudflare and Fastly setup",
      "Cache invalidation wired into deployments",
      "Edge functions and origin shielding",
    ],
    featured: false,
  },

  /* =========================================== RELIABILITY & PERFORMANCE == */
  {
    id: "observability",
    icon: "chart",
    category: "Reliability & Performance",
    name: "Monitoring & Observability",
    summary:
      "Know what broke, why it broke and who it affects — before your customers have to tell you.",
    bullets: [
      "Prometheus, Grafana, Datadog & CloudWatch",
      "OpenTelemetry tracing and structured logging",
      "SLO dashboards and actionable alert routing",
    ],
    featured: true,
  },
  {
    id: "logging",
    icon: "eye",
    category: "Reliability & Performance",
    name: "Centralised Logging",
    summary:
      "Every log line searchable in seconds, with retention policies that don't cost more than your compute.",
    bullets: [
      "Elasticsearch, Loki and CloudWatch Logs pipelines",
      "Structured logging standards and parsing",
      "Retention, tiering and access controls",
    ],
    featured: false,
  },
  {
    id: "tracing",
    icon: "route",
    category: "Reliability & Performance",
    name: "Distributed Tracing",
    summary:
      "Follow a single request across every service and see exactly which hop added the 800ms.",
    bullets: [
      "OpenTelemetry instrumentation and collectors",
      "Jaeger, Tempo and vendor backends",
      "Trace-to-log correlation for fast triage",
    ],
    featured: false,
  },
  {
    id: "alerting",
    icon: "bell",
    category: "Reliability & Performance",
    name: "Alerting & On-Call Tooling",
    summary:
      "Fewer, better alerts that route to the right person — and stay quiet when nothing is actually wrong.",
    bullets: [
      "PagerDuty, Opsgenie and Grafana OnCall",
      "Alert tuning to kill chronic noise",
      "Escalation policies and rotation schedules",
    ],
    featured: false,
  },
  {
    id: "sre",
    icon: "pulse",
    category: "Reliability & Performance",
    name: "SRE, On-Call & Incident Response",
    summary:
      "Error budgets, runbooks and an escalation path that keeps 3 a.m. pages rare and short.",
    bullets: [
      "SLI/SLO definition and error-budget policy",
      "Alert tuning and on-call rotation design",
      "Blameless postmortems and remediation tracking",
    ],
    featured: true,
  },
  {
    id: "dr",
    icon: "database",
    category: "Reliability & Performance",
    name: "Backup, HA & Disaster Recovery",
    summary:
      "Tested recovery procedures with documented RTO and RPO — because an untested backup is not a backup.",
    bullets: [
      "Multi-AZ, multi-region and failover design",
      "Automated backups with restore rehearsals",
      "Database HA, replication and migration safety",
    ],
    featured: false,
  },
  {
    id: "autoscaling",
    icon: "trend",
    category: "Reliability & Performance",
    name: "Autoscaling & Capacity Planning",
    summary:
      "Capacity that follows demand automatically, sized from real traffic data rather than guesswork.",
    bullets: [
      "Horizontal, vertical and KEDA event-driven scaling",
      "Load-model-based capacity forecasting",
      "Headroom without paying for idle instances",
    ],
    featured: false,
  },
  {
    id: "load-testing",
    icon: "gauge",
    category: "Reliability & Performance",
    name: "Load & Performance Testing",
    summary:
      "Find the breaking point in a test environment instead of during your busiest hour.",
    bullets: [
      "k6, JMeter and Locust test design",
      "Realistic traffic modelling and soak tests",
      "Bottleneck analysis across app, DB and network",
    ],
    featured: false,
  },
  {
    id: "chaos",
    icon: "wave",
    category: "Reliability & Performance",
    name: "Chaos Engineering & Resilience Testing",
    summary:
      "Deliberately break things in a controlled way, so you find out now rather than at the worst moment.",
    bullets: [
      "Game days and controlled failure injection",
      "Dependency and availability failure drills",
      "Resilience findings turned into backlog items",
    ],
    featured: false,
  },

  /* =============================================== SECURITY & COMPLIANCE == */
  {
    id: "devsecops",
    icon: "shield",
    category: "Security & Compliance",
    name: "DevSecOps & Compliance",
    summary:
      "Security checks wired into the pipeline, so vulnerabilities are caught in review instead of in production.",
    bullets: [
      "SAST, DAST, dependency and container scanning",
      "Secrets management with Vault, KMS and SOPS",
      "Policy as code and audit-ready evidence trails",
    ],
    featured: true,
  },
  {
    id: "secrets",
    icon: "key",
    category: "Security & Compliance",
    name: "Secrets Management",
    summary:
      "No credentials in Git, no shared password spreadsheets, and automatic rotation you never have to think about.",
    bullets: [
      "HashiCorp Vault, SOPS and cloud KMS",
      "Short-lived credentials and OIDC federation",
      "Automated rotation and leak detection",
    ],
    featured: false,
  },
  {
    id: "image-scanning",
    icon: "search",
    category: "Security & Compliance",
    name: "Container & Image Scanning",
    summary:
      "Block images with known critical CVEs before they ever reach a registry your production cluster can pull from.",
    bullets: [
      "Trivy, Grype and Snyk in the build pipeline",
      "SBOM generation and provenance attestation",
      "Registry admission policies that block bad images",
    ],
    featured: false,
  },
  {
    id: "patching",
    icon: "patch",
    category: "Security & Compliance",
    name: "Vulnerability & Patch Management",
    summary:
      "A patch cadence you can actually keep, driven by real exposure data rather than raw CVE counts.",
    bullets: [
      "Automated OS, runtime and dependency patching",
      "Risk-based prioritisation by exploitability",
      "Rolling patching with zero-downtime drains",
    ],
    featured: false,
  },
  {
    id: "policy-as-code",
    icon: "scale",
    category: "Security & Compliance",
    name: "Policy as Code",
    summary:
      "Guardrails expressed as code, enforced before deployment — not a wiki page nobody reads.",
    bullets: [
      "Open Policy Agent and Kyverno policies",
      "Budget, tagging and region restrictions",
      "Pre-merge plan checks on every pull request",
    ],
    featured: false,
  },
  {
    id: "iam",
    icon: "badge",
    category: "Security & Compliance",
    name: "IAM, Zero Trust & Access Reviews",
    summary:
      "Least-privilege access that's provable, reviewed and revoked automatically when someone changes teams.",
    bullets: [
      "Least-privilege role and policy design",
      "SSO, MFA and federated identity",
      "Scheduled access reviews and automatic revocation",
    ],
    featured: false,
  },
  {
    id: "compliance",
    icon: "clipboard",
    category: "Security & Compliance",
    name: "Compliance Readiness",
    summary:
      "Continuous evidence collection instead of a quarterly fire drill — audit trails generated by your pipeline.",
    bullets: [
      "SOC 2, ISO 27001, HIPAA and PCI DSS readiness",
      "Automated control evidence and reporting",
      "Change management and segregation-of-duties trails",
    ],
    featured: false,
  },

  /* ==================================================== NETWORKING & DATA == */
  {
    id: "networking",
    icon: "network",
    category: "Networking & Data",
    name: "Networking, Ingress & Service Mesh",
    summary:
      "Traffic that reaches the right service, stays encrypted in transit, and fails over without dropping connections.",
    bullets: [
      "Load balancers, ingress and API gateways",
      "Istio and Cilium service mesh, mTLS by default",
      "Traffic shifting for canary and blue/green rollout",
    ],
    featured: false,
  },
  {
    id: "dns-tls",
    icon: "cert",
    category: "Networking & Data",
    name: "DNS, TLS & Certificate Automation",
    summary:
      "Certificates that renew themselves, DNS managed as code, and no more expiry-day outages.",
    bullets: [
      "ACM, cert-manager and Let's Encrypt automation",
      "Route53, Cloudflare and Azure DNS as code",
      "Expiry monitoring with renewal alerting",
    ],
    featured: false,
  },
  {
    id: "database-devops",
    icon: "database",
    category: "Networking & Data",
    name: "Database DevOps & Data Migrations",
    summary:
      "Schema changes shipped through the pipeline with rollback plans, rather than run by hand at midnight.",
    bullets: [
      "Versioned migrations in CI/CD with review",
      "Zero-downtime, expand-contract schema changes",
      "Replication, failover and read-scaling design",
    ],
    featured: false,
  },

  /* ============================================ OPTIMISATION & ADVISORY == */
  {
    id: "finops",
    icon: "gears",
    category: "Optimisation & Advisory",
    name: "Cloud Cost Optimisation (FinOps)",
    summary:
      "Find the 30% of your bill nobody can justify, then keep it gone with budgets and guardrails.",
    bullets: [
      "Spend visibility, tagging and chargeback",
      "Rightsizing, savings plans and spot strategy",
      "Automated anomaly alerts and budget guardrails",
    ],
    featured: true,
  },
  {
    id: "advisory",
    icon: "book",
    category: "Optimisation & Advisory",
    name: "DevOps Assessment & Enablement",
    summary:
      "A maturity assessment that produces a prioritised roadmap, then hands the team the skills to run it.",
    bullets: [
      "Delivery, reliability and security maturity audit",
      "Prioritised 90-day improvement roadmap",
      "Hands-on training, pairing and runbook handover",
    ],
    featured: false,
  },
  {
    id: "support-247",
    icon: "headset",
    category: "Optimisation & Advisory",
    name: "24/7 Managed DevOps Support",
    summary:
      "An on-call team on the other end of the pager, with agreed response targets and monthly incident reporting.",
    bullets: [
      "24/7 monitoring, triage and incident response",
      "Contractual response and resolution targets",
      "Monthly reliability and cost reporting",
    ],
    featured: false,
  },
  {
    id: "training",
    icon: "graduation",
    category: "Optimisation & Advisory",
    name: "Training & Team Enablement",
    summary:
      "Your engineers learn to run the platform themselves — through pairing, workshops and internal runbooks.",
    bullets: [
      "Tailored workshops on IaC, Kubernetes and CI/CD",
      "Pairing and code review on real work",
      "Internal knowledge base so it stays in-house",
    ],
    featured: false,
  },
  {
    id: "documentation",
    icon: "sitemap",
    category: "Optimisation & Advisory",
    name: "Technical Documentation & Runbooks",
    summary:
      "Diagrams, decision records and step-by-step runbooks that turn a 3 a.m. page into a checklist.",
    bullets: [
      "Architecture diagrams kept in sync with reality",
      "Operational runbooks for every alert",
      "Architecture decision records and onboarding guides",
    ],
    featured: false,
  },
];

/* ----------------------------------------------------------------- PROCESS -- */
export const PROCESS = [
  {
    step: "01",
    title: "Discover",
    text: "A short, focused audit of your delivery flow, infrastructure and pain points. You get findings either way — no obligation.",
  },
  {
    step: "02",
    title: "Design",
    text: "A written plan with target architecture, tooling choices, sequencing and the risks we expect to hit.",
  },
  {
    step: "03",
    title: "Automate",
    text: "We build it incrementally behind pull requests, so your team reviews and absorbs every change as it lands.",
  },
  {
    step: "04",
    title: "Operate",
    text: "Monitoring, on-call and continuous improvement — with documentation and handover so you're never locked in.",
  },
];

/* ------------------------------------------------------------ TESTIMONIALS -- */
/* Set to [] to hide the section entirely.                                     */
export const TESTIMONIALS = [
  {
    quote:
      "Deploys went from a fortnightly all-hands event to something we do thirty times a day. The difference in team morale is real.",
    name: "Alex Mercer",
    role: "VP Engineering",
    company: "Fintech platform",
  },
  {
    quote:
      "They found 38% of our cloud spend in the first two weeks and built the guardrails so it stayed that way.",
    name: "Priya Raman",
    role: "Head of Infrastructure",
    company: "E-commerce group",
  },
  {
    quote:
      "Our audit trail went from a quarterly panic to a dashboard. We passed SOC 2 with time to spare.",
    name: "Daniel Osei",
    role: "CTO",
    company: "Healthcare SaaS",
  },
];

/* -------------------------------------------------------------------- FAQ -- */
export const FAQS = [
  {
    q: "How quickly can you start?",
    a: "Discovery calls are usually booked within 48 hours, and most engagements kick off within one to two weeks depending on scope.",
  },
  {
    q: "Do you work with our existing tools?",
    a: "Yes. We prefer to improve what you already run rather than force a rewrite. If a tool is genuinely holding you back we will make the case for replacing it in plain language, with the trade-offs spelled out.",
  },
  {
    q: "Will you hand over documentation?",
    a: "Always. Every engagement ends with runbooks, architecture diagrams and a walkthrough session. You own the repositories and the accounts throughout — we never hold the keys.",
  },
  {
    q: "Can you cover out-of-hours support?",
    a: "Yes. Managed plans include 24/7 on-call with agreed response targets, escalation paths and incident reporting.",
  },
  {
    q: "What does an engagement cost?",
    a: "Assessment work is fixed-fee so there are no surprises. Ongoing engineering is either a monthly retainer or a fixed-scope project, quoted upfront. You will always know the number before we start.",
  },
];

/* ------------------------------------------------------------------ PLANS -- */
export const PLANS = [
  {
    name: "Audit",
    tagline: "Know exactly where you stand.",
    price: "Fixed fee",
    note: "1–2 weeks",
    features: [
      "Delivery, infra & security review",
      "Prioritised findings report",
      "90-day improvement roadmap",
      "Walkthrough session with your team",
    ],
    cta: "Request an audit",
    highlight: false,
  },
  {
    name: "Build",
    tagline: "Ship the platform, properly.",
    price: "Project",
    note: "Scoped upfront",
    features: [
      "Everything in Audit",
      "CI/CD, IaC & Kubernetes delivery",
      "Observability and alerting baseline",
      "Documentation and team handover",
    ],
    cta: "Scope a project",
    highlight: true,
  },
  {
    name: "Operate",
    tagline: "We keep the lights on.",
    price: "Monthly",
    note: "Ongoing retainer",
    features: [
      "Everything in Build",
      "24/7 on-call & incident response",
      "Cost, performance & security tuning",
      "Quarterly roadmap reviews",
    ],
    cta: "Discuss a retainer",
    highlight: false,
  },
];
