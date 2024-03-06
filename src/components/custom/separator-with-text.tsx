import { cn } from '@/lib/utils';

interface SeparatorWithTextProps {
  text: string;
  className?: string;
  borderClass?: string;
  textClass?: string;
}

const SeparatorWithText = ({
  text,
  className,
  borderClass,
  textClass,
}: SeparatorWithTextProps) => (
  <div className={cn('flex items-center', className)}>
    <div
      className={cn(
        'flex-grow border-t border-gray-300 dark:border-gray-700',
        borderClass
      )}
    ></div>
    <div className={cn('px-4 text-gray-500', textClass)}>{text}</div>
    <div
      className={cn(
        'flex-grow border-t border-gray-300 dark:border-gray-700',
        borderClass
      )}
    ></div>
  </div>
);

export default SeparatorWithText;
