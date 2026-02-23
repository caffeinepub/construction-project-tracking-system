import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Initialize authorization/access-control
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserRole = AccessControl.UserRole;

  // Application-specific roles
  public type AppRole = {
    #Admin;
    #Foreman;
    #Buyer;
    #Finance;
  };

  public type UserProfile = {
    name : Text;
    appRole : AppRole;
  };

  public type Material = {
    id : Nat;
    name : Text;
    unit : Text;
    price : Nat;
  };

  public type Job = {
    id : Nat;
    name : Text;
    volume : Nat;
    unit : Text;
    cost : Nat;
    parentId : ?Nat;
  };

  public type Vendor = {
    id : Nat;
    name : Text;
    address : Text;
    phone : Text;
  };

  public type RAPTemplate = {
    id : Nat;
    name : Text;
    jobs : [Job];
  };

  public type MaterialRequest = {
    id : Nat;
    jobId : Nat;
    materialId : Nat;
    quantity : Nat;
    requestedBy : Principal;
    approvedByBuyer : Bool;
    approvedByFinance : Bool;
    finalApproval : Bool;
    buyerPrice : ?Nat;
    financePrice : ?Nat;
  };

  public type ProgressRecord = {
    jobId : Nat;
    date : Time.Time;
    percentage : Nat;
  };

  public type RealizationReport = {
    materialId : Nat;
    actualPrice : Nat;
    vendorId : Nat;
    date : Time.Time;
    createdBy : Principal;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let materials = Map.empty<Nat, Material>();
  let jobs = Map.empty<Nat, Job>();
  let vendors = Map.empty<Nat, Vendor>();
  let rapTemplates = Map.empty<Nat, RAPTemplate>();
  let materialRequests = Map.empty<Nat, MaterialRequest>();
  let progressRecords = Map.empty<Nat, ProgressRecord>();
  let realizationReports = Map.empty<Nat, RealizationReport>();

  var nextMaterialId = 1;
  var nextJobId = 1;
  var nextVendorId = 1;
  var nextRAPTemplateId = 1;
  var nextMaterialRequestId = 1;
  var nextProgressRecordId = 1;
  var nextRealizationReportId = 1;

  // Helper functions for role checking
  private func hasAppRole(caller : Principal, requiredRole : AppRole) : Bool {
    switch (userProfiles.get(caller)) {
      case (null) { false };
      case (?profile) {
        switch (requiredRole, profile.appRole) {
          case (#Admin, #Admin) { true };
          case (#Foreman, #Foreman) { true };
          case (#Buyer, #Buyer) { true };
          case (#Finance, #Finance) { true };
          case _ { false };
        };
      };
    };
  };

  private func isAdminRole(caller : Principal) : Bool {
    hasAppRole(caller, #Admin)
  };

  private func isForemanRole(caller : Principal) : Bool {
    hasAppRole(caller, #Foreman)
  };

  private func isBuyerRole(caller : Principal) : Bool {
    hasAppRole(caller, #Buyer)
  };

  private func isFinanceRole(caller : Principal) : Bool {
    hasAppRole(caller, #Finance)
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view profiles");
    };
    userProfiles.get(caller)
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view profiles");
    };
    if (caller != user and not isAdminRole(caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile unless you are an admin");
    };
    userProfiles.get(user)
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can save profiles");
    };

    // Only admins can assign Admin role, users can set their own non-admin roles on first save
    switch (userProfiles.get(caller)) {
      case (null) {
        // First time profile creation - allow any role except Admin
        switch (profile.appRole) {
          case (#Admin) {
            if (not AccessControl.isAdmin(accessControlState, caller)) {
              Runtime.trap("Unauthorized: Only system admins can assign Admin role");
            };
          };
          case _ { /* Allow Foreman, Buyer, Finance */ };
        };
      };
      case (?existingProfile) {
        // Profile update - only admins can change roles
        if (existingProfile.appRole != profile.appRole and not isAdminRole(caller)) {
          Runtime.trap("Unauthorized: Only admins can change user roles");
        };
      };
    };

    userProfiles.add(caller, profile);
  };

  // Admin function to assign roles
  public shared ({ caller }) func assignUserRole(user : Principal, profile : UserProfile) : async () {
    if (not isAdminRole(caller)) {
      Runtime.trap("Unauthorized: Only admins can assign user roles");
    };
    userProfiles.add(user, profile);
  };

  // Master Data Management - Admin only
  public shared ({ caller }) func addMaterial(name : Text, unit : Text, price : Nat) : async () {
    if (not isAdminRole(caller)) {
      Runtime.trap("Unauthorized: Only Admin can add materials");
    };
    let material : Material = {
      id = nextMaterialId;
      name;
      unit;
      price;
    };
    materials.add(nextMaterialId, material);
    nextMaterialId += 1;
  };

  public shared ({ caller }) func updateMaterial(id : Nat, name : Text, unit : Text, price : Nat) : async () {
    if (not isAdminRole(caller)) {
      Runtime.trap("Unauthorized: Only Admin can update materials");
    };
    switch (materials.get(id)) {
      case (null) { Runtime.trap("Material not found") };
      case (?_) {
        let material : Material = { id; name; unit; price };
        materials.add(id, material);
      };
    };
  };

  public shared ({ caller }) func deleteMaterial(id : Nat) : async () {
    if (not isAdminRole(caller)) {
      Runtime.trap("Unauthorized: Only Admin can delete materials");
    };
    materials.remove(id);
  };

  public query ({ caller }) func getAllMaterials() : async [Material] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view materials");
    };
    materials.values().toArray()
  };

  public shared ({ caller }) func addJob(name : Text, volume : Nat, unit : Text, cost : Nat, parentId : ?Nat) : async () {
    if (not isAdminRole(caller)) {
      Runtime.trap("Unauthorized: Only Admin can add jobs");
    };
    let job : Job = {
      id = nextJobId;
      name;
      volume;
      unit;
      cost;
      parentId;
    };
    jobs.add(nextJobId, job);
    nextJobId += 1;
  };

  public shared ({ caller }) func updateJob(id : Nat, name : Text, volume : Nat, unit : Text, cost : Nat, parentId : ?Nat) : async () {
    if (not isAdminRole(caller)) {
      Runtime.trap("Unauthorized: Only Admin can update jobs");
    };
    switch (jobs.get(id)) {
      case (null) { Runtime.trap("Job not found") };
      case (?_) {
        let job : Job = { id; name; volume; unit; cost; parentId };
        jobs.add(id, job);
      };
    };
  };

  public shared ({ caller }) func deleteJob(id : Nat) : async () {
    if (not isAdminRole(caller)) {
      Runtime.trap("Unauthorized: Only Admin can delete jobs");
    };
    jobs.remove(id);
  };

  public query ({ caller }) func getAllJobs() : async [Job] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view jobs");
    };
    jobs.values().toArray()
  };

  public shared ({ caller }) func addVendor(name : Text, address : Text, phone : Text) : async () {
    if (not isAdminRole(caller)) {
      Runtime.trap("Unauthorized: Only Admin can add vendors");
    };
    let vendor : Vendor = {
      id = nextVendorId;
      name;
      address;
      phone;
    };
    vendors.add(nextVendorId, vendor);
    nextVendorId += 1;
  };

  public shared ({ caller }) func updateVendor(id : Nat, name : Text, address : Text, phone : Text) : async () {
    if (not isAdminRole(caller)) {
      Runtime.trap("Unauthorized: Only Admin can update vendors");
    };
    switch (vendors.get(id)) {
      case (null) { Runtime.trap("Vendor not found") };
      case (?_) {
        let vendor : Vendor = { id; name; address; phone };
        vendors.add(id, vendor);
      };
    };
  };

  public shared ({ caller }) func deleteVendor(id : Nat) : async () {
    if (not isAdminRole(caller)) {
      Runtime.trap("Unauthorized: Only Admin can delete vendors");
    };
    vendors.remove(id);
  };

  public query ({ caller }) func getAllVendors() : async [Vendor] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view vendors");
    };
    vendors.values().toArray()
  };

  // RAP and RAB Management - Admin only
  public shared ({ caller }) func createRAPTemplate(name : Text, jobsList : [Job]) : async () {
    if (not isAdminRole(caller)) {
      Runtime.trap("Unauthorized: Only Admin can create RAP templates");
    };
    let template : RAPTemplate = {
      id = nextRAPTemplateId;
      name;
      jobs = jobsList;
    };
    rapTemplates.add(nextRAPTemplateId, template);
    nextRAPTemplateId += 1;
  };

  public shared ({ caller }) func updateRAPTemplate(id : Nat, name : Text, jobsList : [Job]) : async () {
    if (not isAdminRole(caller)) {
      Runtime.trap("Unauthorized: Only Admin can update RAP templates");
    };
    switch (rapTemplates.get(id)) {
      case (null) { Runtime.trap("RAP template not found") };
      case (?_) {
        let template : RAPTemplate = { id; name; jobs = jobsList };
        rapTemplates.add(id, template);
      };
    };
  };

  public shared ({ caller }) func deleteRAPTemplate(id : Nat) : async () {
    if (not isAdminRole(caller)) {
      Runtime.trap("Unauthorized: Only Admin can delete RAP templates");
    };
    rapTemplates.remove(id);
  };

  public query ({ caller }) func getAllRAPTemplates() : async [RAPTemplate] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view RAP templates");
    };
    rapTemplates.values().toArray()
  };

  // Material Request Workflow - Foreman creates requests
  public shared ({ caller }) func createMaterialRequest(jobId : Nat, materialId : Nat, quantity : Nat) : async () {
    if (not isForemanRole(caller)) {
      Runtime.trap("Unauthorized: Only Foreman can create material requests");
    };

    // Verify job and material exist
    switch (jobs.get(jobId)) {
      case (null) { Runtime.trap("Job not found") };
      case (?_) {};
    };
    switch (materials.get(materialId)) {
      case (null) { Runtime.trap("Material not found") };
      case (?_) {};
    };

    let request : MaterialRequest = {
      id = nextMaterialRequestId;
      jobId;
      materialId;
      quantity;
      requestedBy = caller;
      approvedByBuyer = false;
      approvedByFinance = false;
      finalApproval = false;
      buyerPrice = null;
      financePrice = null;
    };
    materialRequests.add(nextMaterialRequestId, request);
    nextMaterialRequestId += 1;
  };

  // Buyer approves and sets price
  public shared ({ caller }) func approveMaterialRequestByBuyer(requestId : Nat, price : Nat, quantity : Nat) : async () {
    if (not isBuyerRole(caller)) {
      Runtime.trap("Unauthorized: Only Buyer can approve material requests");
    };

    switch (materialRequests.get(requestId)) {
      case (null) { Runtime.trap("Material request not found") };
      case (?request) {
        if (request.approvedByBuyer) {
          Runtime.trap("Request already approved by Buyer");
        };

        let updatedRequest : MaterialRequest = {
          request with
          approvedByBuyer = true;
          buyerPrice = ?price;
          quantity = quantity;
        };
        materialRequests.add(requestId, updatedRequest);
      };
    };
  };

  // Finance final approval
  public shared ({ caller }) func approveMaterialRequestByFinance(requestId : Nat, finalPrice : Nat) : async () {
    if (not isFinanceRole(caller)) {
      Runtime.trap("Unauthorized: Only Finance can give final approval");
    };

    switch (materialRequests.get(requestId)) {
      case (null) { Runtime.trap("Material request not found") };
      case (?request) {
        if (not request.approvedByBuyer) {
          Runtime.trap("Request must be approved by Buyer first");
        };
        if (request.approvedByFinance) {
          Runtime.trap("Request already approved by Finance");
        };

        let updatedRequest : MaterialRequest = {
          request with
          approvedByFinance = true;
          finalApproval = true;
          financePrice = ?finalPrice;
        };
        materialRequests.add(requestId, updatedRequest);
      };
    };
  };

  public query ({ caller }) func getAllMaterialRequests() : async [MaterialRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view material requests");
    };
    materialRequests.values().toArray()
  };

  public query ({ caller }) func getMyMaterialRequests() : async [MaterialRequest] {
    if (not isForemanRole(caller)) {
      Runtime.trap("Unauthorized: Only Foreman can view their own requests");
    };

    let allRequests = materialRequests.values().toArray();
    allRequests.filter<MaterialRequest>(func(req) { req.requestedBy == caller })
  };

  public query ({ caller }) func getPendingBuyerApprovals() : async [MaterialRequest] {
    if (not isBuyerRole(caller)) {
      Runtime.trap("Unauthorized: Only Buyer can view pending approvals");
    };

    let allRequests = materialRequests.values().toArray();
    allRequests.filter<MaterialRequest>(func(req) { not req.approvedByBuyer })
  };

  public query ({ caller }) func getPendingFinanceApprovals() : async [MaterialRequest] {
    if (not isFinanceRole(caller)) {
      Runtime.trap("Unauthorized: Only Finance can view pending approvals");
    };

    let allRequests = materialRequests.values().toArray();
    allRequests.filter<MaterialRequest>(func(req) { req.approvedByBuyer and not req.approvedByFinance })
  };

  // Progress Tracking - Foreman records progress
  public shared ({ caller }) func recordProgress(jobId : Nat, percentage : Nat) : async () {
    if (not isForemanRole(caller)) {
      Runtime.trap("Unauthorized: Only Foreman can record progress");
    };

    if (percentage > 100) {
      Runtime.trap("Percentage cannot exceed 100");
    };

    switch (jobs.get(jobId)) {
      case (null) { Runtime.trap("Job not found") };
      case (?_) {};
    };

    let record : ProgressRecord = {
      jobId;
      date = Time.now();
      percentage;
    };
    progressRecords.add(nextProgressRecordId, record);
    nextProgressRecordId += 1;
  };

  public query ({ caller }) func getAllProgressRecords() : async [ProgressRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view progress records");
    };
    progressRecords.values().toArray()
  };

  public query ({ caller }) func getProgressRecordsByJob(jobId : Nat) : async [ProgressRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view progress records");
    };

    let allRecords = progressRecords.values().toArray();
    allRecords.filter<ProgressRecord>(func(rec) { rec.jobId == jobId })
  };

  // Realization Reports - Buyer inputs actual prices after Finance approval
  public shared ({ caller }) func addRealizationReport(materialId : Nat, actualPrice : Nat, vendorId : Nat) : async () {
    if (not isBuyerRole(caller)) {
      Runtime.trap("Unauthorized: Only Buyer can add realization reports");
    };

    // Verify material and vendor exist
    switch (materials.get(materialId)) {
      case (null) { Runtime.trap("Material not found") };
      case (?_) {};
    };
    switch (vendors.get(vendorId)) {
      case (null) { Runtime.trap("Vendor not found") };
      case (?_) {};
    };

    let report : RealizationReport = {
      materialId;
      actualPrice;
      vendorId;
      date = Time.now();
      createdBy = caller;
    };
    realizationReports.add(nextRealizationReportId, report);
    nextRealizationReportId += 1;
  };

  public query ({ caller }) func getAllRealizationReports() : async [RealizationReport] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view realization reports");
    };
    realizationReports.values().toArray()
  };

  public query ({ caller }) func getRealizationReportsByMaterial(materialId : Nat) : async [RealizationReport] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view realization reports");
    };

    let allReports = realizationReports.values().toArray();
    allReports.filter<RealizationReport>(func(rep) { rep.materialId == materialId })
  };

  // Material usage tracking - Buyer can view total materials used
  public query ({ caller }) func getMaterialUsageSummary(materialId : Nat) : async { totalRequested : Nat; totalApproved : Nat } {
    if (not isBuyerRole(caller)) {
      Runtime.trap("Unauthorized: Only Buyer can view material usage summary");
    };

    let allRequests = materialRequests.values().toArray();

    var totalRequested : Nat = 0;
    var totalApproved : Nat = 0;

    for (req in allRequests.vals()) {
      if (req.materialId == materialId) {
        totalRequested += req.quantity;
        if (req.finalApproval) {
          totalApproved += req.quantity;
        };
      };
    };

    { totalRequested; totalApproved };
  };
};
