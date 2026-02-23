# Specification

## Summary
**Goal:** Build a construction project management application with RAP/RAB planning, multi-stage approval workflow (Foreman → Buyer → Finance), progress tracking with S-Curve visualization, and integrated accounting system.

**Planned changes:**
- Implement Internet Identity authentication with four roles: Admin, Foreman, Buyer, Finance with role-based access control
- Create master data management for Materials (name, unit, price), Jobs, and Vendors with CRUD operations
- Build RAP/RAB creation system with unlimited nested sub-job structure where each level has independent volume, unit, and cost
- Implement master RAP template system for reusable project structures
- Create material/fund request workflow where Foreman selects main jobs (auto-including all sub-jobs and materials)
- Implement Buyer review stage with ability to edit quantities/prices and approve partially, tracking remaining amounts
- Implement Finance review stage with partial approval capability and workflow completion
- Build realization report system where Buyer inputs actual prices from vendor invoices after Finance approval
- Create comprehensive accounting system with automatic journal entries, general ledger, balance sheet, P&L, cash flow, and budget vs actual comparison per job
- Implement progress tracking system recording dates for main jobs to generate S-Curve data
- Build S-Curve visualization showing timeline progress versus planned schedule with interactive chart
- Create role-specific dashboards for Admin, Foreman, Buyer, and Finance showing relevant summaries and pending items
- Implement material usage tracking visible to Buyer when additional requests are submitted
- Design creative visual theme suitable for professional construction management (avoiding blue and purple colors)

**User-visible outcome:** Users can authenticate with Internet Identity, create and manage construction project budgets (RAP/RAB) with unlimited nested sub-jobs, submit and approve material/fund requests through a three-stage workflow (Foreman → Buyer → Finance), track actual costs through realization reports, monitor project progress with S-Curve visualization, view comprehensive accounting reports (balance sheet, P&L, cash flow, budget vs actual), and access role-specific dashboards tailored to their workflow stage.
