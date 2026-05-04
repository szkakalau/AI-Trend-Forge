import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const opportunities = [
  {
    title: "AI Resume Tailor Tool",
    slug: "ai-resume-tailor-tool",
    summary:
      "Instantly rewrite resumes per job description so applicants stop sounding generic—and hiring managers see relevance in seconds.",
    painPoint:
      "Job seekers spend hours tweaking resumes for each posting and still get screened out by ATS keyword mismatches.",
    targetUser: "Active job seekers and career coaches managing multiple clients.",
    category: "Career & Hiring",
    score: 92,
    buildDifficulty: "Medium",
    pricingHint: "$12–29/mo individual; $49/mo coach seats.",
    launchChannels: ["LinkedIn", "r/resumes", "Product Hunt", "micro-influencer coaches"],
    mvpFeatures: [
      "Paste JD + resume → tailored bullets",
      "ATS keyword gap checklist",
      "Export PDF/DOCX",
    ],
    sourcePlatform: "Reddit",
    whyNow:
      "Layoffs and AI hiring stacks pushed more applicants online; manual tailoring does not scale.",
    icp: "Mid-level tech/marketing professionals applying to 10+ roles weekly.",
    redditLaunch:
      "Title: I built a tiny tool that tailors your resume to each JD in ~60 seconds — looking for brutal feedback. Body: Paste resume + posting link, get bullet rewrites + keyword gaps. Free during beta.",
    saasPotential:
      "Sticky recurring revenue from heavy applicants; expansion into cover letters and mock interviews.",
    goToMarket:
      "Partner with bootcamps; SEO landing pages per role cluster (PM, SWE, data).",
    landingHeadline: "Resumes that match the job—before you hit submit.",
  },
  {
    title: "AI Cold Email Personalizer",
    slug: "ai-cold-email-personalizer",
    summary:
      "Turn a prospect list into concise, research-backed emails that sound human—not mail-merge spam.",
    painPoint:
      "Outbound teams burn leads with generic sequences; personalization at scale is expensive and inconsistent.",
    targetUser: "SDRs and founders doing founder-led sales.",
    category: "Sales & GTM",
    score: 89,
    buildDifficulty: "Low–Medium",
    pricingHint: "$39/seat/mo; starter pack at $19 for solo founders.",
    launchChannels: ["Indie Hackers", "LinkedIn", "r/sales", "partner agencies"],
    mvpFeatures: [
      "Company/news scrape + 3 hook variants",
      "Tone presets (direct, friendly, enterprise)",
      "CRM snippet export",
    ],
    sourcePlatform: "IndieHackers",
    whyNow:
      "AI slop inboxes made relevance the new moat; lightweight personalization beats volume.",
    icp: "B2B teams sending 50–300 cold emails weekly without a full research team.",
    redditLaunch:
      "Post in r/sales: Side project—paste LinkedIn + site, get 3 personalized openers + CTA—does this save you time or feel creepy?",
    saasPotential:
      "Expand into sequences, deliverability insights, and team analytics with clear ROI metrics.",
    goToMarket:
      "Agency reseller packs; integrations with Apollo / HubSpot via CSV-first MVP.",
    landingHeadline: "Cold emails that prove you did the homework.",
  },
  {
    title: "AI Meeting Notes for Sales Teams",
    slug: "ai-meeting-notes-sales-teams",
    summary:
      "Auto CRM-ready notes: objections, budget signals, next steps—without reps typing during calls.",
    painPoint:
      "Reps skip CRM hygiene; managers lose forecast accuracy when nuance lives in scattered transcripts.",
    targetUser: "SMB sales teams using Zoom/Meet.",
    category: "Sales Ops",
    score: 87,
    buildDifficulty: "Medium",
    pricingHint: "$29/user/mo; team bundles at 5+ seats.",
    launchChannels: ["Product Hunt", "LinkedIn", "partner RevOps consultants"],
    mvpFeatures: [
      "Upload transcript → structured summary",
      "Extract MEDDPICC-style fields",
      "Push to HubSpot notes",
    ],
    sourcePlatform: "Product Hunt",
    whyNow:
      "Hybrid selling increased recorded calls; GPT-class summarization is finally reliable enough.",
    icp: "10–80 person revenue teams without dedicated sales ops.",
    redditLaunch:
      "r/sales title: Would you trust AI notes if they landed straight in HubSpot? Sharing a prototype—tear it apart.",
    saasPotential:
      "Workflow integrations and compliance tiers unlock enterprise expansion.",
    goToMarket:
      "RevOps newsletter sponsorships; templates per vertical (SaaS, agencies).",
    landingHeadline: "Every call captured. CRM updated. No typing.",
  },
  {
    title: "AI Reddit Post Generator",
    slug: "ai-reddit-post-generator",
    summary:
      "Draft authentic community posts that match subreddit norms—without sounding promotional or bot-like.",
    painPoint:
      "Founders need distribution on Reddit but get banned when tone or structure triggers mods.",
    targetUser: "Indie hackers and marketers testing narrative-market fit.",
    category: "Growth",
    score: 84,
    buildDifficulty: "Low",
    pricingHint: "$15/mo hobby; $39/mo with analytics.",
    launchChannels: ["Indie Hackers", "r/startups", "Twitter/X threads"],
    mvpFeatures: [
      "Subreddit tone presets",
      "Anti-spam checklist",
      "Title/body A/B variants",
    ],
    sourcePlatform: "Reddit",
    whyNow:
      "Paid ads fatigue pushes builders toward communities; moderation is stricter—quality assistance wins.",
    icp: "Solo founders launching weekly and needing compliant storytelling.",
    redditLaunch:
      "Ironically: HonestShowHN style post asking mods what triggers removals—product solves that checklist.",
    saasPotential:
      "Add scheduling insights and performance tracking across subs for upsell.",
    goToMarket:
      "Creator partnerships; showcase before/after examples with anonymized posts.",
    landingHeadline: "Reddit posts that pass the vibe check—and the mods.",
  },
  {
    title: "AI YouTube Clip Generator",
    slug: "ai-youtube-clip-generator",
    summary:
      "Find viral-worthy moments in long videos and export vertical clips with captions ready for Shorts/Reels.",
    painPoint:
      "Editors spend hours scrubbing footage; creators miss timely trends because clipping is slow.",
    targetUser: "YouTubers and podcasters repurposing long-form.",
    category: "Creator Economy",
    score: 86,
    buildDifficulty: "Medium–High",
    pricingHint: "$24/mo creator; $79/mo studio.",
    launchChannels: ["YouTube communities", "Twitter/X", "Product Hunt"],
    mvpFeatures: [
      "Highlight detection from transcript",
      "Auto 9:16 crop suggestions",
      "Burn-in captions export",
    ],
    sourcePlatform: "Reddit",
    whyNow:
      "Short-form discovery drives subs; budgets for editors are tight at early channels.",
    icp: "Channels publishing 2+ long videos weekly with repurposing intent.",
    redditLaunch:
      "r/NewTubers: I prototyped an AI that proposes clip timestamps—would you trust it vs manual scrubbing?",
    saasPotential:
      "Credits-based exports and team review queues scale ARPU.",
    goToMarket:
      "Affiliate with editing freelancers; template packs per niche (gaming, finance).",
    landingHeadline: "Turn long videos into a week of shorts—in minutes.",
  },
  {
    title: "AI Customer Support Auto Reply",
    slug: "ai-customer-support-auto-reply",
    summary:
      "Draft accurate first-touch replies from your help center and past tickets—keeping brand tone consistent.",
    painPoint:
      "Small teams drown in repetitive tickets; macros feel robotic and outdated fast.",
    targetUser: "SMB SaaS with 500–5k MAU and lean support.",
    category: "Support & CX",
    score: 88,
    buildDifficulty: "Medium",
    pricingHint: "$49/mo includes 2 seats; overages per ticket bundle.",
    launchChannels: ["Indie Hackers", "MicroConf community", "Zendesk marketplace later"],
    mvpFeatures: [
      "KB ingestion",
      "Tone + policy guardrails",
      "Human approve-before-send",
    ],
    sourcePlatform: "IndieHackers",
    whyNow:
      "Ticket volumes rose post-AI product boom; buyers expect instant answers without hiring fast.",
    icp: "Founding CS teams wanting automation without enterprise suites.",
    redditLaunch:
      "r/SaaS: Would you let AI draft replies if approval stays human? Sharing workflow screenshots.",
    saasPotential:
      "Charge by resolved tier + integrations to Intercom/Zendesk as traction proves.",
    goToMarket:
      "CS freelancer referrals; ROI calculator vs hiring fractional support.",
    landingHeadline: "First-response quality—without hiring another inbox.",
  },
];

async function main() {
  for (const row of opportunities) {
    await prisma.opportunity.upsert({
      where: { slug: row.slug },
      create: row,
      update: row,
    });
  }
}

main()
  .then(() => {
    console.log("Seed complete:", opportunities.length, "opportunities");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
