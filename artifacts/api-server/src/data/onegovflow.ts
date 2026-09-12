export type DemoState = {
  active: boolean;
  step: number;
  message: string;
};

export const dashboard = {
  citizenName: "Aarav Mehta",
  readinessScore: 72,
  eligibleServices: 4,
  uploadedDocuments: 4,
  activeApplications: 2,
  pendingActions: 3,
  timeSavedMinutes: 41,
  profileCompletion: 78,
};

export const profile = {
  id: "citizen-001",
  fullName: "Aarav Mehta",
  email: "aarav.mehta@example.com",
  mobile: "+91 98765 43210",
  age: 24,
  gender: "Male",
  aadhaarMasked: "XXXX XXXX 4821",
  education: "B.Tech · Computer Science",
  occupation: "Software Engineer",
  annualIncome: 480000,
  socialCategory: "General",
  state: "Maharashtra",
  district: "Pune",
  village: "Hinjewadi",
  completion: 78,
};

export const documents = [
  {
    id: "doc-aadhaar",
    name: "Aadhaar Card",
    category: "Identity",
    status: "verified" as const,
    verified: true,
    updatedAt: "12 Sep 2026",
    size: "1.8 MB",
    requiredFor: ["Scholarship applications", "Address services"],
  },
  {
    id: "doc-pan",
    name: "PAN Card",
    category: "Identity",
    status: "verified" as const,
    verified: true,
    updatedAt: "10 Sep 2026",
    size: "1.2 MB",
    requiredFor: ["Employment services", "Business registration"],
  },
  {
    id: "doc-income",
    name: "Income Certificate",
    category: "Financial",
    status: "pending" as const,
    verified: false,
    updatedAt: "08 Sep 2026",
    size: "2.4 MB",
    requiredFor: ["Education scholarships", "Housing schemes"],
  },
  {
    id: "doc-caste",
    name: "Caste Certificate",
    category: "Identity",
    status: "missing" as const,
    verified: false,
    updatedAt: "Not added",
    size: "—",
    requiredFor: ["Education scholarships"],
  },
  {
    id: "doc-domicile",
    name: "Domicile Certificate",
    category: "Address",
    status: "verified" as const,
    verified: true,
    updatedAt: "06 Sep 2026",
    size: "2.1 MB",
    requiredFor: ["State scholarships", "Public services"],
  },
  {
    id: "doc-bank",
    name: "Bank Passbook",
    category: "Financial",
    status: "verified" as const,
    verified: true,
    updatedAt: "02 Sep 2026",
    size: "1.6 MB",
    requiredFor: ["Direct benefit transfers"],
  },
];

export const services = [
  {
    id: "pm-scholarship",
    name: "National Education Scholarship",
    category: "Education",
    description: "Financial support for eligible undergraduate students pursuing higher education.",
    status: "eligible" as const,
    processingTime: "15–20 days",
    requiredDocuments: ["Aadhaar Card", "Income Certificate", "Bank Passbook"],
    reason: "Eligible because your profile shows an undergraduate course and annual income below ₹6 lakh.",
    accent: "violet",
  },
  {
    id: "skill-india",
    name: "Skill India Training",
    category: "Employment",
    description: "Choose from certified training programs that improve employment readiness.",
    status: "eligible" as const,
    processingTime: "7–10 days",
    requiredDocuments: ["Aadhaar Card", "Education Certificate"],
    reason: "Eligible based on your education profile and age.",
    accent: "cyan",
  },
  {
    id: "startup-india",
    name: "Startup India Seed Support",
    category: "Business",
    description: "Explore early-stage support and mentorship for innovative business ideas.",
    status: "needs-action" as const,
    processingTime: "30–45 days",
    requiredDocuments: ["PAN Card", "Bank Passbook", "Business Plan"],
    reason: "Add a business plan to unlock the application checklist.",
    accent: "orange",
  },
  {
    id: "ayushman",
    name: "Ayushman Bharat Health Cover",
    category: "Health",
    description: "Check access to public health coverage and nearby empanelled hospitals.",
    status: "ineligible" as const,
    processingTime: "3–5 days",
    requiredDocuments: ["Aadhaar Card", "Income Certificate"],
    reason: "Your current income profile is above this scheme's threshold.",
    accent: "green",
  },
  {
    id: "housing",
    name: "State Housing Assistance",
    category: "Certificates",
    description: "Review state-level housing support options based on residency and income.",
    status: "needs-action" as const,
    processingTime: "20–30 days",
    requiredDocuments: ["Domicile Certificate", "Income Certificate"],
    reason: "Verify your income certificate to complete this eligibility check.",
    accent: "blue",
  },
  {
    id: "agri-subsidy",
    name: "Digital Agriculture Subsidy",
    category: "Agriculture",
    description: "Access digital application support for eligible agricultural benefits.",
    status: "ineligible" as const,
    processingTime: "10–15 days",
    requiredDocuments: ["Land Record", "Bank Passbook"],
    reason: "Add land ownership details to continue.",
    accent: "teal",
  },
];

