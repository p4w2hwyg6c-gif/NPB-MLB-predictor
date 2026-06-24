# NPB → MLB 契約予測サイト

選手名と年を入力すると、29〜35項目のスタッツをもとにMLB移籍契約を予測します。

---

## 📁 ファイル構成

```
npb-mlb-predictor/
├── api/
│   └── predict.js      ← バックエンド（APIキーをここで安全に管理）
├── public/
│   └── index.html      ← フロントエンド（ユーザーが見る画面）
├── vercel.json         ← Vercel設定
├── package.json
└── README.md
```

---

## 🚀 デプロイ手順（Vercel・無料）

### ステップ1：GitHubにアップロード

1. [github.com](https://github.com) でアカウント作成（無料）
2. 「New repository」でリポジトリ作成（名前例：`npb-mlb-predictor`）
3. このフォルダのファイルをすべてアップロード

### ステップ2：Vercelにデプロイ

1. [vercel.com](https://vercel.com) でアカウント作成（GitHub連携・無料）
2. 「New Project」→ 作成したGitHubリポジトリを選択
3. 「Deploy」をクリック（自動でビルド＆デプロイされます）

### ステップ3：APIキーを設定

1. Vercelのプロジェクトページ → 「Settings」→「Environment Variables」
2. 以下を追加：
   - **Name**: `ANTHROPIC_API_KEY`
   - **Value**: `sk-ant-api...`（Anthropicのコンソールで取得）
3. 「Save」→ 「Redeploy」

### APIキーの取得方法

1. [console.anthropic.com](https://console.anthropic.com) にアクセス
2. 「API Keys」→「Create Key」
3. 表示されたキーをコピー（一度しか表示されません）

---

## 💡 ローカルで動かす場合

```bash
# 依存パッケージのインストール
npm install

# .env.localファイルを作成
echo "ANTHROPIC_API_KEY=sk-ant-api..." > .env.local

# 開発サーバー起動
npm run dev
```

ブラウザで `http://localhost:3000` を開く。

---

## 🔒 セキュリティについて

- APIキーは `api/predict.js`（サーバー側）でのみ使用されます
- フロントエンド（ブラウザ）にAPIキーは一切露出しません
- Vercelの環境変数として安全に管理されます

---

## 📊 参照スタッツ

**投手（29項目）**
- 主要：勝利数 / ERA / 登板数 / 先発登板 / 投球回 / 自責点 / WHIP / GO/AO / K/9 / rWAR / BB / FIP / 奪三振数 / K/BB
- アドバンスト：xERA / xBA / Fastball Velo / Chase% / Whiff% / K% / BB% / Barrel% / HardHit% / GB% / Extension / WHIP評価 / WAR評価 / FIP評価 / K/BB評価

**野手（35項目）**
- 主要：打率 / 出塁率 / 長打率 / OPS / HR / 打点 / 盗塁 / 得点 / 安打 / 二塁打 / 三塁打 / BB / K / BABIP
- アドバンスト：Batting RV / Baserunning RV / Fielding RV / xwOBA / xBA / xSLG / Avg Exit Velo / Barrel% / HardHit% / Bat Speed / Squared-Up% / Chase% / Whiff% / K% / BB% / OAA / Arm Value / Arm Strength / Sprint Speed / WAR
