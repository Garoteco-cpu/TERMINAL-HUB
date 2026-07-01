import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { LayoutDashboard, Wallet, BarChart3, Coins, Layers, Eye } from 'lucide-react';
import './App.css';

const ASSET_DATA = {
  stocks: {
    label: "Ações / Stocks",
    icon: <BarChart3 size={18} />,
    assets: [
      { id: 'slben', name: 'S.L. Benfica (SLBEN.LS)', price: 3.24, cap: 74500000, vol: 18500 },
      { id: 'aapl', name: 'Apple Inc. (AAPL)', price: 189.30, cap: 2950000000000, vol: 5200000000 },
      { id: 'nvda', name: 'NVIDIA Corp. (NVDA)', price: 942.50, cap: 2350000000000, vol: 18000000000 },
      { id: 'tsla', name: 'Tesla Inc. (TSLA)', price: 177.40, cap: 565000000000, vol: 9200000000 },
      { id: 'msft', name: 'Microsoft Corp. (MSFT)', price: 421.90, cap: 3150000000000, vol: 11000000000 }
    ]
  },
  etfs: {
    label: "ETFs Globais",
    icon: <Layers size={18} />,
    assets: [
      { id: 'voo', name: 'Vanguard S&P 500 (VOO)', price: 478.20, cap: 1100000000000, vol: 3100000000 },
      { id: 'qqq', name: 'Invesco QQQ Trust (QQQ)', price: 445.80, cap: 250000000000, vol: 7500000000 },
      { id: 'iwda', name: 'iShares World (IWDA)', price: 92.45, cap: 62000000000, vol: 450000000 },
      { id: 'vusa', name: 'Vanguard S&P 500 Dist (VUSA.L)', price: 84.10, cap: 43000000000, vol: 120000000 },
      { id: 'schd', name: 'Schwab US Dividend (SCHD)', price: 78.50, cap: 54000000000, vol: 850000000 }
    ]
  },
  crypto: {
    label: "Criptomoedas",
    icon: <Coins size={18} />,
    assets: [
      { id: 'btc', name: 'Bitcoin (BTC)', price: 68420, cap: 1340000000000, vol: 28000000000 },
      { id: 'eth', name: 'Ethereum (ETH)', price: 3510, cap: 420000000000, vol: 14000000000 },
      { id: 'sol', name: 'Solana (SOL)', price: 145.20, cap: 66000000000, vol: 3100000000 },
      { id: 'bnb', name: 'BNB (BNB)', price: 585.00, cap: 86000000000, vol: 1800000000 },
      { id: 'ada', name: 'Cardano (ADA)', price: 0.46, cap: 16000000000, vol: 450000000 }
    ]
  },
  private_equity: {
    label: "Private Equity",
    icon: <Eye size={18} />,
    assets: [
      { id: 'spacex', name: 'SpaceX (Fundo Privado)', price: 97.00, cap: 180000000000, vol: 0 },
      { id: 'stripe', name: 'Stripe Inc. (Série I)', price: 23.50, cap: 65000000000, vol: 0 },
      { id: 'revolut', name: 'Revolut Ltd (Série E)', price: 42.10, cap: 33000000000, vol: 0 },
      { id: 'openai', name: 'OpenAI Holding', price: 150.00, cap: 80000000000, vol: 0 },
      { id: 'epic', name: 'Epic Games Priv.', price: 12.80, cap: 32000000000, vol: 0 }
    ]
  }
};

