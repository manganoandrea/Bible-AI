import * as admin from "firebase-admin";
import { onDocumentCreated, onDocumentUpdated } from "firebase-functions/v2/firestore";
import { generateStory } from "./generateStory";
import { generateSlideImages } from "./generateSlideImages";
import { AgeBand, CompanionType, Value } from "./prompts/types";

// Initialize Firebase Admin SDK
admin.initializeApp();

/**
 * Firestore trigger that fires when a new story document is created.
 * Only processes documents where type === "personalized" and status === "generating".
 */
export const onStoryCreated = onDocumentCreated(
  { document: "stories/{storyId}", timeoutSeconds: 300, memory: "1GiB" },
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
      console.log("No data associated with the event");
      return;
    }

    const storyId = event.params.storyId;
    const data = snapshot.data();

    // Only process personalized stories that are in generating status
    if (data.type !== "personalized" || data.status !== "generating") {
      console.log(
        `Skipping story ${storyId}: type=${data.type}, status=${data.status}`
      );
      return;
    }

    console.log(`Processing new personalized story: ${storyId}`);

    // Get profile data from the story document or fetch from profiles collection
    const profileId = data.profileId as string | undefined;
    let profileData: {
      childName: string;
      ageBand: AgeBand;
      companionType: CompanionType;
      companionName: string;
      values: Value[];
    };

    if (profileId) {
      // Fetch profile data from profiles collection
      const profileSnapshot = await admin
        .firestore()
        .collection("profiles")
        .doc(profileId)
        .get();

      if (!profileSnapshot.exists) {
        console.error(`Profile ${profileId} not found for story ${storyId}`);
        await snapshot.ref.update({
          status: "failed",
          error: "Profile not found",
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        return;
      }

      const profile = profileSnapshot.data();
      if (!profile) {
        console.error(`Profile ${profileId} has no data`);
        await snapshot.ref.update({
          status: "failed",
          error: "Profile data is empty",
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        return;
      }

      // Validate required fields exist before type assertions
      if (!profile.ageBand || !profile.companionType || !profile.values) {
        console.error("Invalid profile data:", profileId);
        await snapshot.ref.update({
          status: "failed",
          error: "Invalid profile data: missing required fields",
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        return;
      }

      profileData = {
        childName: profile.childName as string,
        ageBand: profile.ageBand as AgeBand,
        companionType: profile.companionType as CompanionType,
        companionName: profile.companionName as string,
        values: profile.values as Value[],
      };
    } else {
      // Profile data is embedded in the story document
      profileData = {
        childName: data.childName as string,
        ageBand: data.ageBand as AgeBand,
        companionType: data.companionType as CompanionType,
        companionName: data.companionName as string,
        values: data.values as Value[],
      };
    }

    // Validate required fields
    if (
      !profileData.childName ||
      !profileData.ageBand ||
      !profileData.companionType ||
      !profileData.companionName ||
      !profileData.values?.length
    ) {
      console.error(`Missing required profile data for story ${storyId}`);
      await snapshot.ref.update({
        status: "failed",
        error: "Missing required profile data",
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      return;
    }

    // Call the story generation orchestrator
    try {
      await generateStory({
        storyId,
        childName: profileData.childName,
        ageBand: profileData.ageBand,
        companionType: profileData.companionType,
        companionName: profileData.companionName,
        values: profileData.values,
      });
    } catch (error) {
      console.error(`Failed to generate story ${storyId}:`, error);
      // Error handling is done in generateStory, but log here for visibility
    }
  }
);

/**
 * Firestore trigger that fires when a story document is updated.
 * Generates slide images when status changes to "cover_ready".
 */
export const onStoryCoverReady = onDocumentUpdated(
  { document: "stories/{storyId}", timeoutSeconds: 540, memory: "2GiB" },
  async (event) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();

    // Only trigger when status changes TO cover_ready
    if (before?.status === "cover_ready" || after?.status !== "cover_ready") {
      return;
    }

    // Get profile for companion info
    const profileId = after.profileId;
    if (!profileId) {
      console.error("No profileId found on story");
      return;
    }

    const profileSnap = await admin
      .firestore()
      .collection("profiles")
      .doc(profileId)
      .get();

    if (!profileSnap.exists) {
      console.error("Profile not found:", profileId);
      return;
    }

    const profile = profileSnap.data()!;

    await generateSlideImages({
      storyId: event.params.storyId,
      companionType: profile.companionType,
      companionName: profile.companionName || profile.companionType,
      childName: profile.childName || "the child",
    });
  }
);
