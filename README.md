# リアルタイムアンケートシステム

リアルタイムアンケートシステムは、プレゼンテーションやミーティング中に参加者からフィードバックをリアルタイムで収集し、視覚化するためのウェブアプリケーションです。Teams や Zoom などのビデオ会議ツールと併用して使用することを想定しています。

https://v0-new-project-9xoza7a7qwv.vercel.app

<img width="1368" alt="image" src="https://github.com/user-attachments/assets/8b4a3c2b-f6e5-4d3f-9ae1-4bfa98925c76" />


## 機能

- **リアルタイム回答表示**: 参加者の回答がリアルタイムでグラフに反映
- **複数質問タイプ**: 選択式、評価（1-5）、テキスト入力の3種類の質問タイプをサポート
- **QRコード参加**: 参加者はQRコードをスキャンしてアンケートに参加可能
- **管理者画面**: アンケートのタイトル、説明、質問の追加・編集・削除が可能
- **レスポンシブデザイン**: モバイルからデスクトップまで様々なデバイスに対応

## 使用スタック

- **フロントエンド**:
  - [Next.js 15](https://nextjs.org/) - Reactフレームワーク
  - [React](https://reactjs.org/) - UIライブラリ
  - [Tailwind CSS](https://tailwindcss.com/) - スタイリング
  - [shadcn/ui](https://ui.shadcn.com/) - UIコンポーネント
  - [Recharts](https://recharts.org/) - データ可視化
  - [QRCode.react](https://www.npmjs.com/package/qrcode.react) - QRコード生成
  - [Zustand](https://zustand-demo.pmnd.rs/) - 状態管理

- **バックエンド**:
  - [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions) - サーバーサイドロジック
  - インメモリデータストレージ（実運用ではデータベースへの置き換えを推奨）

## インストール方法

### 前提条件

- Node.js 18.0.0以上
- npm または yarn または pnpm

### セットアップ手順

1. リポジトリをクローン:

\`\`\`bash
git clone https://github.com/setowatson/Realtime_Questionnaire.git
cd Realtime_Questionnaire
\`\`\`

2. 依存関係をインストール:

\`\`\`bash
npm install
# または
yarn install
# または
pnpm install
\`\`\`

3. 開発サーバーを起動:

\`\`\`bash
npm run dev
# または
yarn dev
# または
pnpm dev
\`\`\`

4. ブラウザで http://localhost:3000 にアクセス

## 使用方法

### プレゼンター向け

1. メイン画面（`/`）にアクセスして、プレゼンテーション中に画面を共有します
2. 左側に表示される質問と回答結果を前後の質問に移動するボタンで切り替えます
3. 右側には常にアンケート全体のQRコードが表示されます
4. 参加者がQRコードをスキャンして回答すると、結果がリアルタイムで更新されます
5. 画面下部の「管理者画面へ」ボタン（デスクトップのみ表示）から管理画面にアクセスできます

### 参加者向け

1. プレゼンターの画面に表示されているQRコードをスキャンします
2. アンケート画面が表示されたら、各質問に回答します
3. 「送信」ボタンをクリックして回答を送信します
4. 全ての質問に回答すると「回答ありがとうございました」画面が表示されます

### 管理者向け

1. メイン画面から「管理者画面へ」ボタンをクリックしてアクセスします
2. アンケートのタイトル・説明を編集できます
3. 「質問を追加」ボタンをクリックして新しい質問を作成できます
4. 質問タイプを選択し、必要な情報を入力します
5. 選択式質問の場合は選択肢を追加します
6. 「保存」ボタンをクリックして質問を保存します
7. 既存の質問は編集アイコンや削除アイコンから管理できます
8. 「アンケート画面へ」ボタンをクリックしてメイン画面に戻ります

## プロジェクト構造

\`\`\`
Realtime_Questionnaire/
├── app/                    # Next.js アプリケーションルーター
│   ├── page.tsx            # メインページ（プレゼンテーション用）
│   ├── answer/             # 回答ページ
│   └── admin/              # 管理者ページ
├── components/             # Reactコンポーネント
│   ├── question-display.tsx    # 質問表示コンポーネント
│   ├── question-result.tsx     # 結果表示コンポーネント
│   ├── qr-code.tsx             # QRコード表示コンポーネント
│   ├── client-wrapper.tsx      # クライアントラッパー
│   ├── error-boundary.tsx      # エラーバウンダリ
│   └── admin/                  # 管理者用コンポーネント
├── hooks/                  # カスタムフック
│   └── use-polling.ts      # ポーリングフック
├── lib/                    # ユーティリティと型定義
│   ├── actions.ts          # サーバーアクション
│   ├── store.ts            # Zustandストア
│   └── types.ts            # 型定義
└── public/                 # 静的ファイル
\`\`\`

## 拡張と改善の可能性

- **データベース統合**: 永続的なデータ保存のためにデータベース（MongoDB, PostgreSQL, Supabaseなど）を追加
- **認証機能**: 管理者画面へのアクセス制限のための認証機能
- **WebSocket実装**: ポーリングの代わりにWebSocketを使用してより高速なリアルタイム通信を実現
- **回答の詳細分析**: 回答データの詳細な分析と統計情報を表示する機能
- **複数アンケート管理**: 複数のアンケートを作成・管理できる機能
- **エクスポート機能**: アンケート結果をCSVやExcel形式でエクスポートする機能

## 注意事項

- 現在の実装では、データはサーバーのメモリに保存されるため、サーバーの再起動によりデータが失われます
- 本番環境では、データベースを使用してデータを永続化することを強く推奨します
- 大規模な利用の場合は、WebSocketを使用したリアルタイム通信の実装を検討してください

## ライセンス

MIT

## 作者

[setowatson](https://github.com/setowatson)

## リポジトリ

[Realtime_Questionnaire](https://github.com/setowatson/Realtime_Questionnaire)
