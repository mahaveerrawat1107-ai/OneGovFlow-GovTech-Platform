import { Router, type IRouter } from "express";
import {
  CreateApplicationBody,
  CreateApplicationResponse,
  CreateDocumentBody,
  GetActivitiesResponse,
  GetAdminOverviewResponse,
  GetApplicationsResponse,
  GetDashboardResponse,
  GetDocumentsResponse,
  GetEligibilityResponse,
  GetProfileResponse,
  GetServicesQueryParams,
  GetServicesResponse,
  RunJudgeDemoResponse,
  UpdateProfileBody,
  UpdateProfileResponse,
} from "@workspace/api-zod";
import {
  activities,
  adminOverview,
  applications,
  dashboard,
  demo,
  documents,
  eligibility,
  profile,
  services,
} from "../data/onegovflow";

const router: IRouter = Router();

router.get("/dashboard", (_req, res) => {
  res.json(GetDashboardResponse.parse(dashboard));
});

router.get("/activities", (_req, res) => {
  res.json(GetActivitiesResponse.parse(activities));
});

router.get("/profile", (_req, res) => {
  res.json(GetProfileResponse.parse(profile));
});

router.patch("/profile", (req, res) => {
  const input = UpdateProfileBody.parse(req.body);
  Object.assign(profile, input);
  profile.completion = Math.min(100, profile.completion + 4);
  dashboard.profileCompletion = profile.completion;
  dashboard.readinessScore = Math.min(100, dashboard.readinessScore + 3);
  res.json(UpdateProfileResponse.parse(profile));
});

router.get("/documents", (_req, res) => {
  res.json(GetDocumentsResponse.parse(documents));
});

router.post("/documents", (req, res) => {
  const input = CreateDocumentBody.parse(req.body);
  const item = {
    id: `doc-${Date.now()}`,
    name: input.name,
    category: input.category,
    status: "pending" as const,
    verified: false,
    updatedAt: "Just now",
    size: input.size ?? "Pending",
    requiredFor: [],
  };
  documents.unshift(item);
  dashboard.uploadedDocuments = documents.filter((document) => document.status !== "missing").length;
  res.status(201).json(item);
});

router.get("/services", (req, res) => {
  const parsed = GetServicesQueryParams.parse(req.query);
  const search = parsed.search?.toLowerCase();
  const filtered = services.filter((service) => {
    const categoryMatch = !parsed.category || parsed.category === "All" || service.category === parsed.category;
    const searchMatch = !search || `${service.name} ${service.description} ${service.category}`.toLowerCase().includes(search);
    return categoryMatch && searchMatch;
  });
  res.json(GetServicesResponse.parse(filtered));
});

router.get("/eligibility", (_req, res) => {
  res.json(GetEligibilityResponse.parse(eligibility));
});

router.get("/applications", (_req, res) => {
  res.json(GetApplicationsResponse.parse(applications));
});

router.post("/applications", (req, res) => {
  const input = CreateApplicationBody.parse(req.body);
  const service = services.find((item) => item.id === input.serviceId);
  if (!service) {
    res.status(404).json({ error: "Service not found" });
    return;
  }
  const item = {
    id: `app-${Date.now()}`,
    serviceName: service.name,
    reference: `OGF-${service.category.slice(0, 3).toUpperCase()}-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}${String(new Date().getDate()).padStart(2, "0")}`,
    status: "submitted" as const,
    progress: 18,
    updatedAt: "Just now",
    steps: [
      { label: "Profile", status: "complete" as const, timestamp: "Just now" },
      { label: "Documents", status: "current" as const, timestamp: null },
      { label: "Eligibility", status: "upcoming" as const, timestamp: null },
      { label: "Verification", status: "upcoming" as const, timestamp: null },
      { label: "Submission", status: "upcoming" as const, timestamp: null },
    ],
  };
  applications.unshift(item as unknown as (typeof applications)[number]);
  dashboard.activeApplications = applications.length;
  res.status(201).json(CreateApplicationResponse.parse(item));
});

router.post("/demo/run", (_req, res) => {
  demo.active = true;
  demo.step = Math.min(5, demo.step + 1);
  const messages = [
    "Profile ready. Starting the unified citizen journey.",
    "Profile completed and saved.",
    "Aadhaar added to your document vault.",
    "Readiness score updated and services unlocked.",
    "Application submitted with guided verification.",
    "Demo complete. One profile, every government service.",
  ];
  demo.message = messages[demo.step];
  dashboard.readinessScore = Math.min(100, dashboard.readinessScore + 5);
  dashboard.timeSavedMinutes = Math.min(45, dashboard.timeSavedMinutes + 1);
  if (demo.step === 5) demo.active = false;
  res.json(RunJudgeDemoResponse.parse(demo));
});

router.get("/admin/overview", (_req, res) => {
  res.json(GetAdminOverviewResponse.parse(adminOverview));
});

export default router;