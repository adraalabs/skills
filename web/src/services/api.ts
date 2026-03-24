// Skills are in the same repo — GitHub Pages serves them from root
const SKILLS_RAW = "https://raw.githubusercontent.com/adraalabs/skills/main";

export interface Skill {
  code: string;
  name: string;
  description: string;
  category: string;
  platforms: string[];
  version: number;
  author: string;
  source: "community" | "published";
  installs?: number;
  content?: string; // skill.md content
}

export interface MarketplaceListResponse {
  skills: Skill[];
  total: number;
}


function parseFrontmatter(md: string): Record<string, string> {
  const match = md.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const fm: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx > 0) fm[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return fm;
}

// Fetch all community skills from index.json (one fetch, instant)
async function fetchCommunitySkills(): Promise<Skill[]> {
  try {
    const res = await fetch(`${SKILLS_RAW}/index.json`);
    if (!res.ok) return [];
    const items: any[] = await res.json();
    return items.map(s => ({
      code: `github:${s.name}`,
      name: s.name,
      description: s.description || "",
      category: s.category || "general",
      platforms: Array.isArray(s.platforms) ? s.platforms : ["discord"],
      version: s.version || 1,
      author: s.author || "community",
      source: "community" as const,
    }));
  } catch {
    return [];
  }
}

// Cache community skills for 5 min
let skillsCache: { skills: Skill[]; expires: number } | null = null;

export const skillsApi = {
  list: async (params?: {
    search?: string;
    category?: string;
    platform?: string;
  }): Promise<Skill[]> => {
    // Fetch community skills (cached)
    if (!skillsCache || Date.now() > skillsCache.expires) {
      skillsCache = { skills: await fetchCommunitySkills(), expires: Date.now() + 300000 };
    }
    let skills = [...skillsCache.skills];

    // Filter
    if (params?.search) {
      const q = params.search.toLowerCase();
      skills = skills.filter(s => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
    }
    if (params?.category) skills = skills.filter(s => s.category === params.category);
    if (params?.platform) skills = skills.filter(s => s.platforms.includes(params.platform!));

    return skills;
  },

  getByCode: async (code: string): Promise<Skill> => {
    if (code.startsWith("github:")) {
      const name = code.replace("github:", "");
      const res = await fetch(`${SKILLS_RAW}/${name}/skill.md`);
      if (!res.ok) throw new Error("Skill not found");
      const content = await res.text();
      const fm = parseFrontmatter(content);
      return {
        code,
        name: fm.name || name,
        description: fm.description || "",
        category: fm.category || "general",
        platforms: fm.platforms?.replace(/[\[\]]/g, "").split(",").map(p => p.trim()) || ["discord"],
        version: parseInt(fm.version) || 1,
        author: fm.author || "community",
        source: "community",
        content,
      };
    }
    throw new Error(`Skill not found: ${code}`);
  },
};
