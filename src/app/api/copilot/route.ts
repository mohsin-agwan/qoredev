import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";

const SYSTEM_PROMPT = `You are QoreDev Copilot, an expert AI assistant for backend development.
You help developers with architecture decisions, code reviews, database design, and API patterns.
Be concise, practical, and actionable.`;

const STUCK_SYSTEM_PROMPT = `You are QoreDev Copilot in Stuck Mode — a patient, step-by-step problem solver.
When a developer is stuck, you:
1. Restate the problem clearly to confirm understanding.
2. Identify the root cause or blocker.
3. Break the solution into numbered, actionable steps.
4. Provide a minimal code example where relevant.
5. Suggest what to verify after each step.
Be thorough, encouraging, and precise.`;

const MAX_QUERY_LENGTH = 4000;

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { query?: string; stuck?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { query, stuck = false } = body;

  if (!query || typeof query !== "string" || query.trim().length === 0) {
    return NextResponse.json({ error: "query is required" }, { status: 400 });
  }

  if (query.trim().length > MAX_QUERY_LENGTH) {
    return NextResponse.json(
      { error: `query must be ${MAX_QUERY_LENGTH} characters or fewer` },
      { status: 400 }
    );
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: stuck ? STUCK_SYSTEM_PROMPT : SYSTEM_PROMPT },
        { role: "user", content: query.trim() },
      ],
      max_tokens: 1024,
      temperature: stuck ? 0.3 : 0.7,
    });

    const answer = completion.choices[0]?.message?.content ?? "";

    return NextResponse.json({ answer });
  } catch (err) {
    console.error("OpenAI error:", err);
    return NextResponse.json(
      { error: "AI service unavailable. Please try again later." },
      { status: 500 }
    );
  }
}
