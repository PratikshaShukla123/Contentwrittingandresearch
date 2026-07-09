import { Bell, Menu, Search, User } from "lucide-react";

export function Header() {
  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 shrink-0 transition-colors">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">
          <Menu className="w-6 h-6" />
        </button>
        <div className="relative hidden sm:block w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Search grants or projects..." 
            className="w-full pl-9 pr-4 py-2 bg-zinc-100 dark:bg-zinc-800/50 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-zinc-800 focus:ring-1 focus:ring-indigo-500 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 transition-all outline-none"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-zinc-900"></span>
        </button>
        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 flex items-center justify-center border border-indigo-200 dark:border-indigo-800 shadow-sm cursor-pointer hover:ring-2 hover:ring-indigo-500 hover:ring-offset-2 dark:hover:ring-offset-zinc-900 transition-all">
          <User className="w-4 h-4" />
        </div>
      </div>
    </header>
  );
}
