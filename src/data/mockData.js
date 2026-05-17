export const governanceScore = 74

export const complianceFrameworks = [
  { id: 1, name: 'GDPR', status: 'Compliant', score: 92, lastReview: '2025-04-15', nextReview: '2025-10-15' },
  { id: 2, name: 'EU AI Act', status: 'At Risk', score: 61, lastReview: '2025-03-22', nextReview: '2025-06-22' },
  { id: 3, name: 'ISO 42001', status: 'Under Review', score: 78, lastReview: '2025-05-01', nextReview: '2025-08-01' },
  { id: 4, name: 'SOC 2 Type II', status: 'Compliant', score: 88, lastReview: '2025-04-28', nextReview: '2025-10-28' },
  { id: 5, name: 'NIST AI RMF', status: 'At Risk', score: 55, lastReview: '2025-02-14', nextReview: '2025-05-14' },
  { id: 6, name: 'IEEE 7000', status: 'Non-Compliant', score: 38, lastReview: '2025-01-10', nextReview: '2025-04-10' },
]

export const models = [
  { id: 'M-001', name: 'GPT-4o Enterprise', vendor: 'OpenAI', riskTier: 'High', status: 'Active', owner: 'Dr. Sarah Chen', department: 'Customer Intelligence', lastAudit: '2025-04-18', useCase: 'Customer support automation' },
  { id: 'M-002', name: 'Claude 3.5 Sonnet', vendor: 'Anthropic', riskTier: 'Medium', status: 'Active', owner: 'James Okafor', department: 'Legal & Compliance', lastAudit: '2025-05-02', useCase: 'Contract analysis & summarization' },
  { id: 'M-003', name: 'LLaMA-3 70B (Fine-tuned)', vendor: 'Internal', riskTier: 'High', status: 'Under Review', owner: 'Dr. Maria Santos', department: 'Risk Analytics', lastAudit: '2025-03-30', useCase: 'Credit risk scoring' },
  { id: 'M-004', name: 'BERT Sentiment Classifier', vendor: 'Internal', riskTier: 'Low', status: 'Active', owner: 'Alex Huang', department: 'Marketing', lastAudit: '2025-04-25', useCase: 'Brand sentiment monitoring' },
  { id: 'M-005', name: 'Stable Diffusion XL', vendor: 'Stability AI', riskTier: 'Medium', status: 'Under Review', owner: 'Priya Nair', department: 'Brand & Creative', lastAudit: '2025-04-10', useCase: 'Marketing asset generation' },
  { id: 'M-006', name: 'Custom NLP Pipeline v2', vendor: 'Internal', riskTier: 'Low', status: 'Active', owner: 'Tom Fischer', department: 'Operations', lastAudit: '2025-05-08', useCase: 'Document classification' },
  { id: 'M-007', name: 'Facial Recognition Module', vendor: 'BioMetrix Corp', riskTier: 'High', status: 'Retired', owner: 'Compliance Team', department: 'Security', lastAudit: '2024-11-15', useCase: 'Physical access control (decommissioned)' },
  { id: 'M-008', name: 'Predictive Attrition Engine', vendor: 'Internal', riskTier: 'High', status: 'Active', owner: 'Dr. Lisa Park', department: 'HR Analytics', lastAudit: '2025-04-01', useCase: 'Employee attrition prediction' },
  { id: 'M-009', name: 'GPT-3.5 Turbo (Legacy)', vendor: 'OpenAI', riskTier: 'Medium', status: 'Retired', owner: 'Dev Platform Team', department: 'Engineering', lastAudit: '2025-01-20', useCase: 'Internal chatbot (deprecated)' },
  { id: 'M-010', name: 'Decision Support LLM', vendor: 'Cohere', riskTier: 'High', status: 'Under Review', owner: 'Dr. Robert Kim', department: 'Executive Strategy', lastAudit: '2025-05-12', useCase: 'Strategic planning recommendations' },
]

