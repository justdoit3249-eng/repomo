import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      plan: "FREE" | "STARTER" | "PRO" | "BUSINESS";
      usageCountMonth: number;
    };
  }
}
