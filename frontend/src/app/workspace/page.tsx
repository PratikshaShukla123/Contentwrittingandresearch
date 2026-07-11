"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import {
  Send,
  Bot,
  User,
  Save,
  Download,
  FileText,
  Sparkles,
  Paperclip,
  Wand2
} from "lucide-react";
import { sendChatMessage, getChatHistory, ChatMessage, generateProposalDocument } from "@/lib/api";
import { useState, useEffect } from "react";
import ReactMarkdown from 'react-markdown';

export default function WorkspacePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "ai", content: "Hi! I'm your AI Grant Writing assistant. I've drafted a preliminary outline based on your research topic. What would you like to tweak?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  type ProposalData = {
    title: string;
    summary: string;
    objectives: string | string[];
    methodology: string;
    budget?: { total: number, items: {description: string, amount: number}[] };
    compliance?: { passed: boolean, notes: string };
  };

  const [proposal, setProposal] = useState<ProposalData>({
    title: "Harnessing AI for Climate Change Mitigation",
    summary: "Climate change presents an existential threat to global ecosystems and economies. Traditional mitigation strategies have proven insufficient given the scale of the crisis. Recent advancements in artificial intelligence offer unprecedented opportunities to optimize energy grids, accelerate materials discovery for carbon capture, and model complex climate dynamics with high fidelity.",
    objectives: [
      "Develop a novel Transformer-based model for long-term climate prediction.",
      "Optimize smart grid energy distribution using deep reinforcement learning.",
      "Open-source all datasets and models for community collaboration."
    ],
    methodology: "We will employ state-of-the-art machine learning architectures, specifically focusing on spatial-temporal Graph Neural Networks (GNNs) combined with attention mechanisms (Transformers). This hybrid approach enables the model to capture both local spatial dependencies in climate data and long-term temporal trends. The models will be trained on the coupled model intercomparison project (CMIP6) data archive, ensuring robust validation against established physical models."
  });

  const PROJECT_ID = 1;

  useEffect(() => {
    async function loadHistory() {
      try {
        const history = await getChatHistory(PROJECT_ID);
        if (history && history.length > 0) {
          // Map to match the ChatMessage interface
          const formattedHistory = history.map(msg => ({
            role: msg.role as 'user' | 'ai',
            content: msg.content
          }));
          setMessages(formattedHistory);
        }
      } catch (error) {
        console.error("Failed to load chat history:", error);
      }
    }
    loadHistory();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user" as const, content: input.trim() };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      // Send chat message to backend
      const response = await sendChatMessage({
        messages: newMessages,
        project_id: PROJECT_ID,
      });

      setMessages(prev => [...prev, { role: "ai", content: response.content }]);

      // Auto-populate UI if reports are found in the response
      const draftMatch = response.content.match(/\*\*Proposal Draft:\*\*\s*```(?:json)?\s*([\s\S]*?)```/);
      const budgetMatch = response.content.match(/\*\*Budget:\*\*\s*```(?:json)?\s*([\s\S]*?)```/);
      const complianceMatch = response.content.match(/\*\*Compliance Report:\*\*\s*```(?:json)?\s*([\s\S]*?)```/);

      if (draftMatch || budgetMatch || complianceMatch) {
        setProposal(prev => {
          const next = { ...prev };
          if (draftMatch && draftMatch[1]) {
            try {
              const generated = JSON.parse(draftMatch[1]);
              next.title = generated.title || next.title;
              next.summary = generated.sections?.summary || generated.sections?.background || next.summary;
              next.objectives = generated.sections?.objectives || next.objectives;
              next.methodology = generated.sections?.methodology || next.methodology;
            } catch(e) { console.error(e) }
          }
          if (budgetMatch && budgetMatch[1]) {
            try { next.budget = JSON.parse(budgetMatch[1]); } catch(e) { console.error(e) }
          }
          if (complianceMatch && complianceMatch[1]) {
            try { next.compliance = JSON.parse(complianceMatch[1]); } catch(e) { console.error(e) }
          }
          return next;
        });
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages(prev => [...prev, { role: "ai", content: "Sorry, I encountered an error communicating with the backend." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    try {
      const generated = await generateProposalDocument(PROJECT_ID);

      setProposal({
        title: generated.title || "Generated Proposal",
        summary: generated.sections?.summary || "",
        objectives: generated.sections?.objectives || "",
        methodology: generated.sections?.methodology || "Unable to generate methodology"
      });
    } catch (error) {
      console.error("Failed to generate proposal:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-zinc-50 dark:bg-black font-sans overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full min-w-0">
        <Header />

        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-white dark:bg-zinc-950">

          {/* Left Pane: Document Preview / Editor */}
          <div className="flex-1 flex flex-col lg:border-r border-zinc-200 dark:border-zinc-800 h-1/2 lg:h-auto">
            {/* Toolbar */}
            <div className="h-14 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-4 bg-zinc-50/50 dark:bg-zinc-900/50 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 font-medium text-sm">
                <FileText className="w-4 h-4" />
                AI in Climate Change Mitigation.pdf
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-sm disabled:opacity-50"
                >
                  <Wand2 className="w-4 h-4" />
                  {isGenerating ? "Generating..." : "Generate Proposal"}
                </button>
                <div className="w-px h-4 bg-zinc-300 dark:bg-zinc-700 mx-1"></div>
                <button className="p-2 text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors">
                  <Save className="w-4 h-4" />
                </button>
                <button className="p-2 text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 overflow-y-auto p-8 lg:p-12">
              <div className="max-w-3xl mx-auto space-y-8">
                <div>
                  <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-4 focus:outline-none" contentEditable suppressContentEditableWarning>
                    {proposal.title}
                  </h1>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">Last edited by AI Agent • Just now</p>
                </div>

                <section>
                  <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 mb-3">1. Background & Significance</h2>
                  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed text-lg focus:outline-none" contentEditable suppressContentEditableWarning>
                    {proposal.summary}
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 mb-3">2. Objectives</h2>
                  <div className="text-zinc-700 dark:text-zinc-300 leading-relaxed text-lg focus:outline-none" contentEditable suppressContentEditableWarning>
                    {Array.isArray(proposal.objectives) ? (
                      <ul className="list-disc list-inside space-y-2">
                        {proposal.objectives.map((obj, i) => <li key={i}>{obj}</li>)}
                      </ul>
                    ) : (
                      <p className="whitespace-pre-wrap">{proposal.objectives}</p>
                    )}
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 mb-3">3. Methodology</h2>
                  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed text-lg focus:outline-none" contentEditable suppressContentEditableWarning>
                    {proposal.methodology}
                  </p>
                </section>

                {proposal.budget && (
                  <section>
                    <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 mb-3">4. Budget Estimate</h2>
                    <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
                      <div className="flex justify-between items-center mb-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
                        <span className="font-semibold text-zinc-700 dark:text-zinc-300">Total Budget</span>
                        <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">${proposal.budget.total.toLocaleString()}</span>
                      </div>
                      <ul className="space-y-3">
                        {proposal.budget.items.map((item: any, i: number) => (
                          <li key={i} className="flex justify-between text-sm">
                            <span className="text-zinc-600 dark:text-zinc-400">{item.description}</span>
                            <span className="font-medium text-zinc-800 dark:text-zinc-200">${item.amount.toLocaleString()}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </section>
                )}

                {proposal.compliance && (
                  <section>
                    <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 mb-3">Compliance Review</h2>
                    <div className={`p-4 rounded-xl border ${proposal.compliance.passed ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800' : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-2 h-2 rounded-full ${proposal.compliance.passed ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                        <span className={`font-semibold ${proposal.compliance.passed ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
                          {proposal.compliance.passed ? "Passed Validation" : "Needs Revision"}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">{proposal.compliance.notes}</p>
                    </div>
                  </section>
                )}
              </div>
            </div>
          </div>

          {/* Right Pane: AI Chat Interface */}
          <div className="w-full lg:w-96 xl:w-[400px] flex flex-col bg-zinc-50 dark:bg-zinc-900 border-t lg:border-t-0 lg:border-l border-zinc-200 dark:border-zinc-800 shrink-0 h-1/2 lg:h-auto">
            {/* Chat Header */}
            <div className="h-14 border-b border-zinc-200 dark:border-zinc-800 flex items-center px-4 bg-white dark:bg-zinc-950 shrink-0">
              <div className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-50">
                <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                LangGraph Agents
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user"
                    ? "bg-indigo-600 text-white"
                    : "bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-600 dark:text-fuchsia-400"
                    }`}>
                    {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`px-4 py-3 rounded-2xl max-w-[80%] ${msg.role === "user"
                    ? "bg-indigo-600 text-white rounded-tr-none"
                    : "bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-tl-none shadow-sm"
                    }`}>
                    <div className="text-sm leading-relaxed space-y-3">
                      <ReactMarkdown 
                        components={{
                          pre: ({node, ...props}) => <div className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-3 rounded-lg overflow-x-auto text-xs my-2"><pre {...props} /></div>,
                          code: ({node, ...props}) => <code className="bg-zinc-100 dark:bg-zinc-900 px-1 py-0.5 rounded text-xs text-indigo-600 dark:text-indigo-400 font-mono break-words" {...props} />,
                          p: ({node, ...props}) => <p className="leading-relaxed" {...props} />,
                          ul: ({node, ...props}) => <ul className="list-disc pl-4 space-y-1" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal pl-4 space-y-1" {...props} />,
                          h1: ({node, ...props}) => <h1 className="text-lg font-bold mt-2" {...props} />,
                          h2: ({node, ...props}) => <h2 className="text-base font-bold mt-2" {...props} />,
                          h3: ({node, ...props}) => <h3 className="text-sm font-semibold mt-2" {...props} />,
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-600 dark:text-fuchsia-400">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl max-w-[80%] bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-tl-none shadow-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 shrink-0">
              <form onSubmit={handleSend} className="relative flex items-center">
                <button type="button" className="absolute left-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                  <Paperclip className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask the AI to refine the draft..."
                  className="w-full pl-10 pr-12 py-3 bg-zinc-100 dark:bg-zinc-900 border border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-zinc-800 focus:ring-1 focus:ring-indigo-500 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 transition-all outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="absolute right-2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              <div className="text-center mt-2 text-[10px] text-zinc-500 dark:text-zinc-500">
                AI agents can make mistakes. Review before finalizing.
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
