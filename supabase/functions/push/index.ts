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
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const payload: CronPayload = await req.json();
  console.log("🚀 ~ Deno.serve ~ payload:", payload);

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data, error } = await supabaseClient.from("users").select("*");
  if (error) throw error;

  const push_token = data[0]?.push_token;
  console.log("🚀 ~ Deno.serve ~ push_token:", push_token);

  // EXPO PUSH
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
