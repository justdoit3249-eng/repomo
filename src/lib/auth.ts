import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createServerSupabase } from "./supabase";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;
      const supabase = createServerSupabase();
      const { data: existing } = await supabase
        .from("User")
        .select("id")
        .eq("email", user.email)
        .single();

      if (!existing) {
        await supabase.from("User").insert({
          email: user.email,
          name: user.name,
          image: user.image,
          plan: "FREE",
          usageCountMonth: 0,
          usageResetDate: new Date().toISOString(),
        });
      } else {
        await supabase
          .from("User")
          .update({ name: user.name, image: user.image })
          .eq("email", user.email);
      }
      return true;
    },
    async session({ session }) {
      if (session.user?.email) {
        const supabase = createServerSupabase();
        const { data: dbUser } = await supabase
          .from("User")
          .select("id, plan, usageCountMonth")
          .eq("email", session.user.email)
          .single();

        if (dbUser) {
          session.user.id = dbUser.id;
          session.user.plan = dbUser.plan;
          session.user.usageCountMonth = dbUser.usageCountMonth;
        }
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
