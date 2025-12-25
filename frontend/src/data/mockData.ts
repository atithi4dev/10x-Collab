export type ResourceTag = 'API' | 'UI' | 'Backend' | 'Research' | 'Assets' | 'Docs';

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'link' | 'image' | 'video' | 'note' | 'api' | 'file' | 'credentials';
  url?: string;
  content?: string;
  tags: ResourceTag[];
  addedBy: string;
  timestamp: Date;
  pinned: boolean;
}

export interface FileActivity {
  id: string;
  userId: string;
  fileName: string;
  branch: string;
  action: 'editing' | 'reviewing' | 'idle';
  lastUpdate: Date;
}

export interface TeamPin {
  id: string;
  userId: string;
  content: string;
  status: 'in-progress' | 'done' | 'blocked';
  likes: string[];
  comments: { userId: string; text: string; timestamp: Date }[];
  timestamp: Date;
}

export const mockResources: Resource[] = [
  {
    id: '1',
    title: 'REST API Documentation',
    description: 'Main API docs for the authentication service',
    type: 'link',
    url: 'https://api.example.com/docs',
    tags: ['API', 'Docs'],
    addedBy: '1',
    timestamp: new Date(Date.now() - 3600000),
    pinned: true,
  },
  {
    id: '2',
    title: 'Figma Design System',
    description: 'Complete UI kit and component library',
    type: 'link',
    url: 'https://figma.com/file/xyz',
    tags: ['UI', 'Assets'],
    addedBy: '4',
    timestamp: new Date(Date.now() - 7200000),
    pinned: true,
  },
  {
    id: '3',
    title: 'Database Schema',
    description: 'ERD diagram for the main database',
    type: 'image',
    url: '/placeholder.svg',
    tags: ['Backend', 'Docs'],
    addedBy: '2',
    timestamp: new Date(Date.now() - 10800000),
    pinned: false,
  },
  {
    id: '4',
    title: 'API Endpoints',
    description: 'POST /auth/login - User authentication endpoint',
    type: 'api',
    content: '{\n  "endpoint": "/auth/login",\n  "method": "POST",\n  "body": {\n    "email": "string",\n    "password": "string"\n  }\n}',
    tags: ['API', 'Backend'],
    addedBy: '2',
    timestamp: new Date(Date.now() - 14400000),
    pinned: false,
  },
  {
    id: '5',
    title: 'Research: Competitor Analysis',
    description: 'Notes on similar collaboration tools in the market',
    type: 'note',
    content: 'Key findings:\n• Notion: Great for docs, poor real-time\n• Linear: Excellent UX, dev-focused\n• Slack: Communication, not resources',
    tags: ['Research'],
    addedBy: '3',
    timestamp: new Date(Date.now() - 18000000),
    pinned: false,
  },
  {
    id: '6',
    title: 'Demo Video',
    description: 'Quick walkthrough of the MVP features',
    type: 'video',
    url: 'https://youtube.com/watch?v=demo',
    tags: ['Assets', 'Docs'],
    addedBy: '1',
    timestamp: new Date(Date.now() - 21600000),
    pinned: false,
  },
];

export const mockFileActivities: FileActivity[] = [
  {
    id: '1',
    userId: '1',
    fileName: 'Dashboard.tsx',
    branch: 'feature/dashboard',
    action: 'editing',
    lastUpdate: new Date(Date.now() - 60000),
  },
  {
    id: '2',
    userId: '2',
    fileName: 'auth.controller.ts',
    branch: 'feature/auth',
    action: 'editing',
    lastUpdate: new Date(Date.now() - 120000),
  },
  {
    id: '3',
    userId: '3',
    fileName: 'api.service.ts',
    branch: 'main',
    action: 'reviewing',
    lastUpdate: new Date(Date.now() - 300000),
  },
  {
    id: '4',
    userId: '4',
    fileName: 'design-tokens.css',
    branch: 'feature/design-system',
    action: 'editing',
    lastUpdate: new Date(Date.now() - 180000),
  },
];

export const mockTeamPins: TeamPin[] = [
  {
    id: '1',
    userId: '1',
    content: 'Building the dashboard layout — next: add drag-and-drop',
    status: 'in-progress',
    likes: ['2', '4'],
    comments: [
      { userId: '2', text: 'Looking great! Need help with the API integration?', timestamp: new Date(Date.now() - 1800000) },
    ],
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    id: '2',
    userId: '2',
    content: 'Auth routes complete ✓ — ready for frontend integration',
    status: 'done',
    likes: ['1', '3', '4'],
    comments: [],
    timestamp: new Date(Date.now() - 7200000),
  },
  {
    id: '3',
    userId: '3',
    content: 'Fixing WebSocket connection issues — don\'t use real-time features yet',
    status: 'blocked',
    likes: ['1'],
    comments: [
      { userId: '4', text: 'Let me know if you need the design specs updated', timestamp: new Date(Date.now() - 900000) },
    ],
    timestamp: new Date(Date.now() - 5400000),
  },
  {
    id: '4',
    userId: '4',
    content: 'Design system tokens exported — check Figma for updates',
    status: 'done',
    likes: ['1', '2', '3'],
    comments: [],
    timestamp: new Date(Date.now() - 10800000),
  },
];

export const tagColors: Record<ResourceTag, string> = {
  API: 'tag-api',
  UI: 'tag-ui',
  Backend: 'tag-backend',
  Research: 'tag-research',
  Assets: 'tag-assets',
  Docs: 'tag-default',
};
