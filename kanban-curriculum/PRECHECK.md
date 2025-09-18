# ハンズオン前 事前確認手順（Windows / macOS）

本書は、Cursorハンズオンを実施する前に、参加者環境で必要なツールとネットワーク接続が正常に動作するかを確認するための手順書です。

## 概要

- **想定**: Node.jsを用いたフロントエンドハンズオン（Vite、shadcn/ui など）
- **必須条件**: Node.js v18以上、npm/npx/Git が使用可能、npmレジストリへ到達可能
- **判定基準**: STEP 0〜5すべて合格 → 開始可（STEP 6は本番相当の通し検証として推奨）
- **Windowsユーザー**: 必ずSTEP 0でCursorのターミナル設定を確認してください

---

## STEP 0. Cursorのターミナル設定（Windowsのみ）

**目的**: WindowsでCursorのターミナルがPowerShellを使用するように設定
**合格基準**: Cursorのターミナルでnpmコマンドが実行可能

### Windows - Cursorの設定手順

1. Cursorを起動
2. `Ctrl + ,` で設定を開く
3. 検索ボックスに「terminal.integrated.defaultProfile.windows」と入力
4. 「PowerShell」を選択（Git BashやCommand Promptではなく）
5. Cursorを再起動
6. `Ctrl + J` でターミナルを開き、PowerShellが起動することを確認

> **注意**: WindowsではPowerShellを推奨。Git BashやWSLではnpmコマンドの動作が異なる場合があります。

---

## STEP 1. 基本コマンドの存在＆バージョン確認

**目的**: ツールがインストールされ、最低バージョンを満たすか確認
**合格基準**: Node.jsがv18.0.0以上、npm/npx/Gitがバージョン表示される

### Windows（PowerShell）

```powershell
$PSVersionTable.PSVersion
node --version
npm --version
npx --version
git --version
```

### macOS（Terminal）

```bash
sw_vers
node --version
npm --version
npx --version
git --version
```

### 失敗時の切り分け

- `node: command not found` / `'node' is not recognized` → Node.js未インストール
- `git: command not found` → Git未インストール
- Nodeがv18未満 → ハンズオン要件未達

**対応**: インストール・更新が必要（参加者側で実施）

---

## STEP 2. ネットワーク到達性（npmレジストリ）

**目的**: 社内NW/VPN下でnpmレジストリに到達できるか判定
**合格基準**: 名前解決が成功し、npm pingがpongを返す

### Windows（PowerShell）

```powershell
Resolve-DnsName registry.npmjs.org
npm ping
```

### macOS（Terminal）

```bash
nslookup registry.npmjs.org
npm ping
```

### 失敗時の切り分け

- DNS失敗（NXDOMAIN / server can't find等） → 名前解決不可
- npm pingが`ETIMEDOUT` / `ECONNRESET` / `EAI_AGAIN` → 通信不可/不安定
- `SELF_SIGNED_CERT_IN_CHAIN` / `UNABLE_TO_VERIFY_LEAF_SIGNATURE` → 社内証明書関連

**対応**: ネットワーク/証明書設定の問題。IT部門への確認が必要。

---

## STEP 3. 一時ディレクトリの作成（作業領域の確保）

**目的**: 以降の検証を安全な一時領域で実施
**合格基準**: カレントディレクトリが一時フォルダに移動できる

### Windows（PowerShell）

```powershell
$dir = Join-Path $env:TEMP "training-precheck-$(Get-Date -Format yyyyMMdd-HHmmss)"
New-Item -ItemType Directory -Path $dir | Out-Null
Set-Location $dir
```

### macOS（Terminal）

```bash
dir=$(mktemp -d -t training-precheck-XXXXXX)
cd "$dir"
pwd
```

---

## STEP 4. npm実行の最小検証

**目的**: npm installが正しい前提（package.jsonあり）で成功するか確認
**合格基準**: node_modules/package-lock.jsonが生成され、実行確認で日付が表示される

### Windows / macOS 共通

```bash
npm init -y
npm install dayjs@1.11.11
node -e "console.log(require('dayjs')().format())"
```

### 失敗時の切り分け

- npm installのネットワーク系エラー → STEP 2の到達性不可
- 書き込み権限エラー（EPERM等） → フォルダ権限/セキュリティ製品の影響

> **備考**: package.jsonが無い状態でnpm installはエラー。必ずnpm init -yを先に実行。

---

## STEP 5. npxによるCLI取得の検証

**目的**: ハンズオンで利用予定のCLIを取得・実行できるか
**合格基準**: ヘルプやバージョン情報などが表示され、正常終了する

### Windows / macOS 共通

```bash
# shadcn/ui CLIのヘルプ表示
npx --yes shadcn@latest --help
```

### 失敗時の切り分け

- npx実行時のタイムアウトやTLSエラー → STEP 2の到達性/証明書問題

---

## STEP 6.（推奨）本番相当の通し検証

**目的**: ハンズオン本番の一連フロー（取得→install→build）が環境で通るか
**合格基準**: npm installが完走し、dist等のビルド成果物が生成される

### Windows / macOS 共通

```bash
# Vite Reactテンプレート例
npx --yes create-vite@latest precheck-vite -- --template react-ts
cd precheck-vite
npm install
npm run build
```

### 失敗時の切り分け

- npm install失敗 → STEP 2/4の問題が未解消
- 権限/ウイルス対策で失敗 → 端末ポリシーの影響

---

## STEP 7. 後片付け

### Windows（PowerShell）

```powershell
Set-Location $env:TEMP
Remove-Item -Recurse -Force $dir
```

### macOS（Terminal）

```bash
cd /tmp
rm -rf "$dir"
```

---

## チェックリスト

参加者は以下のチェックリストで確認結果を記録してください：

- [ ] STEP 0:（Windowsのみ）CursorのターミナルがPowerShellに設定済み
- [ ] STEP 1: Node.js v18以上、Git、npm、npxが利用可能
- [ ] STEP 2: npmレジストリへの接続が可能
- [ ] STEP 3: 一時ディレクトリの作成・移動が可能
- [ ] STEP 4: npmパッケージのインストールが可能
- [ ] STEP 5: npxでCLIツールの実行が可能
- [ ] STEP 6:（推奨）Viteプロジェクトの作成・ビルドが可能

**すべて✓の場合**: ハンズオン実施可能です！

---

## 補足情報

本チェックリストは、ハンズオンをスムーズに進めるために必要な環境を確認するものです。
STEP 1〜6がすべて正常に動作することを確認いただければ、当日のハンズオンを問題なく実施できます。

企業ネットワークやVPN環境では、プロキシ設定や証明書設定が必要な場合があります。
その際は、各社のIT部門のガイドラインに従って設定をお願いいたします。