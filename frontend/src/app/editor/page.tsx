"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { 
  DollarSign, 
  Save, 
  Download, 
  CheckCircle,
  PieChart,
  Plus,
  Trash2
} from "lucide-react";
import { useState, useCallback } from "react";
import { createProposal } from "@/lib/api";

export default function EditorPage() {
  const [budgetItems, setBudgetItems] = useState([
    { id: 1, category: "Personnel", description: "Principal Investigator (2 months)", amount: 25000 },
    { id: 2, category: "Personnel", description: "Graduate Research Assistant", amount: 35000 },
    { id: 3, category: "Equipment", description: "GPU Cluster Rental", amount: 12000 },
    { id: 4, category: "Travel", description: "Conference Presentation", amount: 3000 },
    { id: 5, category: "Materials", description: "Cloud Storage & APIs", amount: 5000 },
  ]);

  const [isSaving, setIsSaving] = useState(false);
  const [saveText, setSaveText] = useState("Save Draft");

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    setSaveText("Saving...");
    
    try {
      const title = document.getElementById("proposal-title")?.innerText || "Untitled Proposal";
      const summary = document.getElementById("proposal-summary")?.innerText || "";
      const objectives = document.getElementById("proposal-objectives")?.innerText || "";
      const methodology = document.getElementById("proposal-methodology")?.innerText || "";
      
      const content = {
        title,
        sections: {
          summary,
          objectives,
          methodology,
          budgetItems
        }
      };
      
      await createProposal({
        project_id: 1, // Using default project ID
        status: "Drafting",
        content
      });
      
      setSaveText("Saved!");
    } catch (error) {
      console.error("Failed to save proposal:", error);
      setSaveText("Error");
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveText("Save Draft"), 2000);
    }
  }, [budgetItems]);

  const totalAmount = budgetItems.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="flex h-screen w-full bg-zinc-50 dark:bg-black font-sans overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full min-w-0">
        <Header />
        
        <main className="flex-1 flex flex-col xl:flex-row overflow-hidden bg-white dark:bg-zinc-950">
          
          {/* Left Pane: Proposal Editor */}
          <div className="flex-1 flex flex-col border-r border-zinc-200 dark:border-zinc-800">
            {/* Toolbar */}
            <div className="h-14 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-6 bg-zinc-50/50 dark:bg-zinc-900/50 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <span className="text-zinc-500 dark:text-zinc-400 font-medium text-sm">Status:</span>
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium text-sm bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded">
                  <CheckCircle className="w-3.5 h-3.5" /> Approved
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" /> {saveText}
                </button>
                <button 
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-sm"
                >
                  <Download className="w-4 h-4" /> Export PDF
                </button>
              </div>
            </div>
            
            {/* Editor Area (Notion style) */}
            <div className="flex-1 overflow-y-auto p-10 lg:p-16">
              <div className="max-w-3xl mx-auto space-y-8">
                <div className="group relative">
                  <h1 id="proposal-title" className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 mb-2 focus:outline-none" contentEditable suppressContentEditableWarning>
                    AI-Driven Climate Change Mitigation
                  </h1>
                  <p className="text-zinc-500 dark:text-zinc-400 focus:outline-none" contentEditable suppressContentEditableWarning>
                    Add a brief subtitle or abstract here...
                  </p>
                </div>
                
                <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-8"></div>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-200 focus:outline-none" contentEditable suppressContentEditableWarning>
                    1. Project Summary
                  </h2>
                  <p id="proposal-summary" className="text-zinc-700 dark:text-zinc-300 leading-relaxed text-lg focus:outline-none" contentEditable suppressContentEditableWarning>
                    This project seeks to integrate large-scale climate data with advanced Graph Neural Networks (GNNs) to improve long-term weather forecasting and carbon emission tracking. By providing a high-resolution, AI-driven model, policymakers and environmental agencies can make data-driven decisions to optimize resource allocation and enforce mitigation strategies effectively.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-200 focus:outline-none" contentEditable suppressContentEditableWarning>
                    2. Research Objectives
                  </h2>
                  <ul id="proposal-objectives" className="list-disc list-outside ml-6 text-zinc-700 dark:text-zinc-300 leading-relaxed text-lg space-y-3 focus:outline-none" contentEditable suppressContentEditableWarning>
                    <li>To design and train a spatial-temporal Transformer model on the CMIP6 dataset.</li>
                    <li>To reduce the computational overhead of traditional climate simulations by 40%.</li>
                    <li>To deploy an open-source dashboard for real-time inference and analysis by stakeholders.</li>
                  </ul>
                </section>
                
                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-200 focus:outline-none" contentEditable suppressContentEditableWarning>
                    3. Methodology & Approach
                  </h2>
                  <p id="proposal-methodology" className="text-zinc-700 dark:text-zinc-300 leading-relaxed text-lg focus:outline-none" contentEditable suppressContentEditableWarning>
                    The core methodology relies on establishing a reliable data pipeline from satellite imagery and ground sensors into a unified vector representation. We will utilize a hybrid Transformer-GNN architecture, trained on 10 years of historical data. Validation will be performed using held-out datasets and hindcasting techniques to ensure the model captures rare, extreme weather events without overfitting.
                  </p>
                </section>
              </div>
            </div>
          </div>

          {/* Right Pane: Budget Dashboard */}
          <div className="w-full xl:w-[450px] flex flex-col bg-zinc-50 dark:bg-zinc-900 shrink-0">
            {/* Header */}
            <div className="h-14 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-6 bg-white dark:bg-zinc-950 shrink-0">
              <div className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-50">
                <PieChart className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                Budget Overview
              </div>
              <button className="p-1.5 text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Total Card */}
              <div className="bg-emerald-600 rounded-2xl p-6 text-white shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-20">
                  <DollarSign className="w-24 h-24" />
                </div>
                <p className="text-emerald-100 font-medium text-sm">Total Requested Funds</p>
                <h3 className="text-4xl font-bold mt-2">${totalAmount.toLocaleString()}</h3>
                <p className="text-emerald-200 text-sm mt-4">Aligned with NSF Funding Limits</p>
              </div>

              {/* Budget Table */}
              <div className="bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                <div className="px-4 py-3 bg-zinc-100/50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-500 uppercase tracking-wider grid grid-cols-12 gap-2">
                  <div className="col-span-8">Description</div>
                  <div className="col-span-4 text-right">Amount</div>
                </div>
                
                <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {budgetItems.map((item) => (
                    <li key={item.id} className="p-4 flex items-center group">
                      <div className="grid grid-cols-12 gap-2 w-full items-center">
                        <div className="col-span-8">
                          <p className="font-medium text-sm text-zinc-900 dark:text-zinc-100">{item.description}</p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{item.category}</p>
                        </div>
                        <div className="col-span-4 text-right font-medium text-sm text-zinc-700 dark:text-zinc-300 flex justify-end items-center gap-3">
                          ${item.amount.toLocaleString()}
                          <button 
                            onClick={() => setBudgetItems(budgetItems.filter(b => b.id !== item.id))}
                            className="text-zinc-400 hover:text-red-500 transition-all p-1"
                            title="Delete Item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                
                <div className="p-4 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-center text-sm font-semibold">
                  <span className="text-zinc-600 dark:text-zinc-400">Total</span>
                  <span className="text-emerald-600 dark:text-emerald-400">${totalAmount.toLocaleString()}</span>
                </div>
              </div>
              
              {/* Note */}
              <p className="text-xs text-center text-zinc-500 dark:text-zinc-500">
                Budget was auto-generated by the AI Budget Agent based on methodology requirements.
              </p>
            </div>
          </div>
          
        </main>
      </div>
    </div>
  );
}
