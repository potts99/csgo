import { QueryClient, QueryClientProvider } from "react-query";
import { SessionProvider } from "next-auth/react";
import Navigation from "../components/Navigation";
import { useRouter } from "next/router";

import "tailwindcss/tailwind.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Create a client
const queryClient = new QueryClient();

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter();

  if (router.asPath.slice(0, 5) === "/game") {
    return (
      <>
        <SessionProvider session={pageProps.session}>
          <QueryClientProvider client={queryClient}>
            <Navigation>
              <Component {...pageProps} />
            </Navigation>
          </QueryClientProvider>
        </SessionProvider>
      </>
    );
  }

  if (router.asPath.slice(0, 5) === "/auth") {
    return (
      <>
        <SessionProvider session={pageProps.session}>
          <Component {...pageProps} />
        </SessionProvider>
      </>
    );
  }

  return (
    <>
      <SessionProvider session={pageProps.session}>
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
        </QueryClientProvider>
      </SessionProvider>
    </>
  );
}

export default MyApp;