export const risks = [
  { id: 'R-001', description: 'Algorithmic bias in credit risk scoring producing disparate impact on protected groups', severity: 'Critical', likelihood: 'High', category: 'Fairness & Bias', status: 'Mitigating', owner: 'Dr. Maria Santos', dueDate: '2025-07-01', relatedModel: 'M-003' },
  { id: 'R-002', description: 'LLM hallucination in customer-facing advice without sufficient human oversight controls', severity: 'High', likelihood: 'Medium', category: 'Reliability', status: 'Open', owner: 'Dr. Sarah Chen', dueDate: '2025-06-15', relatedModel: 'M-001' },
  { id: 'R-003', description: 'Insufficient model explainability documentation for EU AI Act Article 13 compliance', severity: 'High', likelihood: 'High', category: 'Regulatory', status: 'Open', owner: 'Compliance Team', dueDate: '2025-05-31', relatedModel: 'M-010' },
  { id: 'R-004', description: 'Adversarial prompt injection attacks on public-facing LLM endpoints', severity: 'High', likelihood: 'Medium', category: 'Security', status: 'Mitigating', owner: 'Security Team', dueDate: '2025-06-30', relatedModel: 'M-001' },
  { id: 'R-005', description: 'Training data containing PII without explicit consent for model fine-tuning', severity: 'Critical', likelihood: 'Low', category: 'Data Privacy', status: 'Resolved', owner: 'DPO Office', dueDate: '2025-04-30', relatedModel: 'M-003' },
  { id: 'R-006', description: 'Model performance drift in production environment exceeding acceptable accuracy threshold', severity: 'Medium', likelihood: 'High', category: 'Reliability', status: 'Monitoring', owner: 'MLOps Team', dueDate: '2025-07-15', relatedModel: 'M-004' },
  { id: 'R-007', description: 'Third-party AI API vendor lock-in creating operational continuity risk', severity: 'Medium', likelihood: 'Medium', category: 'Operational', status: 'Accepted', owner: 'CTO Office', dueDate: '2025-09-01', relatedModel: 'M-001' },
  { id: 'R-008', description: 'Shadow AI deployments by business units circumventing governance review process', severity: 'High', likelihood: 'High', category: 'Governance', status: 'Open', owner: 'AI Governance Board', dueDate: '2025-06-01', relatedModel: null },
  { id: 'R-009', description: 'Generative AI model producing copyright-infringing content in marketing materials', severity: 'Medium', likelihood: 'Medium', category: 'Legal', status: 'Mitigating', owner: 'Legal Team', dueDate: '2025-07-31', relatedModel: 'M-005' },
  { id: 'R-010', description: 'Employee attrition model used for termination decisions without adequate human review', severity: 'Critical', likelihood: 'Low', category: 'Ethics', status: 'Monitoring', owner: 'HR Compliance', dueDate: '2025-08-15', relatedModel: 'M-008' },
  { id: 'R-011', description: 'Inadequate access controls on model training pipelines allowing unauthorized modification', severity: 'High', likelihood: 'Low', category: 'Security', status: 'Resolved', owner: 'InfoSec Team', dueDate: '2025-05-15', relatedModel: null },
  { id: 'R-012', description: 'Lack of documented fallback procedures when AI systems become unavailable', severity: 'Low', likelihood: 'Medium', category: 'Operational', status: 'Open', owner: 'Operations Team', dueDate: '2025-08-01', relatedModel: null },
]

