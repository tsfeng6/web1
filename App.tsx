import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Newspaper, ChevronRight, Layers, Smartphone, Palette, Lock, Plus, Trash2, Save, Image as ImageIcon, MapPin, Upload, Zap, FileText, Folder, Delete, X } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import Background from './components/Background';
import GlassCard from './components/GlassCard';
import { MacBookIcon, IPhoneIcon, WatchIcon, CodeIcon, CpuIcon, GpuIcon, ShieldIcon, PinIcon } from './components/SketchIcons';
import { IconProps } from './types';

// --- Data Types & Content ---

type PageKey = 'home' | 'computer' | 'phone' | 'secondhand' | 'code' | 'hardware' | 'news' | 'admin' | 'tools-geo' | 'news-full' | 'news-detail';
type Theme = 'stereo' | 'flat';
type TransitionStage = 'idle' | 'exiting' | 'holding' | 'entering';

interface PageData {
  title: string;
  icon: React.FC<IconProps>;
  description: string;
  content: string[];
}

interface NewsItem {
    id: number;
    title: string;
    date: string;
    content?: string; // Markdown content support
}

const PAGES: Record<string, PageData> = {
  computer: {
    title: '电脑',
    icon: MacBookIcon,
    description: '探索计算机架构与生产力工具的极致。',
    content: [
      'DigiBox 数码交流电脑板块致力于为同学们提供最前沿的计算机硬件知识与软件生态体验。',
      '我们定期举办黑苹果 (Hackintosh) 安装工作坊、Windows 性能调优讲座以及 Linux 发行版尝鲜活动。',
      '无论你是需要一台高性能的渲染工作站，还是轻薄便携的课堂笔记神器，这里都有详尽的评测与选购指南。',
      '加入我们，一起探索 ARM 架构的未来，对比 x86 的辉煌，挖掘每一个晶体管的潜能。'
    ]
  },
  phone: {
    title: '手机',
    icon: IPhoneIcon,
    description: '移动科技的前沿阵地与摄影艺术。',
    content: [
      '手机早已不仅是通讯工具，它是我们延伸的感官。',
      '在这里，我们对比 iOS 与 Android 的生态差异，探讨计算摄影的最新算法，以及移动端芯片的性能跃进。',
      '我们关注各大厂商的发布会，从折叠屏的工业设计到快充技术的物理极限，无所不谈。',
      '社团内部提供多品牌旗舰机型供成员体验，让“云评测”成为过去。'
    ]
  },
  secondhand: {
    title: '二手交易',
    icon: WatchIcon,
    description: '校内安全、透明的数码流转平台。',
    content: [
      '为 BUCEA 师生打造的专属数码循环平台。',
      '在这里交易闲置的数码产品，我们倡导“验机透明、价格公道、交易安全”。',
      '社团提供免费的验机服务与指导，帮助你鉴别成色，规避“翻新机”与“暗病机”风险。',
      '让每一件数码产品都能找到新的主人，发挥它的余热，这不仅是交易，更是环保。'
    ]
  },
  code: {
    title: '代码',
    icon: CodeIcon,
    description: '用逻辑构建世界，用算法改变生活。',
    content: [
      'Hello World! 这里是极客的乐园。',
      '代码板块涵盖 Web 全栈开发、人工智能算法入门、移动端 App 开发以及算法竞赛 (ACM/ICPC) 训练。',
      '我们崇尚开源精神 (Open Source)，鼓励大家在 GitHub 上分享自己的项目。',
      '定期举办黑客马拉松 (Hackathon)，让你在 24 小时内将疯狂的想法变为现实。'
    ]
  },
  hardware: {
    title: '硬件',
    icon: CpuIcon,
    description: '硬核极客的浪漫，从电路到芯片。',
    content: [
      '如果你对 PCB 电路板的味道着迷，那么你来对地方了。',
      '硬件板块深入探讨半导体物理、微处理器架构以及嵌入式系统开发 (Arduino/STM32/ESP32)。',
      '我们组织“装机大赛”，挑战理线艺术与散热极限；我们也研究键盘客制化，寻找最完美的手感。',
      '从摩尔定律到量子计算，我们关注算力基石的每一次震动。'
    ]
  },
  news: {
    title: '科技新闻',
    icon: GpuIcon,
    description: '捕捉全球科技脉搏，解读行业趋势。',
    content: [
      '在这个信息爆炸的时代，我们为你筛选最有价值的科技资讯。',
      '从 AI 大模型的迭代到半导体产业链的博弈，从虚拟现实 (VR/AR) 的突破到清洁能源的应用。',
      '不仅是搬运新闻，更是深度解读。我们定期发布社团原创的科技评论周刊。',
      '在这里，我们不仅是科技的见证者，更是思考者。'
    ]
  }
};

