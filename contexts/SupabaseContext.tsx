import { supabase } from "@/lib/supabase";
import { createContext, useContext } from "react";
import { useAuth } from "./AuthContext";

type ProviderProps = {
  //   userId: string | null;
  setUserPushToken: (token: string) => Promise<any>;
};

const SupabaseContext = createContext<Partial<ProviderProps>>({});

export function useSupabase() {
  return useContext(SupabaseContext);
}

export const SupabaseProvider = ({ children }: any) => {
  const { user } = useAuth();
  const setUserPushToken = async (token: string) => {
    // atualizar todos users de uma vez
    const { data: usersIds, error: usersError } = await supabase
      .from("users")
      .select("id");
    if (usersError) throw Error(usersError.message);

    const { error } = await supabase.from("users").upsert(
      usersIds.map(({ id }) => {
        return { id, push_token: token };
      })
    );

    if (error) {
      console.error("Error setting push token:", error);
    }
  };

  const value = {
    setUserPushToken,
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
};
