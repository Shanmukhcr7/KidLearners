import { AnimatedCard } from "@/components/ui/AnimatedSection";
import { Trophy, Medal, Crown } from "lucide-react";

export default function LeaderboardPage() {
  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="bg-[var(--color-primary)] comic-border rounded-2xl p-8 flex justify-between items-center relative overflow-hidden">
        <div className="z-10">
          <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tight text-[var(--color-navy)] flex items-center gap-4">
            <Trophy size={48} /> Global Leaderboard
          </h1>
          <p className="text-xl font-bold text-[var(--color-navy)]">See how you rank against the entire KidLearners network!</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Top Schools Leaderboard */}
        <div className="space-y-6">
          <h2 className="text-3xl font-black tracking-tight flex items-center gap-2">
            🏫 Top Schools
          </h2>
          
          <AnimatedCard className="comic-card bg-white p-6 border-[4px]">
            <ul className="space-y-4">
              <LeaderboardRow rank={1} name="Lincoln High School" score="1,245,800 XP" isHighlight={false} />
              <LeaderboardRow rank={2} name="Westside Tech (Your School)" score="985,200 XP" isHighlight={true} />
              <LeaderboardRow rank={3} name="Oakridge Academy" score="870,500 XP" isHighlight={false} />
              <LeaderboardRow rank={4} name="Pioneer Valley" score="750,100 XP" isHighlight={false} />
              <LeaderboardRow rank={5} name="Mountain View High" score="620,000 XP" isHighlight={false} />
            </ul>
          </AnimatedCard>
        </div>

        {/* Top Students Leaderboard */}
        <div className="space-y-6">
          <h2 className="text-3xl font-black tracking-tight flex items-center gap-2">
            🧑‍💻 Top Developers
          </h2>
          
          <AnimatedCard delay={0.2} className="comic-card bg-white p-6 border-[4px]">
            <ul className="space-y-4">
              <LeaderboardRow rank={1} name="Sarah K." score="24,500 XP" isHighlight={false} />
              <LeaderboardRow rank={2} name="David M." score="22,100 XP" isHighlight={false} />
              <LeaderboardRow rank={3} name="Emma L." score="19,800 XP" isHighlight={false} />
              <div className="border-t-[3px] border-dashed border-gray-200 my-4"></div>
              <LeaderboardRow rank={42} name="You" score="4,250 XP" isHighlight={true} />
            </ul>
          </AnimatedCard>
        </div>

      </div>
    </div>
  );
}

function LeaderboardRow({ rank, name, score, isHighlight }: { rank: number, name: string, score: string, isHighlight: boolean }) {
  
  let RankIcon = <div className="w-8 h-8 font-black text-xl text-gray-400 flex items-center justify-center">{rank}</div>;
  if (rank === 1) RankIcon = <Crown className="text-yellow-500" size={32} fill="currentColor" />;
  if (rank === 2) RankIcon = <Medal className="text-gray-400" size={32} fill="currentColor" />;
  if (rank === 3) RankIcon = <Medal className="text-amber-600" size={32} fill="currentColor" />;

  return (
    <li className={`flex items-center justify-between p-4 rounded-xl border-[3px] ${isHighlight ? 'bg-[#E5F9E0] border-[var(--color-secondary)]' : 'bg-gray-50 border-gray-200'}`}>
      <div className="flex items-center gap-4">
        <div className="w-10 flex justify-center">
          {RankIcon}
        </div>
        <span className="font-bold text-lg">{name}</span>
      </div>
      <span className="font-black text-[var(--color-navy)]">{score}</span>
    </li>
  );
}