export const eligibility = services.map((service) => ({
  serviceId: service.id,
  serviceName: service.name,
  status: service.status,
  reason: service.reason,
  missingDocuments: service.status === "needs-action" ? service.requiredDocuments.filter((document) => !documents.some((item) => item.name === document && item.verified)) : [],
}));

export const applications = [
  {
    id: "app-001",
    serviceName: "National Education Scholarship",
    reference: "OGF-EDU-260912",
    status: "in-review" as const,
    progress: 68,
    updatedAt: "Today, 10:42 AM",
    steps: [
      { label: "Profile", status: "complete" as const, timestamp: "08 Sep 2026" },
      { label: "Documents", status: "complete" as const, timestamp: "09 Sep 2026" },
      { label: "Eligibility", status: "complete" as const, timestamp: "10 Sep 2026" },
      { label: "Verification", status: "current" as const, timestamp: null },
      { label: "Submission", status: "upcoming" as const, timestamp: null },
    ],
  },
  {
    id: "app-002",
    serviceName: "Skill India Training",
    reference: "OGF-SKL-260905",
    status: "action-needed" as const,
    progress: 42,
    updatedAt: "Yesterday, 4:18 PM",
    steps: [
      { label: "Profile", status: "complete" as const, timestamp: "05 Sep 2026" },
      { label: "Documents", status: "current" as const, timestamp: null },
      { label: "Eligibility", status: "upcoming" as const, timestamp: null },
      { label: "Verification", status: "upcoming" as const, timestamp: null },
      { label: "Submission", status: "upcoming" as const, timestamp: null },
    ],
  },
];

export const activities = [
  {
    id: "activity-001",
    title: "Scholarship application moved to verification",
    description: "Your National Education Scholarship application is being reviewed.",
    timestamp: "Today, 10:42 AM",
    type: "verification" as const,
  },
  {
    id: "activity-002",
    title: "Aadhaar Card verified",
    description: "Your identity document is now ready to reuse across services.",
    timestamp: "Yesterday, 2:15 PM",
    type: "document" as const,
  },
  {
    id: "activity-003",
    title: "4 new services unlocked",
    description: "Your updated profile matched four government programs.",
    timestamp: "10 Sep 2026",
    type: "eligibility" as const,
  },
  {
    id: "activity-004",
    title: "Profile details updated",
    description: "Your address and education details were saved.",
    timestamp: "08 Sep 2026",
    type: "profile" as const,
  },
];

export const adminOverview = {
  pendingReview: 18,
  verificationRequests: 7,
  approvedToday: 24,
  averageProcessingTime: "2.4 days",
  queue: [
    { id: "queue-001", applicant: "Aarav Mehta", serviceName: "National Education Scholarship", priority: "high" as const, submittedAt: "12 Sep, 10:42 AM" },
    { id: "queue-002", applicant: "Ishita Rao", serviceName: "Income Certificate", priority: "medium" as const, submittedAt: "12 Sep, 9:18 AM" },
    { id: "queue-003", applicant: "Kabir Khan", serviceName: "Skill India Training", priority: "low" as const, submittedAt: "11 Sep, 5:32 PM" },
  ],
};

export const demo: DemoState = {
  active: false,
  step: 0,
  message: "Ready to run the OneGovFlow walkthrough.",
};