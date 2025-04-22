# リアルタイムアンケートシステム

リアルタイムアンケートシステムは、プレゼンテーションやミーティング中に参加者からフィードバックをリアルタイムで収集し、視覚化するためのウェブアプリケーションです。Teams や Zoom などのビデオ会議ツールと併用して使用することを想定しています。

![リアルタイムアンケートシステム](https://sjc.microlink.io/pBH6whbSjop7_Zx2TTPsSjW0YTbydzGkxM6874pu87NlfmTPyUc6l7Qqu8of9KoGrSX2BIFTrRt4Mw419kf4MA.jpeg)

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

```bash
git clone https://github.com/yourusername/realtime-survey.git
cd realtime-survey
