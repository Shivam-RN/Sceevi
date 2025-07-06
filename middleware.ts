import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import aj, { createMiddleware, detectBot, shield } from "./lib/arcjet";

const validate = aj
  .withRule(
    shield({
      mode: "LIVE",
    })
  )
  .withRule(
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE", "G00G1E_CRAWLER"],
    })
  );

export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export default createMiddleware(validate);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sign-in|assets).*)"],
};
