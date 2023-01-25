import { AppContextProvider } from "../context/appContext";
import "../style.css";
export default function MyApp({ Component, pageProps }) {
  return (
    <AppContextProvider>
      <Component {...pageProps} />
    </AppContextProvider>
  );
}
