import Map "mo:core/Map";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";

module {
  // Old types
  type OldContentBlock = {
    id : Nat;
    title : { english : Text; spanish : Text };
    content : { english : Text; spanish : Text };
    image : ?Storage.ExternalBlob;
    blockType : { #textBlock; #imageBlock; #mixedBlock };
    order : Nat;
    createdBy : Principal;
    createdAt : Time.Time;
    isVisible : Bool;
  };

  type OldSectionContent = {
    id : Text;
    title : { english : Text; spanish : Text };
    description : { english : Text; spanish : Text };
    image : ?Storage.ExternalBlob;
    background : ?Storage.ExternalBlob;
    contentBlocks : [OldContentBlock];
    order : Nat;
    lastUpdated : Time.Time;
    createdBy : Principal;
    isVisible : Bool;
  };

  // Old actor type
  type OldActor = {
    additionalSections : Map.Map<Text, OldSectionContent>;
    nextSectionId : Nat;
  };

  // New types
  type NewContentBlock = {
    id : Nat;
    title : { english : Text; spanish : Text };
    content : { english : Text; spanish : Text };
    image : ?Storage.ExternalBlob;
    blockType : { #textBlock; #imageBlock; #mixedBlock };
    order : Nat;
    createdBy : Principal;
    createdAt : Time.Time;
    isVisible : Bool;
  };

  type NewSectionContent = {
    id : Text;
    title : { english : Text; spanish : Text };
    description : { english : Text; spanish : Text };
    image : ?Storage.ExternalBlob;
    background : ?Storage.ExternalBlob;
    contentBlocks : [NewContentBlock];
    order : Nat;
    lastUpdated : Time.Time;
    createdBy : Principal;
    isVisible : Bool;
  };

  type NewInstagramFeedConfig = {
    instagramHandle : Text;
    instagramEmbedCode : Text;
    title : { english : Text; spanish : Text };
    description : { english : Text; spanish : Text };
    displayOrder : Nat;
    lastUpdated : Time.Time;
    isVisible : Bool;
    createdBy : Text;
  };

  type NewActor = {
    additionalSections : Map.Map<Text, NewSectionContent>;
    nextSectionId : Nat;
    instagramFeed : ?NewInstagramFeedConfig;
  };

  public func run(old : OldActor) : NewActor {
    // Map sections and blocks since old and current types are compatible
    let newSections = old.additionalSections.map<Text, OldSectionContent, NewSectionContent>(
      func(_id, oldSection) { oldSection },
    );

    // Create default (empty) Instagram feed config with empty creator
    let defaultInstagramFeed : NewInstagramFeedConfig = {
      instagramHandle = "";
      instagramEmbedCode = ""; // Field initialized with empty string
      title = { english = ""; spanish = "" };
      description = { english = ""; spanish = "" };
      displayOrder = 5;
      lastUpdated = 0;
      isVisible = false;
      createdBy = ""; // Now Text according to type of config doc
    };

    {
      additionalSections = newSections;
      nextSectionId = old.nextSectionId;
      instagramFeed = ?defaultInstagramFeed;
    };
  };
};

