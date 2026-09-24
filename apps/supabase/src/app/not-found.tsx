import { ErrorScreen } from "@/components/shared/error-screen";

export default function NotFound() {
  return (
    <ErrorScreen
      title="404 - Page not found"
      message="Sorry, the page you are looking for does not exist or may have been moved. Please check the URL or go back to the home page."
    />
  );
}
