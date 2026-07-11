"use client";

import Link from "next/link";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { 
  ArrowRight, 
  FileText, 
  Sparkles, 
  Clock, 
  CheckCircle,
  TrendingUp,
  Activity,
  Plus
} from "lucide-react";
import { useEffect, useState } from "react";
import { getProposalsByProject, ProposalResponse, createProject } from "@/lib/api";

export default function DashboardPage() {
  const [proposals, setProposals] = useState<ProposalResponse[]>([]);
  
  useEffect(() => {
    async function loadProposals() {
      try {
        try {
          const res = await getProposalsByProject(1);
          setProposals(res);
        } catch (e) {
          // If not found, create default project
          await createProject({ title: "Default Project" });
          const res = await getProposalsByProject(1);
          setProposals(res);
        }
      } catch (err) {
        console.error("Failed to load proposals", err);
      }
    }
    loadProposals();
  }, []);
  return (
    <div className="flex h-screen w-full bg-zinc-50 dark:bg-black font-sans overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10">
          
          {/* Welcome / Hero Section */}
          <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Welcome back, Researcher
              </h1>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                Here's what's happening with your grant proposals today.
              </p>
            </div>
            <Link href="/editor" className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all active:scale-95">
              <Plus className="w-4 h-4" />
              New Proposal
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-start justify-between group hover:border-indigo-500/50 transition-colors">
              <div>
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Active Drafts</p>
                <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mt-2">3</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1 font-medium">
                  <TrendingUp className="w-3 h-3" /> +1 this week
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-start justify-between group hover:border-indigo-500/50 transition-colors">
              <div>
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Grants Discovered</p>
                <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mt-2">12</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1 font-medium">
                  <TrendingUp className="w-3 h-3" /> +4 matching
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-fuchsia-50 dark:bg-fuchsia-900/20 flex items-center justify-center text-fuchsia-600 dark:text-fuchsia-400 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-start justify-between group hover:border-indigo-500/50 transition-colors">
              <div>
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Agent Status</p>
                <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mt-2">Idle</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 flex items-center gap-1 font-medium">
                  <Activity className="w-3 h-3" /> Ready for tasks
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activity Table */}
            <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <h2 className="font-semibold text-lg text-zinc-900 dark:text-zinc-50">Recent Proposals</h2>
                <Link href="/editor" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">View all</Link>
              </div>
              <div className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
                {proposals.length === 0 ? (
                  <div className="px-6 py-8 text-center text-sm text-zinc-500">
                    No proposals found. Click "New Proposal" to create one.
                  </div>
                ) : (
                  proposals.map((item, i) => {
                    const statusColor = item.status === "Drafting" ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400" : "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400";
                    return (
                      <Link href="/editor" key={item.id || i} className="px-6 py-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors cursor-pointer group">
                        <div>
                          <p className="font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {item.content?.title || "Untitled Proposal"}
                          </p>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3" /> Version {item.version || 1}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusColor}`}>
                            {item.status || "Drafting"}
                          </span>
                          <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transform" />
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>
            </div>

            {/* Grants Feed */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col">
              <div className="px-6 py-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-fuchsia-600 dark:text-fuchsia-400" />
                <h2 className="font-semibold text-lg text-zinc-900 dark:text-zinc-50">Grant Matches</h2>
              </div>
              <div className="p-6 flex-1 flex flex-col gap-6">
                {[
                  { title: "NSF Convergence Accelerator", amount: "$5M", deadline: "Oct 15" },
                  { title: "NIH Tech Innovation Grant", amount: "$2M", deadline: "Nov 01" },
                  { title: "DOE Clean Energy Initiative", amount: "$1.5M", deadline: "Dec 10" },
                ].map((grant, i) => (
                  <Link href="/workspace" key={i} className="group cursor-pointer block">
                    <h3 className="font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400 transition-colors line-clamp-1">{grant.title}</h3>
                    <div className="flex items-center gap-3 mt-1.5 text-sm">
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">{grant.amount}</span>
                      <span className="text-zinc-300 dark:text-zinc-700">•</span>
                      <span className="text-zinc-500 dark:text-zinc-400">Due {grant.deadline}</span>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                <Link href="/workspace" className="w-full py-2 flex justify-center text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">
                  View all matches
                </Link>
              </div>
            </div>
          </div>
          
        </main>
      </div>
    </div>
  );
}
