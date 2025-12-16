export default function Progress({
  countLike,
  countDislike,
}: {
  countLike: number;
  countDislike: number;
}) {
  return (
    <>
      {countLike === 0 && countDislike === 0 && (
        <div className="bg-trans-black-10 flex h-1 w-full items-start self-start rounded-full"></div>
      )}
      {countLike > countDislike && (
        <div className="flex h-1 w-full items-start self-start rounded-full bg-[#F43F5E]"></div>
      )}
      {countLike < countDislike && (
        <div className="bg-trans-black-70 flex h-1 w-full items-start self-start rounded-full"></div>
      )}
      {countLike === countDislike && countLike !== 0 && countDislike !== 0 && (
        <>
          <div className="flex h-1 w-full items-start self-start rounded-full bg-[#F43F5E]"></div>
          <div className="bg-trans-black-70 flex h-1 w-full items-start self-start rounded-full"></div>
        </>
      )}
    </>
  );
}
