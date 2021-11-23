import "tailwindcss/tailwind.css";
import Navigation from "../components/Navigation";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Navigation>
        <Component {...pageProps} />
      </Navigation>
    </>
  );
}

export default MyApp;
