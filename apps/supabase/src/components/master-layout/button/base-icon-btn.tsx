interface PropsIcon {
  className?: string;
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

export function BaseIconBTN({ className, src, alt, width, height }: PropsIcon) {
  return (
    <div className={className}>
      <img src={src} alt={alt} width={width} height={height} />
    </div>
  );
}
