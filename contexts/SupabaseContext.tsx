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
    const { data, error } = await supabase
      .from("users")
      .upsert({ id: user?.id, push_token: token });

    if (error) {
      console.error("Error setting push token:", error);
    }

    return data;
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
