import { auth } from "@/app/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const handlers = toNextJsHandler(auth);

export const GET = async (req: Request, props: any) => {
    console.log(`[BetterAuth Debug] GET ${req.url}`);
    return handlers.GET(req);
}

export const POST = async (req: Request, props: any) => {
    console.log(`[BetterAuth Debug] POST ${req.url}`);
    return handlers.POST(req);
}
