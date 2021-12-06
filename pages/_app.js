import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "react-query";

import "tailwindcss/tailwind.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Navigation from "../components/Navigation";

// Create a client
const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
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

export default MyApp;
