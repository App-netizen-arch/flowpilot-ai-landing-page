(() => {
  'use strict';

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const normalize = (value) => value.trim().replace(/\s+/g, ' ');
  const hasAny = (text, terms) => terms.some((term) => text.includes(term));

  const playbooks = [
    {
      key: 'study',
      match: ['study', 'exam', 'revision', 'assignment', 'course', 'learn'],
      label: 'STUDY PLAYBOOK',
      priority: 'Protect the next focused study block.',
      steps: ['Define the exact topic or deliverable', 'Split the material into short review units', 'Schedule one focused practice block', 'Finish with recall, review, or a timed check'],
      estimate: 4,
      tags: ['Focus block', 'Revision', 'Recall']
    },
    {
      key: 'build',
      match: ['build', 'code', 'app', 'website', 'project', 'software', 'deploy', 'developer'],
      label: 'BUILD PLAYBOOK',
      priority: 'Ship the smallest useful slice first.',
      steps: ['Clarify the outcome and acceptance criteria', 'Break the build into shippable vertical slices', 'Implement the highest-risk slice first', 'Verify, polish, and publish a usable increment'],
      estimate: 6,
      tags: ['Build', 'Verify', 'Ship']
    },
    {
      key: 'freelance',
      match: ['client', 'freelance', 'proposal', 'invoice', 'portfolio', 'gig', 'outreach'],
      label: 'FREELANCE PLAYBOOK',
      priority: 'Protect billable delivery before admin.',
      steps: ['Choose the single revenue-critical outcome', 'Turn client work into clear deliverables', 'Reserve uninterrupted delivery time', 'Batch outreach, invoicing, and follow-up'],
      estimate: 5,
      tags: ['Delivery', 'Revenue', 'Follow-up']
    },
    {
      key: 'launch',
      match: ['launch', 'startup', 'founder', 'product', 'marketing', 'campaign'],
      label: 'LAUNCH PLAYBOOK',
      priority: 'Prioritize the constraint that blocks launch.',
      steps: ['Define launch criteria and the hard deadline', 'List dependencies and remove one major blocker', 'Ship the highest-leverage customer-facing asset', 'Review signals and adjust the next action'],
      estimate: 8,
      tags: ['Leverage', 'Launch', 'Feedback']
    }
  ];

  const fallback = {
    key: 'general',
    match: [],
    label: 'GENERAL PLAYBOOK',
    priority: 'Make the next useful action smaller and clearer.',
    steps: ['Define the outcome in one sentence', 'Break it into three concrete actions', 'Reserve time for the highest-impact action', 'Review progress and choose the next step'],
    estimate: 3,
    tags: ['Clarify', 'Execute', 'Review']
  };

  const score = (text, playbook) => playbook.match.reduce((total, term) => total + (text.includes(term) ? 1 : 0), 0);

  function inferTime(text) {
    const hours = text.match(/(\d+(?:\.\d+)?)\s*(?:hours?|hrs?)/i);
    if (hours) return clamp(Number(hours[1]), 1, 40);
    return null;
  }

  function formatEstimate(hours) {
    return hours === 1 ? '1 focused hour' : `${hours} focused hours`;
  }

  function generatePlan(rawGoal) {
    const goal = normalize(rawGoal);
    if (!goal) {
      return { ok: false, error: 'Enter a goal so FlowPilot can build a plan.' };
    }
    if (goal.length > 240) {
      return { ok: false, error: 'Keep the goal under 240 characters for this demo.' };
    }

    const lower = goal.toLowerCase();
    const selected = playbooks
      .map((candidate) => ({ candidate, score: score(lower, candidate) }))
      .sort((a, b) => b.score - a.score)[0];
    const playbook = selected && selected.score > 0 ? selected.candidate : fallback;
    const available = inferTime(goal);
    const baseHours = available || playbook.estimate;
    const confidence = clamp(0.62 + (selected?.score || 0) * 0.08, 0.62, 0.92);

    return {
      ok: true,
      goal,
      mode: playbook.key,
      label: playbook.label,
      priority: playbook.priority,
      steps: playbook.steps,
      estimate: formatEstimate(baseHours),
      tags: playbook.tags,
      confidence: Math.round(confidence * 100),
      reasoning: `Matched the goal to the ${playbook.label.toLowerCase()} using deterministic intent rules.`,
      generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }

  window.FlowPilotSymbolicAI = Object.freeze({
    version: '1.0.0',
    generatePlan,
    capabilities: ['intent matching', 'rule-based prioritization', 'task decomposition', 'effort estimation']
  });
})();
