/* GENERATED FILE — do not edit directly.
   Source: assets/js/tech.js
   Regenerate: node deploy/port-data-modules.js
   Edit the source file, then re-run, so the static site and the React app
   cannot drift apart. */

/* =============================================================================
   TECHNOLOGY LOGOS
   -----------------------------------------------------------------------------
   Named tools and platforms with their brand mark and brand colour, shown in
   the "Technologies we work with" grid.

   ⚠  ABOUT THESE MARKS
   Each `svg` below is a hand-authored, simplified vector that visually
   represents the product. They are NOT the official vendor asset files.
   Before going live commercially, download the official logos from each
   vendor's brand page and drop them in — the structure below supports it:

     • To use an image file instead of inline SVG, set:
         { file: "assets/logos/aws.svg" }
       and drop the `svg` key. The renderer handles both.

   Trademark note: AWS, Microsoft Azure and Google Cloud all publish strict
   brand guidelines. Most restrict logo use to approved partner badges, so if
   you're not a registered partner, prefer the plain name or ask their partner
   team first. Everything else here is generally fine for "we work with X".

   FIELDS
     id       unique key (used for anchors)
     name     label under the tile
     group    which section it lands in — see TECH_GROUP_ORDER
     color    brand hex, used for the mark and hover tint
     featured true = also shown in the homepage strip
     svg      inner markup for a 24x24 viewBox
     note     optional small caption (used on a few entries)
   ========================================================================== */

export const TECH_GROUP_ORDER = [
  "Cloud Platforms",
  "Containers & Orchestration",
  "CI/CD & GitOps",
  "Infrastructure as Code",
  "Observability",
  "Security",
  "Data & Messaging",
  "Runtimes & Servers",
];

