import Link from "next/link";
import { 
  LayoutDashboard, 
  FileText, 
  Search, 
  Settings, 
  PieChart, 
  CheckCircle 
} from "lucide-react";

export function Sidebar() {
  return (
    <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col h-full shrink-0 hidden md:flex transition-colors">
      <div className="h-16 flex items-center px-6 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xl tracking-tight">
          <PieChart className="w-6 h-6" />
          <span>GrantAI</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1">
        <div className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2 px-2">
          Overview
        </div>
        <Link href="/" className="flex items-center gap-3 px-2 py-2 rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 font-medium transition-colors">
          <LayoutDashboard className="w-5 h-5" />
          Dashboard
        </Link>
        <Link href="/workspace" className="flex items-center gap-3 px-2 py-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200 font-medium transition-colors">
          <Search className="w-5 h-5" />
          Workspace
        </Link>
        <Link href="/editor" className="flex items-center gap-3 px-2 py-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200 font-medium transition-colors">
          <FileText className="w-5 h-5" />
          Proposal Editor
        </Link>
        
        <div className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2 px-2 mt-8">
          Agents
        </div>
        <Link href="#" className="flex items-center gap-3 px-2 py-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200 font-medium transition-colors">
          <CheckCircle className="w-5 h-5" />
          Compliance Node
        </Link>
      </div>

      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 shrink-0">
        <Link href="#" className="flex items-center gap-3 px-2 py-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200 font-medium transition-colors">
          <Settings className="w-5 h-5" />
          Settings
        </Link>
      </div>
    </aside>
  );
}
