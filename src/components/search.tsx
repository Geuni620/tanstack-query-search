import { SearchIcon } from '@/components/icons';
import { Input } from '@/components/ui/input';

type SearchProps = {
  search: string;
};

export const Search: React.FC<SearchProps> = ({ search }) => {
  return (
    <div className="ml-auto flex-1 sm:flex-initial">
      <div className="relative">
        <SearchIcon className="absolute left-2 top-1/2 size-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
        <Input
          className="bg-white pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
          placeholder="Search orders..."
          type="search"
          name="search"
          defaultValue={search}
        />
      </div>
    </div>
  );
};
