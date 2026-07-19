/**
 * Local AI Helper Service
 * Generates task descriptions using keyword analysis and predefined prompt templates.
 * No external API required — runs entirely in-process.
 */

// Keyword-to-context mapping for smarter description generation
const DOMAIN_KEYWORDS = {
  auth: ['login', 'register', 'signup', 'sign up', 'sign in', 'authentication', 'auth', 'password', 'oauth', 'sso', 'jwt', 'logout'],
  ui: ['page', 'ui', 'interface', 'component', 'modal', 'dialog', 'form', 'layout', 'design', 'responsive', 'dashboard', 'screen', 'view', 'navbar', 'sidebar', 'header', 'footer', 'button', 'card'],
  api: ['api', 'endpoint', 'rest', 'graphql', 'request', 'response', 'backend', 'server', 'route', 'webhook', 'integration', 'service', 'microservice'],
  database: ['database', 'db', 'schema', 'model', 'query', 'migration', 'seed', 'mongo', 'sql', 'postgres', 'mysql', 'index', 'collection', 'table'],
  testing: ['test', 'unit test', 'e2e', 'integration test', 'spec', 'coverage', 'jest', 'cypress', 'playwright', 'qa', 'quality'],
  deployment: ['deploy', 'ci/cd', 'pipeline', 'docker', 'kubernetes', 'aws', 'cloud', 'hosting', 'build', 'release', 'devops', 'nginx'],
  performance: ['performance', 'optimize', 'speed', 'cache', 'caching', 'lazy load', 'bundle', 'minify', 'compress', 'cdn'],
  security: ['security', 'encryption', 'ssl', 'https', 'xss', 'csrf', 'sanitize', 'validate', 'permission', 'role', 'access control', 'rbac'],
  notification: ['notification', 'email', 'sms', 'alert', 'push notification', 'webhook', 'message', 'reminder'],
  reporting: ['report', 'analytics', 'chart', 'graph', 'dashboard', 'metrics', 'kpi', 'statistics', 'export', 'csv', 'pdf'],
  payment: ['payment', 'stripe', 'checkout', 'billing', 'invoice', 'subscription', 'cart', 'order', 'transaction'],
  search: ['search', 'filter', 'sort', 'pagination', 'autocomplete', 'elasticsearch', 'fulltext'],
  mobile: ['mobile', 'ios', 'android', 'react native', 'flutter', 'responsive', 'pwa', 'app store'],
  refactor: ['refactor', 'cleanup', 'improve', 'restructure', 'rewrite', 'technical debt', 'code quality'],
  documentation: ['documentation', 'docs', 'readme', 'wiki', 'swagger', 'openapi', 'comment', 'jsdoc'],
};

