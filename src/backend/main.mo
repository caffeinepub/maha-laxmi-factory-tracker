import Map "mo:core/Map";
import Set "mo:core/Set";
import Text "mo:core/Text";
import Float "mo:core/Float";
import List "mo:core/List";
import Nat64 "mo:core/Nat64";
import Nat32 "mo:core/Nat32";
import Nat16 "mo:core/Nat16";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  public type TowelType = {
    #bath;
    #hand;
    #face;
  };

  public type ProductionEntry = {
    id : Nat64;
    workerId : Principal;
    workerName : Text;
    towelType : TowelType;
    quantityMeters : Float;
    date : Text;
    notes : Text;
  };

  public type DispatchEntry = {
    id : Nat64;
    adminId : Principal;
    towelType : TowelType;
    quantityMeters : Float;
    date : Text;
    destination : Text;
    notes : Text;
  };

  public type StockAdjustment = {
    id : Nat64;
    adminId : Principal;
    towelType : TowelType;
    quantityMeters : Float;
    reason : Text;
    date : Text;
  };

  public type Worker = {
    principal : Principal;
    name : Text;
    isAdmin : Bool;
  };

  public type Stock = {
    bathTowels : Float;
    handTowels : Float;
    faceTowels : Float;
  };

  public type UserProfile = {
    name : Text;
  };

  module Stock {
    public func empty() : Stock {
      {
        bathTowels = 0.0;
        handTowels = 0.0;
        faceTowels = 0.0;
      };
    };
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let workers = Map.empty<Principal, Worker>();
  let productionEntries = Map.empty<Nat64, ProductionEntry>();
  let dispatchEntries = Map.empty<Nat64, DispatchEntry>();
  let stockAdjustments = Map.empty<Nat64, StockAdjustment>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var nextProductionId = 1 : Nat64;
  var nextDispatchId = 1 : Nat64;
  var nextAdjustmentId = 1 : Nat64;
  var initialStock = Stock.empty();

  func updateStock(towelType : TowelType, quantity : Float) {
    switch (towelType) {
      case (#bath) { initialStock := { initialStock with bathTowels = initialStock.bathTowels + quantity } };
      case (#hand) { initialStock := { initialStock with handTowels = initialStock.handTowels + quantity } };
      case (#face) { initialStock := { initialStock with faceTowels = initialStock.faceTowels + quantity } };
    };
  };

  func findWorkerNameByPrincipal(principal : Principal) : Text {
    switch (workers.get(principal)) {
      case (null) { "Unknown Worker" };
      case (?worker) {
        worker.name;
      };
    };
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Production Entry - Worker or Admin only
  public shared ({ caller }) func addProductionEntry(towelType : TowelType, quantityMeters : Float, date : Text, notes : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add production entries");
    };
    let entry : ProductionEntry = {
      id = nextProductionId;
      workerId = caller;
      workerName = findWorkerNameByPrincipal(caller);
      towelType;
      quantityMeters;
      date;
      notes;
    };
    productionEntries.add(nextProductionId, entry);
    updateStock(towelType, quantityMeters);
    nextProductionId += 1;
  };

  // Dispatch Entry - Admin only
  public shared ({ caller }) func addDispatchEntry(towelType : TowelType, quantityMeters : Float, date : Text, destination : Text, notes : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add dispatch entries");
    };
    let entry : DispatchEntry = {
      id = nextDispatchId;
      adminId = caller;
      towelType;
      quantityMeters;
      date;
      destination;
      notes;
    };
    dispatchEntries.add(nextDispatchId, entry);
    updateStock(towelType, -quantityMeters);
    nextDispatchId += 1;
  };

  // Stock Adjustment - Admin only
  public shared ({ caller }) func adjustStock(towelType : TowelType, quantityMeters : Float, reason : Text, date : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can adjust stock");
    };
    let adjustment : StockAdjustment = {
      id = nextAdjustmentId;
      adminId = caller;
      towelType;
      quantityMeters;
      reason;
      date;
    };
    stockAdjustments.add(nextAdjustmentId, adjustment);
    updateStock(towelType, quantityMeters);
    nextAdjustmentId += 1;
  };

  // Set Initial Stock - Admin only
  public shared ({ caller }) func setInitialStock(bath : Float, hand : Float, face : Float) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set initial stock");
    };
    initialStock := {
      bathTowels = bath;
      handTowels = hand;
      faceTowels = face;
    };
  };

  // Get Stock - Public (no auth required)
  public query ({ caller }) func getStock() : async Stock {
    initialStock;
  };

  // Get Production History - Admin sees all, Worker sees own
  public query ({ caller }) func getProductionHistory() : async [ProductionEntry] {
    if (AccessControl.hasPermission(accessControlState, caller, #admin)) {
      return productionEntries.values().toArray();
    };
    if (AccessControl.hasPermission(accessControlState, caller, #user)) {
      return productionEntries.values().toArray().filter(
        func(entry : ProductionEntry) : Bool { entry.workerId == caller }
      );
    };
    Runtime.trap("Unauthorized: Only users can view production history");
  };

  // Get Dispatch History - Admin only
  public query ({ caller }) func getDispatchHistory() : async [DispatchEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view dispatch history");
    };
    dispatchEntries.values().toArray();
  };

  // Get Workers - Admin only
  public query ({ caller }) func getWorkers() : async [Worker] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view workers list");
    };
    workers.values().toArray();
  };

  // Add Worker - Admin only
  public shared ({ caller }) func addWorker(principal : Principal, name : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add workers");
    };
    workers.add(principal, {
      principal;
      name;
      isAdmin = false;
    });
  };

  // Remove Worker - Admin only
  public shared ({ caller }) func removeWorker(principal : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can remove workers");
    };
    workers.remove(principal);
  };

  // Add Admin - Admin only
  public shared ({ caller }) func addAdmin(principal : Principal, name : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add other admins");
    };
    workers.add(principal, {
      principal;
      name;
      isAdmin = true;
    });
  };

  // Remove Admin - Admin only
  public shared ({ caller }) func removeAdmin(principal : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can remove other admins");
    };
    switch (workers.get(principal)) {
      case (null) { Runtime.trap("Admin record not found") };
      case (?worker) {
        if (not worker.isAdmin) {
          Runtime.trap("Attempted to remove a non-admin worker");
        };
        workers.remove(principal);
      };
    };
  };
};
