export interface Project {
  id: string;
  title: string;
  description: string;
  url: string;
  socials?: {
    title: string;
    url: string;
  }[];
  status: "soon" | "live";
  collaborators?: {
    name: string;
    url: string;
  }[];
}

export const PROJECTS: Project[] = [
  {
    id: "project_1",
    title: "Memex",
    description:
      "A tool to do deep research on the web. Annotate & Summarize websites, videos and PDFs",
    url: "https://memex.garden",
    status: "live",
  },
  {
    id: "project_2",
    title: "Suppstacks.store",
    description:
      "Cut through the hype of which supplements to take and brands to trust",
    url: "https://suppstacks.store",
    status: "live",
  },
  {
    id: "project_3",
    title: "BecomingSound.app",
    description: "Chanting app for deep meditation and relaxation",
    url: "https://becomingsound.app",
    status: "live",
    collaborators: [
      {
        name: "Nicolas Endres",
        url: "",
      },
    ],
  },
  {
    id: "project_4",
    title: "Taxing",
    description:
      "Automate the most dreadful work of doing your taxes: Matching invoices and transactions. A tool to scan your email inbox for invoices and automatically associate them with your bank transactions.",
    url: "",
    status: "soon",
  },
  {
    id: "project_5",
    title: "Bam.baby",
    description: "Interactive silent disco journeys for groups",
    url: "https://bam.baby",
    status: "live",
    collaborators: [
      {
        name: "Bruno Pilz",
        url: "https://brunopilz.com",
      },
    ],
  },
];