// Template library keyed by detected domain
const DESCRIPTION_TEMPLATES = {
  auth: [
    'Implement {action} with secure JWT-based authentication, bcrypt password hashing, input validation, and proper error handling. Include rate limiting to prevent brute-force attacks and refresh token support.',
    'Build {action} featuring email/password validation, session management with JWT tokens, and user-friendly error messages. Ensure HTTPS-only cookie handling and CSRF protection.',
    'Create {action} with form validation, password strength indicators, OAuth integration support, and secure token storage on the client side.',
  ],
  ui: [
    'Design and build {action} using a responsive layout that adapts to mobile, tablet, and desktop viewports. Include loading states, empty states, and error boundaries for a polished user experience.',
    'Develop {action} with accessible markup (ARIA labels, keyboard navigation), smooth transitions, and consistent design tokens. Follow WCAG 2.1 AA accessibility standards.',
    'Implement {action} as a reusable component with configurable props, event emitters, and thorough unit tests. Support dark mode and RTL layouts.',
  ],
  api: [
    'Build {action} following RESTful conventions with proper HTTP status codes, request validation, rate limiting, and OpenAPI documentation. Include pagination for list endpoints.',
    'Create {action} with async/await error handling, input sanitization, response caching, and structured logging. Write integration tests covering success and error scenarios.',
    'Develop {action} using MVC architecture with middleware for authentication, validation, and centralized error handling. Add request/response logging for debugging.',
  ],
  database: [
    'Design and implement {action} with proper indexing for query performance, data validation at the schema level, and migration scripts. Add seed data for local development.',
    'Create {action} with optimized queries, connection pooling, and transaction support where needed. Document the schema with field descriptions and relationship diagrams.',
    'Implement {action} including schema validation, compound indexes for common query patterns, and a rollback strategy for failed migrations.',
  ],
  testing: [
    'Write comprehensive tests for {action} covering unit tests for business logic, integration tests for API endpoints, and E2E tests for critical user journeys. Aim for 80%+ code coverage.',
    'Implement {action} using a test-driven approach with mocks for external dependencies. Include edge case handling, boundary value testing, and performance benchmarks.',
    'Develop {action} with automated test suites that run in CI/CD, covering happy paths, error scenarios, and security edge cases.',
  ],
  deployment: [
    'Set up {action} with zero-downtime deployments, automated rollback triggers, environment-specific configurations, and health checks. Document the deployment runbook.',
    'Configure {action} including Dockerfile optimization, CI/CD pipeline stages (build, test, deploy), secret management, and monitoring/alerting integration.',
    'Implement {action} with blue-green deployment strategy, infrastructure-as-code, and automated smoke tests post-deployment.',
  ],
  performance: [
    'Optimize {action} by profiling bottlenecks, implementing caching strategies (Redis/CDN), lazy loading assets, and reducing bundle size. Set performance budgets and monitor Core Web Vitals.',
    'Improve {action} through code splitting, memoization, database query optimization, and image compression. Establish baseline metrics before and after changes.',
    'Enhance {action} with server-side rendering or static generation where appropriate, HTTP/2 push, and prefetching strategies for predictable user flows.',
  ],
  security: [
    'Implement {action} with input sanitization, output encoding, CSRF protection, and security headers (CSP, HSTS). Conduct a threat model review and document security decisions.',
    'Harden {action} by adding role-based access control, audit logging, rate limiting, and dependency vulnerability scanning in CI. Follow OWASP Top 10 guidelines.',
    'Secure {action} with end-to-end encryption, principle of least privilege, secure coding review, and penetration testing for critical paths.',
  ],
  notification: [
    'Build {action} with support for multiple channels (email, push, in-app), user preference management, retry logic for failed deliveries, and unsubscribe handling.',
    'Implement {action} using an event-driven architecture with queuing (Redis/SQS), templating system, and delivery status tracking. Support localization for multiple languages.',
    'Create {action} with real-time delivery via WebSockets, digest grouping to prevent notification fatigue, and analytics tracking for open and click rates.',
  ],
  reporting: [
    'Develop {action} with interactive charts using Chart.js or D3, date range filtering, data export to CSV/PDF, and scheduled report delivery via email.',
    'Build {action} featuring customizable KPI dashboards, drill-down capabilities, real-time data updates, and role-based data visibility controls.',
    'Implement {action} with caching for expensive aggregations, responsive visualizations, and printable report layouts.',
  ],
  payment: [
    'Integrate {action} using Stripe (or equivalent) with webhook handling for async events, idempotency keys to prevent duplicate charges, and PCI-compliant card handling.',
    'Build {action} with secure checkout flow, subscription billing support, refund processing, and automated invoice generation. Add fraud detection rules.',
    'Implement {action} with support for multiple currencies, tax calculation, promo codes, and a clear audit trail of all financial transactions.',
  ],
  search: [
    'Implement {action} with debounced full-text search, relevance ranking, faceted filtering, and URL-serialized filter state for shareable search results.',
    'Build {action} featuring autocomplete suggestions, search history, highlighted match terms in results, and server-side pagination for large datasets.',
    'Create {action} with advanced filter combinations, saved search functionality, and analytics tracking on popular search queries.',
  ],
  mobile: [
    'Develop {action} with a mobile-first approach, touch-friendly interactions (44px tap targets), offline support via service workers, and app store deployment setup.',
    'Build {action} ensuring consistent behavior across iOS and Android with native-like transitions, haptic feedback, and biometric authentication support.',
    'Implement {action} with responsive breakpoints, progressive enhancement, reduced-motion support, and performance budgets for mobile networks.',
  ],
  refactor: [
    'Refactor {action} by extracting reusable utilities, eliminating code duplication, improving naming clarity, and adding missing test coverage. Document the before/after architecture decisions.',
    'Restructure {action} following SOLID principles, reducing coupling between modules, and improving error handling consistency. Ensure zero regressions with existing test suite.',
    'Clean up {action} by removing dead code, standardizing patterns, updating deprecated dependencies, and improving code documentation.',
  ],
  documentation: [
    'Write documentation for {action} including a clear overview, installation steps, configuration options, API reference, and code examples covering the most common use cases.',
    'Create {action} with auto-generated API docs via Swagger/OpenAPI, architecture diagrams, and a developer quickstart guide. Keep it versioned alongside the codebase.',
    'Document {action} with JSDoc annotations, README updates, and a CHANGELOG. Include troubleshooting tips for known issues.',
  ],
  default: [
    'Implement {action} following best practices: break down the work into small, testable units, add proper error handling and logging, write unit tests, and document any non-obvious decisions.',
    'Build {action} with clean, maintainable code using clear naming conventions, separation of concerns, and defensive programming. Include a brief code review checklist.',
    'Develop {action} ensuring it is accessible, performant, and well-tested. Use async/await for any I/O operations, validate all inputs, and handle edge cases gracefully.',
  ],
};

// Action verb extraction helpers
const ACTION_VERBS = ['build', 'create', 'implement', 'design', 'develop', 'add', 'set up', 'configure', 'integrate', 'write', 'fix', 'update', 'improve', 'refactor', 'optimize', 'migrate'];

function extractAction(title) {
  const lower = title.toLowerCase();
  for (const verb of ACTION_VERBS) {
    if (lower.startsWith(verb)) {
      return title; // title already starts with an action verb — use as-is
    }
  }
  // Default: prepend "implement" for noun-only titles
  return title;
}

function detectDomain(title) {
  const lower = title.toLowerCase();
  const scores = {};

  for (const [domain, keywords] of Object.entries(DOMAIN_KEYWORDS)) {
    scores[domain] = keywords.reduce((acc, kw) => acc + (lower.includes(kw) ? 1 : 0), 0);
  }

  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  return best[1] > 0 ? best[0] : 'default';
}

function pickTemplate(templates) {
  return templates[Math.floor(Math.random() * templates.length)];
}

/**
 * Generate a task description from a title using local NLP heuristics.
 * @param {string} title - The task title
 * @returns {{ description: string, domain: string }}
 */
const generateDescription = (title) => {
  if (!title || title.trim().length < 2) {
    return {
      description: 'Define the scope, acceptance criteria, and implementation steps for this task. Break it down into subtasks, add relevant context, and link any related issues or resources.',
      domain: 'default',
    };
  }

  const domain = detectDomain(title);
  const templates = DESCRIPTION_TEMPLATES[domain] || DESCRIPTION_TEMPLATES.default;
  const template = pickTemplate(templates);
  const action = extractAction(title.trim());

  // Fill the {action} placeholder (lowercase for mid-sentence fit)
  const description = template.replace('{action}', action.charAt(0).toLowerCase() + action.slice(1));

  return { description, domain };
};

module.exports = { generateDescription };
