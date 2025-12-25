import { Link2, Eye, MessageSquare, Search, Pin, GitBranch } from 'lucide-react';

const features = [
  {
    icon: <Link2 className="w-6 h-6" />,
    title: 'Central Resource Hub',
    description: 'All your team\'s links, APIs, files, and notes in one searchable place. No more hunting through DMs.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: <Eye className="w-6 h-6" />,
    title: 'Real-Time File Presence',
    description: 'See exactly what each teammate is working on. View their current file and branch without asking.',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
  },
  {
    icon: <Pin className="w-6 h-6" />,
    title: 'Progress Pins',
    description: 'Post quick status updates like "Backend done, needs testing" so everyone stays in sync.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
  },
  {
    icon: <Search className="w-6 h-6" />,
    title: 'Smart Search & Filter',
    description: 'Find any resource instantly by tag, type, or team member. Everything is organized and accessible.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    icon: <GitBranch className="w-6 h-6" />,
    title: 'Branch Awareness',
    description: 'Know which branch your teammates are on to avoid merge conflicts and coordinate better.',
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
  },
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: 'Quick Comments',
    description: 'Leave feedback on pins and resources without context-switching to another app.',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
];

export function Features() {
  return (
    <section className="py-24 relative">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything your team needs,{' '}
            <span className="gradient-text">nothing it doesn't</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Built specifically for hackathon teams and small dev squads who need to move fast without chaos.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="glass-card-hover p-6 group animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
