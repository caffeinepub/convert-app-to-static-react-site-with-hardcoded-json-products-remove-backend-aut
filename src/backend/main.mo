import Iter "mo:core/Iter";
import List "mo:core/List";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Storage "blob-storage/Storage";
import Text "mo:core/Text";
import Time "mo:core/Time";
import VarArray "mo:core/VarArray";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  include MixinStorage();

  let hardcodedAdmins = List.fromArray([Principal.fromText("ix7jl-xlknv-uwyet-3fsxh-x7nqh-zkhvg-keqsk-zs4hv-ihh5p-uytti-6ae")]);

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let hardcodedAdminUsername = "Administrator";
  let hardcodedAdminPassword = "AdminAAboxes26";

  let adminUsers = Map.empty<Text, AdminUser>();
  let activeAdminSessions = Map.empty<Text, AdminUserSession>();

  type Role = {
    #admin;
    #user;
  };

  type Profile = {
    id : Text;
    username : Text;
    role : Role;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  let profiles = Map.empty<Text, Profile>();

  // Session timeout: 24 hours in nanoseconds
  let sessionTimeout : Time.Time = 24 * 60 * 60 * 1_000_000_000;

  type Language = {
    #english;
    #spanish;
  };

  public type UserProfile = {
    name : Text;
    email : ?Text;
    language : Language;
  };

  public type TextContent = {
    english : Text;
    spanish : Text;
  };

  public type AdminUser = {
    username : Text;
    fullName : Text;
    password : Text;
    isActive : Bool;
    createdAt : Time.Time;
    createdBy : Text;
  };

  public type AdminUserSession = {
    username : Text;
    fullName : Text;
    loginTime : Time.Time;
    lastActive : Time.Time;
    sessionId : Text;
  };

  public type ContentBlock = {
    id : Nat;
    title : TextContent;
    content : TextContent;
    image : ?Storage.ExternalBlob;
    blockType : BlockType;
    order : Nat;
    createdBy : Principal;
    createdAt : Time.Time;
    isVisible : Bool;
  };

  public type BlockType = {
    #textBlock;
    #imageBlock;
    #mixedBlock;
  };

  public type SectionContent = {
    id : Text;
    title : TextContent;
    description : TextContent;
    image : ?Storage.ExternalBlob;
    background : ?Storage.ExternalBlob;
    contentBlocks : [ContentBlock];
    order : Nat;
    lastUpdated : Time.Time;
    createdBy : Principal;
    isVisible : Bool;
  };

  public type ImageMetadata = {
    filename : Text;
    contentType : Text;
    size : Nat;
    uploadTime : Time.Time;
  };

  public type AdminContentUpdate = {
    contentType : Text;
    contentId : Text;
    timestamp : Time.Time;
    updatedBy : Principal;
  };

  public type UploadedBlob = {
    blob : Storage.ExternalBlob;
    contentType : Text;
    uploadTime : Time.Time;
    uploadedBy : Principal;
  };

  public type Product = {
    id : Text;
    title : TextContent;
    description : TextContent;
    image : Storage.ExternalBlob;
    price : TextContent;
  };

  public type Package = {
    id : Text;
    name : TextContent;
    description : TextContent;
    image : Storage.ExternalBlob;
    price : TextContent;
  };

  public type HowToOrderStep = {
    stepNumber : Nat;
    title : TextContent;
    description : TextContent;
    image : ?Storage.ExternalBlob;
  };

  public type SocialMediaLink = {
    platform : Text;
    url : Text;
    icon : ?Storage.ExternalBlob;
  };

  public type BusinessHours = {
    monday : Text;
    tuesday : Text;
    wednesday : Text;
    thursday : Text;
    friday : Text;
    saturday : Text;
    sunday : Text;
  };

  public type LastUpdated = {
    timestamp : Time.Time;
    updatedBy : Principal;
  };

  public type HeroSection = {
    title : TextContent;
    description : TextContent;
    backgroundImage : ?Storage.ExternalBlob;
    lastUpdated : LastUpdated;
  };

  public type ProductSection = {
    products : [Product];
    lastUpdated : LastUpdated;
  };

  public type PackageSection = {
    packages : [Package];
    lastUpdated : LastUpdated;
  };

  public type HowToOrderSection = {
    steps : [HowToOrderStep];
    lastUpdated : LastUpdated;
  };

  public type ContactSection = {
    email : TextContent;
    phone : TextContent;
    whatsapp : TextContent;
    address : TextContent;
    socialLinks : [SocialMediaLink];
    businessHours : BusinessHours;
    lastUpdated : LastUpdated;
  };

  public type LogoSection = {
    logoImage : ?Storage.ExternalBlob;
    lastUpdated : LastUpdated;
  };

  public type AdminUpdate = {
    contentType : Text;
    contentId : Text;
    timestamp : Time.Time;
    adminId : Principal;
  };

  public type SectionContentView = {
    id : Text;
    title : TextContent;
    description : TextContent;
    image : ?Storage.ExternalBlob;
    background : ?Storage.ExternalBlob;
    contentBlocks : [ContentBlock];
    order : Nat;
    lastUpdated : Time.Time;
    createdBy : Principal;
    isVisible : Bool;
  };

  public type ContentBlockView = {
    id : Nat;
    title : TextContent;
    content : TextContent;
    image : ?Storage.ExternalBlob;
    blockType : BlockType;
    order : Nat;
    createdBy : Principal;
    createdAt : Time.Time;
    isVisible : Bool;
  };

  public type SectionContentWithBlocks = {
    section : SectionContentView;
    visibleBlocks : [ContentBlockView];
  };

  public type AllSectionsWithBlocks = {
    visibleSections : [SectionContentView];
    sectionBlocks : [SectionContentWithBlocks];
  };

  public type InstagramFeedConfig = {
    instagramHandle : Text;
    instagramEmbedCode : Text;
    title : TextContent;
    description : TextContent;
    displayOrder : Nat;
    lastUpdated : Time.Time;
    isVisible : Bool;
    createdBy : Text;
  };

  var nextProductId = 1;
  var nextPackageId = 1;
  var nextSectionId = 1000;

  let userProfiles = Map.empty<Principal, UserProfile>();
  let products = Map.empty<Text, Product>();
  let packages = Map.empty<Text, Package>();
  let howToOrderSteps = Map.empty<Nat, HowToOrderStep>();
  let socialMediaLinks = Map.empty<Text, SocialMediaLink>();
  let additionalSections = Map.empty<Text, SectionContent>();

  var instagramFeed : ?InstagramFeedConfig = null;

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

  // Session validation helper - validates session and caller permissions
  func validateAdminSession(caller: Principal, sessionId : Text) : AdminUserSession {
    // First check if caller has admin permissions via AccessControl
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    switch (activeAdminSessions.get(sessionId)) {
      case (?session) {
        let now = Time.now();
        let timeSinceLastActive = now - session.lastActive;
        
        if (timeSinceLastActive > sessionTimeout) {
          activeAdminSessions.remove(sessionId);
          Runtime.trap("Session expired. Please login again.");
        };
        
        // Update last active time
        let updatedSession = {
          session with lastActive = now;
        };
        activeAdminSessions.add(sessionId, updatedSession);
        
        updatedSession;
      };
      case (null) {
        Runtime.trap("Invalid session. Please login.");
      };
    };
  };

  // Query-safe session validation - returns Bool instead of trapping
  func isValidAdminSession(caller: Principal, sessionId : Text) : Bool {
    // First check if caller has admin permissions via AccessControl
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      return false;
    };

    switch (activeAdminSessions.get(sessionId)) {
      case (?session) {
        let now = Time.now();
        let timeSinceLastActive = now - session.lastActive;
        timeSinceLastActive <= sessionTimeout;
      };
      case (null) { false };
    };
  };

  public shared ({ caller }) func createAdditionalSection(sessionId : Text, title : TextContent, description : TextContent, image : ?Storage.ExternalBlob, background : ?Storage.ExternalBlob, order : Nat, isVisible : Bool) : async Text {
    let _ = validateAdminSession(caller, sessionId);

    let emptyContentBlocks : [ContentBlock] = [];
    let newId = nextSectionId.toText();
    let newSection : SectionContent = {
      id = newId;
      title;
      description;
      image;
      background;
      contentBlocks = emptyContentBlocks;
      order;
      lastUpdated = Time.now();
      createdBy = caller;
      isVisible;
    };
    additionalSections.add(newId, newSection);
    nextSectionId += 1;
    newId;
  };

  public shared ({ caller }) func updateAdditionalSection(sessionId : Text, id : Text, title : TextContent, description : TextContent, image : ?Storage.ExternalBlob, background : ?Storage.ExternalBlob, order : Nat, isVisible : Bool) : async () {
    let _ = validateAdminSession(caller, sessionId);

    switch (additionalSections.get(id)) {
      case (?existingSection) {
        let updatedSection = {
          existingSection with
          title;
          description;
          image;
          background;
          order;
          lastUpdated = Time.now();
          isVisible;
        };
        additionalSections.add(id, updatedSection);
      };
      case (null) { Runtime.trap("Section not found") };
    };
  };

  public shared ({ caller }) func deleteAdditionalSection(sessionId : Text, id : Text) : async () {
    let _ = validateAdminSession(caller, sessionId);

    switch (additionalSections.get(id)) {
      case (?_) {
        additionalSections.remove(id);
      };
      case (_) { Runtime.trap("Section not found") };
    };
  };

  public shared ({ caller }) func adminDeleteContentBlock(sessionId : Text, sectionId : Text, blockId : Nat) : async () {
    let _ = validateAdminSession(caller, sessionId);

    switch (additionalSections.get(sectionId)) {
      case (?section) {
        let contentBlocksArray = section.contentBlocks;
        if (blockId >= contentBlocksArray.size()) { Runtime.trap("Block not found") };
        let updatedBlocks = contentBlocksArray;
        additionalSections.add(sectionId, { section with contentBlocks = updatedBlocks });
      };
      case (null) { Runtime.trap("Section not found") };
    };
  };

  public query func getAllAdditionalSections() : async [SectionContentView] {
    additionalSections.values().map<SectionContent, SectionContentView>(
      func(section) {
        {
          section with
          contentBlocks = section.contentBlocks;
        };
      }
    ).toArray();
  };

  public shared ({ caller }) func getAllSectionsAdmin(sessionId : Text) : async [SectionContentView] {
    let _ = validateAdminSession(caller, sessionId);
    additionalSections.values().map<SectionContent, SectionContentView>(
      func(section) {
        {
          section with
          contentBlocks = section.contentBlocks;
        };
      }
    ).toArray();
  };

  public shared ({ caller }) func addContentBlock(sessionId : Text, sectionId : Text, title : TextContent, content : TextContent, image : ?Storage.ExternalBlob, blockType : BlockType, order : Nat, isVisible : Bool) : async ContentBlock {
    let _ = validateAdminSession(caller, sessionId);

    switch (additionalSections.get(sectionId)) {
      case (?section) {
        let contentBlocksArray = section.contentBlocks;
        let blockId = contentBlocksArray.size();

        let newBlock : ContentBlock = {
          id = blockId;
          title;
          content;
          image;
          blockType;
          order;
          createdBy = caller;
          createdAt = Time.now();
          isVisible;
        };

        let updatedBlocks = contentBlocksArray.concat([newBlock]);
        let updatedSection = {
          section with contentBlocks = updatedBlocks;
        };

        additionalSections.add(sectionId, updatedSection);
        newBlock;
      };
      case (null) { Runtime.trap("Section not found") };
    };
  };

  func createContentBlockView(block : ContentBlock) : ContentBlockView {
    block;
  };

  public shared ({ caller }) func getVisibleContentBlockAdmin(sessionId : Text, sectionId : Text) : async [ContentBlockView] {
    let _ = validateAdminSession(caller, sessionId);

    switch (additionalSections.get(sectionId)) {
      case (?section) {
        section.contentBlocks.map<ContentBlock, ContentBlockView>(
          func(block) { createContentBlockView(block) }
        );
      };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func getAllContentBlocksAdmin(sessionId : Text, sectionId : Text) : async [ContentBlockView] {
    let _ = validateAdminSession(caller, sessionId);

    switch (additionalSections.get(sectionId)) {
      case (?section) {
        section.contentBlocks.map<ContentBlock, ContentBlockView>(
          func(block) { createContentBlockView(block) }
        );
      };
      case (null) { [] };
    };
  };

  func addProductHelper(product : Product) {
    let newId = nextProductId.toText();
    let newProduct = {
      product with id = newId;
    };
    products.add(newId, newProduct);
    nextProductId += 1;
  };

  public query func getAllProducts() : async [Product] {
    products.values().toArray();
  };

  public shared ({ caller }) func addProduct(sessionId : Text, title : TextContent, description : TextContent, image : Storage.ExternalBlob, price : TextContent) : async Product {
    let _ = validateAdminSession(caller, sessionId);

    let newId = nextProductId.toText();
    let newProduct : Product = {
      id = newId;
      title;
      description;
      image;
      price;
    };
    products.add(newId, newProduct);
    nextProductId += 1;
    newProduct;
  };

  public shared ({ caller }) func editProduct(sessionId : Text, id : Text, title : TextContent, description : TextContent, image : Storage.ExternalBlob, price : TextContent) : async Product {
    let _ = validateAdminSession(caller, sessionId);

    switch (products.get(id)) {
      case (?existingProduct) {
        let updatedProduct = {
          existingProduct with
          title;
          description;
          image;
          price;
        };
        products.add(id, updatedProduct);
        updatedProduct;
      };
      case (_) { Runtime.trap("Product not found") };
    };
  };

  public shared ({ caller }) func deleteProduct(sessionId : Text, id : Text) : async () {
    let _ = validateAdminSession(caller, sessionId);

    switch (products.get(id)) {
      case (?_) {
        products.remove(id);
      };
      case (_) { Runtime.trap("Product not found") };
    };
  };

  public query func getAllPackages() : async [Package] {
    packages.values().toArray();
  };

  public shared ({ caller }) func addPackage(sessionId : Text, name : TextContent, description : TextContent, image : Storage.ExternalBlob, price : TextContent) : async Package {
    let _ = validateAdminSession(caller, sessionId);

    let newId = nextPackageId.toText();
    let newPackage : Package = {
      id = newId;
      name;
      description;
      image;
      price;
    };
    packages.add(newId, newPackage);
    nextPackageId += 1;
    newPackage;
  };

  public shared ({ caller }) func editPackage(sessionId : Text, id : Text, name : TextContent, description : TextContent, image : Storage.ExternalBlob, price : TextContent) : async Package {
    let _ = validateAdminSession(caller, sessionId);

    switch (packages.get(id)) {
      case (?existingPackage) {
        let updatedPackage = {
          existingPackage with
          name;
          description;
          image;
          price;
        };
        packages.add(id, updatedPackage);
        updatedPackage;
      };
      case (_) { Runtime.trap("Package not found") };
    };
  };

  public shared ({ caller }) func deletePackage(sessionId : Text, id : Text) : async () {
    let _ = validateAdminSession(caller, sessionId);

    switch (packages.get(id)) {
      case (?_) {
        packages.remove(id);
      };
      case (_) { Runtime.trap("Package not found") };
    };
  };

  public query func getAllPackageIds() : async [Text] {
    packages.keys().toArray();
  };

  public shared ({ caller }) func addHowToOrderStep(sessionId : Text, stepNumber : Nat, title : TextContent, description : TextContent, image : ?Storage.ExternalBlob) : async HowToOrderStep {
    let _ = validateAdminSession(caller, sessionId);

    let newStep : HowToOrderStep = {
      stepNumber;
      title;
      description;
      image;
    };
    howToOrderSteps.add(stepNumber, newStep);
    newStep;
  };

  public query func getAllHowToOrderSteps() : async [HowToOrderStep] {
    howToOrderSteps.values().toArray();
  };

  public shared ({ caller }) func editHowToOrderStep(sessionId : Text, stepNumber : Nat, title : TextContent, description : TextContent, image : ?Storage.ExternalBlob) : async HowToOrderStep {
    let _ = validateAdminSession(caller, sessionId);

    switch (howToOrderSteps.get(stepNumber)) {
      case (?existingStep) {
        let updatedStep = {
          existingStep with
          title;
          description;
          image;
        };
        howToOrderSteps.add(stepNumber, updatedStep);
        updatedStep;
      };
      case (_) { Runtime.trap("Step not found") };
    };
  };

  public query func getAllSocialMediaLinks() : async [SocialMediaLink] {
    socialMediaLinks.values().toArray();
  };

  public shared ({ caller }) func addSocialMediaLink(sessionId : Text, platform : Text, url : Text, icon : ?Storage.ExternalBlob) : async SocialMediaLink {
    let _ = validateAdminSession(caller, sessionId);

    let newLink : SocialMediaLink = {
      platform;
      url;
      icon;
    };
    socialMediaLinks.add(platform, newLink);
    newLink;
  };

  public shared ({ caller }) func editSocialMediaLink(sessionId : Text, platform : Text, url : Text, icon : ?Storage.ExternalBlob) : async SocialMediaLink {
    let _ = validateAdminSession(caller, sessionId);

    switch (socialMediaLinks.get(platform)) {
      case (?existingLink) {
        let updatedLink = {
          existingLink with
          url;
          icon;
        };
        socialMediaLinks.add(platform, updatedLink);
        updatedLink;
      };
      case (_) { Runtime.trap("Social media link not found") };
    };
  };

  public shared ({ caller }) func deleteSocialMediaLink(sessionId : Text, platform : Text) : async () {
    let _ = validateAdminSession(caller, sessionId);

    switch (socialMediaLinks.get(platform)) {
      case (?_) {
        socialMediaLinks.remove(platform);
      };
      case (_) { Runtime.trap("Social media link not found") };
    };
  };

  public shared ({ caller }) func updateInstagramFeedConfig(sessionId : Text, instagramHandle : Text, instagramEmbedCode : Text, title : TextContent, description : TextContent, displayOrder : Nat, isVisible : Bool) : async () {
    let session = validateAdminSession(caller, sessionId);

    let config : InstagramFeedConfig = {
      instagramHandle;
      instagramEmbedCode;
      title;
      description;
      displayOrder;
      lastUpdated = Time.now();
      isVisible;
      createdBy = session.username;
    };

    instagramFeed := ?config;
  };

  public query func getInstagramFeedConfig() : async ?InstagramFeedConfig {
    instagramFeed;
  };

  public shared ({ caller }) func adminLogin(username : Text, password : Text) : async Text {
    // Admin login doesn't require existing admin permission - it's the entry point
    // However, we should check that the caller is not anonymous for security
    if (caller.isAnonymous()) {
      Runtime.trap("Anonymous principals cannot login as admin");
    };

    if (username == hardcodedAdminUsername and password == hardcodedAdminPassword) {
      let sessionId = Time.now().toText() # "-" # username;
      let session = {
        username;
        fullName = "Primary Admin";
        loginTime = Time.now();
        lastActive = Time.now();
        sessionId;
      };
      activeAdminSessions.add(sessionId, session);
      return sessionId;
    };

    switch (adminUsers.get(username)) {
      case (?user) {
        if (user.password == password and user.isActive) {
          let sessionId = Time.now().toText() # "-" # username;
          let session = {
            username = user.username;
            fullName = user.fullName;
            loginTime = Time.now();
            lastActive = Time.now();
            sessionId;
          };
          activeAdminSessions.add(sessionId, session);
          return sessionId;
        } else {
          Runtime.trap("Invalid credentials or inactive user");
        };
      };
      case (null) { Runtime.trap("Invalid credentials") };
    };
  };

  public shared ({ caller }) func adminLogout(sessionId : Text) : async () {
    let _ = validateAdminSession(caller, sessionId);
    activeAdminSessions.remove(sessionId);
  };

  public shared ({ caller }) func createAdminUser(sessionId : Text, username : Text, fullName : Text, password : Text) : async () {
    let session = validateAdminSession(caller, sessionId);
    
    // Check if username already exists
    switch (adminUsers.get(username)) {
      case (?_) { Runtime.trap("Username already exists") };
      case (null) {};
    };

    let newUser = {
      username;
      fullName;
      password;
      isActive = true;
      createdAt = Time.now();
      createdBy = session.username;
    };
    adminUsers.add(username, newUser);
  };

  public shared ({ caller }) func getAdminUsers(sessionId : Text) : async [AdminUser] {
    let _ = validateAdminSession(caller, sessionId);
    adminUsers.values().toArray();
  };

  public query ({ caller }) func validateSession(sessionId : Text) : async Bool {
    isValidAdminSession(caller, sessionId);
  };

  public query ({ caller }) func isAdmin() : async Bool {
    if (caller.isAnonymous()) { return false };
    AccessControl.isAdmin(accessControlState, caller);
  };
};