export const auditLog = [
  { id: 'A-001', timestamp: '2025-05-16T14:23:11Z', type: 'Risk Assessment', system: 'Decision Support LLM', actor: 'Dr. Robert Kim', outcome: 'Flag', details: 'High-impact decision system identified without documented human oversight protocol. Escalated to governance board.' },
  { id: 'A-002', timestamp: '2025-05-15T09:45:00Z', type: 'Model Deployment', system: 'Custom NLP Pipeline v2', actor: 'Tom Fischer', outcome: 'Approved', details: 'Version 2.1.4 deployment approved following full impact assessment. Low risk classification confirmed by board.' },
  { id: 'A-003', timestamp: '2025-05-14T16:02:33Z', type: 'Compliance Review', system: 'EU AI Act Assessment', actor: 'Compliance Team', outcome: 'Warning', details: 'Three high-risk AI systems (M-001, M-003, M-008) lack required technical documentation under EU AI Act Article 11.' },
  { id: 'A-004', timestamp: '2025-05-13T11:30:00Z', type: 'Security Scan', system: 'GPT-4o Enterprise', actor: 'Security Automation', outcome: 'Pass', details: 'Automated adversarial probe testing completed. 847 test cases executed. Prompt injection guardrails fully validated.' },
  { id: 'A-005', timestamp: '2025-05-12T14:15:22Z', type: 'Model Audit', system: 'Decision Support LLM', actor: 'External Auditor: KPMG AI', outcome: 'Under Review', details: 'Third-party audit initiated. Preliminary findings indicate insufficient bias testing coverage. Full report pending in 14 days.' },
  { id: 'A-006', timestamp: '2025-05-10T10:00:00Z', type: 'Policy Update', system: 'AI Governance Framework', actor: 'AI Governance Board', outcome: 'Approved', details: 'Updated AI use policy v3.2 ratified. New mandatory bias testing requirements effective 2025-07-01.' },
  { id: 'A-007', timestamp: '2025-05-08T13:44:17Z', type: 'Incident Report', system: 'LLaMA-3 70B (Fine-tuned)', actor: 'Dr. Maria Santos', outcome: 'Flag', details: 'Statistical parity difference of 0.12 detected in credit scoring outputs. Mitigation plan activated, model placed under review.' },
  { id: 'A-008', timestamp: '2025-05-07T09:20:05Z', type: 'Training Review', system: 'Predictive Attrition Engine', actor: 'HR Compliance', outcome: 'Warning', details: 'Human review rate for model-flagged employees at 34%, below required 80% threshold. Corrective action plan required.' },
  { id: 'A-009', timestamp: '2025-05-05T15:30:00Z', type: 'Model Retirement', system: 'GPT-3.5 Turbo (Legacy)', actor: 'Dev Platform Team', outcome: 'Approved', details: 'Legacy model decommission completed. All API dependencies migrated to Claude 3.5 Sonnet. Retirement documentation archived.' },
  { id: 'A-010', timestamp: '2025-05-02T11:00:00Z', type: 'Model Audit', system: 'Claude 3.5 Sonnet', actor: 'Legal & Compliance', outcome: 'Pass', details: 'Quarterly audit completed. Contract analysis outputs reviewed by 3 senior attorneys. Accuracy 94.2%, within acceptable bounds.' },
  { id: 'A-011', timestamp: '2025-04-30T14:05:44Z', type: 'Data Governance', system: 'LLaMA-3 70B (Fine-tuned)', actor: 'DPO Office', outcome: 'Resolved', details: 'PII in training dataset identified and remediated. Data pipeline updated with anonymization step. Risk R-005 closed.' },
  { id: 'A-012', timestamp: '2025-04-28T10:22:00Z', type: 'Compliance Review', system: 'SOC 2 Type II', actor: 'External Auditor: Deloitte', outcome: 'Pass', details: 'SOC 2 Type II audit for AI systems concluded. Zero control deficiencies. Certificate valid through 2026-04-28.' },
  { id: 'A-013', timestamp: '2025-04-25T09:15:33Z', type: 'Security Scan', system: 'BERT Sentiment Classifier', actor: 'Security Automation', outcome: 'Pass', details: 'Routine security scan completed. No vulnerabilities detected. Model serving infrastructure patched to latest stable version.' },
  { id: 'A-014', timestamp: '2025-04-18T14:00:00Z', type: 'Model Audit', system: 'GPT-4o Enterprise', actor: 'Dr. Sarah Chen', outcome: 'Warning', details: 'Audit identified gaps in logging completeness for EU AI Act audit trail requirements. Remediation sprint Q2 scheduled.' },
  { id: 'A-015', timestamp: '2025-04-15T11:30:00Z', type: 'Compliance Review', system: 'GDPR Assessment', actor: 'DPO Office', outcome: 'Pass', details: 'Annual GDPR compliance review completed for all AI-processed personal data. All processors documented. Score: 92/100.' },
]

export const complianceTrend = [
  { month: 'Jun 24', score: 58 },
  { month: 'Jul 24', score: 60 },
  { month: 'Aug 24', score: 63 },
  { month: 'Sep 24', score: 61 },
  { month: 'Oct 24', score: 65 },
  { month: 'Nov 24', score: 68 },
  { month: 'Dec 24', score: 66 },
  { month: 'Jan 25', score: 70 },
  { month: 'Feb 25', score: 69 },
  { month: 'Mar 25', score: 71 },
  { month: 'Apr 25', score: 73 },
  { month: 'May 25', score: 74 },
]

export const riskDistribution = [
  { name: 'Critical', value: 3, color: '#dc2626' },
  { name: 'High', value: 5, color: '#ef4444' },
  { name: 'Medium', value: 3, color: '#f59e0b' },
  { name: 'Low', value: 1, color: '#10b981' },
]
