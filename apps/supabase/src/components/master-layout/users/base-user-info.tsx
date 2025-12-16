import { timeAgo } from "@suzu/ui";
import { BaseText } from "../base-text";

interface BaseUserInfoProps {
  displayName?: string;
  subText?: string;
  created_at?: Date;
  username?: string;
  message?: string;
}
function BaseUserInfo({
  displayName,
  subText,
  created_at,
  username,
  message,
}: BaseUserInfoProps) {
  return (
    <div className="flex flex-col items-start justify-center">
      <div className="flex items-center justify-center gap-1">
        {displayName && (
          <BaseText
            className="sz-parag-semi"
            text={displayName}
            textColor="slate-900"
          />
        )}

        {subText && (
          <BaseText
            className="sz-parag-reg"
            text={subText}
            textColor="slate-500"
          />
        )}

        {created_at && (
          <BaseText
            className="sz-parag-reg"
            text={timeAgo(created_at, { withAgo: true })}
            textColor="slate-500"
          />
        )}
      </div>
      {username && (
        <BaseText
          className="sz-parag-reg"
          text={username}
          textColor="slate-500"
        />
      )}

      {message && (
        <BaseText
          className="sz-parag-reg"
          text={message}
          textColor="slate-500"
        />
      )}
    </div>
  );
}

export { BaseUserInfo };
