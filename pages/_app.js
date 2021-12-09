import { QueryClient, QueryClientProvider } from "react-query";

import "tailwindcss/tailwind.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Navigation from "../components/Navigation";
import { useRouter } from "next/router";

// Create a client
const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  console.log(router);

  if (router.asPath.slice(0, 5) === "/game") {
    return (
      <>
        <QueryClientProvider client={queryClient}>
          <Navigation>
            <Component {...pageProps} />
          </Navigation>
        </QueryClientProvider>
      </>
    );
  }

  if (router.asPath.slice(0, 5) === "/auth") {
    return (
      <>
        <Component {...pageProps} />
      </>
    );
  }

  return (
    <>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
