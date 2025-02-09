import React, { useState, useEffect } from 'react';
import { 
  Activity, MessageSquare, TrendingUp, Users, Brain, Search, ArrowRight, X, 
  ChevronUp, ChevronDown, Share2, Download, RefreshCw, Globe, Clock, 
  TrendingDown, BarChart2, Hash, MessageCircle, ThumbsUp, AlertTriangle,
  Zap, Target, Award, UserCheck, Sparkles, LineChart, Lightbulb, Filter,
  MessageSquareDashed, ArrowUpRight, Repeat, Heart, BookMarked, DollarSign,
  Rocket, Shield, Coins
} from 'lucide-react';

function MatrixRain() {
  return (
    <div className="fixed inset-0 pointer-events-none">
      <div className="matrix-rain">
        {Array.from({ length: 50 }).map((_, i) => (
          <div key={i} className="matrix-column" style={{ animationDelay: `${Math.random() * 2}s` }}>
            {Array.from({ length: 20 }).map((_, j) => (
              <span key={j} className="text-emerald-400" style={{ animationDelay: `${Math.random() * 5}s` }}>
                {String.fromCharCode(33 + Math.random() * 93)}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function SearchView({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState('');
  const [recentSearches] = useState([
    'Bitcoin Analysis',
    'Ethereum Trends',
    'DeFi Projects',
    'NFT Market'
  ]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-3xl space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold text-emerald-400 flex items-center justify-center animate-pulse-slow">
            <Coins className="mr-4 h-16 w-16" />
            CryptoScope
          </h1>
          <p className="text-gray-400 text-xl">Real-time cryptocurrency sentiment and market analysis</p>
        </div>

        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center">
            <Search className="h-6 w-6 text-emerald-500" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter a cryptocurrency name or ticker..."
            className="w-full bg-gray-900/50 border-2 border-emerald-500/20 focus:border-emerald-500 text-gray-100 rounded-2xl py-6 pl-14 pr-14 text-xl placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all glass"
          />
          {query && (
            <button
              onClick={() => onSearch(query)}
              className="absolute inset-y-3 right-3 bg-emerald-500 text-black px-6 rounded-xl flex items-center hover:bg-emerald-400 transition-all group"
            >
              <span className="mr-2">Analyze</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-gray-400 text-sm font-medium flex items-center">
            <Activity className="h-4 w-4 mr-2" />
            Recent Analyses
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recentSearches.map((search, i) => (
              <button
                key={i}
                onClick={() => onSearch(search)}
                className="card p-4 text-left transition-all group hover:bg-gray-800/50"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 group-hover:text-emerald-400 transition-colors">{search}</span>
                  <ArrowRight className="h-4 w-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PriceTargetCard({ title, value, icon: Icon, timeframe }: {
  title: string;
  value: number | null;
  icon: any;
  timeframe: string;
}) {
  return (
    <div className="card p-6 hover:scale-[1.02] transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-xl bg-emerald-500/10">
          <Icon className="h-6 w-6 text-emerald-400" />
        </div>
        <span className="text-sm text-gray-400">{timeframe}</span>
      </div>
      <h3 className="text-gray-400 mb-2">{title}</h3>
      <p className="text-2xl font-bold text-emerald-400">
        {value ? `$${value.toLocaleString()}` : 'TBD'}
      </p>
    </div>
  );
}

function SentimentCard({ data }: { data: any }) {
  return (
    <div className="card p-6">
      <h2 className="text-xl font-semibold text-gray-300 mb-6 flex items-center">
        <ThumbsUp className="h-5 w-5 mr-2 text-emerald-400" />
        Sentiment Analysis
      </h2>
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-emerald-400 mb-2">
            {data.positivePercentage}%
          </div>
          <div className="text-gray-400">Positive</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-400 mb-2">
            {data.neutralPercentage}%
          </div>
          <div className="text-gray-400">Neutral</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-red-400 mb-2">
            {data.negativePercentage}%
          </div>
          <div className="text-gray-400">Negative</div>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <h3 className="text-gray-400 mb-2">Positive Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {data.positiveKeywords.map((keyword: string, i: number) => (
              <span key={i} className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm">
                {keyword}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-gray-400 mb-2">Negative Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {data.negativeKeywords.map((keyword: string, i: number) => (
              <span key={i} className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm">
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function KeyTweetsSection({ tweets }: { tweets: any[] }) {
  return (
    <div className="space-y-4">
      {tweets.map((tweet, i) => (
        <div key={i} className="card p-4">
          <div className="flex items-start space-x-3">
            <img 
              src={`https://source.unsplash.com/100x100/?crypto&${i}`}
              alt={tweet.user}
              className="w-12 h-12 rounded-full ring-2 ring-emerald-500/20"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-200">{tweet.user}</p>
                  <p className="text-gray-500 text-sm">{tweet.handle}</p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs ${
                  tweet.sentiment === 'positive' ? 'text-emerald-400 bg-emerald-500/20' :
                  tweet.sentiment === 'negative' ? 'text-red-400 bg-red-500/20' :
                  'text-blue-400 bg-blue-500/20'
                }`}>
                  {tweet.sentiment.charAt(0).toUpperCase() + tweet.sentiment.slice(1)}
                </div>
              </div>
              <p className="text-gray-300 mt-2">{tweet.tweet}</p>
              <div className="flex items-center mt-3 space-x-4 text-gray-500 text-sm">
                <a 
                  href={tweet.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center hover:text-emerald-400 transition-colors"
                >
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  View Tweet
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CatalystsAndRisks({ catalysts, risks }: { catalysts: any[]; risks: any[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-gray-300 mb-4 flex items-center">
          <Rocket className="h-5 w-5 mr-2 text-emerald-400" />
          Catalysts
        </h2>
        <div className="space-y-4">
          {catalysts.map((catalyst, i) => (
            <div key={i} className="p-4 bg-gray-800/50 rounded-lg">
              <p className="text-gray-300">{catalyst.description}</p>
              <p className="text-sm text-gray-500 mt-2">Source: {catalyst.source}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-gray-300 mb-4 flex items-center">
          <Shield className="h-5 w-5 mr-2 text-red-400" />
          Risks
        </h2>
        <div className="space-y-4">
          {risks.map((risk, i) => (
            <div key={i} className="p-4 bg-gray-800/50 rounded-lg">
              <p className="text-gray-300">{risk.description}</p>
              <p className="text-sm text-gray-500 mt-2">Source: {risk.source}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TrendsSection({ trends }: { trends: any }) {
  return (
    <div className="card p-6">
      <h2 className="text-xl font-semibold text-gray-300 mb-6 flex items-center">
        <TrendingUp className="h-5 w-5 mr-2 text-emerald-400" />
        Market Trends
      </h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-gray-400 mb-2">Tweet Volume</h3>
          <p className="text-emerald-400 font-semibold">{trends.tweetVolumeChange}</p>
        </div>
        <div>
          <h3 className="text-gray-400 mb-2">Emerging Narratives</h3>
          <div className="flex flex-wrap gap-2">
            {trends.emergingNarratives.map((narrative: string, i: number) => (
              <span key={i} className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-sm">
                {narrative}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-gray-400 mb-2">Related Coins</h3>
          <div className="flex flex-wrap gap-2">
            {trends.relatedCoins.map((coin: string, i: number) => (
              <span key={i} className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm">
                {coin}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ data, onBack }: { data: any; onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'sentiment' | 'social'>('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-6 py-8 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div className="flex items-center space-x-4">
            <button 
              onClick={onBack}
              className="bg-gray-900/80 hover:bg-gray-800 p-2 rounded-lg transition-all hover:scale-105"
            >
              <X className="h-5 w-5 text-emerald-400" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-emerald-400 flex items-center">
                {data.coin} ({data.ticker})
              </h1>
              <p className="text-gray-400 mt-1 flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {data.date}
                <span className="mx-2">•</span>
                <Globe className="h-4 w-4 mr-1" />
                Market Analysis
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={handleRefresh}
              className={`bg-emerald-500/20 hover:bg-emerald-500/30 px-4 py-2 rounded-lg flex items-center transition-all text-emerald-400 ${
                isRefreshing ? 'animate-spin' : ''
              }`}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </button>
            <button className="bg-gray-900/80 hover:bg-gray-800 px-4 py-2 rounded-lg flex items-center transition-all text-gray-300 hover:text-emerald-400">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </button>
            <button className="bg-gray-900/80 hover:bg-gray-800 px-4 py-2 rounded-lg flex items-center transition-all text-gray-300 hover:text-emerald-400">
              <Download className="mr-2 h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-8">
          {[
            { id: 'overview' as const, label: 'Overview', icon: BarChart2 },
            { id: 'sentiment' as const, label: 'Sentiment Analysis', icon: ThumbsUp },
            { id: 'social' as const, label: 'Social Insights', icon: MessageSquareDashed }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-3 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-gray-900/50 text-gray-400 hover:bg-gray-800'
              }`}
            >
              <tab.icon className="h-5 w-5 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-12 gap-6">
          {activeTab === 'overview' && (
            <>
              <div className="col-span-12">
                <div className="card p-6 mb-6">
                  <h2 className="text-xl font-semibold text-gray-300 mb-4">Summary</h2>
                  <p className="text-gray-300">{data.summary}</p>
                </div>
              </div>
              
              <div className="col-span-12 grid grid-cols-1 md:grid-cols-4 gap-6">
                <PriceTargetCard
                  title="Short Term Dip Target"
                  value={data.priceTargets.shortTermDipTarget}
                  icon={Target}
                  timeframe="24h"
                />
                <PriceTargetCard
                  title="Short Term Range"
                  value={data.priceTargets.shortTermDipTargetRange}
                  icon={TrendingUp}
                  timeframe="24-48h"
                />
                <PriceTargetCard
                  title="Mid Term Target"
                  value={data.priceTargets.midTermTarget}
                  icon={LineChart}
                  timeframe="1-2 weeks"
                />
                <PriceTargetCard
                  title="Long Term Target"
                  value={data.priceTargets.longTermTarget}
                  icon={Rocket}
                  timeframe="1-3 months"
                />
              </div>

              <div className="col-span-12">
                <CatalystsAndRisks
                  catalysts={data.catalysts}
                  risks={data.risks}
                />
              </div>
            </>
          )}

          {activeTab === 'sentiment' && (
            <>
              <div className="col-span-12 md:col-span-8">
                <SentimentCard data={data.sentimentAnalysis} />
              </div>
              <div className="col-span-12 md:col-span-4">
                <TrendsSection trends={data.trends} />
              </div>
              <div className="col-span-12">
                <div className="card p-6">
                  <h2 className="text-xl font-semibold text-gray-300 mb-4">Example Tweets</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-gray-400 mb-4">Positive Examples</h3>
                      <KeyTweetsSection tweets={data.sentimentAnalysis.examples.positive} />
                    </div>
                    <div>
                      <h3 className="text-gray-400 mb-4">Negative Examples</h3>
                      <KeyTweetsSection tweets={data.sentimentAnalysis.examples.negative} />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'social' && (
            <>
              <div className="col-span-12">
                <div className="card p-6 mb-6">
                  <h2 className="text-xl font-semibold text-gray-300 mb-6 flex items-center">
                    <MessageCircle className="h-5 w-5 mr-2 text-emerald-400" />
                    Key Tweets
                  </h2>
                  <KeyTweetsSection tweets={data.keyTweets} />
                </div>
              </div>
              <div className="col-span-12">
                <div className="card p-6">
                  <h2 className="text-xl font-semibold text-gray-300 mb-4">Sources</h2>
                  <div className="space-y-2">
                    {data.sourceURLs.map((url: string, i: number) => (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-emerald-400 hover:text-emerald-300 transition-colors"
                      >
                        {url}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Simulated data - in a real app, this would come from an API
    setAnalysisData({
      coin: "Bitcoin",
      ticker: "BTC",
      date: "2024-03-14",
      summary: "Bitcoin shows strong bullish sentiment with increasing institutional adoption...",
      sentimentAnalysis: {
        positivePercentage: 65,
        negativePercentage: 15,
        neutralPercentage: 20,
        score: 7.5,
        positiveKeywords: ["adoption", "institutional", "bullish"],
        negativeKeywords: ["regulation", "volatility"],
        examples: {
          positive: [
            {
              tweet: "Bitcoin's institutional adoption is accelerating!",
              user: "CryptoAnalyst",
              handle: "@cryptoanalyst"
            }
          ],
          negative: [
            {
              tweet: "Regulatory concerns still loom over crypto markets",
              user: "MarketWatcher",
              handle: "@marketwatcher"
            }
          ]
        }
      },
      priceTargets: {
        shortTermDipTarget: 65000,
        shortTermDipTargetRange: 68000,
        midTermTarget: 75000,
        longTermTarget: 100000
      },
      catalysts: [
        {
          description: "ETF approval expected soon",
          source: "Financial Times"
        }
      ],
      risks: [
        {
          description: "Potential regulatory challenges",
          source: "Reuters"
        }
      ],
      trends: {
        tweetVolumeChange: "+25% in last 24h",
        emergingNarratives: ["ETF Approval", "Institutional Buying"],
        relatedCoins: ["ETH", "SOL", "BNB"]
      },
      keyTweets: [
        {
          user: "Crypto Influencer",
          handle: "@cryptoinfluencer",
          tweet: "Bitcoin breaking new highs!",
          link: "https://twitter.com/example",
          sentiment: "positive"
        }
      ],
      sourceURLs: [
        "https://example.com/bitcoin-analysis",
        "https://example.com/market-report"
      ]
    });
    setHasSearched(true);
  };

  const handleBack = () => {
    setHasSearched(false);
    setSearchQuery('');
    setAnalysisData(null);
  };

  return (
    <div className="min-h-screen bg-black text-gray-100">
      <MatrixRain />
      {!hasSearched ? (
        <SearchView onSearch={handleSearch} />
      ) : (
        <Dashboard data={analysisData} onBack={handleBack} />
      )}
    </div>
  );
}

export default App;