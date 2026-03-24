import { useState, useEffect } from "react";
import { Search, Package, X, Sparkles, Filter } from "lucide-react";
import { skillsApi, type Skill } from "./services/api";

// Platform icons as inline SVGs
const DiscordIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
);
const TelegramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
);

const CATEGORIES = ["all", "engagement", "moderation", "economy", "community", "fun", "utility"];
const PLATFORMS = ["all", "discord", "telegram"];

function SkillCard({ skill, onSelect }: { skill: Skill; onSelect: (s: Skill) => void }) {
  return (
    <button onClick={() => onSelect(skill)} className="text-left p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.05] transition-all group">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">{skill.name}</h3>
        <div className="flex gap-1.5 items-center">
          {skill.platforms.includes("discord") && <DiscordIcon className="w-4 h-4 text-indigo-400" />}
          {skill.platforms.includes("telegram") && <TelegramIcon className="w-4 h-4 text-blue-400" />}
        </div>
      </div>
      <p className="text-xs text-zinc-400 line-clamp-2 mb-3">{skill.description}</p>
      <div className="flex items-center gap-3 text-[10px] text-zinc-500">
        <span className="bg-white/[0.04] px-2 py-0.5 rounded-full">{skill.category}</span>
        <span className="text-zinc-400">v{skill.version}</span>
        <span>{skill.author}</span>
        {skill.installs ? <span>{skill.installs} installs</span> : null}
      </div>
    </button>
  );
}

function SkillDetail({ skill, onClose }: { skill: Skill; onClose: () => void }) {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    skillsApi.getByCode(skill.code).then(s => {
      setContent(s.content || null);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [skill.code]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-zinc-900 border border-white/[0.08] rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white">{skill.name}</h2>
            <p className="text-sm text-zinc-400 mt-1">{skill.description}</p>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-500 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex gap-2 mb-4 items-center">
          {skill.platforms.includes("discord") && <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-indigo-500/20 text-indigo-300"><DiscordIcon className="w-3.5 h-3.5" /> Discord</span>}
          {skill.platforms.includes("telegram") && <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-300"><TelegramIcon className="w-3.5 h-3.5" /> Telegram</span>}
          <span className="text-xs px-2 py-1 rounded-full bg-white/[0.06] text-zinc-400">{skill.category}</span>
          <span className="text-xs px-2 py-1 rounded-full bg-white/[0.06] text-zinc-400">v{skill.version}</span>
        </div>
        {/* Install instructions */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-4 mb-4">
          <p className="text-xs text-zinc-400 mb-2">Install with:</p>
          <code className="text-sm text-green-400 font-mono">@Adraa install {skill.name}</code>
        </div>
        {/* Skill.md content */}
        {loading ? (
          <div className="text-center py-8 text-zinc-500 text-sm">Loading...</div>
        ) : content ? (
          <div className="space-y-3 text-sm text-zinc-300" dangerouslySetInnerHTML={{ __html:
            content.replace(/^---[\s\S]*?---\n/, "").trim()
              .replace(/^### (.+)$/gm, '<h3 class="text-base font-semibold text-white mt-5 mb-2">$1</h3>')
              .replace(/^## (.+)$/gm, '<h2 class="text-lg font-bold text-white mt-6 mb-3">$1</h2>')
              .replace(/^# (.+)$/gm, '<h1 class="text-xl font-bold text-white mt-6 mb-3">$1</h1>')
              .replace(/`([^`]+)`/g, '<code class="text-xs font-mono bg-white/[0.06] px-1.5 py-0.5 rounded text-indigo-300">$1</code>')
              .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white">$1</strong>')
              .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-zinc-400">$1</li>')
              .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 list-decimal text-zinc-400">$2</li>')
              .replace(/\n\n/g, '<br/><br/>')
              .replace(/\n/g, '<br/>')
          }} />
        ) : (
          <p className="text-sm text-zinc-500">No detailed instructions available for this skill.</p>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selected, setSelected] = useState<Skill | null>(null);
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [category, setCategory] = useState("all");
  const [platform, setPlatform] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setLoading(true);
    skillsApi.list({
      search: debounced || undefined,
      category: category !== "all" ? category : undefined,
      platform: platform !== "all" ? platform : undefined,
    }).then(s => { setSkills(s); setLoading(false); }).catch(() => setLoading(false));
  }, [debounced, category, platform]);

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-40 border-b border-white/[0.06] bg-black/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <a href="https://adraa.ai" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Adraa</a>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-white">Skills Marketplace</span>
          </div>
          <a href="https://github.com/adraalabs/skills" target="_blank" className="text-xs text-zinc-500 hover:text-white transition-colors">Contribute</a>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">Skills Marketplace</h1>
          <p className="text-sm text-zinc-400 max-w-md mx-auto">
            Install proven features in one step. Community-built, open-source skills for Discord and Telegram.
          </p>
        </div>

        {/* Search + Filters */}
        <div className="max-w-2xl mx-auto mb-8 space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input type="text" placeholder="Search skills..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-white/[0.16] transition-all" />
            {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"><X className="w-3.5 h-3.5" /></button>}
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <Filter className="w-3.5 h-3.5 text-zinc-500" />
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className={`text-[11px] px-2.5 py-1 rounded-full transition-all ${c === category ? "bg-white/[0.12] text-white" : "bg-white/[0.03] text-zinc-500 hover:text-zinc-300"}`}>
                {c}
              </button>
            ))}
            <span className="text-zinc-600 mx-1">|</span>
            {PLATFORMS.map(p => (
              <button key={p} onClick={() => setPlatform(p)}
                className={`flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full transition-all ${p === platform
                  ? p === "discord" ? "bg-indigo-500/20 text-indigo-300" : p === "telegram" ? "bg-blue-500/20 text-blue-300" : "bg-white/[0.12] text-white"
                  : "bg-white/[0.03] text-zinc-500 hover:text-zinc-300"}`}>
                {p === "discord" && <DiscordIcon className="w-3 h-3" />}
                {p === "telegram" && <TelegramIcon className="w-3 h-3" />}
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-32 rounded-xl bg-white/[0.02] border border-white/[0.04] animate-pulse" />
            ))}
          </div>
        ) : skills.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
            <p className="text-sm text-zinc-400">No skills found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {skills.map(s => <SkillCard key={s.code} skill={s} onSelect={setSelected} />)}
          </div>
        )}
      </div>

      {selected && <SkillDetail skill={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
