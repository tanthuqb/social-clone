import {
  ErrorScreen,
  GENERIC_ERROR_MESSAGE,
} from "@/components/shared/error-screen";

export default function ErrorPage() {
  return (
    <ErrorScreen title="Something went wrong" message={GENERIC_ERROR_MESSAGE} />
  );
}
