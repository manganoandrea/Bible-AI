import Purchases, {
  type CustomerInfo,
  type PurchasesOffering,
} from "react-native-purchases";
import { Platform } from "react-native";

const API_KEYS = {
  ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY || "",
  android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY || "",
};

export async function initRevenueCat(userId?: string): Promise<void> {
  const apiKey = Platform.OS === "ios" ? API_KEYS.ios : API_KEYS.android;

  await Purchases.configure({
    apiKey,
    appUserID: userId,
  });
}

export async function getOfferings(): Promise<PurchasesOffering | null> {
  const offerings = await Purchases.getOfferings();
  return offerings.current;
}

export async function getCustomerInfo(): Promise<CustomerInfo> {
  return Purchases.getCustomerInfo();
}

export async function restorePurchases(): Promise<CustomerInfo> {
  return Purchases.restorePurchases();
}

export function isPremium(customerInfo: CustomerInfo): boolean {
  return customerInfo.entitlements.active["premium"] !== undefined;
}

export async function identifyUser(userId: string): Promise<void> {
  await Purchases.logIn(userId);
}