// Initial Mock Data
const INITIAL_NEWS_ITEMS: NewsItem[] = [
  { id: 1, title: '数码交流 2024 秋季招新正式启动！', date: '2024-11-20', content: '我们不仅寻找数码爱好者，更寻找未来的科技领袖。\n\n无论你是硬件发烧友、代码极客，还是摄影达人，这里都有属于你的舞台。\n\n**招新部门：**\n- 技术部\n- 媒体部\n- 运营部\n\n期待你的加入！' },
  { id: 2, title: '关于举办第十届“装机猿”大赛的通知', date: '2024-11-18', content: '这是一场速度与美学的较量。\n\n参赛选手需要在规定时间内完成一台高性能主机的组装与点亮。不仅比拼手速，更比拼理线艺术。\n\n**奖品丰厚：**\n- 一等奖：RTX 4060 显卡一张\n- 二等奖：机械键盘一把\n- 三等奖：大容量固态硬盘' },
  { id: 3, title: '苹果 M4 芯片深度架构解析讲座回顾', date: '2024-11-15', content: '本次讲座我们深入剖析了 Apple M4 芯片的微架构设计。\n\n从 N3E 工艺的优势到新的 SME 矩阵扩展指令集，讲师带大家领略了移动计算的巅峰。\n\n错过的同学可以在社团网盘下载录像回放。' },
  { id: 4, title: '校园二手市场规范化交易倡议书', date: '2024-11-10', content: '为了维护良好的校园交易环境，我们倡议：\n\n1. 如实描述商品成色，不隐瞒暗病。\n2. 尽量面交，当场验机。\n3. 合理定价，拒绝恶意倒卖。\n\n让我们共同打造一个诚信、透明的数码交流圈。' },
];

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageKey>('home');
  const [theme, setTheme] = useState<Theme>('stereo');
  
  // App State
  const [newsItems, setNewsItems] = useState<NewsItem[]>(INITIAL_NEWS_ITEMS);
  const [selectedArticleId, setSelectedArticleId] = useState<number | null>(null);
  
  // Background Control
  const [bgRefreshKey, setBgRefreshKey] = useState(0);

  // Transition States
  const [isNavigating, setIsNavigating] = useState(false);
  const [transitionStage, setTransitionStage] = useState<TransitionStage>('idle');

  // Admin State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('11451419');
  const [inputCode, setInputCode] = useState('');
  const [isShake, setIsShake] = useState(false);
  const [adminTab, setAdminTab] = useState<'articles' | 'settings'>('articles');
  const [editingArticle, setEditingArticle] = useState<Partial<NewsItem> | null>(null);
  const [tempPassword, setTempPassword] = useState('');

  // Geo Tool State
  const [geoImage, setGeoImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [geoResult, setGeoResult] = useState<{city: string, prob: number}[] | null>(null);
  
  // Font injection
  useEffect(() => {
    const loadFonts = async () => {
      try {
        const fontUrl = 'https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;600;700;800;900&family=Noto+Sans+SC:wght@100;300;400;500;700&display=swap';
        const style = document.createElement('style');
        style.innerHTML = `
          @import url('${fontUrl}'); 
          body { font-family: 'Inter', 'Noto Sans SC', sans-serif; }
          .ease-silky { transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1); }
          .shake-anim { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
          @keyframes shake {
            10%, 90% { transform: translate3d(-1px, 0, 0); }
            20%, 80% { transform: translate3d(2px, 0, 0); }
            30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
            40%, 60% { transform: translate3d(4px, 0, 0); }
          }
        `;
        document.head.appendChild(style);
      } catch (e) {
        console.error('Font load error', e);
      }
    };
    loadFonts();
  }, []);

  // Admin Login Listener (Physical Keyboard)
  useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
          if (currentPage === 'admin' && !isAdminAuthenticated) {
              if (e.key >= '0' && e.key <= '9') {
                  handleKeypadInput(e.key);
              } else if (e.key === 'Backspace') {
                  handleKeypadInput('DEL');
              }
          }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, isAdminAuthenticated, inputCode]);

  // Handle Code Input Logic (Shared by Keyboard and Keypad)
  const handleKeypadInput = (key: string) => {
      if (isAdminAuthenticated) return;
      
      if (key === 'DEL') {
           setInputCode(prev => prev.slice(0, -1));
           return;
      }

      if (inputCode.length < 8) {
          const newCode = inputCode + key;
          setInputCode(newCode);
          if (newCode.length === 8) {
              // Verify
              if (newCode === adminPassword) {
                  setTimeout(() => setIsAdminAuthenticated(true), 300);
              } else {
                  setIsShake(true);
                  setTimeout(() => {
                      setIsShake(false);
                      setInputCode('');
                  }, 500);
              }
          }
      }
  };

  const handleNavigate = (page: PageKey) => {
    if (currentPage === page) return;
    setIsNavigating(true);
    setTimeout(() => {
      setCurrentPage(page);
      // Reset specific states when leaving
      if (page !== 'admin') {
          setInputCode('');
      }
      if (page !== 'tools-geo') {
          setGeoImage(null);
          setGeoResult(null);
      }
      if (page !== 'news-detail') {
          // Optional: reset article selection if needed, but usually good to keep for history
      }
      window.scrollTo(0, 0);
      setTimeout(() => {
         setIsNavigating(false);
      }, 50); 
    }, 250);
  };

  const toggleTheme = (e?: React.MouseEvent) => {
    if(e) e.stopPropagation();
    setTransitionStage('exiting');
    setTimeout(() => {
        setTransitionStage('holding');
        const nextTheme = theme === 'stereo' ? 'flat' : 'stereo';
        setTheme(nextTheme);
        if (nextTheme === 'stereo') {
            setBgRefreshKey(prev => prev + 1);
        }
        setTimeout(() => {
            setTransitionStage('entering');
            setTimeout(() => {
                setTransitionStage('idle');
            }, 250); 
        }, 800); 
    }, 250); 
  };

  // --- Helper Styles ---
  const getFontClass = (type: 'h1' | 'h2' | 'body' | 'label') => {
    if (theme === 'stereo') {
      switch (type) {
        case 'h1': return 'font-extrabold tracking-tight text-gray-800';
        case 'h2': return 'font-bold tracking-widest text-gray-600';
        case 'body': return 'font-medium text-gray-700';
        case 'label': return 'font-bold text-gray-800';
      }
    } else {
      // Thinner fonts for Flat theme
      switch (type) {
        case 'h1': return 'font-[100] tracking-[0.1em] text-black';
        case 'h2': return 'font-[100] tracking-[0.2em] text-gray-600';
        case 'body': return 'font-[200] tracking-wide text-gray-800';
        case 'label': return 'font-[100] tracking-widest text-gray-900';
      }
    }
  };

  const iconStrokeWidth = theme === 'stereo' ? 1.5 : 0.8;

  // --- Logic: Tools (REAL AI) ---
  const analyzeWithGemini = async (base64Image: string) => {
      setIsAnalyzing(true);
      try {
        const mimeTypeMatch = base64Image.match(/data:([^;]+);base64,(.*)/);
        if (!mimeTypeMatch) throw new Error("Invalid image data");
        
        const mimeType = mimeTypeMatch[1];
        const base64Data = mimeTypeMatch[2];

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                {
                    role: 'user',
                    parts: [
                        { inlineData: { mimeType: mimeType, data: base64Data } },
                        { text: "Analyze the location of this image. Identify the city or region. Return a JSON array of exactly 4 potential locations with confidence probability (integer 0-100). Key names: 'city', 'prob'. Ensure probabilities are realistic guesses." }
                    ]
                }
            ],
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: { city: { type: Type.STRING }, prob: { type: Type.INTEGER } }
                    }
                }
            }
        });

        const text = response.text;
        if (text) {
            const data = JSON.parse(text);
            setGeoResult(data);
        }
      } catch (error) {
          console.error("AI Analysis Failed", error);
          setGeoResult([
              { city: 'AI连接失败 (Connection Failed)', prob: 0 },
              { city: '请检查 API Key', prob: 0 },
              { city: 'Please check network', prob: 0 },
              { city: 'Retry later', prob: 0 },
          ]);
      } finally {
          setIsAnalyzing(false);
      }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              const result = reader.result as string;
              setGeoImage(result);
              setGeoResult(null);
              analyzeWithGemini(result);
          };
          reader.readAsDataURL(file);
      }
  };

  // --- Logic: Admin ---
  const handleSaveArticle = () => {
      if (editingArticle && editingArticle.title) {
          if (editingArticle.id) {
              // Update
              setNewsItems(prev => prev.map(item => item.id === editingArticle.id ? { ...item, ...editingArticle } as NewsItem : item));
          } else {
              // Create
              const newId = Math.max(...newsItems.map(i => i.id)) + 1;
              setNewsItems(prev => [{ id: newId, title: editingArticle.title!, date: new Date().toISOString().split('T')[0], content: editingArticle.content || '' }, ...prev]);
          }
          setEditingArticle(null);
      }
  };

  const handleDeleteArticle = (id: number) => {
      setNewsItems(prev => prev.filter(i => i.id !== id));
  };

  // --- Render Views ---

  const renderHome = () => {
    
    // STROKE WIDTH CALCULATION FOR VISUAL CONSISTENCY
    const lucideStroke = theme === 'stereo' ? 1.5 : 1.2;
    const shieldStroke = theme === 'stereo' ? 6 : 5;

    return (
      <div className="h-full w-full flex flex-col gap-6 p-6 md:p-10 max-w-[1600px] mx-auto">
        
        {/* Header */}
        <GlassCard 
          variant={theme} 
          className="w-full h-[32vh] flex items-center justify-center relative group"
        >
           <div className="text-center z-10 pt-8">
              <h1 className={`text-6xl md:text-8xl mb-6 transition-all duration-700 ${getFontClass('h1')}`}>
                DigiBox
              </h1>
              <div className="flex items-center justify-center gap-6">
                <span className={`h-[1px] w-12 transition-colors ${theme === 'stereo' ? 'bg-gray-400' : 'bg-gray-400'}`}></span>
                <h2 className={`text-3xl md:text-4xl transition-all duration-700 ${getFontClass('h2')}`}>数码交流</h2>
                <span className={`h-[1px] w-12 transition-colors ${theme === 'stereo' ? 'bg-gray-400' : 'bg-gray-400'}`}></span>
              </div>
           </div>
           {theme === 'stereo' && (
             <div className="absolute top-10 left-10 opacity-10 -rotate-12">
                <MacBookIcon className="w-24 h-24 text-gray-800" strokeWidth={0.5} />
             </div>
           )}

           {/* RELOCATED BUTTONS: Backend & Theme */}
           <div className="absolute bottom-6 right-6 flex gap-4 z-20">
               <button 
                  onClick={toggleTheme}
                  className={`p-3 rounded-full transition-all duration-300 flex items-center justify-center group hover:scale-105 ${theme === 'stereo' ? 'bg-white/40 hover:bg-white/60 text-gray-700 shadow-lg' : 'border border-gray-300 hover:border-gray-600 text-gray-500 hover:text-gray-900'}`}
                  title="Switch Theme"
               >
                   {theme === 'stereo' ? <Smartphone size={20} strokeWidth={lucideStroke} /> : <Layers size={20} strokeWidth={lucideStroke} />}
               </button>
               <button 
                  onClick={(e) => { e.stopPropagation(); handleNavigate('admin'); }}
                  className={`p-3 rounded-full transition-all duration-300 flex items-center justify-center group hover:scale-105 ${theme === 'stereo' ? 'bg-white/40 hover:bg-white/60 text-gray-700 shadow-lg' : 'border border-gray-300 hover:border-gray-600 text-gray-500 hover:text-gray-900'}`}
                  title="Backend Login"
               >
                   <ShieldIcon className="w-5 h-5" strokeWidth={shieldStroke} />
               </button>
           </div>
        </GlassCard>

        {/* Main Layout Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(58vh-3rem)]">
          
          {/* News Feed */}
          <div className="lg:col-span-5 h-full">
              <GlassCard 
                  variant={theme} 
                  className="h-full flex flex-col p-8 group relative"
                  // Clicking header goes to timeline
                  onClick={() => handleNavigate('news-full')}
                  hoverEffect={true}
              >
                <div className="flex items-center justify-between mb-8 opacity-80 cursor-pointer">
                  <div className="flex items-center gap-3">
                      <Newspaper size={theme === 'stereo' ? 28 : 24} strokeWidth={iconStrokeWidth} className={theme === 'flat' ? 'text-gray-500' : 'text-gray-700'} />
                      <h3 className={`text-2xl transition-all ${theme === 'stereo' ? 'font-bold text-gray-800' : 'font-[100] tracking-widest text-gray-600'}`}>最新动态</h3>
                  </div>
                  <div className={`transition-transform duration-300 group-hover:translate-x-1 ${theme === 'stereo' ? 'text-gray-500' : 'text-gray-400'}`}>
                      <ChevronRight />
                  </div>
                </div>
                
                <div className="flex-1 overflow-hidden relative">
                   {/* Preview List */}
                   <div className="space-y-5">
                    {newsItems.slice(0, 4).map((item) => (
                        <div 
                          key={item.id} 
                          // Clicking item goes to Detail Page
                          onClick={(e) => { e.stopPropagation(); setSelectedArticleId(item.id); handleNavigate('news-detail'); }}
                          className={`p-4 transition-all duration-300 cursor-pointer ${
                            theme === 'stereo' 
                                ? 'rounded-xl bg-white/10 border border-transparent hover:bg-white/20' 
                                : 'border-b border-gray-200 hover:bg-gray-50/50'
                          }`}
                        >
                        <div className={`text-xs mb-2 transition-colors ${theme === 'stereo' ? 'text-gray-500 font-medium' : 'text-gray-500 font-[200]'}`}>
                            {item.date}
                        </div>
                        <div className={`leading-relaxed line-clamp-2 transition-colors ${
                            theme === 'stereo' 
                            ? 'text-gray-800 font-medium' 
                            : 'text-gray-900 font-[200]'
                        }`}>
                            {item.title}
                        </div>
                        </div>
                    ))}
                  </div>
                  
                  {/* Fade out gradient at bottom to suggest more */}
                  <div className={`absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t ${theme === 'stereo' ? 'from-gray-100/10' : 'from-gray-50/0'} to-transparent pointer-events-none`}></div>
                </div>
              </GlassCard>
          </div>

          {/* Icon Grid & Tools */}
          <div className="lg:col-span-7 h-full">
              <GlassCard variant={theme} className="h-full relative flex items-center justify-center p-8">
                <div className="w-full h-full flex flex-col">
                    
                    {/* Main Categories */}
                    <div className="grid grid-cols-3 gap-x-12 gap-y-10 w-full max-w-xl mx-auto pt-4 pb-6">
                    {[
                        { key: 'computer', Icon: MacBookIcon },
                        { key: 'phone', Icon: IPhoneIcon },
                        { key: 'secondhand', Icon: WatchIcon },
                        { key: 'code', Icon: CodeIcon },
                        { key: 'hardware', Icon: CpuIcon },
                        { key: 'news', Icon: GpuIcon },
                    ].map((item) => (
                        <button
                        key={item.key}
                        onClick={(e) => { e.stopPropagation(); handleNavigate(item.key as PageKey); }}
                        className="group relative w-full flex flex-col items-center justify-center p-2 focus:outline-none transition-transform active:scale-95 duration-200"
                        >
                        <div className="transform transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-1">
                            <item.Icon 
                            className={`w-16 h-16 md:w-20 md:h-20 transition-colors duration-300 ${
                                theme === 'stereo' 
                                ? 'text-gray-600 group-hover:text-gray-900 drop-shadow-md' 
                                : 'text-gray-800 group-hover:text-black'
                            }`} 
                            strokeWidth={theme === 'stereo' ? 1.2 : 0.6} 
                            />
                        </div>
                        </button>
                    ))}
                    </div>

                    {/* Divider Line */}
                    <div className="w-full flex items-center justify-center py-2">
                        <div className={`h-[1px] w-3/4 rounded-full ${theme === 'stereo' ? 'bg-gray-400/30 shadow-[0_1px_0_rgba(255,255,255,0.5)]' : 'bg-gray-300'}`}></div>
                    </div>

                    {/* Tools Section - TEXT REMOVED */}
                    <div className="flex-1 flex items-center justify-center pt-4">
                         <button
                            onClick={(e) => { e.stopPropagation(); handleNavigate('tools-geo'); }}
                            className="group relative flex flex-col items-center justify-center p-2 focus:outline-none transition-transform active:scale-95 duration-200"
                         >
                            <div className="transform transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-1">
                                <PinIcon 
                                    className={`w-16 h-16 md:w-20 md:h-20 transition-colors duration-300 ${
                                        theme === 'stereo' 
                                        ? 'text-gray-600 group-hover:text-gray-900 drop-shadow-md' 
                                        : 'text-gray-800 group-hover:text-black'
                                    }`} 
                                    strokeWidth={theme === 'stereo' ? 1.2 : 0.6} 
                                />
                            </div>
                         </button>
                    </div>

                </div>
              </GlassCard>
          </div>

        </div>
      </div>
    );
  };

  // Full Screen News Detail Page
  const renderNewsDetail = () => {
    const article = newsItems.find(i => i.id === selectedArticleId);
    if (!article) return null;

    return (
        <div className="h-full w-full flex items-center justify-center p-6 md:p-10">
            <GlassCard variant={theme} className="w-full max-w-5xl h-[85vh] flex flex-col md:flex-row overflow-hidden">
                {/* Sidebar / Header Area */}
                <div className={`w-full md:w-1/3 p-10 flex flex-col relative border-b md:border-b-0 md:border-r ${theme === 'stereo' ? 'bg-white/10 border-white/20' : 'bg-transparent border-gray-200'}`}>
                    <button 
                        onClick={() => handleNavigate('home')}
                        className="flex items-center gap-3 mb-12 group active:scale-95 transition-transform w-max"
                    >
                         <div className={`p-2 rounded-full transition-colors ${theme === 'stereo' ? 'bg-white/20 group-hover:bg-white/50' : 'border border-gray-200 group-hover:border-gray-400'}`}>
                             <ArrowLeft size={18} strokeWidth={iconStrokeWidth} className="text-gray-600"/>
                         </div>
                         <span className={`text-sm ${theme === 'stereo' ? 'font-medium text-gray-600' : 'font-[200] text-gray-500'}`}>返回主页</span>
                    </button>
                    
                    <div className="mt-4">
                        <div className={`text-sm font-mono mb-4 ${theme === 'stereo' ? 'text-blue-600 font-bold' : 'text-gray-500 font-[300]'}`}>{article.date}</div>
                        <h1 className={`text-3xl md:text-4xl leading-tight ${getFontClass('h1')}`}>{article.title}</h1>
                    </div>
                </div>

                {/* Content Area */}
                <div className={`flex-1 p-10 md:p-16 overflow-y-auto custom-scrollbar ${theme === 'stereo' ? 'bg-white/5' : 'bg-transparent'}`}>
                    <div className={`text-lg leading-relaxed whitespace-pre-line ${theme === 'stereo' ? 'text-gray-700 font-light' : 'text-gray-900 font-[200]'}`}>
                        {article.content || "暂无内容"}
                    </div>
                </div>
            </GlassCard>
        </div>
    );
  };

  // Full Screen Timeline Page
  const renderNewsTimeline = () => (
      <div className="h-full w-full flex items-center justify-center p-6 md:p-10">
          <GlassCard variant={theme} className="w-full max-w-5xl h-[85vh] flex flex-col relative overflow-hidden p-10">
               <div className="flex items-center justify-between mb-10 z-10">
                  <button onClick={() => handleNavigate('home')} className="p-3 rounded-full hover:bg-gray-100/20 transition-colors flex items-center gap-2 text-gray-600">
                      <ArrowLeft size={24} strokeWidth={iconStrokeWidth} />
                      <span className={theme === 'stereo' ? 'font-medium' : 'font-[200]'}>返回</span>
                  </button>
                  <h2 className={`text-3xl ${getFontClass('h2')}`}>社团动态时间轴</h2>
                  <div className="w-20"></div>
               </div>

               <div className="flex-1 overflow-y-auto custom-scrollbar pl-10 pr-4">
                   <div className={`relative border-l ${theme === 'stereo' ? 'border-gray-400/50' : 'border-gray-300'} ml-4 space-y-12 py-4`}>
                       {newsItems.map((item) => (
                           <div 
                             key={item.id} 
                             className="relative pl-12 group cursor-pointer"
                             onClick={() => { setSelectedArticleId(item.id); handleNavigate('news-detail'); }}
                           >
                               {/* Timeline Dot */}
                               <div className={`absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full border-2 transition-all duration-300 ${
                                   theme === 'stereo' 
                                   ? 'bg-white border-blue-500 group-hover:scale-150 shadow-md' 
                                   : 'bg-white border-gray-800 group-hover:scale-125'
                               }`}></div>

                               <div className={`mb-2 text-sm font-mono ${theme === 'stereo' ? 'text-blue-600 font-bold' : 'text-gray-500 font-[300]'}`}>
                                   {item.date}
                               </div>
                               <h3 className={`text-2xl mb-4 group-hover:text-blue-600 transition-colors ${theme === 'stereo' ? 'font-bold text-gray-800' : 'font-[200] text-black'}`}>
                                   {item.title}
                               </h3>
                               <div className={`p-6 rounded-2xl leading-relaxed whitespace-pre-line line-clamp-3 ${
                                   theme === 'stereo' 
                                   ? 'bg-white/30 border border-white/40 text-gray-700 shadow-sm group-hover:bg-white/50' 
                                   : 'bg-gray-50/50 border border-gray-200 text-gray-600 font-[300] group-hover:bg-gray-100'
                               }`}>
                                   {item.content || '暂无详细内容...'}
                               </div>
                           </div>
                       ))}
                   </div>
               </div>
          </GlassCard>
      </div>
  );

  const renderContentPage = () => {
      if (['home', 'admin', 'tools-geo', 'news-full', 'news-detail'].includes(currentPage)) return null;
      const data = PAGES[currentPage];
      return (
        <div className="h-full w-full flex items-center justify-center p-6 md:p-10">
          <GlassCard variant={theme} className="w-full max-w-5xl h-[85vh] flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar */}
            <div className={`w-full md:w-1/3 p-10 flex flex-col justify-between relative overflow-hidden border-b md:border-b-0 md:border-r ${
              theme === 'stereo' ? 'bg-white/10 border-white/20' : 'bg-transparent border-gray-200'
            }`}>
              <div className="z-10">
                <button 
                  onClick={() => handleNavigate('home')}
                  className="flex items-center gap-3 mb-12 group active:scale-95 transition-transform"
                >
                  <div className={`p-2 rounded-full transition-colors ${
                    theme === 'stereo' ? 'bg-white/20 group-hover:bg-white/50' : 'border border-gray-200 group-hover:border-gray-400'
                  }`}>
                     <ArrowLeft size={18} strokeWidth={iconStrokeWidth} className="text-gray-600"/>
                  </div>
                  <span className={`text-sm ${theme === 'stereo' ? 'font-medium text-gray-600' : 'font-[200] text-gray-500'}`}>返回主页</span>
                </button>
                <div className="mb-8">
                   <data.icon className={`w-32 h-32 mb-8 ${theme === 'stereo' ? 'text-gray-800' : 'text-black'}`} strokeWidth={iconStrokeWidth} />
                   <h1 className={`text-5xl mb-6 ${getFontClass('h1')}`}>{data.title}</h1>
                   <p className={`text-lg leading-relaxed ${theme === 'stereo' ? 'font-light text-gray-600 border-l-4 border-gray-400 pl-4' : 'font-[200] text-gray-500'}`}>
                     {data.description}
                   </p>
                </div>
              </div>
            </div>
            {/* Content */}
            <div className={`flex-1 p-10 md:p-16 overflow-y-auto custom-scrollbar ${theme === 'stereo' ? 'bg-white/5' : 'bg-transparent'}`}>
              <div className="space-y-10 max-w-2xl">
                 {data.content.map((paragraph, idx) => (
                   <p key={idx} className={`text-xl leading-loose ${theme === 'stereo' ? 'text-gray-700 font-light' : 'text-gray-900 font-[200] tracking-wide'}`}>
                     {paragraph}
                   </p>
                 ))}
              </div>
            </div>
          </GlassCard>
        </div>
      );
  };

  const renderGeoTool = () => (
      <div className="h-full w-full flex items-center justify-center p-6 md:p-10">
        <GlassCard variant={theme} className="w-full max-w-4xl h-[80vh] flex flex-col relative p-10 overflow-hidden">
           {/* Header */}
           <div className="flex items-center justify-between mb-8 z-10">
               <button onClick={() => handleNavigate('home')} className="p-3 rounded-full hover:bg-gray-100/20 transition-colors">
                   <ArrowLeft size={24} className="text-gray-700" />
               </button>
               <h2 className={`text-2xl ${getFontClass('h2')}`}>AI 图寻系统</h2>
               <div className="w-10"></div>
           </div>

           {/* Content */}
           <div className="flex-1 flex flex-col items-center justify-center gap-8 z-10">
               {!geoImage ? (
                   <div className="w-full max-w-xl h-96 border-2 border-dashed border-gray-400/50 rounded-3xl flex flex-col items-center justify-center bg-white/20 hover:bg-white/30 transition-colors relative group">
                       <input 
                         type="file" 
                         accept="image/*"
                         onChange={handleFileUpload}
                         className="absolute inset-0 opacity-0 cursor-pointer"
                       />
                       <Upload size={64} className="text-gray-500 mb-6 group-hover:scale-110 transition-transform" strokeWidth={1} />
                       <p className="text-xl text-gray-600 font-medium">点击或拖拽上传图片</p>
                       <p className="text-sm text-gray-500 mt-2">支持 JPG, PNG (AI 分析地理位置)</p>
                   </div>
               ) : (
                   <div className="flex flex-col md:flex-row w-full gap-8 h-full">
                       {/* Image Preview */}
                       <div className="flex-1 relative rounded-3xl overflow-hidden shadow-2xl bg-black/5">
                           <img src={geoImage} alt="Upload" className="w-full h-full object-cover" />
                           {isAnalyzing && (
                               <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                                   <Zap className="animate-pulse mb-4" size={48} />
                                   <p className="text-xl font-medium tracking-widest animate-pulse">正在分析地理特征...</p>
                               </div>
                           )}
                       </div>
                       {/* Results */}
                       {geoResult && (
                           <div className="w-full md:w-80 flex flex-col justify-center animate-in slide-in-from-right duration-700">
                               <h3 className="text-lg font-bold text-gray-700 mb-6 flex items-center gap-2">
                                   <MapPin size={20} /> 分析结果
                               </h3>
                               <div className="space-y-4">
                                   {geoResult.map((res, idx) => (
                                       <div key={idx} className="bg-white/40 rounded-xl p-4 border border-white/50">
                                           <div className="flex justify-between items-end mb-2">
                                               <span className="font-medium text-gray-800">{res.city}</span>
                                               <span className="font-bold text-blue-700">{res.prob}%</span>
                                           </div>
                                           <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                               <div className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out" style={{ width: `${res.prob}%` }}></div>
                                           </div>
                                       </div>
                                   ))}
                               </div>
                               <button onClick={() => { setGeoImage(null); setGeoResult(null); }} className="mt-auto py-4 text-gray-500 hover:text-gray-800 transition-colors text-sm">
                                   重新上传
                               </button>
                           </div>
                       )}
                   </div>
               )}
           </div>
        </GlassCard>
      </div>
  );

  const renderAdminLogin = () => (
     <div className="h-full w-full flex items-center justify-center p-6 md:p-10 relative z-50">
        <GlassCard variant={theme} className={`w-full max-w-md p-8 flex flex-col items-center justify-center transition-transform ${isShake ? 'shake-anim' : ''} relative`}>
           
           {/* Back Button */}
           <button 
                onClick={() => handleNavigate('home')}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-200/20 transition-colors"
           >
                <X size={20} className={theme === 'stereo' ? 'text-gray-600' : 'text-gray-800'} />
           </button>

           <Lock className={`w-10 h-10 mb-4 ${theme === 'stereo' ? 'text-gray-600' : 'text-gray-800'} mt-4`} strokeWidth={1} />
           <h2 className={`text-xl mb-6 ${getFontClass('h2')}`}>输入密码</h2>
           
           {/* Dots Display */}
           <div className="flex gap-3 mb-8">
               {Array.from({ length: 8 }).map((_, idx) => (
                   <div 
                     key={idx}
                     className={`w-3 h-3 rounded-full border transition-all duration-300 ${
                         idx < inputCode.length 
                            ? (theme === 'stereo' ? 'bg-gray-800 border-gray-800 scale-110' : 'bg-black border-black scale-110')
                            : (theme === 'stereo' ? 'bg-transparent border-gray-400' : 'bg-transparent border-gray-300')
                     }`}
                   />
               ))}
           </div>
           <p className={`text-xs ${theme === 'stereo' ? 'text-gray-500' : 'text-gray-400'} mb-6`}>请输入8位数字访问后台</p>

           {/* ON-SCREEN KEYPAD */}
           <div className="grid grid-cols-3 gap-4 w-full max-w-[240px]">
               {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                   <button
                     key={num}
                     onClick={() => handleKeypadInput(num.toString())}
                     className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-light transition-all active:scale-95 ${
                         theme === 'stereo' 
                         ? 'bg-white/40 hover:bg-white/60 text-gray-800 shadow-sm' 
                         : 'border border-gray-300 hover:bg-gray-50 text-gray-800'
                     }`}
                   >
                       {num}
                   </button>
               ))}
               <div className="w-16 h-16"></div> {/* Spacer for alignment */}
               <button
                 onClick={() => handleKeypadInput('0')}
                 className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-light transition-all active:scale-95 ${
                     theme === 'stereo' 
                     ? 'bg-white/40 hover:bg-white/60 text-gray-800 shadow-sm' 
                     : 'border border-gray-300 hover:bg-gray-50 text-gray-800'
                 }`}
               >
                   0
               </button>
               <button
                 onClick={() => handleKeypadInput('DEL')}
                 className={`w-16 h-16 rounded-full flex items-center justify-center transition-all active:scale-95 ${
                     theme === 'stereo' 
                     ? 'hover:bg-white/40 text-gray-600' 
                     : 'text-gray-500 hover:text-red-500'
                 }`}
               >
                   <Delete size={24} strokeWidth={1} />
               </button>
           </div>

        </GlassCard>
     </div>
  );

  const renderAdminDashboard = () => (
      <div className="h-full w-full flex items-center justify-center p-6 md:p-10">
          <GlassCard variant={theme} className="w-full max-w-6xl h-[90vh] flex overflow-hidden">
              {/* Sidebar */}
              <div className="w-64 bg-white/20 border-r border-white/20 flex flex-col p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-8 flex items-center gap-2">
                      <ShieldIcon className="w-6 h-6"/> 后台管理
                  </h2>
                  
                  <nav className="space-y-2 flex-1">
                      <button 
                        onClick={() => { setAdminTab('articles'); setEditingArticle(null); }}
                        className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${adminTab === 'articles' ? 'bg-white/40 font-bold shadow-sm' : 'hover:bg-white/20 text-gray-600'}`}
                      >
                          <Folder size={18} /> 文稿管理
                      </button>
                      <button 
                        onClick={() => setAdminTab('settings')}
                        className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${adminTab === 'settings' ? 'bg-white/40 font-bold shadow-sm' : 'hover:bg-white/20 text-gray-600'}`}
                      >
                          <Lock size={18} /> 安全设置
                      </button>
                  </nav>

                  <button onClick={() => handleNavigate('home')} className="mt-auto text-sm text-gray-500 hover:text-gray-800 py-2">
                      退出登录
                  </button>
              </div>

              {/* Main Area */}
              <div className="flex-1 flex flex-col bg-white/10">
                  {adminTab === 'articles' && (
                      <>
                          {!editingArticle ? (
                              // List View
                              <div className="flex-1 flex flex-col p-8">
                                  <div className="flex justify-between items-center mb-6">
                                      <h3 className="text-2xl font-bold text-gray-700">所有文稿</h3>
                                      <button 
                                        onClick={() => setEditingArticle({})} 
                                        className="bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-black transition-colors shadow-lg"
                                      >
                                          <Plus size={18} /> 新建文稿
                                      </button>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 overflow-y-auto pb-4">
                                      {newsItems.map(item => (
                                          <div key={item.id} className="bg-white/40 p-5 rounded-xl border border-white/50 hover:shadow-md transition-shadow group relative">
                                              <div className="flex flex-col h-32">
                                                  <Folder className="text-blue-400 mb-2 w-8 h-8" strokeWidth={1} />
                                                  <span className="font-bold text-gray-800 line-clamp-2">{item.title}</span>
                                                  <span className="text-xs text-gray-500 mt-auto">{item.date}</span>
                                              </div>
                                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                                  <button onClick={() => setEditingArticle(item)} className="p-2 bg-white rounded-full shadow text-blue-600 hover:bg-blue-50">
                                                      <FileText size={14} />
                                                  </button>
                                                  <button onClick={() => handleDeleteArticle(item.id)} className="p-2 bg-white rounded-full shadow text-red-600 hover:bg-red-50">
                                                      <Trash2 size={14} />
                                                  </button>
                                              </div>
                                          </div>
                                      ))}
                                  </div>
                              </div>
                          ) : (
                              // Editor View
                              <div className="flex-1 flex flex-col p-8">
                                  <div className="flex items-center gap-4 mb-6 border-b border-gray-300/30 pb-4">
                                      <button onClick={() => setEditingArticle(null)} className="p-2 hover:bg-white/30 rounded-full">
                                          <ArrowLeft size={20} />
                                      </button>
                                      <input 
                                        type="text" 
                                        placeholder="输入标题..." 
                                        className="flex-1 bg-transparent text-2xl font-bold outline-none placeholder-gray-400"
                                        value={editingArticle.title || ''}
                                        onChange={e => setEditingArticle(prev => ({...prev, title: e.target.value}))}
                                      />
                                      <button onClick={handleSaveArticle} className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 shadow-md">
                                          <Save size={18} /> 保存
                                      </button>
                                  </div>
                                  <div className="flex-1 bg-white/40 rounded-xl border border-white/50 p-4 flex flex-col relative">
                                      <div className="flex gap-2 mb-2 border-b border-gray-200/50 pb-2">
                                          <button className="p-2 hover:bg-white/50 rounded text-gray-600 text-sm font-medium">H1</button>
                                          <button className="p-2 hover:bg-white/50 rounded text-gray-600 text-sm font-medium">Bold</button>
                                          <button className="p-2 hover:bg-white/50 rounded text-gray-600 flex items-center gap-1 text-sm">
                                              <ImageIcon size={14} /> 插入图片
                                          </button>
                                      </div>
                                      <textarea 
                                        className="flex-1 bg-transparent resize-none outline-none font-mono text-sm text-gray-700 leading-relaxed"
                                        placeholder="# Start writing in Markdown..."
                                        value={editingArticle.content || ''}
                                        onChange={e => setEditingArticle(prev => ({...prev, content: e.target.value}))}
                                      />
                                  </div>
                              </div>
                          )}
                      </>
                  )}

                  {adminTab === 'settings' && (
                      <div className="flex-1 p-10 flex flex-col items-center justify-center">
                          <div className="bg-white/40 p-8 rounded-2xl shadow-lg w-full max-w-md">
                              <h3 className="text-xl font-bold mb-6 text-gray-700">修改管理员密码</h3>
                              <div className="space-y-4">
                                  <div>
                                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">新密码 (8位数字)</label>
                                      <input 
                                        type="text" 
                                        maxLength={8}
                                        className="w-full bg-white/50 border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500 transition-colors"
                                        value={tempPassword}
                                        onChange={e => setTempPassword(e.target.value.replace(/[^0-9]/g, ''))}
                                      />
                                  </div>
                                  <button 
                                    onClick={() => {
                                        if(tempPassword.length === 8) {
                                            setAdminPassword(tempPassword);
                                            setTempPassword('');
                                            alert('密码修改成功');
                                        } else {
                                            alert('必须是8位数字');
                                        }
                                    }}
                                    className="w-full bg-gray-800 text-white py-3 rounded-lg font-medium hover:bg-black transition-colors"
                                  >
                                      确认修改
                                  </button>
                              </div>
                          </div>
                      </div>
                  )}
              </div>
          </GlassCard>
      </div>
  );

  // --- Global Page Transition Logic ---
  const pageContainerClass = `
    relative z-10 w-full h-full transition-all duration-300 ease-silky transform
    ${isNavigating || transitionStage !== 'idle' 
       ? 'opacity-0 scale-95 blur-md' // Hidden when navigating OR switching themes
       : 'opacity-100 scale-100 blur-0' // Visible
    }
  `;

  return (
    <div className="relative w-full h-screen overflow-hidden font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Background Layer */}
      <Background visible={theme === 'stereo'} refreshKey={bgRefreshKey} />

      {/* Middle Stage Transition Overlay (Icon only) */}
      <div className={`fixed inset-0 z-[100] pointer-events-none flex items-center justify-center transition-all duration-500 ${
          transitionStage === 'holding' ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
      }`}>
         <div className="relative flex items-center justify-center p-10 bg-white/40 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white/50">
             <Palette 
                size={64} 
                className="text-gray-800 animate-pulse" 
                strokeWidth={1}
             />
         </div>
      </div>

      {/* Main Content Layer */}
      <div className={pageContainerClass}>
        {currentPage === 'home' && renderHome()}
        {currentPage === 'news-full' && renderNewsTimeline()}
        {currentPage === 'news-detail' && renderNewsDetail()}
        {currentPage === 'tools-geo' && renderGeoTool()}
        {currentPage === 'admin' && (isAdminAuthenticated ? renderAdminDashboard() : renderAdminLogin())}
        {!['home', 'admin', 'tools-geo', 'news-full', 'news-detail'].includes(currentPage) && renderContentPage()}
      </div>
    </div>
  );
};

export default App;