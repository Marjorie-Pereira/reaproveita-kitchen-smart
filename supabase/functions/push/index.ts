import { createClient } from "@supabase/supabase-js";

interface Notification {
  title: string;
  body: string;
  item_id: string;
}

interface CronPayload {
  record: Notification;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE",
};

Deno.serve(async (req) => {
  const payload: CronPayload = await req.json();
  console.log("🚀 ~ Deno.serve ~ payload:", payload);

  // Create a Supabase client with the Auth context of the logged in user.
  const supabaseClient = createClient(
    // Supabase API URL - env var exported by default.
    Deno.env.get("SUPABASE_URL") ?? "",
    // Supabase API ANON KEY - env var exported by default.
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    // Create client with Auth context of the user that called the function.
    // This way your row-level-security (RLS) policies are applied.
    {
      global: {
        headers: { Authorization: req.headers.get("Authorization")! },
      },
    }
  );

  // And we can run queries in the context of our authenticated user
  const { data, error } = await supabaseClient.from("users").select("*");
  if (error) throw error;

  console.log("data: ", data);
  const push_token = data[0]?.push_token;
  console.log("🚀 ~ Deno.serve ~ push_token:", push_token);

  const res = await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Deno.env.get("EXPO_ACCESS_TOKEN")}`,
    },
    body: JSON.stringify({
      to: push_token,
      sound: "default",
      body: payload.record.body,
      title: payload.record.title,
      data: {
        item_id: payload.record.item_id,
      },
    }),
  }).then((res) => res.json());

  return new Response(JSON.stringify(res), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