export const TECHNOLOGIES = [
  /* ===================================================== CLOUD PLATFORMS == */
  {
    id: "aws",
    name: "AWS",
    group: "Cloud Platforms",
    color: "#FF9900",
    featured: true,
    svg:
      '<text x="12" y="11.4" text-anchor="middle" font-family="Inter, Helvetica, Arial, sans-serif" ' +
      'font-size="10.5" font-weight="800" letter-spacing="-0.6" fill="currentColor">aws</text>' +
      '<path d="M3.4 15.2c4.9 3.5 12.1 3.4 16.2-.2" fill="none" stroke="currentColor" ' +
      'stroke-width="1.9" stroke-linecap="round"/>' +
      '<path d="M18.1 11.9 23 14.4l-4.3 2.5z" fill="currentColor"/>',
  },
  {
    id: "azure",
    name: "Microsoft Azure",
    group: "Cloud Platforms",
    color: "#0078D4",
    featured: true,
    svg:
      '<path d="M14.9 2.6 6.2 21.4h15.2L14.9 2.6Z" fill="currentColor"/>' +
      '<path d="M10.5 2.6 2.6 21.4h6.6L14.2 11z" fill="currentColor" opacity=".58"/>',
  },
  {
    id: "gcp",
    name: "Google Cloud",
    group: "Cloud Platforms",
    color: "#4285F4",
    featured: true,
    svg:
      '<path d="M12 3.2a7.6 7.6 0 0 0-6.5 3.7A5 5 0 0 0 6.7 16.9h10.7a4.9 4.9 0 0 0 2.6-9V7.6A7.5 7.5 0 0 0 12 3.2Z" fill="#4285F4"/>' +
      '<path d="M12 3.2a7.6 7.6 0 0 0-6.5 3.7 5 5 0 0 0-1 7.4l4.5-4.3z" fill="#EA4335"/>' +
      '<path d="M4.5 14.3a5 5 0 0 0 2.2 2.6h4.1l-3.8-3.8z" fill="#FBBC05"/>' +
      '<path d="M10.8 16.9h6.6a4.9 4.9 0 0 0 3.4-1.5l-6-6.6z" fill="#34A853"/>',
  },
  {
    id: "cloudflare",
    name: "Cloudflare",
    group: "Cloud Platforms",
    color: "#F38020",
    svg:
      '<path d="M18 17.9H7.2a3.7 3.7 0 0 1-.5-7.3 5.5 5.5 0 0 1 10.3 1.3A3.3 3.3 0 0 1 18 17.9Z" fill="currentColor"/>' +
      '<path d="M20.4 12.9a4.6 4.6 0 0 1 1.3 3.6 3 3 0 0 1-2.6 1.4h-2.8a2.6 2.6 0 0 0 .2-5z" fill="currentColor" opacity=".55"/>',
  },

  /* ========================================== CONTAINERS & ORCHESTRATION == */
  {
    id: "kubernetes",
    name: "Kubernetes",
    group: "Containers & Orchestration",
    color: "#326CE5",
    featured: true,
    svg:
      '<path d="m12 2.2 8.1 3.9 2 8.3-5.6 6.4H7.5L1.9 14.4l2-8.3z" fill="currentColor" opacity=".16"/>' +
      '<path d="m12 2.2 8.1 3.9 2 8.3-5.6 6.4H7.5L1.9 14.4l2-8.3z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>' +
      '<circle cx="12" cy="12" r="2.5" fill="none" stroke="currentColor" stroke-width="1.4"/>' +
      '<path d="M12 9.5V4.7M12 14.5v4.8M9.8 10.8 5.5 8.2M14.2 13.2l4.3 2.6M9.8 13.2 5.5 15.8M14.2 10.8l4.3-2.6" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"/>',
  },
  {
    id: "docker",
    name: "Docker",
    group: "Containers & Orchestration",
    color: "#2496ED",
    featured: true,
    svg:
      '<rect x="6.4" y="6.2" width="2.7" height="2.5" rx=".4" fill="currentColor"/>' +
      '<rect x="9.7" y="6.2" width="2.7" height="2.5" rx=".4" fill="currentColor"/>' +
      '<rect x="13" y="6.2" width="2.7" height="2.5" rx=".4" fill="currentColor"/>' +
      '<rect x="9.7" y="3.4" width="2.7" height="2.5" rx=".4" fill="currentColor"/>' +
      '<rect x="13" y="3.4" width="2.7" height="2.5" rx=".4" fill="currentColor"/>' +
      '<rect x="16.3" y="6.2" width="2.7" height="2.5" rx=".4" fill="currentColor"/>' +
      '<path d="M2.2 9.9h19.4c0 5.7-4.2 10-9.6 10-5.2 0-9.4-4-9.8-9.4z" fill="currentColor"/>' +
      '<path d="M18.6 6.6c1.6-.4 2.8 0 3.7 1.3-1 .6-2 .7-3.1.3z" fill="currentColor" opacity=".6"/>',
  },
  {
    id: "helm",
    name: "Helm",
    group: "Containers & Orchestration",
    color: "#0F1689",
    svg:
      '<circle cx="12" cy="12" r="7.3" fill="none" stroke="currentColor" stroke-width="1.5"/>' +
      '<circle cx="12" cy="12" r="3.3" fill="none" stroke="currentColor" stroke-width="1.5"/>' +
      '<path d="M12 4.7V1.8M12 22.2v-2.9M4.7 12H1.8M22.2 12h-2.9M6.9 6.9 4.8 4.8M19.2 19.2l-2.1-2.1M6.9 17.1l-2.1 2.1M19.2 4.8l-2.1 2.1" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>',
  },
  {
    id: "istio",
    name: "Istio",
    group: "Containers & Orchestration",
    color: "#466BB0",
    svg:
      '<path d="M12 2.4 4.4 6.6v10.8L12 21.6l7.6-4.2V6.6z" fill="currentColor" opacity=".18"/>' +
      '<path d="M12 2.4v19.2M4.4 6.6 12 12l7.6-5.4M4.4 17.4 12 12l7.6 5.4" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>',
  },
  {
    id: "openshift",
    name: "OpenShift",
    group: "Containers & Orchestration",
    color: "#EE0000",
    svg:
      '<path d="M12 3.2 3.4 8.2v7.6L12 20.8l8.6-5V8.2z" fill="currentColor" opacity=".16"/>' +
      '<path d="M12 3.2 3.4 8.2v7.6L12 20.8l8.6-5V8.2z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>' +
      '<circle cx="12" cy="12" r="3.4" fill="currentColor"/>',
  },

  /* ==================================================== CI/CD & GITOPS == */
  {
    id: "github",
    name: "GitHub",
    group: "CI/CD & GitOps",
    color: "#181717",
    featured: true,
    svg:
      '<path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" fill="currentColor"/>',
  },
  {
    id: "gitlab",
    name: "GitLab",
    group: "CI/CD & GitOps",
    color: "#FC6D26",
    featured: true,
    svg:
      '<path d="M12 22 2.5 15.1 5.2 4.9z" fill="#E24329"/>' +
      '<path d="M12 22 21.5 15.1 18.8 4.9z" fill="#E24329"/>' +
      '<path d="M12 22 7.5 15.1h9z" fill="#FC6D26"/>' +
      '<path d="M5.2 4.9 7.5 15.1H2.5z" fill="#FCA326"/>' +
      '<path d="M18.8 4.9 16.5 15.1h5z" fill="#FCA326"/>',
  },
  {
    id: "jenkins",
    name: "Jenkins",
    group: "CI/CD & GitOps",
    color: "#D33833",
    svg:
      '<path d="M12 3.4c-2.4 0-4 1.8-4.2 4.3-.1 1.5.2 3 .6 4.2.4 1.3.3 2.4 0 3.3-.2.8.3 1.3 1.1 1.3h4.9c.8 0 1.3-.5 1.1-1.3-.3-.9-.4-2 0-3.3.4-1.2.7-2.7.6-4.2C15.9 5.2 14.4 3.4 12 3.4Z" fill="currentColor"/>' +
      '<path d="M4.2 18.6c1.8-1 4.4-1.5 7.8-1.5s6 .5 7.8 1.5c-1.8 1.7-4.5 2.6-7.8 2.6s-6-.9-7.8-2.6Z" fill="currentColor" opacity=".65"/>',
  },
  {
    id: "argocd",
    name: "Argo CD",
    group: "CI/CD & GitOps",
    color: "#EF7B4D",
    featured: true,
    svg:
      '<circle cx="12" cy="8.4" r="4.6" fill="currentColor"/>' +
      '<path d="M7.6 10.4c-1.5 4-1.4 7 .5 9.3M16.4 10.4c1.5 4 1.4 7-.5 9.3M12 13.2v7M9.6 11.5c-1 3.5-.6 6.4 1 8.4M14.4 11.5c1 3.5.6 6.4-1 8.4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
      '<circle cx="10.2" cy="7.4" r="1.05" fill="#fff"/><circle cx="13.8" cy="7.4" r="1.05" fill="#fff"/>',
  },
  {
    id: "flux",
    name: "Flux CD",
    group: "CI/CD & GitOps",
    color: "#5468FF",
    svg:
      '<path d="M3.6 17.6c3.1-6.2 6-9.2 8.4-9.2s5.3 3 8.4 9.2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity=".5"/>' +
      '<path d="M3.6 11.6c3.1-6.2 6-9.2 8.4-9.2s5.3 3 8.4 9.2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  },

  /* ============================================== INFRASTRUCTURE AS CODE == */
  {
    id: "terraform",
    name: "Terraform",
    group: "Infrastructure as Code",
    color: "#7B42BC",
    featured: true,
    svg:
      '<path d="M4.4 3.4 8 5.5v5.2l-3.6-2.1z" fill="currentColor" opacity=".55"/>' +
      '<path d="M8.7 5.5 12.3 3.4v5.2L8.7 10.7z" fill="currentColor"/>' +
      '<path d="M13 3.4l3.6 2.1v5.2L13 8.6z" fill="currentColor" opacity=".55"/>' +
      '<path d="M8.7 11.4 12.3 9.3v10.9l-3.6-2.1z" fill="currentColor"/>',
  },
  {
    id: "ansible",
    name: "Ansible",
    group: "Infrastructure as Code",
    color: "#EE0000",
    svg:
      '<path d="M12 3 4.4 20.6h3.2l1.6-4.2h5.6l1.6 4.2h3.2L12 3Zm-1.7 10.8L12 9l1.7 4.8z" fill="currentColor"/>' +
      '<circle cx="12" cy="2.6" r="1.5" fill="currentColor" opacity=".6"/>',
  },
  {
    id: "pulumi",
    name: "Pulumi",
    group: "Infrastructure as Code",
    color: "#8A3391",
    svg:
      '<path d="M12 2.6 3.8 7.3v9.4L12 21.4l8.2-4.7V7.3z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>' +
      '<circle cx="12" cy="12" r="3.2" fill="currentColor"/>',
  },
  {
    id: "vagrant",
    name: "Vagrant",
    group: "Infrastructure as Code",
    color: "#1868F2",
    svg:
      '<path d="M2.4 5.4h5.2L12 15.4l4.4-10h5.2L12 21z" fill="currentColor"/>',
  },

  /* ==================================================== OBSERVABILITY == */
  {
    id: "prometheus",
    name: "Prometheus",
    group: "Observability",
    color: "#E6522C",
    featured: true,
    svg:
      '<path d="M12 2.2c1.7 3.3 5.5 5.2 5.5 9.8 0 3.9-2.5 6.9-5.5 6.9s-5.5-3-5.5-6.9c0-4.6 3.8-6.5 5.5-9.8Z" fill="currentColor"/>' +
      '<path d="M6.3 19.6h11.4c-.8 1.6-2.1 2.6-3.5 2.6h-4.4c-1.4 0-2.7-1-3.5-2.6Z" fill="currentColor" opacity=".6"/>',
  },
  {
    id: "grafana",
    name: "Grafana",
    group: "Observability",
    color: "#F46800",
    featured: true,
    svg:
      '<defs><linearGradient id="grad-grafana" x1="0" y1="1" x2="1" y2="0">' +
      '<stop offset="0" stop-color="#F46800"/><stop offset="1" stop-color="#FCEE1F"/>' +
      '</linearGradient></defs>' +
      '<path d="M12 2.4c2.7 3.5 6.4 5.7 6.4 10.4A6.4 6.4 0 0 1 12 19.2a6.4 6.4 0 0 1-6.4-6.4c0-4.7 3.7-6.9 6.4-10.4Z" fill="url(#grad-grafana)"/>' +
      '<path d="M3.6 18.6c1.7 1 3.8.4 4.8-1.2M20.4 18.6c-1.7 1-3.8.4-4.8-1.2" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>',
  },
  {
    id: "datadog",
    name: "Datadog",
    group: "Observability",
    color: "#632CA6",
    featured: true,
    svg:
      '<path d="M6.4 9.2 4.6 6.4c-.3-.4 0-1 .5-.9l3.2.7a7.7 7.7 0 0 1 7.4 0l3.2-.7c.5-.1.8.5.5.9l-1.8 2.8a7.7 7.7 0 0 1-.9 9.7H7.3a7.7 7.7 0 0 1-.9-9.7Z" fill="currentColor"/>' +
      '<circle cx="9.7" cy="12.4" r="1.05" fill="#fff"/><circle cx="14.3" cy="12.4" r="1.05" fill="#fff"/>' +
      '<path d="M11 16.3h2l-1 1.5z" fill="#fff"/>',
  },
  {
    id: "elastic",
    name: "Elastic",
    group: "Observability",
    color: "#F04E98",
    svg:
      '<path d="M3 7.2c4.6-1.7 11-1.7 15.4.2" stroke="#F04E98" stroke-width="3" stroke-linecap="round" fill="none"/>' +
      '<path d="M3.4 12h13" stroke="#FEC514" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M3 16.8c4.6 1.7 11 1.7 15.4-.2" stroke="#00BFB3" stroke-width="3" stroke-linecap="round" fill="none"/>',
  },
  {
    id: "jaeger",
    name: "Jaeger",
    group: "Observability",
    color: "#66CFE3",
    svg:
      '<path d="M12 3.2 4.6 6.6v5.2c0 4.4 3.1 7.9 7.4 9.2 4.3-1.3 7.4-4.8 7.4-9.2V6.6z" fill="currentColor" opacity=".22"/>' +
      '<path d="M14.6 7.4h-3.2v6.8c0 1.2-.7 1.8-1.8 1.8-.9 0-1.6-.5-1.9-1.4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  {
    id: "opentelemetry",
    name: "OpenTelemetry",
    group: "Observability",
    color: "#425CC7",
    svg:
      '<path d="M12 3.4 20.6 12 12 20.6 3.4 12z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>' +
      '<path d="M12 7.4 16.6 12 12 16.6 7.4 12z" fill="currentColor" opacity=".45"/>' +
      '<circle cx="12" cy="12" r="1.9" fill="currentColor"/>',
  },
  {
    id: "pagerduty",
    name: "PagerDuty",
    group: "Observability",
    color: "#06AC38",
    svg:
      '<path d="M12 2.8 21.4 20.8H2.6z" fill="currentColor" opacity=".2"/>' +
      '<path d="M12 2.8 21.4 20.8H2.6z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>' +
      '<path d="M12 8.4v6.4" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>',
  },

  /* ========================================================= SECURITY == */
  {
    id: "vault",
    name: "HashiCorp Vault",
    group: "Security",
    color: "#FFCF25",
    featured: true,
    svg:
      '<rect x="2.6" y="2.6" width="18.8" height="18.8" rx="3.4" fill="#1B1B33"/>' +
      '<path d="M12 5.6 6.4 18.4h3.3l1.1-2.7h2.4l1.1 2.7h3.3zM10.4 13.4 12 9.4l1.6 4z" fill="#FFCF25"/>',
  },
  {
    id: "snyk",
    name: "Snyk",
    group: "Security",
    color: "#4C4A73",
    svg:
      '<path d="M12 3.2 4.8 6.6v5.3c0 4.3 3 7.8 7.2 9.1 4.2-1.3 7.2-4.8 7.2-9.1V6.6z" fill="currentColor" opacity=".22"/>' +
      '<path d="M8.6 12.6c.8-2 3-3 5-2.2" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>' +
      '<path d="M15.2 10.4 13.6 14 12 10.4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  {
    id: "trivy",
    name: "Trivy",
    group: "Security",
    color: "#1904DA",
    svg:
      '<path d="M12 2.6 4.4 12 12 21.4 19.6 12z" fill="currentColor" opacity=".18"/>' +
      '<path d="M12 2.6 4.4 12 12 21.4 19.6 12z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>' +
      '<path d="M8.6 12h6.8" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>',
  },
  {
    id: "sonarqube",
    name: "SonarQube",
    group: "Security",
    color: "#4E9BCD",
    svg:
      '<path d="M3.4 20.6c0-8.2 6.2-14.6 13.6-14.6" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"/>' +
      '<circle cx="16.6" cy="6" r="3.3" fill="currentColor"/>' +
      '<path d="M3.4 20.6h5.8" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"/>',
  },

  /* ================================================ DATA & MESSAGING == */
  {
    id: "postgresql",
    name: "PostgreSQL",
    group: "Data & Messaging",
    color: "#4169E1",
    svg:
      '<path d="M12 3.2c-4.5 0-7.6 3.5-7.6 8 0 5.5 3.7 9.6 7.6 9.6s7.6-4.1 7.6-9.6c0-4.5-3.1-8-7.6-8Z" fill="currentColor" opacity=".18"/>' +
      '<path d="M8.3 8.2v3.5c0 2.7 1.5 4.3 3.7 4.3s3.7-1.6 3.7-4.3V8.2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>' +
      '<circle cx="10" cy="7.3" r="1.7" fill="currentColor"/><circle cx="14" cy="7.3" r="1.7" fill="currentColor"/>',
  },
  {
    id: "redis",
    name: "Redis",
    group: "Data & Messaging",
    color: "#DC382D",
    featured: true,
    svg:
      '<path d="M12 3.2 3.2 6.6 12 10l8.8-3.4z" fill="currentColor"/>' +
      '<path d="M3.2 10.7 12 14.1l8.8-3.4v2.2L12 16.3l-8.8-3.4z" fill="currentColor" opacity=".72"/>' +
      '<path d="M3.2 15.3 12 18.7l8.8-3.4v2.2L12 20.9l-8.8-3.4z" fill="currentColor" opacity=".45"/>',
  },
  {
    id: "mongodb",
    name: "MongoDB",
    group: "Data & Messaging",
    color: "#47A248",
    svg:
      '<path d="M12 2.4c3.6 3.6 5.5 7.3 5.5 10.7 0 3.6-2.4 6.7-5.5 8.7-3.1-2-5.5-5.1-5.5-8.7 0-3.4 1.9-7.1 5.5-10.7Z" fill="currentColor"/>' +
      '<path d="M12 2.4v19.4" stroke="#fff" stroke-width="1.2" opacity=".55"/>',
  },
  {
    id: "kafka",
    name: "Apache Kafka",
    group: "Data & Messaging",
    color: "#231F20",
    svg:
      '<circle cx="5.4" cy="12" r="2.3" fill="currentColor"/>' +
      '<circle cx="18.6" cy="6.2" r="2.3" fill="currentColor"/>' +
      '<circle cx="18.6" cy="17.8" r="2.3" fill="currentColor"/>' +
      '<path d="M7.4 11.1 16.6 7.2M7.4 12.9l9.2 3.9M18.6 8.5v6.8" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round"/>',
  },
  {
    id: "rabbitmq",
    name: "RabbitMQ",
    group: "Data & Messaging",
    color: "#FF6600",
    svg:
      '<circle cx="12" cy="12" r="8.4" fill="currentColor" opacity=".16"/>' +
      '<path d="M6.8 8.4h3.4v7H6.8zM13.8 8.4h3.4v4.4h-3.4z" fill="currentColor"/>' +
      '<path d="M7 18.4c3.4 1.4 6.6 1.4 10 0" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
  },

  /* ============================================== RUNTIMES & SERVERS == */
  {
    id: "nodejs",
    name: "Node.js",
    group: "Runtimes & Servers",
    color: "#5FA04E",
    svg:
      '<path d="M12 2.4 3.6 7.2v9.6L12 21.6l8.4-4.8V7.2z" fill="currentColor" opacity=".17"/>' +
      '<path d="M12 2.4 3.6 7.2v9.6L12 21.6l8.4-4.8V7.2z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>' +
      '<path d="M9.4 15c0 1.2.9 2 2.6 2 1.9 0 3-1.1 3-3V8.4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
  },
  {
    id: "python",
    name: "Python",
    group: "Runtimes & Servers",
    color: "#3776AB",
    svg:
      '<path d="M11.8 2.8c-2.6 0-4.5 1-4.5 3v2.5h5.1v1H6.3c-1.9 0-3.3 1.4-3.3 4.1s1.1 4.1 2.9 4.1h1.7v-2.9c0-2 1.6-3.3 3.5-3.3h3.5c1.7 0 2.9-1.3 2.9-2.9V5.8c0-1.9-1.8-3-3.9-3z" fill="#3776AB"/>' +
      '<path d="M12.2 21.2c2.6 0 4.5-1 4.5-3v-2.5h-5.1v-1h6.1c1.9 0 3.3-1.4 3.3-4.1s-1.1-4.1-2.9-4.1h-1.7v2.9c0 2-1.6 3.3-3.5 3.3h-3.5c-1.7 0-2.9 1.3-2.9 2.9v4.8c0 1.9 1.8 3 3.9 3z" fill="#FFD43B"/>' +
      '<circle cx="9.5" cy="5.9" r="1" fill="#fff"/><circle cx="14.5" cy="18.1" r="1" fill="#fff"/>',
  },
  {
    id: "golang",
    name: "Go",
    group: "Runtimes & Servers",
    color: "#00ADD8",
    svg:
      '<circle cx="12" cy="13.2" r="7" fill="currentColor"/>' +
      '<circle cx="6.6" cy="6.6" r="2.6" fill="currentColor"/>' +
      '<circle cx="17.4" cy="6.6" r="2.6" fill="currentColor"/>' +
      '<circle cx="9.6" cy="11.6" r="1.55" fill="#fff"/><circle cx="14.4" cy="11.6" r="1.55" fill="#fff"/>' +
      '<circle cx="9.6" cy="11.6" r=".72" fill="#1B1B33"/><circle cx="14.4" cy="11.6" r=".72" fill="#1B1B33"/>' +
      '<path d="M10.1 16.2h3.8" stroke="#fff" stroke-width="1.2" stroke-linecap="round"/>',
  },
  {
    id: "java",
    name: "Java",
    group: "Runtimes & Servers",
    color: "#F89820",
    svg:
      '<path d="M3.4 9h13v5c0 3.3-2.6 5.9-5.9 5.9H9.3c-3.3 0-5.9-2.6-5.9-5.9z" fill="#5382A1"/>' +
      '<path d="M17.2 10h1.4a2.7 2.7 0 0 1 0 5.4h-1.4" fill="none" stroke="#5382A1" stroke-width="1.8"/>' +
      '<path d="M8.2 3.6c-.8 1-.8 1.8 0 2.8s.8 1.8 0 2.8M12.4 3.2c-.8 1-.8 1.8 0 2.8s.8 1.8 0 2.8" stroke="#F89820" stroke-width="1.5" fill="none" stroke-linecap="round"/>',
  },
  {
    id: "dotnet",
    name: ".NET",
    group: "Runtimes & Servers",
    color: "#512BD4",
    svg:
      '<rect x="2.6" y="4.6" width="18.8" height="14.8" rx="3" fill="currentColor" opacity=".12"/>' +
      '<text x="12" y="15.7" text-anchor="middle" font-family="Inter, Helvetica, Arial, sans-serif" ' +
      'font-size="8.4" font-weight="800" letter-spacing="-0.4" fill="currentColor">.NET</text>',
  },
  {
    id: "nginx",
    name: "nginx",
    group: "Runtimes & Servers",
    color: "#009639",
    svg:
      '<path d="M4.2 19.8V4.2l15.6 15.6V4.2" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linejoin="round" stroke-linecap="round"/>',
  },
];
