
export type MembershipType = "Free" | "Advanced" | "Pro";

export const canConnectWithPlayers = (membership: MembershipType): boolean => {
  return membership === "Advanced" || membership === "Pro";
};

export const canAccessDetailedAnalysis = (membership: MembershipType): boolean => {
  // Even free users get basic analysis but advanced features are for paid tiers
  return true;
};

export const getAnalysisFeatures = (membership: MembershipType): string[] => {
  const baseFeatures = [
    "Basic stroke analysis",
    "Basic footwork assessment",
    "Technique suggestions"
  ];
  
  if (membership === "Advanced") {
    return [
      ...baseFeatures,
      "Detailed frame-by-frame analysis",
      "Personalized improvement plan",
      "Side-by-side comparisons with pros"
    ];
  }
  
  if (membership === "Pro") {
    return [
      ...baseFeatures,
      "Detailed frame-by-frame analysis",
      "Personalized improvement plan",
      "Side-by-side comparisons with pros",
      "Weekly coaching sessions",
      "Custom training program"
    ];
  }
  
  return baseFeatures;
};
