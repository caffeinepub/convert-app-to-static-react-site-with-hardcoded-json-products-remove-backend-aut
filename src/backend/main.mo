import AccessControl "authorization/access-control";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Storage "blob-storage/Storage";
import Time "mo:core/Time";
import VarArray "mo:core/VarArray";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";

// NO Migration here, as principal cannot be serialized in migration files unfortunately
actor {
  include MixinStorage();

  // Admins in development and creator for deployment
  // TODO: During Deployment, let creators append their IP address
  let hardcodedAdmins = List.fromArray([Principal.fromText("ix7jl-xlknv-uwyet-3fsxh-x7nqh-zkhvg-keqsk-zs4hv-ihh5p-uytti-6ae")]);
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

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

  public shared ({ caller }) func createAdditionalSection(title : TextContent, description : TextContent, image : ?Storage.ExternalBlob, background : ?Storage.ExternalBlob, order : Nat, isVisible : Bool) : async Text {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create sections");
    };

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

  public shared ({ caller }) func updateAdditionalSection(id : Text, title : TextContent, description : TextContent, image : ?Storage.ExternalBlob, background : ?Storage.ExternalBlob, order : Nat, isVisible : Bool) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update sections");
    };

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

  public shared ({ caller }) func deleteAdditionalSection(id : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete sections");
    };

    switch (additionalSections.get(id)) {
      case (?_) {
        additionalSections.remove(id);
      };
      case (_) { Runtime.trap("Section not found") };
    };
  };

  public query ({ caller }) func adminDeleteContentBlock(sectionId : Text, blockId : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete content blocks");
    };

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

  public query ({ caller }) func getAllSectionsAdmin() : async [SectionContentView] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all sections");
    };
    additionalSections.values().map<SectionContent, SectionContentView>(
      func(section) {
        {
          section with
          contentBlocks = section.contentBlocks;
        };
      }
    ).toArray();
  };

  public shared ({ caller }) func addContentBlock(sectionId : Text, title : TextContent, content : TextContent, image : ?Storage.ExternalBlob, blockType : BlockType, order : Nat, isVisible : Bool) : async ContentBlock {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add content blocks");
    };

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

  public query ({ caller }) func getVisibleContentBlockAdmin(sectionId : Text) : async [ContentBlockView] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view content blocks");
    };

    switch (additionalSections.get(sectionId)) {
      case (?section) {
        section.contentBlocks.map<ContentBlock, ContentBlockView>(
          func(block) { createContentBlockView(block) }
        );
      };
      case (null) { [] };
    };
  };

  public query ({ caller }) func getAllContentBlocksAdmin(sectionId : Text) : async [ContentBlockView] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all content blocks");
    };

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

  public shared ({ caller }) func addProduct(title : TextContent, description : TextContent, image : Storage.ExternalBlob, price : TextContent) : async Product {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };

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

  public shared ({ caller }) func editProduct(id : Text, title : TextContent, description : TextContent, image : Storage.ExternalBlob, price : TextContent) : async Product {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can edit products");
    };

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

  public shared ({ caller }) func deleteProduct(id : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };

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

  public shared ({ caller }) func addPackage(name : TextContent, description : TextContent, image : Storage.ExternalBlob, price : TextContent) : async Package {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add packages");
    };

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

  public shared ({ caller }) func editPackage(id : Text, name : TextContent, description : TextContent, image : Storage.ExternalBlob, price : TextContent) : async Package {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can edit packages");
    };

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

  public shared ({ caller }) func deletePackage(id : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete packages");
    };

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

  public shared ({ caller }) func addHowToOrderStep(stepNumber : Nat, title : TextContent, description : TextContent, image : ?Storage.ExternalBlob) : async HowToOrderStep {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add how-to-order steps");
    };

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

  public shared ({ caller }) func editHowToOrderStep(stepNumber : Nat, title : TextContent, description : TextContent, image : ?Storage.ExternalBlob) : async HowToOrderStep {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can edit how-to-order steps");
    };

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

  public shared ({ caller }) func addSocialMediaLink(platform : Text, url : Text, icon : ?Storage.ExternalBlob) : async SocialMediaLink {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add social media links");
    };

    let newLink : SocialMediaLink = {
      platform;
      url;
      icon;
    };
    socialMediaLinks.add(platform, newLink);
    newLink;
  };

  public shared ({ caller }) func editSocialMediaLink(platform : Text, url : Text, icon : ?Storage.ExternalBlob) : async SocialMediaLink {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can edit social media links");
    };

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

  public shared ({ caller }) func deleteSocialMediaLink(platform : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete social media links");
    };

    switch (socialMediaLinks.get(platform)) {
      case (?_) {
        socialMediaLinks.remove(platform);
      };
      case (_) { Runtime.trap("Social media link not found") };
    };
  };

  public shared ({ caller }) func updateInstagramFeedConfig(instagramHandle : Text, instagramEmbedCode : Text, title : TextContent, description : TextContent, displayOrder : Nat, isVisible : Bool) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update Instagram feed settings");
    };

    let config : InstagramFeedConfig = {
      instagramHandle;
      instagramEmbedCode;
      title;
      description;
      displayOrder;
      lastUpdated = Time.now();
      isVisible;
      createdBy = caller.toText();
    };

    instagramFeed := ?config;
  };

  public query func getInstagramFeedConfig() : async ?InstagramFeedConfig {
    instagramFeed;
  };

  // Internal helpers to check hardcoded admins
  func isHardcodedAdmin(principal : Principal) : Bool {
    hardcodedAdmins.find(func(admin) { admin == principal }) != null;
  };

  public query ({ caller }) func isAdmin() : async Bool {
    if (isHardcodedAdmin(caller)) { return true };
    if (caller == Principal.fromText("2vxsx-fae")) { return false };
    AccessControl.isAdmin(accessControlState, caller);
  };

  public shared ({ caller }) func bootstrapAdmin() : async () {
    switch (isHardcodedAdmin(caller)) {
      case (true) {
        Runtime.trap("Bootstrap already exists - admin extension is not needed");
      };
      case (false) {
        Runtime.trap("Unauthorized - you are not authorized to bootstrap as admin");
      };
    };
  };
};