function App() {
  const [category, setCategory] = useState('stocks');
  const [activeAsset, setActiveAsset] = useState('slben');
  const [days, setDays] = useState('7');
  const [chartData, setChartData] = useState([]);
  const [stats, setStats] = useState({ name: '', ticker: '', price: 0, marketCap: 0, volume: 0 });

  useEffect(() => {
    const firstAsset = ASSET_DATA[category].assets[0].id;
    setActiveAsset(firstAsset);
  }, [category]);

  useEffect(() => {
    const currentList = ASSET_DATA[category].assets;
    const selected = currentList.find(item => item.id === activeAsset) || currentList[0];

    setStats({
      name: selected.name.split(' (')[0],
      ticker: selected.id.toUpperCase(),
      price: selected.price,
      marketCap: selected.cap,
      volume: selected.vol
    });

    const points = days === '1' ? 24 : days === '7' ? 7 : days === '30' ? 30 : 12;
    const volatility = category === 'crypto' ? 0.05 : selected.id === 'slben' ? 0.015 : 0.02;

    const generatedData = Array.from({ length: points }).map((_, i) => {
      let label = '';
      if (days === '1') {
        label = `${i}:00`;
      } else if (days === '7') {
        label = `Dia ${i + 1}`;
      } else if (days === '30') {
        label = `Dia ${i + 1}`;
      } else {
        const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        label = meses[i % 12];
      }

      const modifier = 1 + (Math.sin(i * 0.45) * volatility) + (Math.cos(i * 0.8) * (volatility * 0.3));
      return {
        date: label,
        price: parseFloat((selected.price * modifier).toFixed(2))
      };
    });

    setChartData(generatedData);
  }, [category, activeAsset, days]);

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div>
          <div className="logo">TerminalHub</div>
        </div>
        
        <div>
          <div className="sidebar-section-title">CLASSES DE ATIVOS</div>
          <ul className="nav-links">
            {Object.keys(ASSET_DATA).map((key) => (
              <li key={key}>
                <button
                  className={`tab-btn-nav ${category === key ? 'active' : ''}`}
                  onClick={() => setCategory(key)}
                >
                  {ASSET_DATA[key].icon}
                  {ASSET_DATA[key].label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <main className="main-content">
        <header className="header-container">
          <div>
            <h1>{stats.name} Terminal</h1>
            <p className="text-muted-p">// ENGINE_ACTIVE: {category.toUpperCase()}_DESK</p>
          </div>
          
          <div className="select-box">
            <Wallet size={15} color="var(--accent)" />
            <select 
              value={activeAsset} 
              onChange={(e) => setActiveAsset(e.target.value)} 
              className="asset-selector"
            >
              {ASSET_DATA[category].assets.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.name}
                </option>
              ))}
            </select>
          </div>
        </header>

        <section className="cards-grid">
          <div className="card">
            <div className="card-title">Valor Unitário ({stats.ticker})</div>
            <div className="card-value">
              ${stats.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="card">
            <div className="card-title">Volume Diário Transacionado</div>
            <div className="card-value">
              {stats.volume > 0 ? `$${stats.volume.toLocaleString()}` : "Mercado de Liquidez Retida"}
            </div>
          </div>
          <div className="card">
            <div className="card-title">Capitalização Bolsista / Valuation</div>
            <div className="card-value">
              ${stats.marketCap.toLocaleString()}
            </div>
          </div>
        </section>

        <section className="chart-container">
          <div className="chart-header">
            <h3>Histórico de Cotação</h3>
            <div className="filter-buttons">
              {[
                { label: '24H', value: '1' },
                { label: '7D', value: '7' },
                { label: '30D', value: '30' },
                { label: '1A', value: '365' }
              ].map((btn) => (
                <button
                  key={btn.value}
                  className={`filter-btn ${days === btn.value ? 'active' : ''}`}
                  onClick={() => setDays(btn.value)}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart 
                key={`${activeAsset}-${days}`} 
                data={chartData} 
                margin={{ top: 10, right: 5, left: 10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#222226" strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#505055" 
                  fontSize={11} 
                  tickLine={false} 
                  dy={10}
                  fontFamily="JetBrains Mono"
                  interval={days === '30' ? 4 : 'preserveStartEnd'}
                />
                <YAxis 
                  stroke="#505055" 
                  fontSize={11} 
                  domain={['auto', 'auto']}
                  tickFormatter={(v) => `$${v.toLocaleString()}`}
                  tickLine={false}
                  dx={-10}
                  fontFamily="JetBrains Mono"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#121214', 
                    borderColor: '#222226', 
                    borderRadius: '4px',
                    fontFamily: 'JetBrains Mono'
                  }}
                  labelStyle={{ color: '#707075' }}
                  itemStyle={{ color: 'var(--accent)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke="var(--accent)" 
                  fillOpacity={1} 
                  fill="url(#colorPrice)" 
                  strokeWidth={1.5} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;