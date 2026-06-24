// api/predict.js
// Vercel Serverless Function - APIキーをサーバー側で安全に管理します

export default async function handler(req, res) {
  // CORSヘッダー（フロントエンドからのアクセスを許可）
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // プリフライトリクエスト対応
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { playerName, year } = req.body;

  if (!playerName) {
    return res.status(400).json({ error: '選手名が必要です' });
  }

  // 年指定のコンテキスト文生成
  const yearContext = year
    ? `「${year}年シーズン終了時点」の成績・年齢で分析してください。${year}年のシーズン成績と、それまでのキャリア累計・傾向を考慮すること。`
    : `直近の成績・現在の年齢で分析してください。`;

  const prompt = `あなたはNPB選手のMLB移籍契約を予測する専門アナリストです。
「${playerName}」について${yearContext}
投手か野手かを自動判定し、以下のJSONのみで返してください。マークダウン・コードブロック不可。

{
  "found": true,
  "name": "正式名",
  "team": "所属球団（${year || '現在'}時点）",
  "age": ${year ? `${year}年時点の` : '現在の'}年齢(数値),
  "type": "投手" or "野手",
  "position": "具体的ポジション（日本語）",
  "season_year": "${year || '直近'}",

  "stats_main": {
    "wins": "勝利数(投手のみ)", "era": "ERA(投手のみ)", "games": "登板数(投手のみ)",
    "gs": "先発登板(投手のみ)", "ip": "投球回(投手のみ)", "er": "自責点(投手のみ)",
    "whip": "WHIP(投手のみ)", "goao": "GO/AO(投手のみ)", "kper9": "K/9(投手のみ)",
    "war": "rWAR(投手のみ)", "bb": "BB(投手のみ)", "fip": "FIP(投手のみ)",
    "so": "奪三振数(投手のみ)", "kbb": "K/BB(投手のみ)",
    "avg": "打率(野手のみ)", "obp": "出塁率(野手のみ)", "slg": "長打率(野手のみ)",
    "ops": "OPS(野手のみ)", "hr": "HR(野手のみ)", "rbi": "打点(野手のみ)",
    "sb": "盗塁(野手のみ)", "r": "得点(野手のみ)", "h": "安打(野手のみ)",
    "doubles": "二塁打(野手のみ)", "triples": "三塁打(野手のみ)",
    "bb_b": "BB(野手のみ)", "k_b": "K(野手のみ)", "babip": "BABIP(野手のみ)"
  },

  "stats_adv": {
    "xera": "xERA(投手のみ)", "xba_p": "xBA(投手のみ)", "fb_velo": "Fastball Velo mph(投手のみ)",
    "chase_p": "Chase%(投手のみ)", "whiff_p": "Whiff%(投手のみ)", "kpct_p": "K%(投手のみ)",
    "bbpct_p": "BB%(投手のみ)", "barrel_p": "Barrel%被(投手のみ)", "hardhit_p": "HardHit%被(投手のみ)",
    "gb": "GB%(投手のみ)", "extension": "Extension ft(投手のみ)",
    "whip_adv": "WHIP評価(投手のみ)", "war_adv_p": "WAR評価(投手のみ)",
    "fip_adv": "FIP評価(投手のみ)", "kbb_adv": "K/BB評価(投手のみ)",
    "batting_rv": "Batting Run Value(野手のみ)", "baserunning_rv": "Baserunning RV(野手のみ)",
    "fielding_rv": "Fielding RV(野手のみ)", "xwoba": "xwOBA(野手のみ)",
    "xba_b": "xBA(野手のみ)", "xslg": "xSLG(野手のみ)",
    "exit_velo": "Avg Exit Velo mph(野手のみ)", "barrel_b": "Barrel%(野手のみ)",
    "hardhit_b": "HardHit%(野手のみ)", "bat_speed": "Bat Speed mph(野手のみ)",
    "squared_up": "Squared-Up%(野手のみ)", "chase_b": "Chase%(野手のみ)",
    "whiff_b": "Whiff%(野手のみ)", "kpct_b": "K%(野手のみ)", "bbpct_b": "BB%(野手のみ)",
    "oaa": "OAA(野手のみ)", "arm_value": "Arm Value(野手のみ)",
    "arm_strength": "Arm Strength mph(野手のみ)", "sprint_speed": "Sprint Speed ft/s(野手のみ)",
    "war_b": "WAR(野手のみ)", "war_note": "WAR MLB換算評価(野手のみ)"
  },

  "scores": {
    "score1": 0〜100, "score2": 0〜100, "score3": 0〜100, "score4": 0〜100,
    "score5": 0〜100, "score6": 0〜100, "score7": 0〜100, "score8": 0〜100,
    "score9": 0〜100, "score10": 0〜100, "score11": 0〜100, "score12": 0〜100,
    "labels": ["ラベル1〜12"],
    "descs": ["説明1〜12"]
  },

  "predicted_years": 整数,
  "predicted_total_m": 整数,
  "aav_m": 整数,
  "confidence": "高" or "中" or "低",
  "similar_cases": [
    {"name": "選手名", "year": 移籍年, "years": 年数, "total_m": 百万ドル, "note": "類似ポイント"},
    {"name": "選手名", "year": 移籍年, "years": 年数, "total_m": 百万ドル, "note": "類似ポイント"},
    {"name": "選手名", "year": 移籍年, "years": 年数, "total_m": 百万ドル, "note": "類似ポイント"}
  ],
  "comment": "MLB評価と予測根拠を3文（日本語）。${year ? year + '年時点の年齢・キャリアステージを明記し、' : ''}主要アドバンスト指標の観点を含めること。"
}

投手過去事例：山本由伸$325M/12年、田中将大$155M/7年、ダルビッシュ$56M/6年、前田健太$25M/6年、菊池雄星$56M/3年、今永昇太$53M/4年。
野手過去事例：大谷翔平$700M/10年、吉田正尚$90M/5年、筒香嘉智$9M/2年、秋山翔吾$6.5M/2年、青木宣親$3M/1年。
Statcast系指標はNPB公式集計外のため合理的に推定すること。
選手が存在しない場合は found: false のみ返すこと。`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY, // 環境変数からAPIキーを取得
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
       model: 'claude-3-5-sonnet-20240620',
        max_tokens: 2200,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    const raw = data.content.map((b) => b.text || '').join('');
    const clean = raw.replace(/```json|```/g, '').trim();
    const result = JSON.parse(clean);

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'サーバーエラーが発生しました', detail: error.message });
  }
}
