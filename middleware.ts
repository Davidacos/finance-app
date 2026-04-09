import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const refreshToken = request.cookies.get("refreshToken")?.value;
  // NOTE: In this specific implementation, we are using localStorage for refreshToken on the client side.
  // Next.js Middleware can only access Cookies. 
  // If we want real Middleware protection, we should use Cookies.
  // However, the user explicitly asked for localStorage for refreshToken.
  
  // So, for now, we will handle route protection primarily on the client side 
  // or use a cookie as a "signed-in" flag if needed.
  
  // Let's implement a simple version that redirects /login and /register if there's a specific cookie, 
  // but since we are using localStorage, the Middleware approach is limited.
  
  // I will suggest to the user later to use a cookie for the 'isAuthenticated' flag if they want Middleware.
  // For now, I'll return NextResponse.next() and do protection in a layout or HOC.
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
